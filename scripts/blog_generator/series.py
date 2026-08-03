#!/usr/bin/env python3
"""Multi-part series: posts that are Part 1..3 of a thread — including the
very human failure mode of a series that never gets its Part 2.

Real bloggers start series and don't always finish them. So each series rolls
a secret fate at birth: most get completed, a good share are quietly forgotten
after Part 1, and some three-parters stall at two. A forgotten series is never
mentioned again — no apology post, no cleanup — it just ages out of the open
list, exactly the way an abandoned series sits on a real blog.

Mechanics:
- A regular post sometimes (START_CHANCE) becomes "Part 1" of a planned 2-3
  part series (never during a "tailor your resume for X" post).
- On later runs the loop sometimes (CONTINUE_CHANCE) writes the next part —
  same author, next facet of the thread, a recap line in their own voice. So
  parts land a few posts apart rather than back-to-back.
- The fate caps how many parts actually get written. A series whose fate is
  spent (or whose author retired) just sits until STALE_DAYS pass, then closes
  as forgotten.

State lives in series.json (gitignored, local-only, like all bot memory).
"""

from __future__ import annotations

import json
import random
from datetime import datetime, timedelta, timezone
from pathlib import Path

START_CHANCE = 0.15     # chance a regular post opens a new series
CONTINUE_CHANCE = 0.55  # per-run chance an open, fated series gets its next part
STALE_DAYS = 45         # an open series untouched this long closes as forgotten
MAX_OPEN = 2            # never juggle more open series than this
MAX_PARTS = 3

# Fate distribution, sampled at series birth:
#   ~60% finish every planned part, ~25% are forgotten after Part 1,
#   ~15% stall one short of the plan (which for a 2-parter is also Part 1).
_FATE_FINISH = 0.60
_FATE_FORGET = 0.25


def _iso(dt: datetime) -> str:
    return dt.strftime("%Y-%m-%dT%H:%M:%S.000Z")


def _parse(ts: str) -> datetime | None:
    try:
        return datetime.strptime(ts, "%Y-%m-%dT%H:%M:%S.000Z").replace(tzinfo=timezone.utc)
    except (TypeError, ValueError):
        return None


def load(path: Path) -> dict:
    if path.exists():
        try:
            state = json.loads(path.read_text(encoding="utf-8"))
            if isinstance(state, dict):
                state.setdefault("open", [])
                state.setdefault("closed", [])
                return state
        except json.JSONDecodeError:
            pass
    return {"open": [], "closed": []}


def save(path: Path, state: dict):
    path.write_text(json.dumps(state, indent=2, ensure_ascii=False) + "\n", encoding="utf-8")


def may_start(state: dict, rng=random) -> dict | None:
    """Roll whether this post opens a new series; if so, plan it and seal its
    fate. Returns {"planned": n, "will_write": m} or None."""
    if len(state["open"]) >= MAX_OPEN:
        return None
    if rng.random() >= START_CHANCE:
        return None
    planned = 2 if rng.random() < 0.55 else MAX_PARTS
    r = rng.random()
    if r < _FATE_FINISH:
        will_write = planned
    elif r < _FATE_FINISH + _FATE_FORGET:
        will_write = 1
    else:
        will_write = max(1, planned - 1)
    return {"planned": planned, "will_write": will_write}


def start(state: dict, angle: str, author: str, plan: dict, part1: dict,
          now: datetime) -> dict:
    entry = {
        "id": f"s{now.strftime('%Y%m%d%H%M%S')}",
        "angle": angle[:140],
        "author": author,
        "planned": plan["planned"],
        "will_write": plan["will_write"],
        "parts": [part1],
        "started": _iso(now),
        "last_part": part1.get("date") or _iso(now),
        "status": "open",
    }
    state["open"].append(entry)
    return entry


def _close(state: dict, entry: dict, status: str):
    entry["status"] = status
    state["open"].remove(entry)
    state["closed"].append(entry)


def pick_continuation(state: dict, active_authors: list[str], now: datetime,
                      rng=random) -> dict | None:
    """The open series due for its next part this run, or None. Also does the
    housekeeping: closes series that went stale or lost their author. Mutates
    state — the caller persists it."""
    due = None
    for entry in list(state["open"]):
        last = _parse(entry.get("last_part") or "")
        if last and now - last > timedelta(days=STALE_DAYS):
            _close(state, entry, "forgotten")
            continue
        if entry["author"] not in active_authors:
            # The author retired mid-series — the most human abandonment of all.
            _close(state, entry, "author_retired")
            continue
        if len(entry["parts"]) >= entry["will_write"]:
            continue  # fate spent: no more parts; it will age out as forgotten
        if due is None and rng.random() < CONTINUE_CHANCE:
            due = entry
    return due


def record_part(state: dict, entry: dict, part: dict):
    entry["parts"].append(part)
    entry["last_part"] = part.get("date") or entry["last_part"]
    if len(entry["parts"]) >= entry["planned"]:
        _close(state, entry, "finished")


def summarize(state: dict) -> str:
    lines = [f"Open series ({len(state['open'])}):"]
    for e in state["open"]:
        fate = ("will finish" if e["will_write"] >= e["planned"]
                else f"secretly stops at {e['will_write']}")
        lines.append(f"  • {e['angle'][:60]!r} by {e['author']} — "
                     f"part {len(e['parts'])}/{e['planned']} ({fate})")
    if not state["open"]:
        lines.append("  (none)")
    closed = state["closed"][-8:]
    if closed:
        lines.append(f"Recently closed ({len(closed)} of {len(state['closed'])}):")
        for e in closed:
            lines.append(f"  • {e['angle'][:60]!r} — {len(e['parts'])}/{e['planned']} "
                         f"parts, {e['status']}")
    return "\n".join(lines)
