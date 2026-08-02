# ResumAI Blog Post Generator

A **standalone authoring helper** that writes SEO blog posts into this repo for you.

> **It is not part of the website.** Nothing in `app/` imports it, the Next.js
> runtime never calls it, and it has its own `requirements.txt` so it does not
> touch `package.json`. It is a plain local script: it runs, writes static
> `.tsx` files + updates a JSON index, and (optionally) pushes. That's the whole
> footprint.

---

## TL;DR — run it locally

```bash
# 1. one-time setup
cd scripts/blog_generator
pip install -r requirements.txt          # only dependency: openai

# 2. generate ONE post right now (writes files, commits, pushes to main)
python3 generator.py once

# 3. …or run it forever, ~3x/day, and walk away
python3 generator.py loop
```

That's it. Every other command below is a variation on those two.

You can run the commands from inside `scripts/blog_generator/` (shown above) or
from anywhere via the full path — the script figures out the repo location from
its own path, not your current directory:

```bash
python3 scripts/blog_generator/generator.py once
```

---

## Prerequisites

- **Python 3.9+** (check with `python3 --version`).
- **`OPENAI_API_KEY`** — read **automatically** from the repo `.env` (the same
  key the app already uses). Nothing to configure. To override, export your own
  in the shell or pass `--model` for a different model.
- A working `git` checkout (only needed if you let it push; see below).

---

## The commands, explained

```bash
# One post now — the normal way to publish.
# Finds news -> writes the post -> commits -> pushes to your current branch (main).
python3 generator.py once

# Same, but DON'T push. Post is written and committed locally so you can review
# it (git show / git diff HEAD~1) and push yourself when happy.
python3 generator.py once --no-push

# Preview mode. Picks the news + calls the model, but writes NOTHING to disk
# and does no git. Great for a quick sanity check that everything's wired up.
python3 generator.py once --dry-run

# Run continuously, ~3x/day (every 8h with ±45min jitter so it isn't robotic).
# Leave this in a terminal, a tmux/screen session, or background it (see below).
python3 generator.py loop

# Sanity-check the renderer only — builds one canned post full of tricky
# characters and writes it to the path you give. No news, no model, no git.
# Used to prove the output can't break `next build`.
python3 generator.py selftest --out /tmp/page.tsx

# Show the current author roster (their tone, post count, and when each retires).
# Seeds the roster on first run and retires/refills expired authors.
python3 generator.py personas

# Preview sampled headline briefs (no API call) — eyeball the title variety.
python3 generator.py headlines -n 8

# Preview a live research backbone (angle + cited facts + hook).
# NOTE: this one DOES hit the web-search API; it just persists nothing.
python3 generator.py research
```

### Leaving `loop` running in the background

```bash
# start it detached, logging to generator.log
nohup python3 generator.py loop > /dev/null 2>&1 &

# watch it work
tail -f generator.log
```

Stop it with `Ctrl-C` (if foreground) or `kill <pid>` (if backgrounded — find
the pid with `pgrep -f "generator.py loop"`).

---

## What one run actually does

1. **Researches a backbone.** Makes a **separate web-search API call** and
   distils it into the post's spine: a specific angle, 3–5 real and current facts
   (each with a source), and a hook (see [Research backbone](#research-backbone)).
   If research comes up empty or stale, it **falls back** to Google News RSS
   headlines (last ~30 days, stdlib-only) or an evergreen resume angle — so a
   post always ships.
2. **Avoids repeats.** Skips anything overlapping a topic already covered
   (tracked in `topics_log.json`, pre-seeded with every existing post) — and the
   research step keeps its own freshness memory on top (`research_log.json`).
3. **Writes as one of a roster of real-feeling authors.** Each post is bylined
   by a persistent persona with a consistent-but-varying voice (see
   [Authors & voice](#authors--voice) below), so the blog reads like a handful
   of real people — not one AI voice.
4. **Renders build-safe TSX.** `render.py` templates the exact markup the site's
   blog uses and **auto-escapes every entity** (`&apos;`, `&ldquo;`, `&mdash;`,
   `&lt;`, `&#123;`…). The model never writes TSX, so a stray quote, brace, or
   angle bracket can't break the build.
5. **Publishes.** Writes `…/post/<slug>/page.tsx`, appends the entry to
   `public/blog_posts.json` (keeping the OG/JSON-LD/index dates in sync), then
   **commits and pushes ONLY those two site files** to your current branch (skip
   with `--no-push`). Its own memory (personas / topics / history) is updated
   locally but **never committed** — see below.

---

## Authors & voice

The blog is written by a **persistent roster of ~6 authors** (`personas.json`),
not a random name each time. This is what makes it read as authentic.

- **Each author has a trait profile** — sliders for warmth, formality, verbosity,
  cleverness, contrarianism, data-drivenness, plus a signature tone (wry,
  analytical, plainspoken, storyteller…). Their voice for a given post is
  **sampled within their own range**, so an author stays recognizable across
  posts but never writes two identical ones.
- **Traits drift slowly.** Each time an author writes, their sliders nudge a
  little (bounded to a neighbourhood of who they were at birth) — so voices
  evolve over months without becoming a different person.
- **Authors retire and get replaced.** Every author is born with a **random
  lifespan of 2 months to 2 years**, assigned at creation. When they pass it,
  they move to `archived` and a **freshly generated** author (new name, role,
  traits, bio, lifespan) takes their seat — keeping the masthead at ~6 and
  slowly turning it over. Posts they already wrote keep their byline; nothing is
  rewritten.
- **Continuity:** the initial roster reuses the bylines already on the site
  (Eli Lewis, Sarah Cole, Ian Vensel…) with staggered expiries, so it doesn't
  reset the blog's apparent history.

See the roster any time with `python3 generator.py personas`.

### Topic variety

The generator **usually rides real, recent news** (novelty-checked against
everything already written) so posts stay topical. Roughly **~18% of the time**
it deliberately picks an evergreen career angle instead, so the blog reads like
a blog and not a news wire. Tune the mix via `EVERGREEN_CHANCE` in
`generator.py`.

### Research backbone

The old topic source was Google News RSS — fine, but it's just *headlines*, so
posts leaned generic. Before writing, the generator now makes a **separate
web-search API call** (`research.py`, via OpenAI's Responses `web_search` tool —
no new key or account) and distils the results into a **backbone**: a specific,
resume-relevant **angle**, a **hook**, and **3–5 real, current facts each with a
source URL**. The writer builds the post on that spine and attributes the facts
in plain language — which is what makes a topic feel authentic and current
instead of like an evergreen rehash.

It carries **its own freshness memory and self-healing**, separate from the RSS
topic log:

- Every backbone is recorded in `research_log.json` (query, angle, keywords,
  source URLs), pruned after ~45 days.
- Each run **rotates the search query** away from recently-used themes and
  **novelty-checks** the distilled brief against recent entries; a stale or
  duplicate result makes it **retry with a different query** (a few attempts)
  rather than serving the same facts twice.
- If every attempt fails — no key, empty search, all stale — it returns nothing
  and the run **falls back** to the RSS/evergreen path. A post always ships.

Preview a live backbone with `python3 generator.py research`, or turn the whole
step off with `--no-research` (posts then use RSS/evergreen topics only).

### Headline variety

The body already gets a distinct voice per author — the **headline** now gets
the same treatment (`headlines.py`). Left to itself the model defaults hard to
one title formula (`Punchy Phrase: Explanatory Subtitle`) and a small pool of
favourite verbs (Crafting, Mastering, Unlocking, Unleash, Elevate…), so a run of
posts reads like one template.

Instead, each run **samples one of 12 headline shapes** — plain statement,
imperative, honest question, number lead, contrarian take, first-person line,
"how to X without Y", specific-scenario, specific listicle, before/after quote
contrast, "if you…" conditional, or (rarely) the classic two-part colon. The
shape is **weighted toward the author's personality** (a wry author reaches for a
contrarian jab; an analytical one leads with a number) and **steered away from
the shapes and opening words the last few posts already used** (tracked in
`state.json`).

The **ban-list of worn headline vocabulary is dynamic**: a static seed of known
AI clichés (`crafting`, `mastering`, `unlocking`, `dream job`…) **plus any
flavour word the recent titles have started overusing**, mined live from
`blog_posts.json` each run — while core domain words (`resume`, `ATS`, `cover
letter`…) are never banned. So if the model latches onto a new crutch, the list
self-heals and pushes it off. Preview the variety with
`python3 generator.py headlines`.

---

## Options

| Flag | Applies to | Default | Meaning |
|------|-----------|---------|---------|
| `--model` | once, loop | `gpt-4o` | OpenAI model (or set `BLOGGEN_MODEL`) |
| `--temperature` | once, loop | `0.9` | higher = more voice variance |
| `--max-age-days` | once, loop | `30` | ignore news older than this |
| `--no-push` | once, loop | off | commit locally, don't push |
| `--dry-run` | once, loop | off | generate, write nothing |
| `--no-research` | once, loop | off | skip the web-search backbone; RSS/evergreen topics only |
| `--interval-hours` | loop | `8` | cadence (8h ≈ 3×/day) |
| `--jitter-minutes` | loop | `45` | ± randomness so posts aren't clockwork |
| `--no-run-on-start` | loop | off | wait one interval before the first post |

---

## Files in this folder

| File | Role |
|------|------|
| `generator.py` | orchestration, model call, git, CLI |
| `render.py` | TSX template + entity escaping + file writes |
| `news.py` | Google News RSS fetch + novelty selection (fallback topic source) |
| `research.py` | web-search backbone: angle + cited facts + hook, with self-healing freshness memory |
| `personas.py` | author roster: trait profiles, drift, lifespan/retirement, voice sampling |
| `headlines.py` | headline shapes, persona-weighted sampling, worn-word ban-list |
| `requirements.txt` | the single dependency (`openai`) |

### Local state / history (gitignored — the bot's private memory)

These live only on your machine and are **never committed**. They are created
automatically on the first run if missing, so a fresh checkout just works.

| File | Role |
|------|------|
| `personas.json` | the live roster (active + retired authors) |
| `topics_log.json` | every topic covered — the anti-repeat memory (seeded from existing posts) |
| `history.json` | append-only log of every post generated (author, voice, news hook, model…) |
| `state.json` | tiny runtime pointer: last run, restart-safe schedule, recent headline shapes |
| `research_log.json` | web-search backbone memory — used angles/queries/sources, for freshness |
| `generator.log` | run log |

Only the **site content** — the new `page.tsx` and `public/blog_posts.json` —
is what gets committed and pushed. Generated posts land in
`app/app/(routes)/blog/resume-writing-tips-tricks-and-services/post/<slug>/page.tsx`.

---

## Current state (first run notes)

- The **first post** — the "doomjobbing" trend
  (`…/post/doomjobbing-why-mass-applying-backfires-and-tailored-resumes-win/`) —
  was written by hand to seed the pattern. It plus these script files are sitting
  **uncommitted** in your working tree for you to review. **Nothing has been
  pushed yet** — your first `once`/`loop` run will be the first live push.
- The pipeline was verified with `next lint` **and** `tsc --noEmit` against a
  deliberately hostile test post (quotes, apostrophes, `<>`, `{}`, `&`, em-dashes
  in every field → both clean).

## Swapping the model / provider

The only OpenAI-specific code is `call_llm()` in `generator.py`. Point it at a
different model with `--model`, or rewrite that one function to use another
provider (e.g. Anthropic's `claude-sonnet-4-6`) — everything else is provider
agnostic.
