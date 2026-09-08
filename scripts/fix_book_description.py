"""Correct how the book is described across the site.

I had it as a book about family patterns and inheritance. Its own Amazon
listing says something narrower and much more specific: a journal account of a
woman in an abusive marriage, 1981 to 1992, published so a reader might
recognise their own situation. Everywhere it was described wrongly is fixed
here, and the title casing is corrected to "Weight Of Dysfunction".
"""
import io, glob

EDITS = [
    # --- homepage teaser ---
    (
        "src/pages/index.astro",
        [
            (
                '<div class="rule"><h2>Weight of Dysfunction</h2></div>\n        <p class="lede">\n          Katherine\'s book on what families carry, what gets handed down, and\n          how a person puts it down.\n        </p>',
                '<div class="rule"><h2>Weight Of Dysfunction</h2></div>\n        <p class="lede">\n          Katherine\'s book: a woman\'s journal from inside an abusive marriage,\n          kept from 1981 to 1992 and published so someone else might recognise\n          their own situation in it.\n        </p>',
            ),
            (
                '“Her work blends technology, storytelling, and social awareness —\n          resilience, relationships, and personal growth.”',
                '“If reading about her situation helps even one person see their\n          relationship for what it is, I have fulfilled my purpose.”',
            ),
        ],
    ),
    # --- the callout at the foot of book-tagged posts ---
    (
        "src/pages/blog/[slug].astro",
        [
            (
                "<h3>Weight of Dysfunction</h3>\n          <p>\n            Katherine's book on what families carry, what quietly gets handed\n            down, and what it takes to be the one who stops a pattern rather\n            than passing it on.\n          </p>",
                "<h3>Weight Of Dysfunction</h3>\n          <p>\n            Katherine's book is a journal account of a woman in an abusive\n            marriage, kept from 1981 to 1992. She published it so that a reader\n            might recognise their own situation in it.\n          </p>",
            ),
        ],
    ),
    # --- posts that described the book ---
    (
        "src/content/blog/married-digital.md",
        [
            (
                "Katherine's book **Weight of Dysfunction** works through exactly this ground — what a family teaches without saying it, and what it takes to be the person who stops a pattern rather than passing it along. It is [available on Amazon](https://www.amazon.com/Weight-Dysfunction-Katherine-L-Carter/dp/1667889222), and it is the reason this subject sits so close to the centre of the show.",
                "Katherine's **Weight Of Dysfunction** is a journal account of a woman in an abusive marriage, kept over eleven years and published so a reader might recognise their own situation in it. It is [available on Amazon](https://www.amazon.com/Weight-Dysfunction-Katherine-L-Carter/dp/1667889222), and it is why this ground sits so close to the centre of the show.",
            )
        ],
    ),
    (
        "src/content/blog/green-flags.md",
        [
            (
                "That is a learned response, not a preference, and it is worth knowing about yourself. Katherine writes about that inheritance in **Weight of Dysfunction**, [available on Amazon](https://www.amazon.com/Weight-Dysfunction-Katherine-L-Carter/dp/1667889222) — how a family teaches you what to expect, long before you have any say in it.",
                "That is a learned response, not a preference, and it is worth knowing about yourself. Katherine's **Weight Of Dysfunction**, [available on Amazon](https://www.amazon.com/Weight-Dysfunction-Katherine-L-Carter/dp/1667889222), is a journal from inside an abusive marriage — a long, close record of how normal the wrong thing can come to feel.",
            )
        ],
    ),
    (
        "src/content/blog/chemistry.md",
        [
            (
                "If that describes you, it is worth taking seriously rather than fighting. Katherine's **Weight of Dysfunction**, [available on Amazon](https://www.amazon.com/Weight-Dysfunction-Katherine-L-Carter/dp/1667889222), sits on exactly this ground — what you learned to expect before you were old enough to have a say.",
                "If that describes you, it is worth taking seriously rather than fighting. Katherine's **Weight Of Dysfunction**, [available on Amazon](https://www.amazon.com/Weight-Dysfunction-Katherine-L-Carter/dp/1667889222), is a journal kept inside an abusive marriage — an unusually close account of how a person talks themselves into staying.",
            )
        ],
    ),
    (
        "src/content/blog/boundaries.md",
        [
            (
                "That feeling is not a signal that you are doing it wrong. It is what unlearning feels like. Katherine's **Weight of Dysfunction**, [available on Amazon](https://www.amazon.com/Weight-Dysfunction-Katherine-L-Carter/dp/1667889222), covers exactly this ground.",
                "That feeling is not a signal that you are doing it wrong. It is what unlearning feels like. Katherine's **Weight Of Dysfunction**, [available on Amazon](https://www.amazon.com/Weight-Dysfunction-Katherine-L-Carter/dp/1667889222), is a first-hand record of how far that instinct can be pushed.",
            )
        ],
    ),
    (
        "src/content/blog/apology.md",
        [
            (
                "Katherine writes about that inheritance in **Weight of Dysfunction**, [available on Amazon](https://www.amazon.com/Weight-Dysfunction-Katherine-L-Carter/dp/1667889222).",
                "Katherine's **Weight Of Dysfunction**, [available on Amazon](https://www.amazon.com/Weight-Dysfunction-Katherine-L-Carter/dp/1667889222), is a journal from inside a marriage where repair never came.",
            )
        ],
    ),
    (
        "src/content/blog/emotional-affair.md",
        [
            (
                "People who learned early that closeness was conditional, or watched adults keep the peace by never saying the true thing, are unusually prone to this. Katherine writes about that inheritance in **Weight of Dysfunction**, [available on Amazon](https://www.amazon.com/Weight-Dysfunction-Katherine-L-Carter/dp/1667889222).",
                "People who learned early that closeness was conditional, or that peace was kept by never saying the true thing, are unusually prone to this. Katherine's **Weight Of Dysfunction**, [available on Amazon](https://www.amazon.com/Weight-Dysfunction-Katherine-L-Carter/dp/1667889222), is a long first-hand account of what that costs.",
            )
        ],
    ),
    # --- the "family" topic claimed the book as its ground ---
    (
        "src/data/topics.ts",
        [
            (
                '"This is the ground Katherine\'s book covers. What a family teaches without saying, what gets repeated by accident, and what it takes to be the person who stops a pattern rather than passing it on."',
                '"What a family teaches without saying it, what gets repeated by accident, and what it takes to be the person who stops a pattern rather than passing it on."',
            ),
        ],
    ),
    # --- About page: name the book accurately ---
    (
        "src/pages/about.astro",
        [
            (
                'She is the author of <a href="/book">Weight of Dysfunction</a> and the',
                'She is the author of <a href="/book">Weight Of Dysfunction</a> — a\n        journal account of a woman in an abusive marriage — and the',
            ),
            (
                'She is the author of Weight of Dysfunction and the founder of HBK777 Productions.',
                'She is the author of Weight Of Dysfunction and the founder of HBK777 Productions.',
            ),
        ],
    ),
]

total = 0
for path, pairs in EDITS:
    s = io.open(path, encoding="utf-8").read()
    n = 0
    for old, new in pairs:
        if old in s:
            s = s.replace(old, new)
            n += 1
        else:
            print(f"  ! not found in {path}: {old[:60]}...")
    if n:
        io.open(path, "w", encoding="utf-8", newline="\n").write(s)
        print(f"  {path}  ({n})")
        total += n

print(f"\n{total} corrections")
