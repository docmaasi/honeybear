// A directory of places that actually help, grouped by what someone needs.
//
// Rule for this file: every entry is a real, established organisation or an
// open-source project that exists today. Nothing aspirational, nothing
// affiliate, nothing that pays to be here.

export type Resource = {
  name: string;
  href: string;
  note: string;
  /** Shown in bold — a phone number or shortcode people can act on now. */
  tel?: string;
};

export type ResourceGroup = {
  key: string;
  title: string;
  blurb: string;
  urgent?: boolean;
  items: Resource[];
};

export const resourceGroups: ResourceGroup[] = [
  {
    key: "help-now",
    title: "If you need help now",
    blurb: "Free, confidential, staffed around the clock.",
    urgent: true,
    items: [
      {
        name: "National Domestic Violence Hotline",
        tel: "1-800-799-7233",
        href: "https://www.thehotline.org",
        note: "Text START to 88788. Interpreters for over 200 languages. TTY 1-800-787-3224.",
      },
      {
        name: "988 Suicide and Crisis Lifeline",
        tel: "988",
        href: "https://988lifeline.org",
        note: "Call or text, for any mental health crisis.",
      },
      {
        name: "Crisis Text Line",
        tel: "Text HOME to 741741",
        href: "https://www.crisistextline.org",
        note: "When a call is not safe or not possible.",
      },
      {
        name: "RAINN National Sexual Assault Hotline",
        tel: "1-800-656-4673",
        href: "https://www.rainn.org",
        note: "Support after assault and connection to local services.",
      },
      {
        name: "StrongHearts Native Helpline",
        tel: "1-844-762-8483",
        href: "https://strongheartshelpline.org",
        note: "For Native American and Alaska Native communities.",
      },
      {
        name: "loveisrespect",
        tel: "1-866-331-9474",
        href: "https://www.loveisrespect.org",
        note: "Dating abuse support for teens and young adults. Text LOVEIS to 22522.",
      },
      {
        name: "The Trevor Project",
        tel: "1-866-488-7386",
        href: "https://www.thetrevorproject.org",
        note: "Crisis support for LGBTQ young people. Text START to 678-678.",
      },
      {
        name: "Trans Lifeline",
        tel: "1-877-565-8860",
        href: "https://translifeline.org",
        note: "Peer support run by and for trans people.",
      },
    ],
  },
  {
    key: "legal",
    title: "Legal and practical",
    blurb: "Knowing where you stand, and what to do next.",
    items: [
      {
        name: "WomensLaw",
        href: "https://www.womenslaw.org",
        note: "Plain-language legal information on protective orders, custody and divorce, state by state.",
      },
      {
        name: "National Center for Victims of Crime",
        href: "https://victimsofcrime.org",
        note: "Victim rights, compensation, and finding local services.",
      },
      {
        name: "Cyber Civil Rights Initiative",
        href: "https://cybercivilrights.org",
        note: "Help if intimate images have been shared without your consent. Crisis line 1-844-878-2274.",
      },
      {
        name: "StopNCII.org",
        href: "https://stopncii.org",
        note: "Free tool that blocks intimate images from being shared on participating platforms, without uploading the image itself.",
      },
      {
        name: "Take It Down",
        href: "https://takeitdown.ncmec.org",
        note: "For images taken when you were under 18. Run by NCMEC, free.",
      },
    ],
  },
  {
    key: "digital-safety",
    title: "Digital safety",
    blurb:
      "Open, free tools for locking down a phone or an account. All of these are genuinely free and most are open source.",
    items: [
      {
        name: "Signal",
        href: "https://signal.org",
        note: "Open-source encrypted messaging with disappearing messages. Run by a non-profit.",
      },
      {
        name: "Bitwarden",
        href: "https://bitwarden.com",
        note: "Open-source password manager. Free tier is genuinely usable, and lets you change every password from one safe place.",
      },
      {
        name: "Tor Browser",
        href: "https://www.torproject.org",
        note: "Free and open source. Browsing that does not appear in ordinary history or to a network watcher.",
      },
      {
        name: "Have I Been Pwned",
        href: "https://haveibeenpwned.com",
        note: "Check whether your accounts appear in known data breaches. Free.",
      },
      {
        name: "Safety Net — tech safety",
        href: "https://www.techsafety.org",
        note: "From the National Network to End Domestic Violence. Practical guides on stalkerware, location sharing and evidence.",
      },
      {
        name: "Consumer Reports Security Planner",
        href: "https://securityplanner.consumerreports.org",
        note: "A free step-by-step plan for your specific situation.",
      },
      {
        name: "Coalition Against Stalkerware",
        href: "https://stopstalkerware.org",
        note: "How to detect and remove monitoring software from a phone.",
      },
    ],
  },
  {
    key: "virtual-worlds",
    title: "The digital world",
    blurb: "Where the show happens, and how to stay safe in virtual space.",
    items: [
      {
        name: "Meta Horizon Worlds",
        href: "https://www.meta.com/horizon-worlds/",
        note: "One of the two platforms the Haven broadcasts from.",
      },
      {
        name: "Clubroom",
        href: "https://www.clubroom.app",
        note: "Voice-led rooms. The other place the show is live each week.",
      },
      {
        name: "Meta safety and blocking tools",
        href: "https://www.meta.com/help/quest/",
        note: "Blocking, muting, personal boundary and reporting controls.",
      },
      {
        name: "Mozilla Hubs community forks",
        href: "https://github.com/Hubs-Foundation",
        note: "Open-source virtual spaces you can host yourself. For anyone who wants a room nobody else owns.",
      },
      {
        name: "Connect Safely",
        href: "https://connectsafely.org",
        note: "Straightforward guides to online safety, including VR and social platforms.",
      },
    ],
  },
  {
    key: "counselling",
    title: "Counselling and support",
    blurb: "Finding someone qualified, including at low cost.",
    items: [
      {
        name: "Open Path Collective",
        href: "https://openpathcollective.org",
        note: "Therapy at a reduced flat rate for people without adequate insurance.",
      },
      {
        name: "Psychology Today directory",
        href: "https://www.psychologytoday.com/us/therapists",
        note: "Filter by specialism, insurance and sliding scale.",
      },
      {
        name: "SAMHSA National Helpline",
        tel: "1-800-662-4357",
        href: "https://www.samhsa.gov/find-help/national-helpline",
        note: "Free, confidential referrals for substance use and mental health, 24 hours.",
      },
      {
        name: "Al-Anon Family Groups",
        href: "https://al-anon.org",
        note: "For people affected by someone else's drinking.",
      },
      {
        name: "Adult Children of Alcoholics",
        href: "https://adultchildren.org",
        note: "For patterns carried out of a difficult childhood.",
      },
    ],
  },
];

/** Every organisation on the page, for structured data. */
export const allResources = resourceGroups.flatMap((g) => g.items);
