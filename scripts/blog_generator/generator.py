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
from datetime import datetime, timezone
from pathlib import Path

import news
import personas
import render

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
LOG_FILE = HERE / "generator.log"
ENV_FILE = REPO_ROOT / ".env"

# Local-only state files (gitignored): the bot's private memory. Never committed.
STATE_FILES = (PERSONAS_FILE, TOPICS_LOG, HISTORY_FILE)

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

FALLBACK_ANGLES = [
    "the surge in AI-screening of resumes and what job seekers can do about it",
    "why application response rates keep dropping and how to beat the odds",
    "the rise of skills-based hiring over degree requirements",
    "how ghost jobs and endless interview loops are changing job-search strategy",
    "the return-to-office push and how it reshapes what employers want on a resume",
    "what a strong LinkedIn profile should borrow from a good resume",
    "how to talk about an employment gap without apologizing for it",
    "why tailoring beats volume, and how to tailor fast",
]

# Mostly ride real news for topicality, but sometimes go evergreen so the blog
# does not read as a pure news feed. "Often topical, but varied in topic."
EVERGREEN_CHANCE = 0.18

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
            "Open from this real, current news event, then pivot fast into "
            "practical, do-it-today resume and job-application advice. The news is "
            "only the hook; the heart of every post is helping the reader build a "
            "stronger, tailored resume. Frame it positively: focus on what the "
            "reader controls and the momentum they can build, never fear or doom."
        )
    else:
        hook = f"Angle for this post: {news_item['title']}."
        hook_rule = (
            "Ground the post in this current job-market theme, keep it "
            "resume-centric and action-oriented, and frame it around opportunity "
            "and what the reader can do today rather than anxiety."
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
def pick_news(max_age_days: int) -> dict:
    # Usually ride real, recent news; occasionally go evergreen for topic variety.
    if random.random() < EVERGREEN_CHANCE:
        angle = random.choice(FALLBACK_ANGLES)
        LOG.info("topic: evergreen angle (variety): %s", angle)
        return {"title": angle, "real": False, "keywords": news._keywords(angle)}

    topics = load_topics_log()
    titles = existing_titles()
    covered = covered_keyword_sets(topics, titles)
    item = news.select_novel(covered, max_age_days=max_age_days)
    if item:
        item["real"] = True
        LOG.info("news hook: %s", item["title"])
        return item
    angle = random.choice(FALLBACK_ANGLES)
    LOG.warning("no fresh news found; using fallback angle: %s", angle)
    return {"title": angle, "real": False, "keywords": news._keywords(angle)}


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
        return False

    try:
        content = coerce_content(raw, persona)
    except Exception as e:
        LOG.error("content invalid: %s", e)
        return False

    if args.dry_run:
        LOG.info("[dry-run] would write post: %s (slug=%s)", content["title"], content["slug"])
        LOG.info("[dry-run] by %s | icon=%s sections=%d",
                 persona["name"], content["icon"], len(content["sections"]))
        return True

    page = render.write_post(content, POSTS_DIR)
    entry = render.update_blog_json(content, BLOG_JSON)

    topics = load_topics_log()
    topics.append({
        "date": content["date"],
        "slug": content["slug"],
        "title": content["title"],
        "author": persona["name"],
        "news_title": news_item.get("title", ""),
        "news_url": news_item.get("url", ""),
        "keywords": sorted(news_item.get("keywords") or []),
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
        "news_title": news_item.get("title", ""),
        "news_url": news_item.get("url", ""),
        "pushed": not args.no_push,
    })

    LOG.info("wrote %s", page.relative_to(REPO_ROOT))
    # Commit ONLY the site content. Local state (personas/topics/history) is
    # gitignored and stays on this machine.
    commit_and_push([page, BLOG_JSON], content["title"], push=not args.no_push)
    LOG.info("done: %s (by %s)", entry["title"], persona["name"])
    return True


def run_loop(args):
    interval = args.interval_hours * 3600
    LOG.info("loop started: every ~%sh, model=%s, push=%s",
             args.interval_hours, args.model, not args.no_push)
    if not args.no_run_on_start:
        _safe_generate(args)
    while True:
        jitter = random.randint(-args.jitter_minutes, args.jitter_minutes) * 60
        sleep_for = max(600, interval + jitter)
        wake = datetime.now(timezone.utc).timestamp() + sleep_for
        LOG.info("sleeping %.1fh (next run ~%s UTC)", sleep_for / 3600,
                 datetime.fromtimestamp(wake, timezone.utc).strftime("%H:%M"))
        time.sleep(sleep_for)
        _safe_generate(args)


def _safe_generate(args):
    try:
        generate_once(args)
    except Exception as e:  # never let one bad run kill the loop
        LOG.exception("unexpected error in generation: %s", e)


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


def show_personas(args):
    now = datetime.now(timezone.utc)
    roster, seeded = personas.ensure_roster(PERSONAS_FILE, now)
    changed = personas.lifecycle(roster, now) or seeded
    if changed and not args.no_save:
        personas.save_roster(PERSONAS_FILE, roster)
    print(personas.summarize(roster))


if __name__ == "__main__":
    main()
