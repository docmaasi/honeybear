"""Replace every hardcoded colour in components with a token.

The old palette assumed a dark ground everywhere. The new one puts pearl on
the ground and spends purple as an accent, so each hardcoded value is mapped
to the token that carries its ROLE — a divider becomes --rule, a card border
becomes --rule, an overlay becomes the matching band token — rather than to
the nearest visual match.
"""
import io, os, re

# old value -> token that carries the same role on the new ground
MAP = {
    # dark grounds
    "#17101f": "var(--night)",
    "#0b0710": "var(--night)",
    "#100a16": "var(--paper-sunk)",     # was the "sunk" band, now a light band
    "#221929": "var(--paper-raised)",   # was the raised card, now white
    "#1e1926": "var(--paper-raised)",
    # lines and borders
    "#2f2438": "var(--rule)",
    "#2b2136": "var(--rule)",
    "#241b2d": "var(--rule)",
    "#35293f": "var(--rule)",
    "#3c2f47": "var(--rule-strong)",
    "#4a3a58": "var(--rule-strong)",
    "#33244180": "var(--rule)",
    # text
    "#ded7cd": "var(--ink-2)",
    "#d6cfc6": "var(--ink-2)",
    "#f4efe6": "var(--ink)",
    "#b3a99f": "var(--muted)",
    "#837a86": "var(--muted)",
    # accents that were gold on dark
    "#ebc87e": "var(--gold)",
    "#c08b37": "var(--gold-line)",
    "#c08b3733": "var(--accent-soft)",
    "#c08b3759": "var(--accent-line)",
    "#f6dda3": "var(--accent-deep)",
    "#2a1c0a": "#ffffff",               # text on the primary button, now purple
    # plum
    "#3d2456": "var(--accent)",
    "#3d245640": "var(--accent-soft)",
    "#4c1d6b": "var(--accent)",
    # urgent / live
    "#e4574f": "var(--live)",
    "#e4574f14": "var(--live-soft)",
    "#e4574f1f": "var(--live-soft)",
    "#e4574f4d": "var(--live-line)",
    "#7d1f1a": "var(--live)",
    "#a02a24": "var(--live)",
    "#f2a49e": "var(--live)",
    "#f6d8d5": "#ffffff",
    "#ffe9e7": "var(--live-soft)",
    "#7d1f1a1f": "var(--live-soft)",
    "#7d1f1a80": "var(--live-line)",
    # overlays
    "#17101fe8": "var(--night)",
    "#17101fe6": "var(--night)",
    "#17101fd9": "#221a2bb3",
    "#0b0710b8": "#221a2b80",
    "#17101f00": "transparent",
    "#17101fef": "var(--night)",
    "#17101fdd": "var(--night)",
    "#17101fb0": "var(--night)",
}

# Longest first so #17101fe8 is not eaten by #17101f
KEYS = sorted(MAP, key=len, reverse=True)
PATTERN = re.compile("|".join(re.escape(k) for k in KEYS), re.IGNORECASE)

SKIP = {"src/styles/global.css"}

total = 0
for root, _dirs, files in os.walk("src"):
    for f in files:
        if not f.endswith((".astro", ".css")):
            continue
        p = os.path.join(root, f).replace("\\", "/")
        if p in SKIP:
            continue
        s = io.open(p, encoding="utf-8").read()
        new, n = PATTERN.subn(lambda m: MAP[m.group(0).lower()], s)
        if n:
            io.open(p, "w", encoding="utf-8", newline="\n").write(new)
            print(f"{n:4d}  {p}")
            total += n

print(f"\n{total} colour references moved to tokens")

# Report anything still hardcoded so nothing hides.
left = {}
for root, _dirs, files in os.walk("src"):
    for f in files:
        if not f.endswith((".astro", ".css")):
            continue
        p = os.path.join(root, f).replace("\\", "/")
        if p in SKIP:
            continue
        for m in re.findall(r"#[0-9a-fA-F]{3,8}\b", io.open(p, encoding="utf-8").read()):
            left[m] = left.get(m, 0) + 1
if left:
    print("\nstill hardcoded (check each):")
    for k, v in sorted(left.items(), key=lambda x: -x[1]):
        print(f"  {v:3d}  {k}")
