"""
Recent-news discovery via Google News RSS. Stdlib only, so there is no extra
API key or web-search dependency to keep alive. Returns a fresh, de-duplicated
headline that does not overlap with topics we have already written about.
"""

from __future__ import annotations

import random
import re
import urllib.parse
import urllib.request
import xml.etree.ElementTree as ET
from datetime import datetime, timezone
from email.utils import parsedate_to_datetime

USER_AGENT = (
    "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 "
    "(KHTML, like Gecko) Chrome/124.0 Safari/537.36"
)

# Query rotation — career / job-market / workplace angles. Each becomes a
# Google News RSS search so results are inherently recent and dated.
QUERIES = [
    "job market OR hiring OR layoffs",
    "career advice OR job search",
    "workplace OR employees OR return to office",
    "recruiting OR applicant tracking OR resume",
    "AI jobs OR automation workforce",
    "remote work OR hybrid work OR gig economy",
    "graduate jobs OR entry level hiring",
    "salary OR compensation OR job offers",
]

_STOP = set(
    """the a an and or of to in for on at by with from as is are was were be been being this that these those
    you your we our it its they their he she his her not no yes how why what when who will would can could should
    new now more most other into over under about after before amid says say said report reports new latest""".split()
)


def _keywords(text: str) -> set[str]:
    toks = re.findall(r"[a-z0-9]+", (text or "").lower())
    return {t for t in toks if len(t) > 3 and t not in _STOP}


def _clean_title(title: str) -> str:
    # Google News appends " - Publisher"; drop the trailing source for readability.
    return re.sub(r"\s+-\s+[^-]+$", "", title or "").strip() or (title or "").strip()


def _fetch(url: str, timeout: int = 20) -> bytes | None:
    try:
        req = urllib.request.Request(url, headers={"User-Agent": USER_AGENT})
        with urllib.request.urlopen(req, timeout=timeout) as resp:
            return resp.read()
    except Exception:
        return None


def _parse(xml_bytes: bytes) -> list[dict]:
    items = []
    try:
        root = ET.fromstring(xml_bytes)
    except ET.ParseError:
        return items
    for item in root.iter("item"):
        title = _clean_title((item.findtext("title") or ""))
        link = (item.findtext("link") or "").strip()
        pub_raw = item.findtext("pubDate") or ""
        source_el = item.find("source")
        source = (source_el.text if source_el is not None else "") or ""
        published = None
        try:
            published = parsedate_to_datetime(pub_raw)
            if published and published.tzinfo is None:
                published = published.replace(tzinfo=timezone.utc)
        except (TypeError, ValueError):
            published = None
        if title and link:
            items.append(
                {"title": title, "url": link, "source": source, "published": published}
            )
    return items


def gather(max_age_days: int = 30, per_query: int = 8) -> list[dict]:
    now = datetime.now(timezone.utc)
    seen_titles: set[str] = set()
    out: list[dict] = []
    for q in QUERIES:
        url = (
            "https://news.google.com/rss/search?q="
            + urllib.parse.quote(q)
            + "&hl=en-US&gl=US&ceid=US:en"
        )
        raw = _fetch(url)
        if not raw:
            continue
        count = 0
        for it in _parse(raw):
            if it["published"] is not None:
                age = (now - it["published"]).days
                if age < 0 or age > max_age_days:
                    continue
            key = it["title"].lower()
            if key in seen_titles:
                continue
            seen_titles.add(key)
            it["keywords"] = _keywords(it["title"])
            out.append(it)
            count += 1
            if count >= per_query:
                break
    out.sort(key=lambda x: x["published"] or now, reverse=True)
    return out


def select_novel(covered_keyword_sets: list[set[str]], max_age_days: int = 30) -> dict | None:
    """Pick a recent headline whose keywords do not substantially overlap with
    anything we have already covered. Randomised among the freshest viable
    candidates so successive runs do not march down the list in lockstep."""
    candidates = gather(max_age_days=max_age_days)
    if not candidates:
        return None

    viable = []
    for c in candidates:
        kw = c.get("keywords") or set()
        if not kw:
            continue
        overlap = 0.0
        for covered in covered_keyword_sets:
            if not covered:
                continue
            shared = len(kw & covered)
            ratio = shared / max(1, min(len(kw), len(covered)))
            overlap = max(overlap, ratio)
        if overlap < 0.5:  # not clearly the same story we already wrote
            viable.append(c)

    pool = viable or candidates
    top = pool[: min(12, len(pool))]  # freshest dozen
    return random.choice(top)
