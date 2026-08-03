"""
Per-author human fingerprints: the typo / spelling / tic layer.

A real writer is not just a tone — they have ingrained habits that repeat
across everything they publish: a couple of words they always misspell (and
do not know it), spelling *preferences* that are not errors ("towards",
"judgement", "OK"), a dash habit, and the occasional fat-finger slip whose
frequency rises and falls with how rushed they were that day.

This module gives every persona exactly that:

- A **fingerprint generated deterministically from the persona's id** at
  birth. If personas.json is lost or a persona lacks quirks, the identical
  fingerprint regenerates — self-healing by construction.
- A **post-process pass** (`humanize`) applied to the model's output. It only
  touches body prose — never the title, meta description, headings, the CTA,
  or anything inside quotes (quoted before/after resume examples must stay
  copy-safe). Everything it produces is plain ASCII letters and punctuation,
  so it can never break the TSX escaper downstream.
- **Natural fluctuation**: slips are seeded per (author, slug) and budgeted;
  ~1 post in 6 is a "proofread day" with zero slips, a few are "rushed days"
  with more. Habitual misspellings persist even on proofread days — the
  author does not know they are wrong. That split (stable error layer vs
  fluctuating noise layer) is what makes it read as one human over time.
- **Drift**: each time the author writes, their slip rate random-walks a
  little, and rarely they finally *learn* one of their misspellings or pick
  up a new one — bounded, so the fingerprint stays recognizable.

Everything here is offline (no API, no network).
"""

from __future__ import annotations

import random
import re

# --------------------------------------------------------------------------
# Pools
# --------------------------------------------------------------------------

# Genuine, common adult misspellings, grouped by lemma so an author who
# misspells a word misspells its inflections too. correct -> wrong.
MISSPELL_POOL = [
    {"definitely": "definately"},
    {"separate": "seperate", "separately": "seperately"},
    {"receive": "recieve", "received": "recieved", "receiving": "recieving"},
    {"until": "untill"},
    {"occurred": "occured"},
    {"achieve": "acheive", "achievement": "acheivement", "achievements": "acheivements"},
    {"accommodate": "accomodate"},
    {"a lot": "alot"},
    {"occasionally": "occassionally"},
    {"guarantee": "gaurantee", "guaranteed": "gauranteed"},
    {"necessary": "neccessary"},
    {"truly": "truely"},
    {"consistent": "consistant", "consistently": "consistantly"},
    {"relevant": "relevent", "relevance": "relevence"},
    {"referred": "refered"},
    {"committed": "commited"},
    {"lose": "loose"},
]

# Spelling *preferences* — both forms are fine; the author just always picks
# one. This is fingerprint without error, so it can apply at 100%.
STYLE_POOL = [
    ["toward", "towards"],
    ["canceled", "cancelled"],
    ["judgment", "judgement"],
    ["among", "amongst"],
    ["gray", "grey"],
    ["okay", "OK"],
    ["email", "e-mail"],
    ["adviser", "advisor"],
]

PET_PHRASES = [
    "Here's the thing", "Truth be told", "Nine times out of ten",
    "In my experience", "I'll be honest", "For what it's worth",
    "Quick reality check", "More often than not", "Time and again",
    "Let's be real", "Believe me", "Here's where it gets interesting",
]

HABIT_POOL = [
    "you sometimes start a sentence with And or But",
    "you like a one-sentence paragraph when a point deserves it",
    "you ask the reader a question and then answer it yourself",
    "you tuck quick asides into parentheses (like this)",
    "you keep exclamation points to a bare minimum",
    "you allow yourself an exclamation point when something genuinely earns it",
    "you end sections with a plain, direct takeaway line",
    "you drop in an 'honestly' or 'frankly' when leveling with the reader",
    "you like opening a key sentence with 'Look,'",
]

DASH_HABIT = {
    "em": "you reach for an em dash when a sentence needs a swerve",
    "comma": "you almost never type an em dash; commas and parentheses do that job",
    "hyphen": "when you want a dash you just type a plain hyphen - like that",
}

# Words a fat-finger slip must never land on: the blog's core vocabulary
# (misspelling "resume" on a resume blog undermines the whole post) plus
# URL fragments.
PROTECTED = {
    "resume", "resumes", "recruiter", "recruiters", "recruiting", "interview",
    "interviews", "hiring", "cover", "letter", "letters", "skills", "talent",
    "resumai", "linkedin", "https", "http", "www",
}

CONTRACTION_DROPS = [
    (re.compile(r"\bdon[’']t\b"), "dont"),
    (re.compile(r"\bdoesn[’']t\b"), "doesnt"),
    (re.compile(r"\bisn[’']t\b"), "isnt"),
    (re.compile(r"\bcan[’']t\b"), "cant"),
    (re.compile(r"\bthat[’']s\b"), "thats"),
]

MAX_SLIPS_PER_POST = 3
MISSPELL_CAP_PER_WORD = 2      # so a post about separating sections isn't a sea of "seperate"
MISSPELL_PROB = 0.85           # habitual, not metronomic


# --------------------------------------------------------------------------
# Fingerprint generation (deterministic per persona id)
# --------------------------------------------------------------------------

def generate(seed_key: str) -> dict:
    """Build a full fingerprint from a stable key (the persona id). Same key,
    same fingerprint — so a lost or pre-quirks roster heals itself."""
    r = random.Random(f"quirks:{seed_key}")

    groups = r.sample(MISSPELL_POOL, r.choice([2, 2, 3, 3, 4]))

    style_prefs: dict[str, str] = {}
    for grp in r.sample(STYLE_POOL, r.choice([2, 3, 3, 4])):
        pref = r.choice(grp)
        for form in grp:
            if form != pref:
                style_prefs[form] = pref

    return {
        "misspellings": groups,
        "style_prefs": style_prefs,
        "dash_style": r.choices(["em", "comma", "hyphen"], weights=[40, 35, 25])[0],
        "ellipsis": r.choice(["char", "dots", "dots"]),
        "typo_rate": round(r.uniform(0.25, 1.4), 2),   # slips per 1000 words
        "typo_mode": r.choice(["transpose", "drop", "double", "transpose"]),
        "drops_apostrophes": r.random() < 0.3,
        "pet_phrases": r.sample(PET_PHRASES, 2),
        "habits": r.sample(HABIT_POOL, 2),
    }


def ensure_quirks(persona: dict) -> dict:
    """Attach a fingerprint if the persona lacks one (or it is corrupt)."""
    q = persona.get("quirks")
    if not isinstance(q, dict) or not q.get("misspellings"):
        q = generate(persona.get("id") or persona.get("name", "anon"))
        persona["quirks"] = q
    return q


def ensure_roster_quirks(roster: dict) -> bool:
    """Backfill fingerprints for any active author missing one."""
    changed = False
    for p in roster.get("active", []):
        if not isinstance(p.get("quirks"), dict) or not p["quirks"].get("misspellings"):
            ensure_quirks(p)
            changed = True
    return changed


def drift(persona: dict):
    """Called once per post written: the noise layer wanders, and very rarely
    the author learns a word or picks up a new one. Bounded, so they stay
    the same recognizable person."""
    q = persona.get("quirks")
    if not isinstance(q, dict):
        return
    q["typo_rate"] = round(min(1.8, max(0.15, q.get("typo_rate", 0.7) + random.gauss(0, 0.08))), 3)
    groups = q.get("misspellings") or []
    if len(groups) > 1 and random.random() < 0.05:
        groups.pop(random.randrange(len(groups)))          # finally learned one
    if len(groups) < 5 and random.random() < 0.04:
        have = {k for g in groups for k in g}
        fresh = [g for g in MISSPELL_POOL if not (set(g) & have)]
        if fresh:
            groups.append(random.choice(fresh))            # picked up a new one
    q["misspellings"] = groups
    pets = q.get("pet_phrases") or []
    if pets and random.random() < 0.04:
        pool = [p for p in PET_PHRASES if p not in pets]
        if pool:
            pets[random.randrange(len(pets))] = random.choice(pool)


# --------------------------------------------------------------------------
# Prompt-side habits (the model expresses these; spelling stays mechanical)
# --------------------------------------------------------------------------

def prompt_block(persona: dict) -> str:
    q = ensure_quirks(persona)
    habits = list(q.get("habits") or [])
    habits.append(DASH_HABIT.get(q.get("dash_style", "em"), DASH_HABIT["em"]))
    pets = ", ".join(f'"{p}"' for p in q.get("pet_phrases") or [])
    lines = [f"- Ingrained habits (subtle, consistent across your posts): " + "; ".join(habits) + "."]
    if pets:
        lines.append(f"- Phrases you naturally reach for (at most ONE per post, only where it genuinely fits): {pets}.")
    return "\n".join(lines)


# --------------------------------------------------------------------------
# Text machinery
# --------------------------------------------------------------------------

def _map_unquoted(text: str, fn) -> str:
    """Apply fn to the spans of text OUTSIDE double quotes (straight or curly),
    leaving quoted spans — the copy-safe examples — byte-for-byte alone."""
    out, buf, in_q = [], [], False
    for ch in text:
        if ch in '"“”':
            seg = "".join(buf)
            buf = []
            out.append(seg if in_q else fn(seg))
            out.append(ch)
            if ch == "“":
                in_q = True
            elif ch == "”":
                in_q = False
            else:
                in_q = not in_q
        else:
            buf.append(ch)
    seg = "".join(buf)
    out.append(seg if in_q else fn(seg))
    return "".join(out)


def _preserve_case(src_tok: str, target: str) -> str:
    if target.isupper() and len(target) <= 3:      # "OK" stays "OK"
        return target
    if src_tok.isupper() and len(src_tok) > 1:
        return target.upper()
    if src_tok[0].isupper():
        return target[0].upper() + target[1:]
    return target


def _apply_style(seg: str, prefs: dict, counts: dict) -> str:
    for frm, to in prefs.items():
        pat = re.compile(r"\b" + re.escape(frm) + r"\b", re.IGNORECASE)

        def repl(m, to=to):
            counts["styled"] = counts.get("styled", 0) + 1
            return _preserve_case(m.group(0), to)

        seg = pat.sub(repl, seg)
    return seg


def _apply_misspellings(seg: str, groups: list, rng: random.Random, counts: dict) -> str:
    for grp in groups:
        if not isinstance(grp, dict):
            continue
        for correct, wrong in grp.items():
            if counts.get(("w", correct), 0) >= MISSPELL_CAP_PER_WORD:
                continue
            pat = re.compile(r"\b" + re.escape(correct) + r"\b", re.IGNORECASE)

            def repl(m, correct=correct, wrong=wrong):
                if counts.get(("w", correct), 0) >= MISSPELL_CAP_PER_WORD or rng.random() > MISSPELL_PROB:
                    return m.group(0)
                counts[("w", correct)] = counts.get(("w", correct), 0) + 1
                counts["misspellings"] = counts.get("misspellings", 0) + 1
                return _preserve_case(m.group(0), wrong)

            seg = pat.sub(repl, seg)
    return seg


def _apply_dash(seg: str, style: str) -> str:
    if style == "em" or "—" not in seg:
        return seg
    repl = ", " if style == "comma" else " - "
    # never touch dashes that join numbers (ranges like 2024—2026)
    return re.sub(r"(?<!\d)\s*—\s*(?!\d)", repl, seg)


def _apply_ellipsis(seg: str, pref: str) -> str:
    if pref == "dots":
        return seg.replace("…", "...")
    return re.sub(r"(?<!\.)\.{3}(?!\.)", "…", seg)


def _make_slip(word: str, mode: str, rng: random.Random) -> str | None:
    if mode == "drop":
        i = rng.randrange(1, len(word) - 1)
        return word[:i] + word[i + 1:]
    if mode == "double":
        i = rng.randrange(1, len(word) - 1)
        return word[:i] + word[i] + word[i:]
    # transpose two interior letters (default): stays readable
    i = rng.randrange(1, len(word) - 2)
    if word[i] == word[i + 1]:
        i = i + 1 if i < len(word) - 2 else i - 1
    if i < 1:
        return None
    return word[:i] + word[i + 1] + word[i] + word[i + 2:]


def _inject_slip(text: str, mode: str, rng: random.Random, protected: set) -> tuple[str, bool]:
    """Put at most ONE fat-finger slip into an unquoted, lowercase, unimportant
    word of this field. Returns (new_text, did_it)."""
    done = {"hit": False}

    def fx(seg):
        if done["hit"]:
            return seg
        cands = [m for m in re.finditer(r"\b[a-z]{5,14}\b", seg) if m.group(0) not in protected]
        rng.shuffle(cands)
        for m in cands[:6]:
            slip = _make_slip(m.group(0), mode, rng)
            if slip and slip != m.group(0):
                done["hit"] = True
                return seg[: m.start()] + slip + seg[m.end():]
        return seg

    return _map_unquoted(text, fx), done["hit"]


# --------------------------------------------------------------------------
# The main pass
# --------------------------------------------------------------------------

def _collect_prose(content: dict):
    """References to every body-prose string: intro, section paragraphs,
    bullet/callout texts. Headings, title, meta, subtitle, CTA excluded."""
    refs = []
    if content.get("intro"):
        refs.append((content, "intro"))
    for sec in content.get("sections") or []:
        paras = sec.get("paragraphs") or []
        for i in range(len(paras)):
            refs.append((paras, i))
        for group in ("bullets", "callout"):
            for item in sec.get(group) or []:
                if isinstance(item, dict) and item.get("text"):
                    refs.append((item, "text"))
    return refs


def humanize(content: dict, persona: dict) -> tuple[dict, dict]:
    """Apply the author's fingerprint to the post body, in place.

    Deterministic per (author, slug) so the same post always humanizes the
    same way. Returns (content, report)."""
    q = ensure_quirks(persona)
    rng = random.Random(f"{persona.get('id', '?')}:{content.get('slug', '')}")
    refs = _collect_prose(content)
    counts: dict = {}

    # -- stable layer: style prefs + habitual misspellings + dash/ellipsis ----
    for holder, key in refs:
        def fx(seg):
            seg = _apply_style(seg, q.get("style_prefs") or {}, counts)
            seg = _apply_misspellings(seg, q.get("misspellings") or [], rng, counts)
            seg = _apply_dash(seg, q.get("dash_style", "em"))
            seg = _apply_ellipsis(seg, q.get("ellipsis", "char"))
            return seg
        holder[key] = _map_unquoted(holder[key], fx)

    # -- fluctuating layer: how careful were they today? ----------------------
    words = sum(len(re.findall(r"[A-Za-z']+", holder[key])) for holder, key in refs)
    lam = q.get("typo_rate", 0.7) * words / 1000.0
    roll = rng.random()
    if roll < 0.18:
        lam, care = 0.0, "proofread"        # they read it back before posting
    elif roll > 0.93:
        lam, care = lam * 2.2, "rushed"     # they did not
    else:
        care = "normal"
    budget = min(MAX_SLIPS_PER_POST, int(lam) + (1 if rng.random() < (lam - int(lam)) else 0))

    protected = PROTECTED | {w for g in (q.get("misspellings") or []) if isinstance(g, dict) for w in g.values()}
    slips = 0
    order = list(range(len(refs)))
    rng.shuffle(order)
    for idx in order:
        if slips >= budget:
            break
        holder, key = refs[idx]
        holder[key], did = _inject_slip(holder[key], q.get("typo_mode", "transpose"), rng, protected)
        slips += 1 if did else 0

    # -- occasional dropped apostrophe (only some authors have this tic) ------
    apostrophes = 0
    if q.get("drops_apostrophes") and care != "proofread" and rng.random() < 0.25:
        hit = {"done": False}

        def drop_one(seg):
            if hit["done"]:
                return seg
            for pat, plain in CONTRACTION_DROPS:
                new_seg, n = pat.subn(plain, seg, count=1)
                if n:
                    hit["done"] = True
                    return new_seg
            return seg

        for idx in order:
            holder, key = refs[idx]
            holder[key] = _map_unquoted(holder[key], drop_one)
            if hit["done"]:
                apostrophes = 1
                break

    report = {
        "care": care,
        "misspellings": counts.get("misspellings", 0),
        "styled": counts.get("styled", 0),
        "slips": slips,
        "apostrophe_drops": apostrophes,
        "dash_style": q.get("dash_style", "em"),
    }
    return content, report


def report_line(report: dict) -> str:
    if not report:
        return "skipped"
    return (f"{report.get('care', '?')} day | {report.get('misspellings', 0)} habitual misspellings, "
            f"{report.get('styled', 0)} style prefs, {report.get('slips', 0)} slips, "
            f"{report.get('apostrophe_drops', 0)} dropped apostrophes | dash={report.get('dash_style', '?')}")


# --------------------------------------------------------------------------
# CLI support
# --------------------------------------------------------------------------

def describe(persona: dict) -> str:
    q = ensure_quirks(persona)
    miss = ", ".join(f"{c}→{w}" for g in q.get("misspellings", []) if isinstance(g, dict)
                     for c, w in list(g.items())[:1])
    style = ", ".join(f"{f}→{t}" for f, t in (q.get("style_prefs") or {}).items())
    pets = ", ".join(f'"{p}"' for p in q.get("pet_phrases") or [])
    return (
        f"{persona.get('name', '?'):<18} slips≈{q.get('typo_rate', 0)}/1k ({q.get('typo_mode')}) "
        f"dash={q.get('dash_style')} ellipsis={q.get('ellipsis')} "
        f"drops-apostrophes={'yes' if q.get('drops_apostrophes') else 'no'}\n"
        f"    misspells:  {miss or '—'}\n"
        f"    prefers:    {style or '—'}\n"
        f"    reaches for: {pets or '—'}\n"
        f"    habits:     {'; '.join(q.get('habits') or [])}"
    )
