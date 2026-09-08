"""Restore spaces that Astro drops at a line break next to an inline tag.

    ...she is
    <strong>not a therapist</strong>

renders as "she isnot a therapist". The fix is an explicit {" "} at the end of
the text line. Only markup is touched: frontmatter, <style> and <script> are
left alone.
"""
import io, os, re, sys

INLINE = r"(?:a|strong|em|code|span|abbr)"

# A text line ending in a word character or sentence punctuation, followed by
# a line that opens an inline tag.
BEFORE = re.compile(
    r"(?m)([A-Za-z0-9,.;:!?\)’”—-])[ \t]*\n([ \t]*)(<" + INLINE + r"\b)"
)
# An inline tag closing at end of line, followed by a line starting with a word.
AFTER = re.compile(
    r"(?m)(</" + INLINE + r">)[ \t]*\n([ \t]*)([A-Za-z0-9‘“])"
)


def protect(src):
    """Split out frontmatter, style and script so they are never edited."""
    parts, last = [], 0
    spans = []
    if src.startswith("---"):
        end = src.find("\n---", 3)
        if end != -1:
            spans.append((0, end + 4))
    for m in re.finditer(r"<(style|script)\b.*?</\1>", src, re.S):
        spans.append(m.span())
    spans.sort()
    for a, b in spans:
        if a < last:
            continue
        parts.append(("edit", src[last:a]))
        parts.append(("keep", src[a:b]))
        last = b
    parts.append(("edit", src[last:]))
    return parts


def fix(src):
    out, n = [], 0
    for kind, chunk in protect(src):
        if kind == "keep":
            out.append(chunk)
            continue
        chunk, a = BEFORE.subn(r'\1{" "}\n\2\3', chunk)
        chunk, b = AFTER.subn(r'\1{" "}\n\2\3', chunk)
        n += a + b
        out.append(chunk)
    return "".join(out), n


total, touched = 0, 0
for root, _dirs, files in os.walk("src"):
    for f in files:
        if not f.endswith(".astro"):
            continue
        p = os.path.join(root, f)
        src = io.open(p, encoding="utf-8").read()
        fixed, n = fix(src)
        if n:
            io.open(p, "w", encoding="utf-8", newline="\n").write(fixed)
            print(f"{n:4d}  {p}")
            total += n
            touched += 1

print(f"\ninserted {total} spaces across {touched} files")
