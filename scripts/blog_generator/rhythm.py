#!/usr/bin/env python3
"""Human publishing rhythm for the post loop.

The old loop fired every N hours around the clock, which stamps the blog with a
machine's signature: perfectly even gaps, posts at 2am, the same pace on Sunday
as on Tuesday. Real editorial calendars are lumpy — heavier on weekday
mornings, light on weekends, quiet overnight, some days skipped entirely, the
occasional two-post day.

This module samples the next publish time from that shape instead of a fixed
interval. Posts still publish at the moment they generate, so every date on the
site (page, blog_posts.json, sitemap, git history) remains the genuine publish
time — the rhythm changes when the work happens, never what the page claims.

Defaults average about three posts a week. Scale with --posts-per-week.
"""

from __future__ import annotations

import random
from datetime import datetime, timedelta, timezone
from zoneinfo import ZoneInfo

# Publish in the site owner's local timezone by default — the natural clock for
# a small in-house editorial team. Override with --tz / BLOGGEN_TZ (IANA name).
DEFAULT_TZ = "local"

# Relative likelihood a given weekday gets a post (Mon..Sun). Weekday-heavy,
# Friday tapering, weekends mostly quiet. Sums to 5.0 and is scaled by
# --posts-per-week (so the default of 3 multiplies these by 0.6).
WEEKDAY_WEIGHT = [1.0, 0.95, 0.95, 0.9, 0.7, 0.2, 0.3]
_BASE_WEEK = sum(WEEKDAY_WEIGHT)

# Relative likelihood of each local publish hour. Morning peak, a smaller
# after-lunch shelf, a thin evening tail, nothing overnight. Minutes and
# seconds are sampled uniformly so times never land on the hour.
HOUR_WEIGHT = {
    6: 0.5, 7: 2, 8: 6, 9: 10, 10: 9, 11: 7, 12: 4,
    13: 6, 14: 7, 15: 5, 16: 4, 17: 2.5, 18: 1.5,
    19: 1, 20: 0.7, 21: 0.4,
}

# Chance (before --posts-per-week scaling) that a day which already got a post
# gets a second one later the same day.
SECOND_POST_PROB = 0.12

# Never publish twice within this many hours, even across restarts.
MIN_GAP_HOURS = 3.5


def resolve_tz(name: str | None):
    if not name or name == "local":
        return datetime.now().astimezone().tzinfo
    return ZoneInfo(name)


def _sample_time_of_day(day, tz, not_before: datetime | None = None) -> datetime | None:
    """A weighted clock time on `day`, or None if the day's window is spent."""
    hours = list(HOUR_WEIGHT.items())
    if not_before is not None:
        hours = [(h, w) for h, w in hours if h > not_before.hour]
        if not hours:
            return None
    hs, ws = zip(*hours)
    h = random.choices(hs, weights=ws)[0]
    return datetime(day.year, day.month, day.day, h,
                    random.randint(0, 59), random.randint(0, 59), tzinfo=tz)


def next_publish_time(now_utc: datetime, tz_name: str = DEFAULT_TZ,
                      posts_per_week: float = 3.0,
                      last_post_utc: datetime | None = None) -> datetime:
    """Sample the next publish moment (returned in UTC).

    Walks forward day by day; each day publishes with a weekday-weighted
    probability, then draws an hour-weighted clock time. Skipped days and
    two-post days fall out of the sampling naturally, which is exactly the
    lumpiness a fixed interval can't produce."""
    tz = resolve_tz(tz_name)
    scale = posts_per_week / _BASE_WEEK
    earliest = now_utc + timedelta(minutes=15)
    if last_post_utc is not None:
        earliest = max(earliest, last_post_utc + timedelta(hours=MIN_GAP_HOURS))
    local_earliest = earliest.astimezone(tz)

    for i in range(120):
        day = local_earliest.date() + timedelta(days=i)
        p = min(0.97, WEEKDAY_WEIGHT[day.weekday()] * scale)
        if last_post_utc is not None and last_post_utc.astimezone(tz).date() == day:
            p = min(0.3, SECOND_POST_PROB * scale)
        if random.random() > p:
            continue
        slot = _sample_time_of_day(day, tz, not_before=local_earliest if i == 0 else None)
        if slot is None:
            continue
        return slot.astimezone(timezone.utc)

    # Statistically unreachable at any sane weight config; keeps the loop alive
    # if the knobs are ever edited into a corner.
    fallback = datetime.combine(local_earliest.date() + timedelta(days=1),
                                datetime.min.time(), tz)
    return fallback.replace(hour=9, minute=random.randint(5, 55)).astimezone(timezone.utc)


def plausible_hour(dt_utc: datetime, tz_name: str = DEFAULT_TZ) -> bool:
    """True if this moment falls in an hour the rhythm could have produced.
    Used to vet wake times persisted by older versions of the scheduler, and to
    decide whether an overdue catch-up post may fire immediately."""
    return dt_utc.astimezone(resolve_tz(tz_name)).hour in HOUR_WEIGHT


def describe(dt_utc: datetime, tz_name: str = DEFAULT_TZ) -> str:
    local = dt_utc.astimezone(resolve_tz(tz_name))
    return f"{local.strftime('%a %b %d %H:%M %Z')} ({dt_utc.strftime('%H:%M')} UTC)"
