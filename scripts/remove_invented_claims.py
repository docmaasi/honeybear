"""Strip claims about the show that no source supports.

Everything replaced here was written by me, not sourced from Katherine's site,
her YouTube channel, or anything Doc supplied. Assertions about how often a
subject comes up, or about relationships that started in her room, are exactly
the kind of thing a reader would take as fact.

What survives is what can be sourced: the show exists, it is live, it runs in
Meta Horizon Worlds and Clubroom, and the audience participates (her own About
page says so).
"""
import io, glob, os

REPLACEMENTS = [
    # --- outcome claims about her audience: entirely invented ---
    (
        "and a fair number of friendships and a few relationships have started "
        "there simply because the same people kept turning up to the same thing.",
        "and it works the way any regular gathering does: the same people turn "
        "up, and over time they know each other.",
    ),
    (
        "and a fair number of friendships and a few relationships have started "
        "in that room simply because people kept showing up to the same thing.",
        "and it works the way any regular gathering does, by people showing up "
        "to the same thing.",
    ),
    # --- frequency claims: I have no episode-level data ---
    (
        "We talk about this most weeks on **HoneyBear Katherine's Haven**, live "
        "in Meta Horizon Worlds and Clubroom. Bring your questions — the room "
        "answers back.",
        "**HoneyBear Katherine's Haven** is live in Meta Horizon Worlds and "
        "Clubroom, and the audience joins the conversation. Bring your questions.",
    ),
    (
        "Katherine works through this every week on **HoneyBear Katherine's "
        "Haven** in Meta Horizon Worlds and Clubroom, with an audience who have "
        "lived it.",
        "**HoneyBear Katherine's Haven** is live in Meta Horizon Worlds and "
        "Clubroom, with an audience that joins in.",
    ),
    (
        "**HoneyBear Katherine's Haven** runs live in Meta Horizon Worlds and "
        "Clubroom, and this subject comes up almost every week.",
        "**HoneyBear Katherine's Haven** is live in Meta Horizon Worlds and "
        "Clubroom, and the audience talks throughout.",
    ),
    (
        "Katherine and the room work through this often on **HoneyBear "
        "Katherine's Haven**, live in Meta Horizon Worlds and Clubroom.",
        "**HoneyBear Katherine's Haven** is live weekly in Meta Horizon Worlds "
        "and Clubroom.",
    ),
    (
        "Katherine takes this question regularly on **HoneyBear Katherine's "
        "Haven**, live in Meta Horizon Worlds and Clubroom.",
        "**HoneyBear Katherine's Haven** is live weekly in Meta Horizon Worlds "
        "and Clubroom.",
    ),
    (
        "**HoneyBear Katherine's Haven** runs live weekly in Meta Horizon Worlds "
        "and Clubroom, and this question comes up more than any other.",
        "**HoneyBear Katherine's Haven** is live weekly in Meta Horizon Worlds "
        "and Clubroom.",
    ),
    (
        "**HoneyBear Katherine's Haven** runs live weekly in Meta Horizon Worlds "
        "and Clubroom, and this is the sentence that comes up more than any other.",
        "**HoneyBear Katherine's Haven** is live weekly in Meta Horizon Worlds "
        "and Clubroom.",
    ),
    (
        "The show takes this one live most weeks in Meta Horizon Worlds and "
        "Clubroom.",
        "**HoneyBear Katherine's Haven** is live weekly in Meta Horizon Worlds "
        "and Clubroom.",
    ),
    (
        "**HoneyBear Katherine's Haven** runs live in Meta Horizon Worlds and "
        "Clubroom, and this is a room where a lot of people have been exactly here.",
        "**HoneyBear Katherine's Haven** is live in Meta Horizon Worlds and "
        "Clubroom, with an audience that joins the conversation.",
    ),
    (
        "Katherine and the room work through this most weeks on **HoneyBear "
        "Katherine's Haven**, live in Meta Horizon Worlds and Clubroom.",
        "**HoneyBear Katherine's Haven** is live weekly in Meta Horizon Worlds "
        "and Clubroom.",
    ),
    (
        "**HoneyBear Katherine's Haven** runs live in Meta Horizon Worlds and "
        "Clubroom, and this conversation happens with more compassion than "
        "people expect.",
        "**HoneyBear Katherine's Haven** is live in Meta Horizon Worlds and "
        "Clubroom.",
    ),
    (
        "This is the most common question the show gets, and it is usually asked "
        "hoping for one of two answers.",
        "It is a question people arrive at hoping for one of two answers.",
    ),
    (
        "This arrives on the show constantly, usually phrased carefully.",
        "It is usually phrased carefully.",
    ),
    (
        "Two situations come up constantly on the show.",
        "Two situations complicate it.",
    ),
    (
        "and it comes up on the\n        show constantly.",
        "and it runs through the show.",
    ),
    # --- topics page: same problem, softer wording ---
    (
        "These are the subjects it keeps coming back to — and the questions\n"
        "        people actually arrive with.",
        "These are the subjects it covers, and the kinds of questions they raise.",
    ),
    (
        "These are the subjects the Haven keeps returning to.",
        "These are the subjects it covers.",
    ),
    (
        "Most of what people bring to the show turns out to be about what they "
        "believe they deserve.",
        "A great deal of this comes back to what a person believes they deserve.",
    ),
    (
        "This is the ground Katherine's book covers, and it comes up on the show "
        "constantly.",
        "This is the ground Katherine's book covers.",
    ),
    (
        "The Haven spends more time on what comes after",
        "The more useful ground is what comes after",
    ),
]

changed = 0
files = glob.glob("src/content/blog/*.md") + glob.glob("src/pages/*.astro") + glob.glob("src/data/*.ts")
for p in files:
    s = io.open(p, encoding="utf-8").read()
    orig = s
    for old, new in REPLACEMENTS:
        s = s.replace(old, new)
    if s != orig:
        io.open(p, "w", encoding="utf-8", newline="\n").write(s)
        print(f"  {p}")
        changed += 1

print(f"\ncleaned {changed} files")
