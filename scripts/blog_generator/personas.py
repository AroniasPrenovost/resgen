"""
Persona lifecycle for the blog generator.

Instead of picking a random name + random voice every run, the blog is written
by a small, persistent roster of ~6 authors. Each author has a *trait profile*
(sliders like warmth, formality, verbosity, cleverness…). Their voice for a
given post is sampled **within their own range**, so an author stays
recognizable but never robotic. Traits **drift slightly** each time they write.
And every author is born with a **random lifespan of 2 months to 2 years**;
when they pass it they retire and a freshly generated author takes their seat.

State lives in personas.json:  { "active": [...], "archived": [...] }

Everything here is offline (no API, no network) so it is fully testable and the
generator's --dry-run / selftest paths never mutate real state.
"""

from __future__ import annotations

import json
import random
import uuid
from datetime import datetime, timedelta, timezone
from pathlib import Path

import quirks

TARGET_ROSTER = 6
MIN_LIFESPAN_DAYS = 60       # ~2 months
MAX_LIFESPAN_DAYS = 730      # ~2 years

# --------------------------------------------------------------------------
# Building blocks for generating a person
# --------------------------------------------------------------------------
FIRST_NAMES = [
    "Eli", "Sarah", "Ian", "Devin", "Alicia", "Gregory", "Olivia", "Marcus",
    "Priya", "Nadia", "Theo", "Renee", "Malik", "Camila", "Jonah", "Yuki",
    "Diego", "Hannah", "Omar", "Bianca", "Curtis", "Leah", "Sofia", "Andre",
    "Grace", "Nathan", "Imani", "Victor", "Rosa", "Simon", "Tara", "Wesley",
]
LAST_NAMES = [
    "Lewis", "Cole", "Vensel", "Marsh", "Graham", "Shaw", "Reed", "Okoye",
    "Nakamura", "Fournier", "Delgado", "Whitfield", "Barnes", "Osei", "Kaplan",
    "Romano", "Sokolov", "Bennett", "Castillo", "Hargrove", "Petrova", "Nguyen",
    "Abbott", "Mercer", "Dunn", "Ellison", "Vance", "Serrano", "Holt", "Frey",
]
ROLES = [
    "Sales Recruitment Specialist", "Senior Hiring Manager", "Career Coach",
    "Talent Acquisition Lead", "SEO Strategist and Content Creator",
    "Tech Recruiter", "Career Development Advisor", "Recruiting Operations Lead",
    "Executive Resume Writer", "Corporate Recruiter", "HR Business Partner",
    "Interview Prep Coach", "Workforce Analyst", "Staffing Consultant",
    "People Operations Manager", "Former Recruiter turned Coach",
]

# Signature tone → the phrase handed to the model. The *key* is the author's
# stable identity; the sliders modulate how it lands on any given day.
TONE_SIGNATURES = {
    "wry": "wry and a little irreverent, but never snarky for its own sake",
    "warm": "warm and encouraging, like a mentor who has your back",
    "plainspoken": "plainspoken and no-nonsense, cuts straight to the useful part",
    "analytical": "analytical and measured, leans on evidence and numbers",
    "energetic": "energetic and motivating without tipping into hype",
    "candid": "conversational and candid, like advice from a friend who recruits",
    "contrarian": "gently contrarian, willing to push back on common wisdom",
    "reassuring": "calm and reassuring, aimed at readers who feel burned out",
    "storyteller": "story-driven, opens with a scene or a person before the point",
}

# One sample opening sentence per tone — a voice model, not a template. Injected
# into the prompt so the model has a concrete register anchor for the first
# paragraph rather than just a prose description of a personality.
TONE_ANCHORS = {
    "wry": (
        "Hiring managers have a way of remembering the resumes they almost skipped "
        "— usually because something small made them stop."
    ),
    "warm": (
        "If you're staring at a resume that doesn't feel like you yet, "
        "I promise that's a fixable problem."
    ),
    "plainspoken": (
        "Here is what actually gets you past the first screen, "
        "and it is not what most posts about this topic say."
    ),
    "analytical": (
        "The data on this is clearer than the career-advice industry would like to admit."
    ),
    "energetic": (
        "The job you want is out there — what's standing between you and it "
        "is usually a one-paragraph fix on your resume."
    ),
    "candid": (
        "I'll tell you what I'd tell a friend who asked me to look at their resume over coffee."
    ),
    "contrarian": (
        "Most resume advice you'll find online is solving the wrong problem."
    ),
    "reassuring": (
        "Job searching is exhausting, and it's okay to admit that the process "
        "makes no sense sometimes."
    ),
    "storyteller": (
        "A few months ago I watched a candidate lose an offer because of one line "
        "on their resume — not a lie, just the wrong framing."
    ),
}

VERBOSITY_LEVELS = {
    "tight": "Lean but complete. 4 focused sections, short paragraphs, no filler — "
             "the depth comes from worked examples, not word count.",
    "medium": "A proper read. 5 sections with worked examples throughout, a mix of "
              "short and medium paragraphs.",
    "expansive": "Give it room. 6 to 7 sections, several longer, thoughtful "
                 "paragraphs, and examples that build on each other through the piece.",
}

CLEVERNESS_LEVELS = [
    (0.35, "Play it straight and useful. No cute metaphors, just clear help."),
    (0.60, "Open with one sharp observation or hook, then get practical."),
    (0.80, "Allow yourself one good analogy or running metaphor if it genuinely clarifies."),
    (1.01, "Be a touch imperfect and human — an aside, a rhetorical question, an uneven "
           "rhythm. Do not sound polished to a mirror shine."),
]

# Bio fragments, chosen by the author's dominant leaning, so the byline feels
# built up rather than templated.
_BIO_BACKGROUND = [
    "has spent {years} years on the hiring side of the desk",
    "spent {years} years in agency recruiting before going independent",
    "has reviewed thousands of resumes over {years} years in talent",
    "moved from {years} years of corporate recruiting into coaching job seekers",
    "has {years} years helping people navigate layoffs, pivots, and comebacks",
    "built screening and ATS workflows for {years} years",
]
_BIO_FLAVOR = {
    "warm": "and still remembers how it feels to be the one refreshing an inbox.",
    "analytical": "and treats a resume like a dataset with a story to tell.",
    "contrarian": "and is happy to tell you when the popular advice is wrong.",
    "plainspoken": "and has zero patience for buzzwords.",
    "wry": "and finds the whole hiring circus equal parts maddening and funny.",
    "energetic": "and genuinely loves watching someone land the offer.",
    "candid": "and writes the way they would actually talk to a friend.",
    "reassuring": "and believes most job searches are less broken than they feel.",
    "storyteller": "and thinks every career is worth telling well.",
}


# --------------------------------------------------------------------------
# Small helpers
# --------------------------------------------------------------------------
def _now() -> datetime:
    return datetime.now(timezone.utc)


def _iso(dt: datetime) -> str:
    return dt.strftime("%Y-%m-%dT%H:%M:%S.000Z")


def _parse(s: str) -> datetime:
    return datetime.strptime(s, "%Y-%m-%dT%H:%M:%S.000Z").replace(tzinfo=timezone.utc)


def _clamp(x: float, lo: float = 0.0, hi: float = 1.0) -> float:
    return max(lo, min(hi, x))


def _slider() -> float:
    return round(_clamp(random.gauss(0.5, 0.18)), 2)


DRIFTING = ("warmth", "formality", "verbosity", "cleverness", "contrarian", "data_driven")


# --------------------------------------------------------------------------
# Persona creation
# --------------------------------------------------------------------------
def _make_traits() -> dict:
    return {
        "tone": random.choice(list(TONE_SIGNATURES)),
        "warmth": _slider(),
        "formality": _slider(),
        "verbosity": _slider(),
        "cleverness": _slider(),
        "contrarian": _slider(),
        "data_driven": _slider(),
    }


def _make_bio(name: str, traits: dict, years: int) -> str:
    first = name.split()[0]
    background = random.choice(_BIO_BACKGROUND).format(years=years)
    flavor = _BIO_FLAVOR.get(traits["tone"], "and cares about getting people hired.")
    return f"{first} {background}, {flavor}"


def new_persona(now: datetime, used_names: set[str], born: datetime | None = None) -> dict:
    born = born or now
    # Pick a name not already in use (active or archived).
    for _ in range(200):
        name = f"{random.choice(FIRST_NAMES)} {random.choice(LAST_NAMES)}"
        if name not in used_names:
            break
    traits = _make_traits()
    years = random.randint(6, 22)
    lifespan = random.uniform(MIN_LIFESPAN_DAYS, MAX_LIFESPAN_DAYS)
    pid = uuid.uuid4().hex[:8]
    return {
        "id": pid,
        "name": name,
        "role": random.choice(ROLES),
        "years": years,
        "bio": _make_bio(name, traits, years),
        "born": _iso(born),
        "expires": _iso(born + timedelta(days=lifespan)),
        "traits": traits,
        "origin": {k: traits[k] for k in DRIFTING},   # bounds for drift
        "quirks": quirks.generate(pid),   # typo/spelling fingerprint, stable for life
        "posts_written": 0,
        "last_used": None,
    }


def _seed_roster(now: datetime) -> dict:
    """Initial roster reuses the bylines already appearing on the site (for
    continuity) but gives each a trait profile and a staggered, mostly-future
    expiry so retirements spread out over the coming ~1-2 years."""
    seeds = [
        ("Eli Lewis", "Sales Recruitment Specialist", "wry"),
        ("Sarah Cole", "Senior Hiring Manager", "plainspoken"),
        ("Ian Vensel", "Career Coach", "contrarian"),
        ("Devin Marsh", "Talent Acquisition Lead", "analytical"),
        ("Alicia Graham", "SEO Strategist and Content Creator", "candid"),
        ("Gregory Shaw", "Tech Recruiter", "wry"),
    ]
    active = []
    used = set()
    for name, role, tone in seeds:
        born = now - timedelta(days=random.uniform(30, 400))
        p = new_persona(now, used, born=born)
        p["name"] = name
        p["role"] = role
        p["traits"]["tone"] = tone
        p["bio"] = _make_bio(name, p["traits"], p["years"])
        # ensure the seed's expiry is in the future so we don't retire all at once
        exp = _parse(p["expires"])
        if exp <= now + timedelta(days=20):
            p["expires"] = _iso(now + timedelta(days=random.uniform(60, 600)))
        used.add(name)
        active.append(p)
    return {"active": active, "archived": []}


# --------------------------------------------------------------------------
# Persistence + lifecycle
# --------------------------------------------------------------------------
def load_roster(path: Path) -> dict | None:
    if not path.exists():
        return None
    try:
        data = json.loads(path.read_text(encoding="utf-8"))
        data.setdefault("active", [])
        data.setdefault("archived", [])
        return data
    except (json.JSONDecodeError, OSError):
        return None


def save_roster(path: Path, roster: dict):
    path.write_text(json.dumps(roster, indent=2, ensure_ascii=False) + "\n", encoding="utf-8")


def ensure_roster(path: Path, now: datetime | None = None) -> tuple[dict, bool]:
    now = now or _now()
    roster = load_roster(path)
    if roster is None:
        return _seed_roster(now), True
    return roster, False


def _used_names(roster: dict) -> set[str]:
    return {p["name"] for p in roster["active"]} | {p["name"] for p in roster["archived"]}


def lifecycle(roster: dict, now: datetime | None = None, target: int = TARGET_ROSTER) -> bool:
    """Retire expired authors and top the roster back up. Returns True if the
    roster changed (so the caller knows to persist)."""
    now = now or _now()
    changed = False

    survivors = []
    for p in roster["active"]:
        try:
            expired = _parse(p["expires"]) <= now
        except (KeyError, ValueError):
            expired = False
        if expired:
            p["retired_at"] = _iso(now)
            roster["archived"].append(p)
            changed = True
        else:
            survivors.append(p)
    roster["active"] = survivors

    while len(roster["active"]) < target:
        roster["active"].append(new_persona(now, _used_names(roster)))
        changed = True

    return changed


# --------------------------------------------------------------------------
# Selection, drift, voice sampling
# --------------------------------------------------------------------------
def pick(roster: dict) -> dict:
    """Prefer whoever has written least recently, with a little randomness, so
    bylines rotate and the same author rarely posts twice in a row."""
    active = roster["active"]
    active.sort(key=lambda p: (p.get("last_used") or "", p.get("posts_written", 0)))
    pool = active[: min(3, len(active))]
    return random.choice(pool)


def touch_and_drift(persona: dict, now: datetime | None = None):
    """Record the post and nudge the author's traits a little, bounded to a
    neighbourhood of who they were at birth so they evolve without becoming a
    different person."""
    now = now or _now()
    persona["posts_written"] = persona.get("posts_written", 0) + 1
    persona["last_used"] = _iso(now)
    origin = persona.get("origin", {})
    for k in DRIFTING:
        base = origin.get(k, persona["traits"].get(k, 0.5))
        cur = persona["traits"].get(k, base)
        nudged = cur + random.gauss(0, 0.03)
        persona["traits"][k] = round(_clamp(nudged, base - 0.2, base + 0.2), 3)
    # The imperfection fingerprint wanders the same way: slip rate walks, and
    # rarely a misspelling is finally learned (or a new one picked up).
    quirks.drift(persona)


def _jit(x: float, sigma: float = 0.12) -> float:
    return _clamp(x + random.gauss(0, sigma))


def _verbosity(v: float) -> tuple[str, str]:
    label = "tight" if v < 0.4 else "expansive" if v > 0.72 else "medium"
    return label, VERBOSITY_LEVELS[label]


def _cleverness(c: float) -> str:
    for threshold, directive in CLEVERNESS_LEVELS:
        if c < threshold:
            return directive
    return CLEVERNESS_LEVELS[-1][1]


def sample_voice(persona: dict) -> dict:
    """Turn the author's traits into concrete directions for THIS post, jittered
    within their range so no two posts read identically."""
    t = persona["traits"]
    tone = TONE_SIGNATURES.get(t.get("tone", "candid"), TONE_SIGNATURES["candid"])

    mods = []
    if _jit(t.get("warmth", 0.5)) > 0.72:
        mods.append("with a genuinely warm, human touch")
    if _jit(t.get("data_driven", 0.5)) > 0.72:
        mods.append("backing claims with concrete numbers")
    if _jit(t.get("contrarian", 0.5)) > 0.75:
        mods.append("and willing to challenge the conventional advice")
    if _jit(t.get("formality", 0.5)) < 0.28:
        mods.append("in a loose, casual register")
    if mods:
        tone = tone + "; " + ", ".join(mods)

    verbosity = _verbosity(_jit(t.get("verbosity", 0.5)))
    cleverness = _cleverness(_jit(t.get("cleverness", 0.5)))
    return {"tone": tone, "verbosity": verbosity, "cleverness": cleverness}


def summarize(roster: dict) -> str:
    """Human-readable roster snapshot for the CLI."""
    now = _now()
    lines = [f"Active authors ({len(roster['active'])}):"]
    for p in sorted(roster["active"], key=lambda x: x["expires"]):
        try:
            days_left = (_parse(p["expires"]) - now).days
        except ValueError:
            days_left = "?"
        t = p["traits"]
        lines.append(
            f"  • {p['name']:<18} {p['role']:<34} tone={t['tone']:<11} "
            f"posts={p.get('posts_written', 0):<3} retires in ~{days_left}d"
        )
    if roster["archived"]:
        lines.append(f"Archived (retired): {len(roster['archived'])}")
    return "\n".join(lines)
