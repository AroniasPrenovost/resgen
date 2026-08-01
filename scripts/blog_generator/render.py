"""
Renders a structured post `content` dict into the exact TSX that the existing
blog posts use, and writes the page.tsx + updates public/blog_posts.json.

The whole point of this module is that the LLM never produces TSX. It only
returns plain text fields; everything here is templated by Python and every
text node is entity-escaped so the Next.js build (react/no-unescaped-entities)
can never break on a stray apostrophe, quote, angle bracket or curly brace.
"""

from __future__ import annotations

import json
import re
from pathlib import Path


# --------------------------------------------------------------------------
# Escaping
# --------------------------------------------------------------------------

def _smart_double_quotes(s: str) -> str:
    """Turn straight double quotes into curly &ldquo;/&rdquo; entities, toggling."""
    out = []
    opening = True
    for ch in s:
        if ch == '"':
            out.append("&ldquo;" if opening else "&rdquo;")
            opening = not opening
        else:
            out.append(ch)
    return "".join(out)


def jsx_text(s) -> str:
    """Escape a string so it is safe as a JSX *text node*.

    Order matters: ampersand first (so we do not double-escape the entities we
    insert afterwards), then the characters that would otherwise be parsed as
    JSX syntax (< > { }), then typographic niceties, then the two characters the
    react/no-unescaped-entities rule actually rejects (" and ').
    """
    if s is None:
        return ""
    s = str(s)
    s = re.sub(r"\s+", " ", s).strip()
    s = s.replace("&", "&amp;")
    s = s.replace("<", "&lt;").replace(">", "&gt;")
    s = s.replace("{", "&#123;").replace("}", "&#125;")
    s = s.replace("—", "&mdash;").replace("–", "&ndash;")
    s = s.replace("…", "&hellip;")
    s = s.replace("“", "&ldquo;").replace("”", "&rdquo;")
    s = s.replace("‘", "&lsquo;").replace("’", "&rsquo;")
    s = _smart_double_quotes(s)          # remaining straight double quotes
    s = s.replace("'", "&apos;")          # straight apostrophes
    return s


def js_str(s) -> str:
    """Escape a string so it is safe inside a double-quoted TS string literal."""
    if s is None:
        return ""
    s = re.sub(r"\s+", " ", str(s)).strip()
    s = s.replace("\\", "\\\\").replace('"', '\\"')
    return s


def slugify(title: str, maxlen: int = 90) -> str:
    s = title.lower().replace("&", " and ")
    s = re.sub(r"[’'`]", "", s)      # drop apostrophes so words stay joined
    s = re.sub(r"[^a-z0-9]+", "-", s)
    s = re.sub(r"-+", "-", s).strip("-")
    if len(s) > maxlen:
        s = s[:maxlen].rsplit("-", 1)[0]
    return s or "post"


def unique_slug(base: str, posts_dir: Path) -> str:
    slug = base
    n = 2
    while (posts_dir / slug).exists():
        slug = f"{base}-{n}"
        n += 1
    return slug


# --------------------------------------------------------------------------
# Template
# --------------------------------------------------------------------------

TEMPLATE = '''import type { Metadata } from "next";
import { __ICON__, User } from "lucide-react";
import { Heading } from "@/components/heading";
import { JsonLd } from "@/components/json-ld";
import { blogPostSchema } from "@/lib/structured-data";

export const metadata: Metadata = {
  title: "__META_TITLE__",
  description: "__META_DESC__",
  alternates: {
    canonical: "/app/blog/resume-writing-tips-tricks-and-services/post/__SLUG__",
  },
  openGraph: {
    title: "__OG_TITLE__",
    description: "__META_DESC__",
    url: "/app/blog/resume-writing-tips-tricks-and-services/post/__SLUG__",
    type: "article",
    publishedTime: "__PUBDATE__",
  },
};

const BlogDetailPage = async () => {
  return (
    <article className="min-h-screen bg-gray-50">
      <JsonLd
        data={blogPostSchema({
          title: "__META_TITLE__",
          description: "__META_DESC__",
          slug: "__SLUG__",
          datePublished: "__PUBDATE__",
        })}
      />
      <header>
        <Heading
          title={"__HEAD_TITLE__"}
          description={"__HEAD_DESC__"}
          icon={__ICON__}
          iconColor="__ICON_COLOR__"
          bgColor="__BG_COLOR__"
        />
      </header>
      <section className="px-8 lg:px-16 py-0 space-y-6">
__BODY__
      </section>
      <footer className="bg-gray-100 p-6 mt-8">
        <div className="flex items-center space-x-2">
          <div className="relative h-8 w-8 mr-4">
            <User className="w-8 h-8 text-gray-800" />
          </div>
          <div>
            <p className="text-lg font-medium text-gray-800">__AUTHOR_NAME__</p>
            <p className="text-sm text-gray-600 font-small">__AUTHOR_ROLE__</p>
            <p className="text-gray-600 pt-2">
              __AUTHOR_BIO__
            </p>
          </div>
        </div>
      </footer>
    </article>
  );
};

export default BlogDetailPage;
'''

RESUME_GEN_URL = "https://www.resumai.services/app/resume-generator"
I = "        "   # 8-space indent for section children


def _p(text: str) -> str:
    return f'{I}<p className="text-gray-700 custom_html">{jsx_text(text)}</p>'


def _h2(text: str) -> str:
    return f'{I}<h2 className="text-2xl font-bold text-gray-800">{jsx_text(text)}</h2>'


def _bullets(items) -> str:
    lines = [f'{I}<ul className="list-disc pl-5 space-y-2 text-gray-700">']
    for it in items:
        lead = (it.get("lead") or "").strip().rstrip(":").strip() if isinstance(it, dict) else ""
        text = (it.get("text") if isinstance(it, dict) else str(it)) or ""
        if lead:
            lines.append(
                f'{I}  <li className="custom_html"><strong>{jsx_text(lead)}:</strong> {jsx_text(text)}</li>'
            )
        else:
            lines.append(f'{I}  <li className="custom_html">{jsx_text(text)}</li>')
    lines.append(f"{I}</ul>")
    return "\n".join(lines)


def _callout(items) -> str:
    lines = [f'{I}<div className="border-l-4 border-blue-700 pl-4 text-gray-700 space-y-2">']
    for it in items:
        lead = (it.get("lead") or "").strip().rstrip(":").strip() if isinstance(it, dict) else ""
        text = (it.get("text") if isinstance(it, dict) else str(it)) or ""
        if lead:
            lines.append(
                f'{I}  <p className="custom_html"><strong>{jsx_text(lead)}:</strong> {jsx_text(text)}</p>'
            )
        else:
            lines.append(f'{I}  <p className="custom_html">{jsx_text(text)}</p>')
    lines.append(f"{I}</div>")
    return "\n".join(lines)


def _cta(content) -> str:
    lead = content.get("cta") or "Ready to put this into practice?"
    tail = content.get("cta_tail") or "and tailor your next application in minutes."
    return (
        f'{I}<p className="text-gray-700 custom_html">\n'
        f"{I}  {jsx_text(lead)}{{\" \"}}\n"
        f'{I}  <a href="{RESUME_GEN_URL}" className="text-blue-700 hover:underline" '
        f'title="ResumAI - Resume Generator">Resume Generator</a>{{\" \"}}\n'
        f"{I}  {jsx_text(tail)}\n"
        f"{I}</p>"
    )


def _build_body(content) -> str:
    blocks = []
    if content.get("intro"):
        blocks.append(_p(content["intro"]))
    for sec in content.get("sections", []):
        if sec.get("heading"):
            blocks.append(_h2(sec["heading"]))
        for para in sec.get("paragraphs", []) or []:
            if para and para.strip():
                blocks.append(_p(para))
        if sec.get("bullets"):
            blocks.append(_bullets(sec["bullets"]))
        if sec.get("callout"):
            blocks.append(_callout(sec["callout"]))
    blocks.append(_cta(content))
    return "\n\n".join(blocks)


def render_page_tsx(content: dict) -> str:
    body = _build_body(content)
    author = content.get("author", {})
    replacements = {
        "__ICON__": content.get("icon", "ClipboardList"),
        "__META_TITLE__": js_str(content["title"]),
        "__OG_TITLE__": js_str(content["title"] + " | ResumAI Blog"),
        "__META_DESC__": js_str(content["meta_description"]),
        "__SLUG__": content["slug"],
        "__PUBDATE__": content["date"],
        "__HEAD_TITLE__": js_str(content["title"]),
        "__HEAD_DESC__": js_str(content.get("subtitle") or content["meta_description"]),
        "__ICON_COLOR__": content.get("icon_color", "text-blue-700"),
        "__BG_COLOR__": content.get("bg_color", "bg-gray-700/10"),
        "__AUTHOR_NAME__": jsx_text(author.get("name", "The ResumAI Team")),
        "__AUTHOR_ROLE__": jsx_text(author.get("role", "Career Writer")),
        "__AUTHOR_BIO__": jsx_text(author.get("bio", "")),
        "__BODY__": body,
    }
    out = TEMPLATE
    for k, v in replacements.items():
        out = out.replace(k, v)
    return out


# --------------------------------------------------------------------------
# Filesystem side effects
# --------------------------------------------------------------------------

def write_post(content: dict, posts_dir: Path) -> Path:
    post_dir = posts_dir / content["slug"]
    post_dir.mkdir(parents=True, exist_ok=False)
    page = post_dir / "page.tsx"
    page.write_text(render_page_tsx(content), encoding="utf-8")
    return page


def update_blog_json(content: dict, blog_json_path: Path) -> dict:
    data = json.loads(blog_json_path.read_text(encoding="utf-8"))
    entry = {"date": content["date"], "file": content["slug"], "title": content["title"]}
    data.append(entry)
    blog_json_path.write_text(
        json.dumps(data, indent=2, ensure_ascii=False) + "\n", encoding="utf-8"
    )
    return entry
