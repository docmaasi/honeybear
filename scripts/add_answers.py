"""Add a direct answer to each post's frontmatter.

This is the single highest-value thing for answer engines: a 45-60 word reply
to the exact question the post targets, sitting at the top of the page where
it can be extracted whole. It also gives a reader in a hurry what they came for.
"""
import io, os, re

OUT = "src/content/blog"

ANSWERS = {
"meta-boo": "A meta boo is a romantic partner you know entirely through a virtual world. The attachment is genuine, because bonds form through attention, repetition and disclosure rather than touch, and virtual worlds supply all three intensely. What is missing is not the feeling but the evidence: you have not yet seen the person in ordinary life.",

"love-untouched": "Yes. Love forms through sustained attention, repeated contact, mutual disclosure and the sense of being chosen, none of which require physical presence. Virtual relationships often supply those faster than in-person ones. What they lack is physical regulation, ordinary daily life, and the friction that tests whether two people actually work together.",

"avatar-problem": "You cannot know from the avatar, so watch for concealment rather than curation. Curation is looking your best. Concealment is hard limits on when and where you can talk, vagueness that never resolves, details that quietly change, and questions about their real life being deflected back onto your feelings.",

"long-distance": "It helps enormously and creates a new risk. Virtual reality gives long-distance couples shared space, comfortable silence and ordinary time together, which is what long distance always lacked. But it also removes the pain that used to force couples to close the distance, so years can pass without anyone deciding anything.",

"meeting-horizon": "People meet in rooms built around an activity rather than around dating: community events, games, listening rooms and live shows in platforms like Meta Horizon Worlds and Clubroom. Because voice and personality arrive before appearance, different people get chosen and compatibility surfaces earlier than it does in conventional dating.",

"clubroom-voice": "Removing video removes the work of being looked at, so attention goes into listening instead. Voice still carries hesitation, warmth and the pause before a hard sentence, and partial anonymity lowers the stakes enough that people disclose more. The risk is mistaking fast disclosure for actually knowing someone.",

"parallel-life": "Not necessarily. A partner with their own world is often healthier, not threatening. It becomes a problem when the second world starts taking from the first: secrecy rather than privacy, a steady drain on sleep, money or attention, one specific person appearing, and you being treated as the problem for asking.",

"avatar-cheating": "The avatar is not the test. Three questions decide it: was it secret, was intimacy redirected away from your partner, and did it break an agreement you had. If the answer to all three is yes, it functions as an affair regardless of whether anyone was physically present.",

"micro-cheating": "Micro-cheating is a pattern of small behaviours that each redirect a little intimacy elsewhere: messages timed to avoid notice, deleted conversations that were not incriminating, bringing your best self to one person and your tired self home. No single one ends a relationship. Thirty over six months quietly defunds it.",

"married-digital": "It functions as a second relationship. It is real enough to hide, to think about during the day, and to hurt to lose. The absence of a body does not make it nothing, and the common belief that it protects the marriage usually means it has removed the pressure that would have forced a real conversation.",

"not-physical": "Because it answers a question nobody asked. The hurt partner is asking whether you chose someone else and hid it, not whether bodies were involved. For many people a months-long emotional affair is the worse betrayal, because it was deliberate and repeated rather than a single lapse of judgement.",

"emotional-affair": "The signs are a friendship that becomes the first place your news goes, editing it out of the account of your day, comparing your partner unfavourably to someone you only see at their best, and feeling indignant when your partner raises it. Emotional affairs are not additions to a relationship; they are transfers out of it.",

"after-you-find-out": "Do not decide anything. Tell one discreet person, eat and sleep, write down what you know, and postpone everything permanent. Ask for one thing only: complete honesty from here, with no further discoveries. The first week is for staying upright, not for choosing whether the relationship survives.",

"app-burnout": "Burnout is a reasonable response to a system built around two-second decisions and unlimited choice. What works better is repeated exposure through activity: a class, a team, a regular room, a weekly show. Anywhere the same people gather more than once lets you see each other unperformed, which is how anyone assesses anyone accurately.",

"first-six-weeks": "Watch the unglamorous things: how they treat people who can do nothing for them, whether they ask follow-up questions, what happens when something small goes wrong, how they describe their exes, and whether their enthusiasm matches their calendar. Chemistry, shared taste and good texting predict almost nothing.",

"green-flags": "Good signs include repairing quickly after conflict, being the same person in every room, being able to be wrong about small things, having a full life of their own, noticing details about you, saying what they want directly, and being kind when nobody is watching. The absence of red flags is not the same as their presence.",

"chemistry": "Chemistry tells you something is happening but not what. Instant intensity often comes from familiarity rather than compatibility, so people with difficult histories frequently feel the strongest pull toward those who go on to hurt them. Warmth that stays stable across weeks predicts far more than a spark on night one.",

"dating-again": "You are not starting over, you are starting from here, knowing things you did not know at twenty-five. Expect grief to surface at inconvenient moments even if you wanted the marriage to end. Go slowly, say what you want plainly, keep your own life, and treat the first few attempts as practice.",

"apology": "Name the specific thing you did, name the impact in their words rather than yours, offer no explanation unless it is asked for, say what will concretely change, and give up control of when it is resolved. Most apologies fail because they defend halfway through or arrive with a deadline attached.",

"rough-patch": "Arguing often, a lull in sex, and not feeling in love this month tell you little. Contempt, lost curiosity, repair having stopped entirely, consistent relief at their absence, and no longer imagining them in your future are the signals that matter. A rough patch still contains someone reaching back.",

"boundaries": "An ultimatum tries to control the other person. A boundary states what you will do, which is the only thing you actually control. Say the specific behaviour, say your response, and add nothing else. A boundary you announce but never enforce is worse than none, because it teaches people your limits are decorative.",

"long-love": "Long relationships run on small habits rather than passion: answering each other's minor bids for attention, repairing quickly after conflict, treating the problem as something you face together, letting each other change, keeping some separateness, and continuing the behaviour during the flat stretches when the feeling is temporarily absent.",

"digital-abuse": "Digital abuse is coercive control exercised through devices and accounts: monitoring location and messages, demanding passwords, controlling who you may contact, punishing you with silence or message floods, threatening to expose private images, and denying things you both know were said. Fear, not physical injury, is the test.",

"control-signs": "Early control looks like love. It moves very fast, tells you that you are uniquely understood, gradually makes your friends and family into problems, frames jealousy as devotion, introduces small rules, and leaves you managing your words to avoid a reaction. Ask whether your life has got smaller since it began.",

"leaving-safely": "Call an advocate before you act, because leaving is the period of highest risk. Secure documents and money somewhere they cannot reach, assume your phone may be monitored and plan from a device they cannot access, tell one trusted person, agree a code word, and pack a bag stored outside the house.",
}

changed = 0
for slug, ans in ANSWERS.items():
    path = f"{OUT}/{slug}.md"
    s = io.open(path, encoding="utf-8").read()
    if "quickAnswer:" in s:
        continue
    esc = ans.replace('"', "'")
    s = s.replace('book: ', f'quickAnswer: "{esc}"\nbook: ', 1)
    io.open(path, "w", encoding="utf-8", newline="\n").write(s)
    changed += 1

print(f"added a direct answer to {changed} posts")

# Report final word counts including the answer block, which renders on the page.
total = 0
short = []
for f in sorted(os.listdir(OUT)):
    if not f.endswith(".md"):
        continue
    s = io.open(f"{OUT}/{f}", encoding="utf-8").read()
    fm, body = s.split("---", 2)[1], s.split("---", 2)[2]
    ans = re.search(r'quickAnswer: "(.*?)"\n', fm, re.S)
    words = len(body.split()) + (len(ans.group(1).split()) if ans else 0)
    total += words
    if words < 550:
        short.append((f, words))
print(f"{len(os.listdir(OUT))} posts, {total} words total, average {total // 25}")
if short:
    print("still under 550:")
    for f, w in short:
        print(f"  {w}  {f}")
