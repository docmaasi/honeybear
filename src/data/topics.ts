// The relationship subjects the Haven works through.
//
// TO TAG AN EPISODE with a topic, add its `slug` to that episode's `topics`
// array in episodes.ts. An episode can carry more than one.
//
// Topics with no tagged episodes still show here — they describe what the show
// covers. Nothing on this page claims an episode exists that does not.

export type Topic = {
  slug: string;
  name: string;
  /** One line, used on cards and in search results. */
  blurb: string;
  /** Two or three sentences. What this subject actually means on the show. */
  body: string;
  /** Real questions the show sits with. These are what people search for. */
  questions: string[];
  image: string;
};

export const topics: Topic[] = [
  {
    slug: "intimacy-attraction",
    name: "Intimacy and attraction",
    blurb: "What draws people together, and what keeps them there once it does.",
    body:
      "Attraction is the easy part and it is rarely the part that decides anything. The Haven spends more time on what comes after: being known, staying interested, and the difference between wanting someone and being able to live alongside them.",
    questions: [
      "What actually sustains attraction over years, not months?",
      "How do you stay close to someone without losing yourself?",
      "Is chemistry something you find, or something you build?",
    ],
    image: "/art/topics/intimacy.jpg",
  },
  {
    slug: "friendship",
    name: "Friendship",
    blurb: "The relationships nobody signs a contract for, and everybody needs.",
    body:
      "Friendship gets treated as the relationship that takes care of itself. It does not. The show looks at how adult friendships are made, why they quietly end, and what it takes to be the kind of person others keep close.",
    questions: [
      "How do you make real friends as an adult?",
      "What do you do when a long friendship has run out?",
      "Why do some people always seem to have somebody to call?",
    ],
    image: "/art/topics/friendship.jpg",
  },
  {
    slug: "family",
    name: "Family and what we inherit",
    blurb:
      "The patterns handed down before anyone thought to ask whether they should be.",
    body:
      "This is the ground Katherine's book covers, and it comes up on the show constantly. What a family teaches without saying, what gets repeated by accident, and what it takes to be the person who stops a pattern rather than passing it on.",
    questions: [
      "How do you stop repeating what you grew up with?",
      "What do you owe family that hurt you?",
      "Can a relationship with a parent be rebuilt later in life?",
    ],
    image: "/art/topics/family.jpg",
  },
  {
    slug: "conflict-repair",
    name: "Conflict and repair",
    blurb: "Every relationship breaks. The question is whether it mends.",
    body:
      "Arguments are not the problem; unrepaired arguments are. The Haven treats repair as a skill that can be learned — how to apologise so it lands, how to be apologised to, and how to tell a rough patch from a real ending.",
    questions: [
      "How do you apologise in a way that actually repairs something?",
      "What is the difference between a rough patch and the end?",
      "How do you argue without doing damage?",
    ],
    image: "/art/topics/conflict.jpg",
  },
  {
    slug: "healing-self-worth",
    name: "Healing and self-worth",
    blurb: "The relationship underneath all the others.",
    body:
      "Most of what people bring to the show turns out to be about what they believe they deserve. Resilience, confidence, and the slow work of rebuilding a sense of your own worth after something has taken it apart.",
    questions: [
      "How do you rebuild confidence after a relationship damages it?",
      "Why do people accept less than they know they deserve?",
      "What does healing actually look like day to day?",
    ],
    image: "/art/topics/healing.jpg",
  },
  {
    slug: "safety-respect",
    name: "Safety and respect",
    blurb: "Where a hard relationship ends and an unsafe one begins.",
    body:
      "Some patterns are not difficulties to work through. Recognising control, coercion, and the signs that a relationship has stopped being safe — and knowing that help for it already exists and is free.",
    questions: [
      "What are the early signs of a controlling relationship?",
      "Is it abuse if they have never hit me?",
      "Where can I get help without anyone finding out?",
    ],
    image: "/art/topics/safety.jpg",
  },
];

export function topicBySlug(slug: string) {
  return topics.find((t) => t.slug === slug);
}
