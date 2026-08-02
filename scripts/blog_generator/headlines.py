"""
Headline craft for the blog generator.

The body of every post already gets a distinct voice (see personas.py). The
*headline* did not — it was left entirely to the model, which defaults hard to
one shape ("Punchy Phrase: Explanatory Subtitle") and a small pool of favourite
verbs (Crafting, Mastering, Unlocking, Unleash, Elevate, Transform...). Do that
a few dozen times and the blog reads like one template, not a room full of
writers.

This module fixes that the same way the voice system does: it samples a
concrete *headline brief* per run — one of several genuinely different headline
shapes, weighted toward the author's personality and steered away from whatever
the last few posts already did. The model borrows the shape, not the words.

Everything here is offline (no API, no network) so it stays fully testable and
the generator's --dry-run / selftest paths never touch the network.
"""

from __future__ import annotations

import random
import re
from collections import Counter

# --------------------------------------------------------------------------
# The worn headline vocabulary. This is only the *seed*: the known AI-cliché
# words/phrases that read as auto-generated on day one. The live ban list is
# dynamic — `banned_bits()` grows this with whatever flavour words the recent
# titles have actually overused, so the list self-heals as the blog drifts. See
# `dynamic_bans()` below.
# --------------------------------------------------------------------------
SEED_BANNED_TITLE_BITS = [
    "crafting", "craft your", "mastering", "master the art", "unlocking",
    "unlock your", "unleash", "elevate your", "supercharge", "revamp",
    "reboot", "transform your", "the ultimate guide", "the art of",
    "secrets", "insider secrets", "game-changer", "level up", "boost your",
    "dream job", "expert tips", "expert strategies", "stand out from the crowd",
    "shine", "alchemy", "symphony", "maze", "navigating the", "your journey",
    "power of", "harnessing", "demystifying", "say goodbye to",
]

# Back-compat alias for anything importing the old name.
BANNED_TITLE_BITS = SEED_BANNED_TITLE_BITS

# Essential domain vocabulary that must NEVER be banned even when it recurs in
# every title — these words are supposed to repeat; banning them would gut the
# blog's own subject. The dynamic miner skips anything in here.
CORE_ALLOW = {
    "resume", "resumes", "cv", "cover", "letter", "letters", "job", "jobs",
    "application", "applications", "apply", "career", "careers", "ats",
    "recruiter", "recruiters", "recruiting", "hiring", "hire", "interview",
    "interviews", "skill", "skills", "bullet", "bullets", "summary", "section",
    "sections", "keyword", "keywords", "experience", "work", "hired", "candidate",
    "candidates", "employer", "employers", "posting", "role", "roles",
}

# --------------------------------------------------------------------------
# Headline shapes. Each is a genuinely different structure. Examples exist to
# teach the *shape* — they span unrelated resume topics on purpose so the model
# copies the form, never the sentence.
# --------------------------------------------------------------------------
SHAPES = [
    {
        "name": "plain_statement",
        "brief": "A plain, declarative sentence. No colon, no wordplay — just say "
                 "the useful, slightly surprising thing out loud.",
        "examples": [
            "Most resume summaries say nothing. Yours can say a lot.",
            "Recruiters read the top third of your resume closely and skim the rest.",
        ],
    },
    {
        "name": "imperative",
        "brief": "A direct instruction — one clear action the reader can take today. "
                 "Starts with a verb, no colon.",
        "examples": [
            "Lead every bullet with the result, not the job duty.",
            "Cut the three lines that are quietly sinking your resume.",
        ],
    },
    {
        "name": "question",
        "brief": "One honest question the reader is already asking themselves. "
                 "No colon, no answer in the title.",
        "examples": [
            "Is your resume getting filtered out before a person ever reads it?",
            "Why do two similar candidates get very different callbacks?",
        ],
    },
    {
        "name": "number_lead",
        "brief": "Open on one specific, concrete number or count. Keep the rest short.",
        "examples": [
            "Six seconds is all your resume gets. Here is how to win them.",
            "Three words that make a weak bullet point land.",
        ],
    },
    {
        "name": "contrarian",
        "brief": "Push back on a piece of advice everyone repeats. Take a side.",
        "examples": [
            "Stop tailoring every resume by hand. Do this instead.",
            "The one-page rule is wrong for more people than you think.",
        ],
    },
    {
        "name": "first_person",
        "brief": "A short first-person line, the way a real recruiter or writer "
                 "would actually say it. Specific, not performative.",
        "examples": [
            "I have read thousands of resumes. The good ones share one habit.",
            "When I screen a resume, the summary is the first thing I cut.",
        ],
    },
    {
        "name": "how_to_without",
        "brief": "A 'how to X without Y' promise — name the exact fear or trade-off "
                 "the reader wants to avoid.",
        "examples": [
            "How to explain an employment gap without apologizing for it.",
            "How to sound experienced without inflating what you actually did.",
        ],
    },
    {
        "name": "specific_scenario",
        "brief": "Name the reader's exact situation in plain words. Let the "
                 "specificity do the work — no cleverness needed.",
        "examples": [
            "Your first resume, when you have never held a real job.",
            "Switching careers with nothing directly relevant on paper.",
        ],
    },
    {
        "name": "listicle_specific",
        "brief": "A specific numbered list of concrete items — a real count of real "
                 "things, never a vague 'N tips'. The number and the specificity carry it.",
        "examples": [
            "Five resume lines that quietly get you screened out.",
            "Four phrases recruiters are tired of seeing at the top of a resume.",
        ],
    },
    {
        "name": "quote_contrast",
        "brief": "Set a weak line beside a strong one and let the gap speak. Use real "
                 "before/after wording in quotes — no colon, no hype.",
        "examples": [
            "'Managed a budget' says nothing. 'Cut spend 18%' says everything.",
            "'Responsible for sales' is a job. 'Grew sales 30%' is a hire.",
        ],
    },
    {
        "name": "conditional_if_you",
        "brief": "Open with 'If you [the reader's exact situation]...' then the payoff "
                 "or the single move. Speaks straight to one reader.",
        "examples": [
            "If your resume still opens with an Objective, start here.",
            "If you are applying to 40 jobs a week and hearing nothing, read this.",
        ],
    },
    {
        "name": "two_part_colon",
        "brief": "A two-part colon headline — the classic form, so use it RARELY and "
                 "only when the second half adds real specificity, never a vague "
                 "promise. If the part after the colon could sit on any post, pick a "
                 "different shape.",
        "examples": [
            "Career-change resumes: the reframe that makes unrelated work fit.",
            "ATS keywords: match the posting's language without keyword-stuffing.",
        ],
    },
]

SHAPE_BY_NAME = {s["name"]: s for s in SHAPES}

# Which shapes suit which author personality. A wry writer reaches for a
# contrarian jab; an analytical one leads with a number. This is what makes the
# roster feel like distinct people rather than one voice wearing name tags.
TONE_AFFINITY = {
    "wry": ("imperative", "contrarian", "first_person", "quote_contrast"),
    "warm": ("specific_scenario", "how_to_without", "conditional_if_you"),
    "plainspoken": ("plain_statement", "imperative", "listicle_specific"),
    "analytical": ("number_lead", "plain_statement", "quote_contrast"),
    "energetic": ("imperative", "number_lead", "listicle_specific"),
    "candid": ("first_person", "question", "conditional_if_you"),
    "contrarian": ("contrarian", "question", "quote_contrast"),
    "reassuring": ("specific_scenario", "how_to_without", "conditional_if_you"),
    "storyteller": ("first_person", "specific_scenario"),
}

# The colon shape is the one the model over-reaches for, so it stays rare no
# matter who is writing.
_BASE_WEIGHT = 1.0
_AFFINITY_BOOST = 1.8
_COLON_BASE = 0.3


def pick_shape(persona: dict, recent: list[str] | None = None, rng=random) -> dict:
    """Sample a headline shape, weighted toward the author's personality and away
    from the shapes the last few posts already used."""
    recent = list(recent or [])
    tone = (persona.get("traits") or {}).get("tone", "candid")

    weights = {s["name"]: _BASE_WEIGHT for s in SHAPES}
    for name in TONE_AFFINITY.get(tone, ()):
        weights[name] = weights.get(name, _BASE_WEIGHT) + _AFFINITY_BOOST
    weights["two_part_colon"] = _COLON_BASE

    # Damp anything used recently — hard for the last couple, softer before that.
    for i, name in enumerate(reversed(recent)):
        if name in weights:
            weights[name] *= 0.12 if i < 2 else 0.5

    names = [s["name"] for s in SHAPES]
    chosen = rng.choices(names, weights=[max(0.01, weights[n]) for n in names], k=1)[0]
    return SHAPE_BY_NAME[chosen]


# --------------------------------------------------------------------------
# Recent-opening avoidance: keep two posts in a row from starting the same way.
# --------------------------------------------------------------------------
_STOPWORDS = {"the", "a", "an", "your", "how", "to", "why", "is", "are", "of", "in", "on"}


def opening_signature(title: str) -> str:
    """The first meaningful word of a title, lowercased — a cheap fingerprint for
    'this post opens like that one'."""
    for word in re.findall(r"[A-Za-z']+", title.lower()):
        if word not in _STOPWORDS:
            return word
    return ""


def recent_openings(titles: list[str], n: int = 10) -> list[str]:
    """Distinct opening words from the most recent titles, newest first."""
    seen: list[str] = []
    for title in reversed(titles[-n:]):
        sig = opening_signature(title)
        if sig and sig not in seen:
            seen.append(sig)
    return seen


# --------------------------------------------------------------------------
# Dynamic ban list: the seed clichés plus whatever the recent titles have
# actually started overusing, so the list self-heals as the blog drifts.
# --------------------------------------------------------------------------
# Function words the miner should never flag — they are not "flavour" and
# banning them would just confuse the model.
_MINE_STOPWORDS = {
    "the", "and", "for", "your", "you", "our", "with", "from", "this", "that",
    "these", "those", "how", "why", "what", "when", "who", "into", "out", "off",
    "over", "than", "then", "are", "was", "were", "been", "not", "can", "will",
    "does", "did", "get", "gets", "make", "makes", "more", "less", "here",
    "there", "about", "without", "using", "onto", "just", "only", "still",
}


def dynamic_bans(titles: list[str], recent_n: int = 14, min_count: int = 2) -> list[str]:
    """Flavour words the recent titles have overused — the self-healing half of
    the ban list. Counts content words (>= 4 chars, not a stopword, not core
    domain vocabulary) across the last `recent_n` titles and returns any that
    show up in `min_count` or more of them, pushing the model off whatever crutch
    it has started leaning on."""
    counts: Counter[str] = Counter()
    for title in titles[-recent_n:]:
        words = {
            w.strip("'")
            for w in re.findall(r"[a-z']{4,}", title.lower())
        }
        for w in words:
            if w and w not in _MINE_STOPWORDS and w not in CORE_ALLOW:
                counts[w] += 1
    seeded = set(SEED_BANNED_TITLE_BITS)
    return sorted(w for w, c in counts.items() if c >= min_count and w not in seeded)


def banned_bits(titles: list[str] | None = None) -> list[str]:
    """The live ban list handed to the model: static seed + mined overuse."""
    bits = list(SEED_BANNED_TITLE_BITS)
    if titles:
        bits += dynamic_bans(titles)
    return bits


def format_brief(
    shape: dict,
    openings: list[str] | None = None,
    banned: list[str] | None = None,
) -> str:
    """Render the sampled shape (plus recent-opening avoidance and the live ban
    list) as a prompt block."""
    banned = banned or SEED_BANNED_TITLE_BITS
    lines = [
        "HEADLINE BRIEF — write the title in THIS shape, and only this shape:",
        f"- Shape: {shape['brief']}",
        "- Borrow the structure of these examples, not their words or topic:",
    ]
    lines += [f"    · {ex}" for ex in shape["examples"]]
    lines += [
        "- Ban these worn headline words/phrases entirely: "
        + ", ".join(banned) + ".",
        "- Do NOT default to a 'Punchy Phrase: Explanation' colon title unless the "
        "shape above explicitly is that one.",
        "- Keep it human and specific: roughly 4-11 words, sentence-like, the kind "
        "of thing a real writer would actually type.",
    ]
    if openings:
        lines.append(
            "- Do not open the title with any of these recently-used words: "
            + ", ".join(openings) + "."
        )
    return "\n".join(lines)


# --------------------------------------------------------------------------
# Tiny CLI: eyeball the variety without spending a token.
#   python3 headlines.py            # sample 8 briefs across random tones
# --------------------------------------------------------------------------
if __name__ == "__main__":
    import sys

    n = int(sys.argv[1]) if len(sys.argv) > 1 else 8
    used: list[str] = []
    for _ in range(n):
        tone = random.choice(list(TONE_AFFINITY))
        shape = pick_shape({"traits": {"tone": tone}}, recent=used)
        used.append(shape["name"])
        print(f"[{tone:<11}] -> {shape['name']}")
        print("    e.g.  " + shape["examples"][0])
