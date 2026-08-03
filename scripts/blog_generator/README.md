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

# 2. run it forever — the intended mode. Publishes ~3 posts/wk on a human
#    editorial rhythm (see "The loop" below) and needs no supervision.
python3 generator.py loop

# 3. …or generate just ONE post right now (writes files, commits, pushes to main)
python3 generator.py once
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

# Run continuously on a human editorial rhythm (~3 posts/week by default):
# weekday-morning-heavy, light weekends, quiet overnight, most days skipped,
# the rare two-post day. Posts publish the moment they generate, so the
# dates on the site are always the genuine publish times — no fixed interval,
# no 2am posts, no clockwork gaps.
# Leave this in a terminal, a tmux/screen session, or background it (see below).
python3 generator.py loop
python3 generator.py loop --posts-per-week 5        # faster pace
python3 generator.py loop --tz America/New_York     # rhythm in a specific tz
                                                    # (default: this machine's clock)

# Sanity-check the renderer only — builds one canned post full of tricky
# characters and writes it to the path you give. No news, no model, no git.
# Used to prove the output can't break `next build`.
python3 generator.py selftest --out /tmp/page.tsx

# Show the current author roster (their tone, post count, and when each retires).
# Seeds the roster on first run and retires/refills expired authors.
python3 generator.py personas

# Preview sampled headline briefs (no API call) — eyeball the title variety.
python3 generator.py headlines -n 8

# Show each author's typo/spelling fingerprint and a before/after demo of the
# humanizing pass (no API call).
python3 generator.py quirks

# Preview a live research backbone (angle + cited facts + hook).
# NOTE: this one DOES hit the web-search API; it just persists nothing.
python3 generator.py research

# Show open + recently closed multi-part series (parts written, each one's
# secret fate: finish, or quietly stop early). No API call.
python3 generator.py series

# Print the loop's runtime state: last run, last post, next scheduled post,
# and a 7-day success/failure tally. The quick "is it healthy?" check.
python3 generator.py state
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

1. **Decides what kind of post this is**, in priority order:
   - **A series continuation** — if an open multi-part series is due, this run
     writes its next part, by the same author (see
     [Multi-part series](#multi-part-series-part-13--including-abandoned-ones)).
   - **A "tailor your resume for X" entry** — roughly 1 in 4 runs targets one
     big employer or field with its own web research (see
     [that series](#the-tailor-your-resume-for-x-series)).
   - **A regular researched post** — a **separate web-search API call**
     distilled into the post's spine: a specific angle, 4–6 real and current
     facts (each with a source), and a hook (see
     [Research backbone](#research-backbone)). If research comes up empty or
     stale, it **falls back** to Google News RSS headlines (last ~30 days,
     stdlib-only) or an evergreen resume angle — so a post always ships. A
     regular post sometimes opens a **new 2–3-part series** (title carries
     "Part 1").
2. **Avoids repeats.** Skips anything overlapping a topic already covered
   (tracked in `topics_log.json`, pre-seeded with every existing post) — and the
   research step keeps its own freshness memory on top (`research_log.json`).
3. **Writes as one of a roster of real-feeling authors.** Each post is bylined
   by a persistent persona with a consistent-but-varying voice (see
   [Authors & voice](#authors--voice) below), so the blog reads like a handful
   of real people — not one AI voice.
4. **Writes it with real depth.** Posts run 4–7 sections depending on the
   author's verbosity, and every post must include at least two before/after
   resume examples with adaptable wording and at least two sections of
   concrete, do-it-today advice — a piece worth bookmarking, not a listicle.
   Afterwards the author's human fingerprint (habitual typos, spelling
   preferences, tics) is applied mechanically to the body prose.
5. **Renders build-safe TSX.** `render.py` templates the exact markup the site's
   blog uses and **auto-escapes every entity** (`&apos;`, `&ldquo;`, `&mdash;`,
   `&lt;`, `&#123;`…). The model never writes TSX, so a stray quote, brace, or
   angle bracket can't break the build.
6. **Publishes.** Writes `…/post/<slug>/page.tsx`, appends the entry to
   `public/blog_posts.json` (keeping the OG/JSON-LD/index dates in sync), then
   **commits and pushes ONLY those two site files** to your current branch (skip
   with `--no-push`). Ready-to-paste social captions land in `social_drafts/`
   (local only; Discord auto-posts if a webhook is configured). Its own memory
   (personas / topics / history / series) is updated locally but **never
   committed** — see below.

---

## The loop — how the blog actually runs

`python3 generator.py loop` is the intended mode: a long-running process that
does everything above on a **human editorial rhythm**, hands-off. What it
guarantees:

**Human publish times, honestly earned.** `rhythm.py` samples each next
publish moment from a weekday/hour distribution instead of a fixed interval:
Mon–Thu are the busiest days, Friday tapers, weekends are mostly quiet; times
peak mid-morning with a smaller after-lunch shelf and a thin evening tail, and
nothing fires overnight. Days get skipped, the odd day gets two posts, and
minutes/seconds are uniform so nothing lands on the hour. At the default
`--posts-per-week 3` a simulated year comes out at ~3.2/week with gaps ranging
from a few hours to several days. Crucially, posts **publish at the moment
they're generated** — so the date on the page, in `blog_posts.json`, and on
the git commit are all the same genuine timestamp. Nothing is backdated or
faked; the rhythm changes *when the work happens*, never what the page claims.

**Restart-safe.** The next wake time is persisted to `state.json` *before*
sleeping, so stopping and restarting the process resumes the same schedule —
never an extra post. A minimum 3.5h gap between posts holds across restarts.
If the machine was asleep past a scheduled slot, the loop catches up **only if
"now" is an hour a person would plausibly publish** — woken at 3am, it waits
for morning. A stored wake time at an implausible hour (e.g. left over from an
older scheduler) is detected and resampled.

**Self-healing.** A failed run (model error, bad JSON, network) never kills
the loop — it's recorded and the next slot is simply sampled as usual. Every
run lands in a rolling 7-day success/failure tally.

**Monitoring.** `python3 generator.py state` shows the last run, last post,
the next scheduled post, and the 7-day tally; `tail -f generator.log` watches
it live; `python3 generator.py series` shows open story arcs. The loop logs
every decision it makes (author, topic mode, headline shape, quirk pass,
next wake time).

Pace and clock are tunable: `--posts-per-week` (default 3) scales the whole
rhythm; `--tz` pins it to a specific IANA timezone (default: this machine's
clock).

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

### Human fingerprints (typos, spelling habits, tics)

Real writers are imperfect in *consistent* ways — and that consistency is the
fingerprint. Every author is born with one (`quirks.py`), generated
**deterministically from their persona id**, so if `personas.json` is ever
lost or an old roster predates the feature, the exact same fingerprint
regenerates — self-healing without state. Each fingerprint has two layers:

- **A stable error layer** the author doesn't know about: 2–4 words they
  habitually misspell (`seperate`, `definately`, `untill`, `recieve`…) the
  same way in every post, plus spelling *preferences* that aren't errors
  (`towards` vs `toward`, `judgement` vs `judgment`, `OK` vs `okay`,
  `e-mail`…), a dash habit (em dash, plain hyphen, or "never — commas
  instead") and an ellipsis habit (`…` vs `...`). These persist even when the
  author proofreads, because they believe they're correct.
- **A fluctuating noise layer**: fat-finger slips (each author has a
  signature mode — transposed, dropped, or doubled letters) at a per-author
  rate around 0.25–1.4 per 1000 words. Seeded per post, so ~1 post in 6 is a
  "proofread day" with zero slips and the occasional one is "rushed" with
  more — the way a real person's care level wanders. Some authors also
  occasionally drop an apostrophe (`dont`). Capped at 3 slips/post.

The pass is applied **mechanically after the model call** (`quirks.humanize`),
never by the LLM — so it's reliable and consistent. It only touches body
prose: titles, headings, meta descriptions, the CTA, and **anything inside
quotes** (the before/after resume examples readers copy) are never altered.
Core domain words (`resume`, `recruiter`, `ATS`…) are protected from slips.
Everything it emits is plain ASCII, so it can't break the TSX escaper.

The prompt side gets the softer half of the fingerprint: each author's
ingrained habits ("starts sentences with And or But", "asides in
parentheses") and one or two pet phrases they reach for — so the voice itself
carries the same authorial signature the spelling does.

**And it drifts.** Each post, the slip rate random-walks (bounded); rarely an
author finally *learns* one of their misspellings, or picks up a new one, or
swaps a pet phrase — voices age the way real ones do without becoming someone
else. New authors get fresh fingerprints at birth. Inspect everything with
`python3 generator.py quirks` (prints each fingerprint plus a live
before/after demo paragraph).

### Topic variety

The primary topic source is the [research backbone](#research-backbone) — a
fresh web search per post. When research comes up empty the generator falls
back to Google News RSS: a genuinely job/hiring-relevant headline drives the
post ~60% of the time, otherwise (or on the `RESUME_TOPIC_CHANCE` coin flip)
it writes a concrete resume how-to from `RESUME_ANGLES` with the headline as a
light opening nod — so the blog stays topical without reading like a news
wire, and no two intros open the same way.

### The "tailor your resume for X" series

Roughly **1 in 4 posts** (`TAILOR_TOPIC_CHANCE`) is the next entry in a series:
*how to tailor your resume for Google / Walmart / nursing jobs / federal
government jobs…* — drawn from `TAILOR_TARGETS` in `generator.py` (~30 big,
always-hiring employers plus ~10 field/role targets). Each series post:

- runs a **targeted web search** on that employer's hiring process and
  resume screening (`research.build_target_backbone`) — the post only ships if
  real, cited facts come back, so nothing about a company is ever invented;
- must put the literal phrase **"resume for {target}"** in the title (which is
  also what people actually search), so the series is recognizable and each
  target is provably covered once — the picker scans existing titles and skips
  targets already done;
- walks each resume section toward that employer with before/after examples,
  and says plainly when a point is general craft rather than company-specific.

A research miss just falls through to a regular post and leaves the target
uncovered for a later roll.

### Multi-part series (Part 1–3) — including abandoned ones

Roughly **1 in 7 regular posts** (`START_CHANCE` in `series.py`) opens a
planned **2- or 3-part series**: the title carries "Part 1" and the post
promises, in the author's voice, what the next part will dig into.
Continuations arrive a few posts later (55% chance per run, so parts land days
apart, never back-to-back), **always by the same author**, opening with a
natural first-person recap ("in part 1 I covered…").

The human part: every series rolls a **secret fate at birth** — about 60%
get finished, but **a third are quietly abandoned after Part 1** (and a few
three-parters stall at two). A forgotten series is never mentioned again — no
apology, no cleanup — it just sits there, the way abandoned series sit on real
blogs. A series whose author retires mid-thread is abandoned too.

State lives in `series.json` (gitignored, local-only). Inspect open and
recently closed series with `python3 generator.py series`. Never during a
"tailor your resume for X" post; at most 2 series open at once; hard cap 3
parts.

### Research backbone

The old topic source was Google News RSS — fine, but it's just *headlines*, so
posts leaned generic. Before writing, the generator now makes a **separate
web-search API call** (`research.py`, via OpenAI's Responses `web_search` tool —
no new key or account) and distils the results into a **backbone**: a specific,
resume-relevant **angle**, a **hook**, and **4–6 real, current facts each with a
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
| `--posts-per-week` | loop | `3` | average pace the rhythm aims for (or set `BLOGGEN_POSTS_PER_WEEK`) |
| `--tz` | loop | `local` | IANA timezone the rhythm lives in, e.g. `America/New_York` (or set `BLOGGEN_TZ`) |
| `--interval-hours` | loop | — | deprecated, ignored (scheduling follows the rhythm) |
| `--jitter-minutes` | loop | — | deprecated, ignored (scheduling follows the rhythm) |
| `--no-run-on-start` | loop | off | never publish at startup, even if a post was missed |

Scheduling details live in [The loop](#the-loop--how-the-blog-actually-runs)
above.

---

## Files in this folder

| File | Role |
|------|------|
| `generator.py` | orchestration, model call, git, CLI |
| `render.py` | TSX template + entity escaping + file writes |
| `news.py` | Google News RSS fetch + novelty selection (fallback topic source) |
| `research.py` | web-search backbone: angle + cited facts + hook, with self-healing freshness memory |
| `personas.py` | author roster: trait profiles, drift, lifespan/retirement, voice sampling |
| `quirks.py` | per-author human fingerprints: habitual misspellings, spelling preferences, slip rate, tics — applied post-model, quote-safe |
| `headlines.py` | headline shapes, persona-weighted sampling, worn-word ban-list |
| `rhythm.py` | human publishing rhythm: weekday/hour-weighted next-post sampling for `loop` |
| `series.py` | multi-part series (Part 1–3): start/continue/finish — or quietly abandon |
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
| `series.json` | open + closed multi-part series (parts written, each one's secret fate) |
| `generator.log` | run log |

Only the **site content** — the new `page.tsx` and `public/blog_posts.json` —
is what gets committed and pushed. Generated posts land in
`app/app/(routes)/blog/resume-writing-tips-tricks-and-services/post/<slug>/page.tsx`.

---

## Current state (as of 2026-08-03)

- The generator ran live Jul 31 – Aug 3 (9 posts, ~3/day on the old fixed
  8-hour interval). **All 9 were deleted** (commit `f00e6d6`) — they predate
  the current format (deeper posts, 3/wk rhythm, tailoring + multi-part
  series). The blog is back to its 17 pre-generator posts; the local topic
  log was pruned so those topics can be re-covered properly.
- The loop is **not currently running**. Start it with
  `python3 generator.py loop` — it picks up the stored schedule (or samples a
  fresh, plausible slot) and takes it from there.
- The pipeline was verified with `next lint` **and** `tsc --noEmit` against a
  deliberately hostile test post (quotes, apostrophes, `<>`, `{}`, `&`, em-dashes
  in every field → both clean).

## Swapping the model / provider

The only OpenAI-specific code is `call_llm()` in `generator.py`. Point it at a
different model with `--model`, or rewrite that one function to use another
provider (e.g. Anthropic's `claude-sonnet-4-6`) — everything else is provider
agnostic.
