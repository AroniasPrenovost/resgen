"""
Ready-to-paste social captions for each new blog post.

No API keys, no auto-posting — every time the generator writes a post, this
drops a single markdown file into social_drafts/<slug>.md with a caption
tailored for LinkedIn, X, Facebook, and Discord (each with the live URL and
hashtags). You open the file and paste each one wherever you want. Auto-posting
can be layered on later without changing anything here.
"""

from __future__ import annotations

import json
import re
import urllib.request
from pathlib import Path

# The live site. Blog post URLs follow the canonical path used in every page.tsx.
SITE = "https://www.resumai.services"
BLOG_PATH = "/app/blog/resume-writing-tips-tricks-and-services/post"

# Always-on tags; a couple more are pulled from the post title.
BASE_TAGS = ["resume", "resumetips", "jobsearch", "careertips", "hiring"]
_TAG_STOP = {
    "your", "with", "that", "this", "from", "into", "when", "what", "why",
    "how", "the", "and", "for", "you", "are", "job", "jobs", "resume",
}


def post_url(slug: str) -> str:
    return f"{SITE}{BLOG_PATH}/{slug}"


def _clip(text: str, limit: int) -> str:
    text = re.sub(r"\s+", " ", (text or "")).strip()
    if len(text) <= limit:
        return text
    return text[: limit - 1].rstrip(" ,.;:-") + "…"


def _hashtags(content: dict, limit: int = 5) -> list[str]:
    tags = list(BASE_TAGS)
    for word in re.findall(r"[a-z]+", (content.get("title") or "").lower()):
        if len(word) > 3 and word not in _TAG_STOP and word not in tags:
            tags.append(word)
    return tags[:limit]


def _section_teaser(content: dict, n: int = 3) -> list[str]:
    heads = [s.get("heading", "").strip() for s in content.get("sections", [])]
    return [h for h in heads if h][:n]


def build_drafts(content: dict) -> dict:
    """Return {platform: caption_text} for one post."""
    title = content.get("title", "").strip()
    hook = (content.get("subtitle") or content.get("meta_description") or title).strip()
    url = post_url(content["slug"])
    tags = _hashtags(content)
    tag_line = " ".join(f"#{t}" for t in tags)
    teaser = _section_teaser(content)

    # LinkedIn — a hook, a short "what's inside" teaser, the link, then tags.
    li_lines = [hook, ""]
    if teaser:
        li_lines.append("Inside:")
        li_lines += [f"• {t}" for t in teaser]
        li_lines.append("")
    li_lines += [f"Read it here → {url}", "", tag_line]
    linkedin = "\n".join(li_lines).strip()

    # X — one tight line, then link + two tags, kept under 280 chars.
    x_tags = "#resume #jobsearch"
    budget = 280 - len(url) - len(x_tags) - 4  # spaces/newlines
    x = f"{_clip(hook, max(40, budget))}\n\n{url} {x_tags}"

    # Facebook — friendlier, medium length, link, tags.
    facebook = f"{hook}\n\nQuick, practical resume tips you can use today → {url}\n\n{tag_line}"

    # Discord — casual community post. Can be auto-sent via webhook (below).
    discord = f"📄 **New post: {title}**\n\n{hook}\n\nRead it → {url}"

    return {
        "LinkedIn": linkedin,
        "X (Twitter)": x,
        "Facebook": facebook,
        "Discord": discord,
    }


def format_drafts_block(content: dict, drafts: dict) -> str:
    """One terminal-friendly block with every caption, ready to copy-paste."""
    title = content.get("title", "").strip()
    url = post_url(content["slug"])
    lines = ["", "=" * 70, f"  SOCIAL CAPTIONS  —  {title}", f"  {url}", "=" * 70]
    for platform, text in drafts.items():
        lines += ["", f"--- {platform} " + "-" * max(0, 66 - len(platform)), "", text]
    lines += ["", "=" * 70, ""]
    return "\n".join(lines)


def post_to_discord(message: str, webhook_url: str, timeout: int = 15) -> None:
    """POST a message to a Discord channel webhook. Raises on HTTP error.

    Discord webhooks need no OAuth or app approval — just the URL Discord gives
    you under Channel → Integrations → Webhooks. Content is capped at 2000 chars.
    """
    data = json.dumps({"content": message[:1990]}).encode("utf-8")
    req = urllib.request.Request(
        webhook_url,
        data=data,
        headers={"Content-Type": "application/json", "User-Agent": "resumai-bloggen/1.0"},
    )
    with urllib.request.urlopen(req, timeout=timeout) as resp:
        resp.read()


def write_drafts(content: dict, out_dir: Path) -> tuple[Path, dict]:
    """Write social_drafts/<slug>.md; return (path, drafts dict)."""
    drafts = build_drafts(content)
    out_dir.mkdir(parents=True, exist_ok=True)
    lines = [
        f"# Social drafts — {content.get('title', '').strip()}",
        "",
        f"Post URL: {post_url(content['slug'])}",
        f"By: {content.get('author', {}).get('name', '')}",
        "",
        "Copy any block below and paste it into the platform. Nothing is posted "
        "automatically.",
        "",
    ]
    for platform, text in drafts.items():
        lines += [f"## {platform}", "", "```", text, "```", ""]
    path = out_dir / f"{content['slug']}.md"
    path.write_text("\n".join(lines), encoding="utf-8")
    return path, drafts
