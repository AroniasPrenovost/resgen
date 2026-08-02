"""
Pre-generation web research — the post's *backbone*.

Before a post is written, this module makes a SEPARATE web-search API call and
distils the results into a research brief: a specific, resume-relevant angle, a
handful of real and current facts (each with a source), and a suggested hook.
That researched spine is what makes topics feel authentic and current instead of
evergreen-generic or a bare RSS headline.

It keeps its own memory + self-healing, independent of the RSS/topic log:

- `research_log.json` records every backbone (query, angle, keywords, sources).
- Each run rotates the search query and novelty-checks the distilled brief
  against recent entries; a stale or duplicate result makes it retry with a
  different query, so the well never runs dry on the same few facts.
- On any failure (no key, empty search, every query stale) it returns None and
  the caller falls back to the existing RSS / evergreen path — a post always
  ships.

Uses OpenAI's Responses API `web_search` tool, so it reuses the existing
OPENAI_API_KEY with no new account or dependency.
"""

from __future__ import annotations

import json
import logging
import os
import random
from datetime import datetime, timedelta, timezone
from pathlib import Path

import news  # reuse the shared keyword primitive so novelty is consistent

LOG = logging.getLogger("bloggen")

# --------------------------------------------------------------------------
# Tunables
# --------------------------------------------------------------------------
RETENTION_DAYS = 45          # how long a backbone stays in the freshness memory
RECENT_WINDOW = 12           # entries compared against for novelty
SIMILAR_SHARED = 4           # shared keywords with a recent brief => "too similar"
SIMILAR_RATIO = 0.6          # or this Jaccard overlap => "too similar"
DEFAULT_ATTEMPTS = 3         # query rotations before giving up (and falling back)

# Search angles, resume/hiring-adjacent so the facts always pay off in resume
# advice. `{year}` is filled at run time to bias toward current results.
QUERY_THEMES = [
    "resume trends and what recruiters look for {year}",
    "applicant tracking system (ATS) resume screening statistics {year}",
    "hiring and recruiting trends {year}",
    "job market and labor statistics {year}",
    "AI in hiring and automated resume screening {year}",
    "job search statistics and how long it takes {year}",
    "most in-demand skills employers want {year}",
    "entry-level and new-graduate hiring {year}",
    "career change and reskilling trends {year}",
    "cover letter and job application trends {year}",
    "remote and hybrid job posting trends {year}",
    "salary transparency and job offer trends {year}",
]


# --------------------------------------------------------------------------
# History / freshness memory (its own log, self-healing)
# --------------------------------------------------------------------------
def _iso(dt: datetime) -> str:
    return dt.strftime("%Y-%m-%dT%H:%M:%S.000Z")


def _parse(ts: str) -> datetime | None:
    try:
        return datetime.strptime(ts, "%Y-%m-%dT%H:%M:%S.000Z").replace(tzinfo=timezone.utc)
    except (TypeError, ValueError):
        return None


def load_log(path: Path) -> list[dict]:
    if path.exists():
        try:
            return json.loads(path.read_text(encoding="utf-8"))
        except json.JSONDecodeError:
            return []
    return []


def save_log(path: Path, log: list[dict]):
    path.write_text(json.dumps(log, indent=2, ensure_ascii=False) + "\n", encoding="utf-8")


def _prune(log: list[dict], now: datetime) -> list[dict]:
    keep_after = now - timedelta(days=RETENTION_DAYS)
    kept = []
    for e in log:
        t = _parse(e.get("timestamp", ""))
        if t is None or t >= keep_after:
            kept.append(e)
    return kept


def record(path: Path, entry: dict, now: datetime):
    """Append a used backbone and prune the freshness memory back down."""
    log = _prune(load_log(path), now)
    log.append(entry)
    save_log(path, log)


def recent_keyword_sets(log: list[dict], n: int = RECENT_WINDOW) -> list[set[str]]:
    return [set(e.get("keywords") or []) for e in log[-n:] if e.get("keywords")]


def recent_themes(log: list[dict], n: int = 6) -> set[str]:
    return {e.get("theme", "") for e in log[-n:] if e.get("theme")}


def _too_similar(kws: set[str], recent: list[set[str]]) -> bool:
    for rs in recent:
        if not rs:
            continue
        shared = len(kws & rs)
        if shared >= SIMILAR_SHARED:
            return True
        union = len(kws | rs) or 1
        if shared / union >= SIMILAR_RATIO:
            return True
    return False


# --------------------------------------------------------------------------
# Query rotation
# --------------------------------------------------------------------------
def pick_theme(log: list[dict], tried: set[str], rng=random) -> str | None:
    """Choose a query theme not used in the recent log and not already tried this
    run — the freshness rotation that keeps successive posts off the same beat."""
    avoid = recent_themes(log) | tried
    pool = [t for t in QUERY_THEMES if t not in avoid]
    if not pool:
        pool = [t for t in QUERY_THEMES if t not in tried] or QUERY_THEMES
    return rng.choice(pool)


# --------------------------------------------------------------------------
# The two-step search: a web search, then a faithful distillation to JSON.
# --------------------------------------------------------------------------
def _extract_sources(resp) -> list[dict]:
    """Pull url citations out of a Responses API result, defensively."""
    out, seen = [], set()
    try:
        for item in getattr(resp, "output", []) or []:
            for content in getattr(item, "content", []) or []:
                for ann in getattr(content, "annotations", []) or []:
                    url = getattr(ann, "url", None)
                    if url and url not in seen:
                        seen.add(url)
                        out.append({"source": getattr(ann, "title", "") or "", "url": url})
    except Exception:
        pass
    return out


def web_search(client, query: str, model: str) -> tuple[str, list[dict]]:
    """The separate web-search call. Returns (summary_text, sources)."""
    prompt = (
        "Search the web for RECENT, specific, genuinely useful facts about: "
        f"{query}.\n"
        "Prioritise concrete statistics, survey findings, dated trends, and named "
        "organisations from the last ~12 months. Summarise the 4-6 most useful, "
        "specific findings, and for each give the source name and its URL. Skip "
        "anything vague, generic, or older than two years."
    )
    last_err = None
    for tool in ("web_search", "web_search_preview"):
        try:
            resp = client.responses.create(
                model=model, tools=[{"type": tool}], input=prompt,
            )
            text = (getattr(resp, "output_text", "") or "").strip()
            if text:
                return text, _extract_sources(resp)
        except Exception as e:  # unsupported tool name / model — try the other
            last_err = e
    raise RuntimeError(f"web search returned nothing ({last_err})")


def distill(client, query: str, search_text: str, sources: list[dict], model: str) -> dict:
    """Turn raw search notes into a faithful, structured research brief."""
    system = (
        "You turn raw web-search notes into a tight research brief for a "
        "resume-writing blog post. Use ONLY facts that appear in the notes — never "
        "invent a statistic, source, or URL. If a fact has no clear source, drop "
        "it. Return ONLY valid JSON."
    )
    src_block = ""
    if sources:
        src_block = "Known source URLs:\n" + "\n".join(
            f"- {s.get('source', '')}: {s['url']}" for s in sources
        ) + "\n\n"
    schema = {
        "angle": "a specific, resume/job-search-relevant angle these facts support (<= 120 chars)",
        "hook": "one vivid, current sentence a writer could open the post with",
        "facts": [
            {
                "point": "one specific fact or statistic, exactly as supported by the notes",
                "source": "the publication or organisation name",
                "url": "the source URL if known, else an empty string",
            }
        ],
    }
    user = (
        f"Search query: {query}\n\nWeb-search notes:\n{search_text}\n\n"
        + src_block
        + "Produce a research brief that could anchor a concrete resume-writing "
        "how-to. Include 3 to 5 facts, each specific and job/hiring/resume-relevant.\n\n"
        "Return JSON with exactly this shape:\n" + json.dumps(schema, indent=2)
    )
    resp = client.chat.completions.create(
        model=model,
        messages=[{"role": "system", "content": system}, {"role": "user", "content": user}],
        response_format={"type": "json_object"},
        temperature=0.4,
        max_tokens=1200,
    )
    return json.loads(resp.choices[0].message.content)


def _clean_facts(raw) -> list[dict]:
    facts = []
    for f in raw or []:
        if not isinstance(f, dict):
            continue
        point = (f.get("point") or "").strip()
        if not point:
            continue
        facts.append({
            "point": point[:280],
            "source": (f.get("source") or "").strip()[:120],
            "url": (f.get("url") or "").strip()[:400],
        })
        if len(facts) >= 5:
            break
    return facts


# --------------------------------------------------------------------------
# Orchestration
# --------------------------------------------------------------------------
def build_backbone(
    log_path: Path,
    model: str,
    now: datetime | None = None,
    attempts: int = DEFAULT_ATTEMPTS,
    dry_run: bool = False,
    rng=random,
) -> dict | None:
    """Research and return a fresh, novel backbone, or None to trigger fallback."""
    now = now or datetime.now(timezone.utc)
    if not os.environ.get("OPENAI_API_KEY"):
        LOG.warning("research: no OPENAI_API_KEY; skipping web research")
        return None

    from openai import OpenAI
    client = OpenAI(api_key=os.environ["OPENAI_API_KEY"])

    log = load_log(log_path)
    recent = recent_keyword_sets(log)
    tried: set[str] = set()
    year = now.year

    for attempt in range(1, attempts + 1):
        theme = pick_theme(log, tried, rng)
        if not theme:
            break
        tried.add(theme)
        query = theme.format(year=year)
        try:
            text, sources = web_search(client, query, model)
        except Exception as e:
            LOG.info("research: search miss (%d/%d) for %r: %s", attempt, attempts, query, e)
            continue
        try:
            brief = distill(client, query, text, sources, model)
        except Exception as e:
            LOG.info("research: distill failed (%d/%d): %s", attempt, attempts, e)
            continue

        facts = _clean_facts(brief.get("facts"))
        angle = (brief.get("angle") or "").strip()
        if not angle or len(facts) < 2:
            LOG.info("research: thin brief (%d/%d), rotating", attempt, attempts)
            continue

        kws = news._keywords(angle)
        for f in facts:
            kws |= news._keywords(f["point"])
        if _too_similar(kws, recent):
            LOG.info("research: brief too similar to a recent one, rotating query")
            continue

        backbone = {
            "query": query,
            "theme": theme,
            "angle": angle,
            "hook": (brief.get("hook") or "").strip(),
            "facts": facts,
            "keywords": sorted(kws),
            "sources": [f["url"] for f in facts if f.get("url")],
        }
        if not dry_run:
            record(log_path, {
                "timestamp": _iso(now),
                "theme": theme,
                "query": query,
                "angle": angle,
                "keywords": sorted(kws),
                "urls": backbone["sources"],
            }, now)
        LOG.info("research backbone: %s | %d facts | theme=%s",
                 angle[:70], len(facts), theme.split("{")[0].strip())
        return backbone

    LOG.warning("research: no novel backbone after %d attempts; falling back", attempts)
    return None


# --------------------------------------------------------------------------
# CLI: preview a live backbone (this DOES hit the web-search API).
#   python3 research.py
# --------------------------------------------------------------------------
if __name__ == "__main__":
    import sys

    logging.basicConfig(level=logging.INFO, format="%(message)s")
    here = Path(__file__).resolve().parent
    env = here.parents[1] / ".env"
    if env.exists():
        for line in env.read_text().splitlines():
            line = line.strip()
            if line and not line.startswith("#") and "=" in line:
                k, v = line.split("=", 1)
                os.environ.setdefault(k.strip(), v.strip().strip('"').strip("'"))
    model = os.environ.get("BLOGGEN_MODEL", "gpt-4o")
    bb = build_backbone(here / "research_log.json", model, dry_run=True)
    if not bb:
        print("no backbone (search failed or all stale)")
        sys.exit(1)
    print(json.dumps(bb, indent=2, ensure_ascii=False))
