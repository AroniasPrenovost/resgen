#!/usr/bin/env python3
"""
Static blog-post generator for the ResumAI site.

This is a standalone author's helper. It is NOT imported by the Next.js app and
is never called at request time. Running it finds a recent, novel news item,
asks an LLM for structured post content, renders the exact TSX the site's blog
uses (build-safe, entities and all), writes the page.tsx, appends the entry to
public/blog_posts.json, records the topic so it is not repeated, and (by
default) commits and pushes to the current branch.

Usage:
    python3 generator.py once                 # generate one post now
    python3 generator.py loop                 # run ~3x/day, forever
    python3 generator.py once --dry-run       # generate but write nothing
    python3 generator.py once --no-push       # write + commit, do not push
    python3 generator.py selftest --out /tmp/page.tsx   # render a canned post

Env: reads OPENAI_API_KEY (from the repo .env automatically, or the shell).
"""

from __future__ import annotations

import argparse
import json
import logging
import os
import random
import subprocess
import sys
import time
from datetime import datetime, timedelta, timezone
from pathlib import Path

import news
import personas
import render
import social

# --------------------------------------------------------------------------
# Paths
# --------------------------------------------------------------------------
HERE = Path(__file__).resolve().parent
REPO_ROOT = HERE.parents[1]
POSTS_DIR = REPO_ROOT / "app/app/(routes)/blog/resume-writing-tips-tricks-and-services/post"
BLOG_JSON = REPO_ROOT / "public/blog_posts.json"
TOPICS_LOG = HERE / "topics_log.json"
PERSONAS_FILE = HERE / "personas.json"
HISTORY_FILE = HERE / "history.json"
STATE_FILE = HERE / "state.json"
SOCIAL_DRAFTS_DIR = HERE / "social_drafts"
LOG_FILE = HERE / "generator.log"
ENV_FILE = REPO_ROOT / ".env"

# Local-only state files (gitignored): the bot's private memory. Never committed.
STATE_FILES = (PERSONAS_FILE, TOPICS_LOG, HISTORY_FILE, STATE_FILE)

COMMIT_TRAILER = "Co-Authored-By: Claude Opus 4.8 <noreply@anthropic.com>"

# --------------------------------------------------------------------------
# Voice + presentation knobs — sampled per run so posts genuinely fluctuate.
# --------------------------------------------------------------------------
ICONS = [
    "Send", "Target", "Compass", "Zap", "ClipboardList", "Rocket", "Lightbulb",
    "TrendingUp", "Briefcase", "Sparkles", "Award", "Search", "Flame", "Map",
    "GraduationCap",
]

# Only colour classes that already appear elsewhere in the app, so Tailwind
# does not purge them.
COLOR_COMBOS = [
    ("text-blue-700", "bg-gray-700/10"),
    ("text-violet-500", "bg-violet-500/10"),
]

# The author roster and per-author voice sampling now live in personas.py — a
# persistent set of ~6 authors, each with a trait profile that drifts over time
# and a random 2-month-to-2-year lifespan after which they retire.

CTA_TAILS = [
    "and tailor your next application in minutes, not hours.",
    "and let it do the tedious part for you.",
    "and stop sending the same generic resume into the void.",
    "and give your next application a real shot at getting read.",
    "and see how fast a tailored version comes together.",
    "and spend your energy on the jobs that matter.",
]

BANNED = (
    "in today's fast-paced world, delve, tapestry, navigate the ever-evolving, "
    "in conclusion, at the end of the day, game-changer, unlock your potential, "
    "in the realm of, testament to, elevate your, embark on a journey"
)

# Concrete resume-writing how-to angles. These are the backbone of the blog:
# specific, do-it-today instruction on writing and improving a resume, not
# general career or workplace commentary.
RESUME_ANGLES = [
    "how to write resume bullet points that lead with a measurable result",
    "turning a vague job duty into a quantified achievement on your resume",
    "writing a resume summary a hiring manager actually reads",
    "the resume keywords that get you past applicant tracking systems (ATS)",
    "how to tailor one master resume to a specific job posting in minutes",
    "strong action verbs that make your resume bullets hit harder",
    "formatting a resume so it stays clean, skimmable, and ATS-safe",
    "what to cut to get your resume down to one focused page",
    "how to describe an employment gap on your resume without apologizing",
    "rewriting responsibilities as accomplishments on your resume",
    "a cover letter that complements your resume instead of repeating it",
    "listing skills on a resume so they match what recruiters search for",
    "building a strong resume when you have little or no work experience",
    "the career-change resume: reframing past experience for a new field",
]

# The blog is a resume-writing help blog first. A large share of posts are pure
# resume how-tos (independent of the news); the rest use a genuinely job- or
# hiring-related headline as a hook that still pays off in resume advice.
RESUME_TOPIC_CHANCE = 0.4

# A news headline is only worth riding if it clearly touches jobs, hiring, or
# the job search. Anything else (office politics, workplace-trust think-pieces)
# is skipped in favour of a concrete resume-writing angle.
JOB_RELEVANT_TERMS = {
    "resume", "resumes", "cv", "cover", "letter", "application", "applications",
    "applicant", "applicants", "apply", "hiring", "hire", "hires", "recruiter",
    "recruiters", "recruiting", "recruitment", "interview", "interviews",
    "candidate", "candidates", "career", "careers", "layoff", "layoffs",
    "workforce", "employer", "employers", "employment", "unemployment",
    "jobseeker", "jobseekers", "ats", "skills", "talent",
}

# --------------------------------------------------------------------------
# Logging
# --------------------------------------------------------------------------
def setup_logging():
    log = logging.getLogger("bloggen")
    if log.handlers:
        return log
    log.setLevel(logging.INFO)
    fmt = logging.Formatter("%(asctime)s  %(levelname)-7s %(message)s", "%Y-%m-%d %H:%M:%S")
    fh = logging.FileHandler(LOG_FILE, encoding="utf-8")
    fh.setFormatter(fmt)
    sh = logging.StreamHandler(sys.stdout)
    sh.setFormatter(fmt)
    log.addHandler(fh)
    log.addHandler(sh)
    return log


LOG = setup_logging()


# --------------------------------------------------------------------------
# Env / config helpers
# --------------------------------------------------------------------------
def load_env():
    """Minimal .env loader so the shell does not need OPENAI_API_KEY exported."""
    if not ENV_FILE.exists():
        return
    for line in ENV_FILE.read_text(encoding="utf-8").splitlines():
        line = line.strip()
        if not line or line.startswith("#") or "=" not in line:
            continue
        k, v = line.split("=", 1)
        os.environ.setdefault(k.strip(), v.strip().strip('"').strip("'"))


def load_topics_log() -> list[dict]:
    if TOPICS_LOG.exists():
        try:
            return json.loads(TOPICS_LOG.read_text(encoding="utf-8"))
        except json.JSONDecodeError:
            return []
    return []


def save_topics_log(log_data: list[dict]):
    TOPICS_LOG.write_text(json.dumps(log_data, indent=2, ensure_ascii=False) + "\n", encoding="utf-8")


def ensure_topics_log() -> bool:
    """First run: if the topic memory does not exist yet, seed it from the posts
    already on the site so we never re-cover an existing one. Returns True if it
    seeded (i.e. this was a first run)."""
    if TOPICS_LOG.exists():
        return False
    seed = []
    try:
        posts = json.loads(BLOG_JSON.read_text(encoding="utf-8"))
    except Exception:
        posts = []
    for p in posts:
        seed.append({
            "date": p.get("date", ""),
            "slug": p.get("file", ""),
            "title": p.get("title", ""),
            "author": "",
            "news_title": "",
            "news_url": "",
            "keywords": sorted(news._keywords(p.get("title", ""))),
        })
    save_topics_log(seed)
    LOG.info("seeded topic memory from %d existing posts", len(seed))
    return True


def append_history(record: dict):
    """Append-only local run history / learnings (gitignored)."""
    history = []
    if HISTORY_FILE.exists():
        try:
            history = json.loads(HISTORY_FILE.read_text(encoding="utf-8"))
        except json.JSONDecodeError:
            history = []
    history.append(record)
    HISTORY_FILE.write_text(json.dumps(history, indent=2, ensure_ascii=False) + "\n", encoding="utf-8")


def load_state() -> dict:
    """Small, gitignored runtime-state pointer: last run, last post, counters.

    Kept separate from the append-only history so a running loop can read/write a
    tiny fixed-size file (the bot's 'where was I') instead of parsing an
    ever-growing log every time."""
    if STATE_FILE.exists():
        try:
            return json.loads(STATE_FILE.read_text(encoding="utf-8"))
        except json.JSONDecodeError:
            return {}
    return {}


def save_state(state: dict):
    STATE_FILE.write_text(json.dumps(state, indent=2, ensure_ascii=False) + "\n", encoding="utf-8")


def update_state(**changes) -> dict:
    """Read-modify-write the runtime state with the given fields."""
    state = load_state()
    state.update(changes)
    save_state(state)
    return state


# Keep the rolling run log bounded: enough history to always cover a 7-day
# window with headroom, but small enough to stay a tiny file.
RUN_LOG_RETENTION_DAYS = 30


def _parse_iso(ts: str) -> datetime | None:
    try:
        return datetime.strptime(ts, "%Y-%m-%dT%H:%M:%S.000Z").replace(tzinfo=timezone.utc)
    except (TypeError, ValueError):
        return None


def _prune_and_summarize(runs: list[dict], now: datetime) -> tuple[list[dict], dict]:
    """Drop runs older than the retention window and tally the last 7 days."""
    keep_after = now - timedelta(days=RUN_LOG_RETENTION_DAYS)
    week_after = now - timedelta(days=7)
    kept, succ, fail = [], 0, 0
    for r in runs:
        t = _parse_iso(r.get("timestamp", ""))
        if t is None or t < keep_after:
            continue
        kept.append(r)
        if t >= week_after:
            if r.get("ok"):
                succ += 1
            else:
                fail += 1
    total = succ + fail
    summary = {
        "successes": succ,
        "failures": fail,
        "total": total,
        "success_pct": round(100 * succ / total, 1) if total else None,
    }
    return kept, summary


def record_run(ok: bool, stage: str | None = None, error=None, **extra) -> dict:
    """Stamp a run (success or failure) into the runtime state.

    Keeps a small rolling `recent_runs` log and a `last_7_days` success tally so
    we can see how often the bot is failing without walking the full history.
    `posts_generated` (successes) and `failures` stay cumulative for all time."""
    now = datetime.now(timezone.utc)
    ts = now_iso()
    state = load_state()

    entry: dict = {"timestamp": ts, "ok": bool(ok)}
    if not ok:
        entry["stage"] = stage or "unknown"
        if error is not None:
            entry["error"] = str(error)[:300]

    runs, summary = _prune_and_summarize((state.get("recent_runs") or []) + [entry], now)
    state["recent_runs"] = runs
    state["last_7_days"] = summary
    state["last_run"] = ts
    if ok:
        state["posts_generated"] = int(state.get("posts_generated", 0)) + 1
    else:
        state["failures"] = int(state.get("failures", 0)) + 1
        state["last_failure"] = {"timestamp": ts, "stage": entry["stage"],
                                 "error": str(error)[:500] if error is not None else ""}
    state.update(extra)
    save_state(state)

    LOG.info("run %s | 7-day: %d/%d ok (%s%% success, %d failed)",
             "ok" if ok else f"FAILED[{entry['stage']}]",
             summary["successes"], summary["total"], summary["success_pct"], summary["failures"])
    return state


def existing_titles() -> list[str]:
    try:
        return [p["title"] for p in json.loads(BLOG_JSON.read_text(encoding="utf-8"))]
    except Exception:
        return []


def covered_keyword_sets(topics: list[dict], titles: list[str]) -> list[set[str]]:
    sets = []
    for t in topics:
        kws = set(t.get("keywords") or [])
        kws |= news._keywords(t.get("news_title", ""))
        kws |= news._keywords(t.get("title", ""))
        if kws:
            sets.append(kws)
    for title in titles:
        kws = news._keywords(title)
        if kws:
            sets.append(kws)
    return sets


# --------------------------------------------------------------------------
# Prompt + LLM
# --------------------------------------------------------------------------
def build_messages(news_item, voice, persona, avoid_titles):
    tone = voice["tone"]
    verbosity_label, verbosity_note = voice["verbosity"]
    cleverness = voice["cleverness"]

    if news_item.get("real"):
        hook = (
            f'A recent news headline: "{news_item["title"]}"'
            + (f' (source: {news_item["source"]})' if news_item.get("source") else "")
            + (f', published {news_item["published"]}.' if news_item.get("published") else ".")
        )
        hook_rule = (
            "Spend at most the first two or three sentences on this news event. "
            "The rest of the post is a concrete, do-it-today resume-writing "
            "how-to: specific wording, before/after bullet examples, and exactly "
            "what to change on the page. The news is only the hook; the payoff is "
            "helping the reader write a stronger, tailored resume. Keep it "
            "positive: focus on what the reader controls, never fear or doom."
        )
    else:
        hook_item = news_item.get("hook")
        if hook_item:
            src = f' (source: {hook_item["source"]})' if hook_item.get("source") else ""
            hook = (
                f"This post is a resume-writing how-to on: {news_item['title']}.\n"
                f'Open with a light, one- or two-sentence nod to a recent headline — '
                f'"{hook_item["title"]}"{src} — then pivot straight into the how-to. '
                "The headline is only a way in for variety: reference it briefly and "
                "move on. Do not analyse it, quote it at length, or let it steer the "
                "advice."
            )
        else:
            hook = f"This post is a resume-writing how-to on: {news_item['title']}."
        hook_rule = (
            "Write a concrete, example-driven resume-writing how-to. Show the "
            "reader exactly what to do on their own resume — before/after bullet "
            "examples, specific phrasing, action verbs, real wording — not general "
            "career or workplace commentary. Keep it upbeat and practical."
        )

    system = (
        "You are a specific, real human writer contributing to the ResumAI blog. "
        "ResumAI is an AI resume builder that rewrites a person's experience into "
        "tailored, ATS-friendly resumes. You write for job seekers.\n\n"
        "Sound like an actual person who does this work, not a content team. That means:\n"
        "- Lead with a concrete observation, example, or number, not a throat-clearing intro.\n"
        "- Use plain, specific language. Real examples beat abstract advice.\n"
        "- Vary sentence and paragraph length. Some short. Some that run a little longer "
        "because the thought needs the room.\n"
        "- First person is fine (\"I have seen…\"). A little personality and the occasional "
        "aside or rhetorical question is good. Perfect symmetry reads as fake.\n"
        "- Do not sound like SEO filler or a LinkedIn motivational post.\n"
        f"- Never use these worn phrases: {BANNED}.\n"
        "- Do not end with a section literally titled Conclusion unless it genuinely fits.\n\n"
        "What every post is really for:\n"
        "- This blog exists to win ResumAI customers, not to rank for keywords. "
        "When usefulness and SEO pull in different directions, choose usefulness "
        "and persuasion every time. Never keyword-stuff or write for a crawler.\n"
        "- Keep the post centered on the resume and the job application — the "
        "part of the search the reader actually controls. General career advice "
        "(networking, upskilling) can appear as a hook, but the payload of the "
        "post is 'here is how to make your resume and application stronger,' "
        "which is exactly what ResumAI does.\n"
        "- Frame everything positively: momentum, opportunity, and the concrete "
        "next move. Even off grim news, be reassuring and action-oriented, never "
        "doom-y or anxious.\n"
        "- Make ResumAI feel like the obvious, low-effort way to act on the "
        "advice — woven in where it fits naturally, and landed cleanly in the "
        "CTA. Confident and specific about the payoff, not spammy.\n\n"
        "Return ONLY valid JSON, no prose around it."
    )

    schema = {
        "title": "string, a specific, click-worthy but honest headline (<= 90 chars)",
        "meta_description": "string, <= 155 chars, for SEO",
        "subtitle": "string, one short line shown under the title",
        "intro": "string, an opening paragraph with NO heading (may be empty string)",
        "sections": [
            {
                "heading": "string, a section H2",
                "paragraphs": ["one or more paragraph strings"],
                "bullets": "OPTIONAL array of {lead, text} objects, or omit",
                "callout": "OPTIONAL array of {lead, text} for a highlighted aside, or omit",
            }
        ],
        "cta": "string, ONE sentence that leads into a link to ResumAI's Resume Generator",
    }

    persona_line = f"{persona['name']}, {persona['role']}"
    persona_bio = persona.get("bio", "")

    user = (
        f"{hook}\n\n{hook_rule}\n\n"
        f"You are writing AS this person — stay in their voice:\n"
        f"- {persona_line}. {persona_bio}\n"
        f"- Tone: {tone}\n"
        f"- Length: {verbosity_label}. {verbosity_note}\n"
        f"- Style: {cleverness}\n\n"
        f"Do NOT rewrite topics we already covered. Avoid these existing titles:\n"
        + "\n".join(f"- {t}" for t in avoid_titles[-24:])
        + "\n\n"
        "Structure: include one bulleted list somewhere only if it earns its place, "
        "and at most one highlighted callout. At least one section must give "
        "concrete, do-it-today resume or application advice — the tailoring, "
        "phrasing, and ATS work ResumAI automates. End on an encouraging, "
        "forward-looking note. The headline must be specific to THIS post's angle, "
        "not a generic 'resume tips' title.\n\n"
        "Return JSON with exactly this shape:\n"
        + json.dumps(schema, indent=2)
    )
    return system, user


def call_llm(system, user, model, temperature):
    from openai import OpenAI

    client = OpenAI(api_key=os.environ["OPENAI_API_KEY"])
    resp = client.chat.completions.create(
        model=model,
        messages=[{"role": "system", "content": system}, {"role": "user", "content": user}],
        response_format={"type": "json_object"},
        temperature=temperature,
        max_tokens=4000,
    )
    return json.loads(resp.choices[0].message.content)


# --------------------------------------------------------------------------
# Content assembly
# --------------------------------------------------------------------------
def now_iso() -> str:
    return datetime.now(timezone.utc).strftime("%Y-%m-%dT%H:%M:%S.000Z")


def coerce_content(raw: dict, persona: dict) -> dict:
    title = (raw.get("title") or "Career Notes").strip()[:110]
    meta = (raw.get("meta_description") or raw.get("subtitle") or title).strip()[:155]
    subtitle = (raw.get("subtitle") or meta).strip()[:140]

    sections = []
    for sec in raw.get("sections", []) or []:
        if not isinstance(sec, dict):
            continue
        heading = (sec.get("heading") or "").strip()
        paras = [p.strip() for p in (sec.get("paragraphs") or []) if isinstance(p, str) and p.strip()]
        if not heading and not paras:
            continue
        out = {"heading": heading, "paragraphs": paras}
        if isinstance(sec.get("bullets"), list) and sec["bullets"]:
            out["bullets"] = sec["bullets"]
        if isinstance(sec.get("callout"), list) and sec["callout"]:
            out["callout"] = sec["callout"]
        sections.append(out)
    if not sections:
        raise ValueError("LLM returned no usable sections")

    icon_color, bg_color = random.choice(COLOR_COMBOS)
    base_slug = render.slugify(title)
    slug = render.unique_slug(base_slug, POSTS_DIR)

    return {
        "title": title,
        "meta_description": meta,
        "subtitle": subtitle,
        "intro": (raw.get("intro") or "").strip(),
        "sections": sections,
        "cta": (raw.get("cta") or "Ready to put this into practice?").strip(),
        "cta_tail": random.choice(CTA_TAILS),
        "slug": slug,
        "date": now_iso(),
        "icon": random.choice(ICONS),
        "icon_color": icon_color,
        "bg_color": bg_color,
        "author": {"name": persona["name"], "role": persona["role"], "bio": persona["bio"]},
    }


# --------------------------------------------------------------------------
# Git
# --------------------------------------------------------------------------
def git(*args) -> subprocess.CompletedProcess:
    return subprocess.run(
        ["git", *args], cwd=REPO_ROOT, check=True, capture_output=True, text=True
    )


def commit_and_push(paths: list[Path], title: str, push: bool):
    try:
        git("add", *[str(p) for p in paths])
        msg = f"Automated: new blog post — {title}\n\n{COMMIT_TRAILER}"
        git("commit", "-m", msg)
        LOG.info("committed: %s", title)
    except subprocess.CalledProcessError as e:
        LOG.error("git commit failed: %s", (e.stderr or e.stdout or "").strip())
        return
    if not push:
        LOG.info("push skipped (--no-push)")
        return
    try:
        git("push")
        LOG.info("pushed to remote")
    except subprocess.CalledProcessError as e:
        LOG.error("git push failed (post is committed locally): %s", (e.stderr or "").strip())


# --------------------------------------------------------------------------
# Orchestration
# --------------------------------------------------------------------------
def _resume_angle() -> dict:
    angle = random.choice(RESUME_ANGLES)
    return {"title": angle, "real": False, "keywords": news._keywords(angle)}


def _job_relevant(item: dict) -> bool:
    kws = set(item.get("keywords") or []) | news._keywords(item.get("title", ""))
    return bool(kws & JOB_RELEVANT_TERMS)


def pick_news(max_age_days: int) -> dict:
    # Always pull a fresh, novel headline from the career/job-market feeds so
    # every post can at least nod to something recent — that variety is what
    # keeps the evergreen resume how-tos from reading interchangeably.
    topics = load_topics_log()
    titles = existing_titles()
    covered = covered_keyword_sets(topics, titles)
    item = news.select_novel(covered, max_age_days=max_age_days)

    # A headline that is genuinely about jobs/hiring can drive the whole post
    # (news-driven mode). Otherwise — or on a coin flip favouring evergreen
    # how-tos — we write a resume how-to but still bolt the headline on as a
    # light, even gratuitous, hook so no two intros open the same way.
    if item and _job_relevant(item) and random.random() >= RESUME_TOPIC_CHANCE:
        item["real"] = True
        LOG.info("news-driven (job-relevant): %s", item["title"])
        return item

    angle = _resume_angle()
    if item:
        angle["hook"] = {
            "title": item["title"],
            "url": item.get("url", ""),
            "source": item.get("source", ""),
            "keywords": item.get("keywords") or news._keywords(item["title"]),
        }
        LOG.info("resume how-to: %s  |  news nod: %s", angle["title"], item["title"])
    else:
        LOG.warning("no fresh news found; resume how-to with no news nod")
    return angle


def _referenced_news(news_item: dict) -> dict:
    """The headline a post actually cites: the item itself for news-driven
    posts, or the light hook attached to a resume how-to (empty if neither)."""
    if news_item.get("real"):
        return news_item
    return news_item.get("hook") or {}


def generate_once(args) -> bool:
    now = datetime.now(timezone.utc)

    # First run: seed the local topic memory from posts already on the site.
    # (Skip in dry-run so it truly writes nothing; novelty still works off the
    # live blog_posts.json titles.)
    if not args.dry_run:
        ensure_topics_log()

    # Persona lifecycle: load (or seed) the roster on first run, retire expired
    # authors and refill, then pick whoever is up and sample their voice.
    roster, _ = personas.ensure_roster(PERSONAS_FILE, now)
    personas.lifecycle(roster, now)
    persona = personas.pick(roster)
    voice = personas.sample_voice(persona)

    news_item = pick_news(args.max_age_days)
    avoid = existing_titles()

    LOG.info("author: %s — %s | tone=%s posts=%d",
             persona["name"], persona["role"], persona["traits"]["tone"],
             persona.get("posts_written", 0))
    LOG.info("voice: length=%s | style=%r", voice["verbosity"][0], voice["cleverness"][:32])

    system, user = build_messages(news_item, voice, persona, avoid)
    try:
        raw = call_llm(system, user, args.model, args.temperature)
    except Exception as e:
        LOG.error("LLM call failed: %s", e)
        if not args.dry_run:
            record_run(False, "llm_call", e)
        return False

    try:
        content = coerce_content(raw, persona)
    except Exception as e:
        LOG.error("content invalid: %s", e)
        if not args.dry_run:
            record_run(False, "coerce_content", e)
        return False

    if args.dry_run:
        LOG.info("[dry-run] would write post: %s (slug=%s)", content["title"], content["slug"])
        LOG.info("[dry-run] by %s | icon=%s sections=%d",
                 persona["name"], content["icon"], len(content["sections"]))
        return True

    page = render.write_post(content, POSTS_DIR)
    entry = render.update_blog_json(content, BLOG_JSON)

    # Ready-to-paste social captions (LinkedIn/X/Facebook/Discord), written to a
    # gitignored local folder. Discord additionally auto-posts if a webhook URL
    # is configured; everything else is copy-and-paste.
    try:
        draft, drafts = social.write_drafts(content, SOCIAL_DRAFTS_DIR)
        LOG.info("social drafts saved to %s", draft.relative_to(HERE))
        # Print the captions straight to the terminal so they can be copied
        # without opening the file.
        LOG.info("%s", social.format_drafts_block(content, drafts))
        webhook = os.environ.get("DISCORD_WEBHOOK_URL")
        if webhook:
            try:
                social.post_to_discord(drafts["Discord"], webhook)
                LOG.info("posted to Discord")
            except Exception as e:
                LOG.error("Discord post failed (draft still saved): %s", e)
    except Exception as e:  # never let caption generation break a good post
        LOG.error("social draft generation failed: %s", e)

    ref = _referenced_news(news_item)
    topics = load_topics_log()
    topics.append({
        "date": content["date"],
        "slug": content["slug"],
        "title": content["title"],
        "author": persona["name"],
        "news_title": ref.get("title", ""),
        "news_url": ref.get("url", ""),
        "keywords": sorted(set(news_item.get("keywords") or []) | set(ref.get("keywords") or [])),
    })
    save_topics_log(topics)

    # Record the byline and let the author's traits drift a touch, then persist.
    personas.touch_and_drift(persona, now)
    personas.save_roster(PERSONAS_FILE, roster)

    # Local, gitignored run history / learnings.
    append_history({
        "timestamp": content["date"],
        "title": content["title"],
        "slug": content["slug"],
        "author": persona["name"],
        "author_role": persona["role"],
        "model": args.model,
        "voice": {
            "tone_signature": persona["traits"]["tone"],
            "length": voice["verbosity"][0],
            "style": voice["cleverness"],
        },
        "topical": bool(news_item.get("real")),
        "news_title": ref.get("title", ""),
        "news_url": ref.get("url", ""),
        "pushed": not args.no_push,
    })

    # Tiny fixed-size runtime-state pointer (gitignored): the quick "where was I"
    # the loop can consult without walking the full history.
    record_run(True, last_post={
        "title": content["title"],
        "slug": content["slug"],
        "date": content["date"],
        "author": persona["name"],
        "pushed": not args.no_push,
    })

    LOG.info("wrote %s", page.relative_to(REPO_ROOT))
    # Commit ONLY the site content. Local state (personas/topics/history) is
    # gitignored and stays on this machine.
    commit_and_push([page, BLOG_JSON], content["title"], push=not args.no_push)
    LOG.info("done: %s (by %s)", entry["title"], persona["name"])
    return True


def _next_interval_seconds(args, interval: float) -> float:
    """One jittered inter-post gap, floored so we never hot-loop."""
    jitter = random.randint(-args.jitter_minutes, args.jitter_minutes) * 60
    return max(600, interval + jitter)


def run_loop(args):
    interval = args.interval_hours * 3600
    LOG.info("loop started: every ~%sh, model=%s, push=%s",
             args.interval_hours, args.model, not args.no_push)

    # Restart-safe scheduling: decide when the next post is genuinely due from
    # the timestamps persisted in state.json (last_run / next_run), so stopping
    # and restarting the program never fires an extra post. We generate on
    # startup only when we are actually overdue (or have never run before).
    now = datetime.now(timezone.utc)
    state = load_state()
    stored_next = _parse_iso(state.get("next_run") or "")
    last_run = _parse_iso(state.get("last_run") or "")

    if args.no_run_on_start:
        wake = now + timedelta(seconds=_next_interval_seconds(args, interval))
        LOG.info("startup run suppressed (--no-run-on-start)")
    elif stored_next and stored_next > now:
        wake = stored_next
        LOG.info("restart-safe: resuming stored schedule, next run ~%s UTC",
                 wake.strftime("%Y-%m-%d %H:%M"))
    elif last_run and (now - last_run).total_seconds() < interval:
        # We posted recently (this or a prior process) but no future next_run
        # was persisted — wait out the remainder instead of posting again now.
        wake = last_run + timedelta(seconds=_next_interval_seconds(args, interval))
        if wake <= now:
            wake = now + timedelta(seconds=60)
        LOG.info("restart-safe: last post %.1fh ago, next run ~%s UTC",
                 (now - last_run).total_seconds() / 3600, wake.strftime("%Y-%m-%d %H:%M"))
    else:
        if last_run:
            LOG.info("overdue (last post %.1fh ago, interval %.1fh); generating now",
                     (now - last_run).total_seconds() / 3600, interval / 3600)
        _safe_generate(args)
        wake = datetime.now(timezone.utc) + timedelta(seconds=_next_interval_seconds(args, interval))

    while True:
        # Persist the wake time BEFORE sleeping so a restart mid-sleep resumes
        # this same schedule rather than starting a fresh one.
        update_state(next_run=wake.strftime("%Y-%m-%dT%H:%M:%S.000Z"))
        sleep_for = max(0.0, wake.timestamp() - datetime.now(timezone.utc).timestamp())
        LOG.info("sleeping %.1fh (next run ~%s UTC)", sleep_for / 3600, wake.strftime("%H:%M"))
        time.sleep(sleep_for)
        _safe_generate(args)
        wake = datetime.now(timezone.utc) + timedelta(seconds=_next_interval_seconds(args, interval))


def _safe_generate(args):
    try:
        generate_once(args)
    except Exception as e:  # never let one bad run kill the loop
        LOG.exception("unexpected error in generation: %s", e)
        try:
            if not args.dry_run:
                record_run(False, "unexpected", e)
        except Exception:  # recording must never itself kill the loop
            pass


# --------------------------------------------------------------------------
# Self-test — renders a canned, deliberately messy post to prove the pipeline
# produces build-safe TSX. No network, no git, no JSON changes.
# --------------------------------------------------------------------------
def selftest(args):
    content = {
        "title": 'Doom & Gloom: Why "Spray-and-Pray" Applying <Backfires> 100%',
        "meta_description": 'Half of job seekers don\'t read the posting. Here\'s why that backfires — and the fix.',
        "subtitle": "A test of quotes, braces {x}, angles <b>, and apostrophes",
        "intro": "Let's be honest: the market is rough, and you're tired. That's exactly why {this} matters.",
        "sections": [
            {"heading": 'The "Numbers Game" Trap',
             "paragraphs": ["You fire off 16 applications & feel productive.",
                            "But <recruiters> never see 90% of them."]},
            {"heading": "What To Do Instead",
             "paragraphs": ["Slow down. Read the posting once."],
             "bullets": [{"lead": "Tailor the top third", "text": 'Rework your summary to mirror the role.'},
                         {"lead": "Quantify", "text": '"Cut costs 30%" beats "responsible for costs".'},
                         {"text": "Apply to fewer, better roles."}]},
            {"heading": "The Reframe",
             "paragraphs": ["Ten sharp applications beat sixty blind ones."],
             "callout": [{"lead": "Remember", "text": "Getting read > getting sent."}]},
        ],
        "cta": "Ready to trade the doom loop for a resume that gets read? Try the",
        "cta_tail": "and tailor your next application in minutes.",
        "slug": "selftest-post",
        "date": now_iso(),
        "icon": "Send",
        "icon_color": "text-blue-700",
        "bg_color": "bg-gray-700/10",
        "author": {"name": "Test O'Brien", "role": "QA & <Sanity> Check",
                   "bio": "Exists only to break the escaper. Loves quotes \"like this\" & braces {}."},
    }
    tsx = render.render_page_tsx(content)
    out = Path(args.out)
    out.parent.mkdir(parents=True, exist_ok=True)
    out.write_text(tsx, encoding="utf-8")
    LOG.info("selftest TSX written to %s", out)


# --------------------------------------------------------------------------
# CLI
# --------------------------------------------------------------------------
def add_common(p):
    p.add_argument("--model", default=os.environ.get("BLOGGEN_MODEL", "gpt-4o"))
    p.add_argument("--temperature", type=float, default=0.9)
    p.add_argument("--max-age-days", type=int, default=30,
                   help="only consider news no older than this")
    p.add_argument("--no-push", action="store_true", help="commit but do not push")
    p.add_argument("--dry-run", action="store_true", help="generate but write nothing")


def main():
    load_env()
    ap = argparse.ArgumentParser(description="ResumAI static blog-post generator")
    sub = ap.add_subparsers(dest="cmd", required=True)

    once = sub.add_parser("once", help="generate a single post now")
    add_common(once)

    loop = sub.add_parser("loop", help="generate ~3x/day, forever")
    add_common(loop)
    loop.add_argument("--interval-hours", type=float, default=8.0)
    loop.add_argument("--jitter-minutes", type=int, default=45)
    loop.add_argument("--no-run-on-start", action="store_true")

    st = sub.add_parser("selftest", help="render a canned post to prove build-safety")
    st.add_argument("--out", default=str(HERE / "_selftest_page.tsx"))

    pers = sub.add_parser("personas", help="show the author roster (seeds/retires as needed)")
    pers.add_argument("--no-save", action="store_true",
                      help="preview only; do not persist seeding/retirements")

    sub.add_parser("state", help="print the local runtime state (last run, last post, counts)")

    args = ap.parse_args()
    if args.cmd == "once":
        ok = generate_once(args)
        sys.exit(0 if ok else 1)
    elif args.cmd == "loop":
        run_loop(args)
    elif args.cmd == "selftest":
        selftest(args)
    elif args.cmd == "personas":
        show_personas(args)
    elif args.cmd == "state":
        state = load_state()
        if not state:
            print(f"no state yet ({STATE_FILE.name} not written)")
        else:
            print(json.dumps(state, indent=2, ensure_ascii=False))
            # Recompute the 7-day window live so the printed rate is never stale.
            _, wk = _prune_and_summarize(state.get("recent_runs") or [], datetime.now(timezone.utc))
            if wk["total"]:
                print(f"\nLast 7 days: {wk['successes']}/{wk['total']} runs succeeded "
                      f"({wk['success_pct']}% success, {wk['failures']} failed)")
            else:
                print("\nLast 7 days: no runs recorded")


def show_personas(args):
    now = datetime.now(timezone.utc)
    roster, seeded = personas.ensure_roster(PERSONAS_FILE, now)
    changed = personas.lifecycle(roster, now) or seeded
    if changed and not args.no_save:
        personas.save_roster(PERSONAS_FILE, roster)
    print(personas.summarize(roster))


if __name__ == "__main__":
    main()
