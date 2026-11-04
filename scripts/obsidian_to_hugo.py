#!/usr/bin/env python3
"""Build the two trial pages from unchanged Obsidian inputs (stdlib only).

Obsidian aliases are note names, not public redirect paths: remove only aliases
from generated frontmatter. The verbatim input is always retained in obsidian/.
"""
from pathlib import Path
import re
import shutil

ROOT = Path(__file__).resolve().parents[1]
PAGES = {
    "hosting-trial-test-post": "posts/hosting-trial-test-post.md",
    "books": "books.md",
}
EMBED = re.compile(r"!\[\[([^\]|]+)(?:\|[^\]]+)?\]\]")
LINK = re.compile(r"\[\[([^\]|]+)(?:\|([^\]]+))?\]\]")


def convert(source):
    _, front, body = source.split("---", 2)
    front = re.sub(r"(?m)^aliases:[^\n]*\n(?:[ \t]+[^\n]*\n)*", "", front)

    def embed(match):
        name = Path(match[1]).name
        if Path(name).suffix.lower() == ".mp4":
            return '{{< video ' + '"' + name + '"' + ' >}}'
        return f"![{Path(name).stem}](/attachments/{name})"

    def link(match):
        target, label = match[1], match[2] or match[1]
        return '[' + label + ']({{< ref "' + PAGES[target] + '" >}})'

    # Preserve fenced code samples verbatim, including any wiki-like text.
    fenced = False
    lines = []
    for line in body.splitlines(keepends=True):
        if line.lstrip().startswith("```"):
            fenced = not fenced
            lines.append(line)
        elif fenced:
            lines.append(line)
        else:
            lines.append(LINK.sub(link, EMBED.sub(embed, line)))
    return "---" + front + "---" + "".join(lines)


for note, output in PAGES.items():
    destination = ROOT / "content" / output
    destination.parent.mkdir(parents=True, exist_ok=True)
    destination.write_text(convert((ROOT / "obsidian" / f"{note}.md").read_text()))
shutil.copytree(ROOT / "obsidian/attachments", ROOT / "static/attachments", dirs_exist_ok=True)
