function wordRegex(word) {
  return new RegExp(`\\b${word}\\b`, "gi");
}

function phraseRegex(phrase) {
  return new RegExp(phrase.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), "gi");
}

export const VOCABULARY_SIGNALS = [
  ...[
    "delve", "tapestry", "multifaceted", "nuanced", "underscores",
    "pivotal", "paramount", "meticulous", "intricate", "commendable",
    "noteworthy", "indispensable", "invaluable", "unwavering", "discerning",
    "quintessential", "meticulously", "spearheading", "groundbreaking",
    "unparalleled", "intricacies", "interplay",
  ].map((w) => ({ regex: wordRegex(w), weight: 3, label: w })),

  ...[
    "navigate", "leverage", "foster", "comprehensive", "furthermore",
    "moreover", "unlock", "empower", "seamless", "robust",
    "transformative", "harness", "realm", "landscape", "embark",
    "testament", "revolutionize", "endeavor", "utilize", "facilitate",
    "arguably", "streamline", "elevate", "bolster", "underscore",
    "encompass", "synergy", "curate", "cultivate",
    "spearhead", "cornerstone", "catalyst", "resonate",
    "reimagine", "demystify", "juxtaposition", "aforementioned",
    "necessitate", "overarching", "holistic", "actionable",
    "bespoke", "tailor-made",
  ].map((w) => ({ regex: wordRegex(w), weight: 2, label: w })),

  ...[
    "significantly", "notably",
    "increasingly", "substantially",
    "remarkable", "exceptional", "profound",
    "thriving", "vibrant", "compelling", "insightful",
    "impactful", "authentic",
  ].map((w) => ({ regex: wordRegex(w), weight: 1, label: w })),

  ...[
    "it's worth noting that",
    "it's important to note that",
    "it goes without saying",
    "in today's rapidly evolving",
    "in today's fast-paced",
    "in today's digital landscape",
    "in today's landscape",
    "in an era where",
    "in an increasingly",
    "let's dive in",
    "let's break it down",
    "let's unpack this",
    "but here's the thing",
    "but here's the kicker",
    "here's the bottom line",
    "and that's a good thing",
    "and here's why",
    "it's not just about",
    "this is where it gets interesting",
    "this isn't just about",
    "the question isn't whether",
    "the question is not if but when",
    "are you ready to",
    "ready to take your",
    "what if I told you",
    "spoiler alert:",
    "plot twist:",
    "hot take:",
    "unpopular opinion:",
    "I'll say it louder for the people in the back",
    "let that satisfying feeling sink in",
    "the future belongs to those who",
    "the truth no one talks about",
  ].map((p) => ({ regex: phraseRegex(p), weight: 4, label: p })),

  ...[
    "game-changer",
    "here's why",
    "here's how",
    "here's what",
    "let me explain",
    "let that sink in",
    "couldn't agree more",
    "deep dive",
    "dive deep",
    "key takeaway",
    "the bottom line",
    "food for thought",
    "at the end of the day",
    "a win-win",
    "the real question is",
    "the harsh reality",
    "hard truth",
    "wake-up call",
    "not talked about enough",
    "here's my take",
    "buckle up",
    "strap in",
    "mind-blowing",
    "think about it",
    "read that again",
    "say it louder",
    "this is huge",
    "pro tip",
    "if you're not already",
    "you're not alone",
    "stop doing this",
    "most people don't realize",
    "the secret is",
    "the reality is",
    "I was today years old",
    "it changed my life",
    "and it's not even close",
    "this is the way",
    "do yourself a favor",
    "trust me on this",
    "mark my words",
  ].map((p) => ({ regex: phraseRegex(p), weight: 3, label: p })),

  ...[
    "in this article",
    "as we navigate",
    "moving forward",
    "going forward",
    "at scale",
    "from the ground up",
    "end of the day",
    "when it comes to",
    "on the other hand",
    "having said that",
    "with that being said",
    "needless to say",
    "to put it simply",
    "in other words",
    "to be clear",
    "bottom line",
    "long story short",
    "that said",
    "full stop",
    "period",
  ].map((p) => ({ regex: phraseRegex(p), weight: 2, label: p })),
];

const EMOJI_BULLET_RE = /^\s*(?:\p{Emoji_Presentation}|\p{Emoji}\uFE0F)\s/gmu;
const ARROW_BULLET_RE = /^\s*[→➜➤➔▸►‣•·‑–↪↩⤴⤵↳↱]\s/gm;
const EM_DASH_RE = /—/g;
const FORMULAIC_RE = /\b(here'?s (why|how|what|the thing)|(\d+) (things?|ways?|reasons?|steps?|tips?|lessons?|mistakes?|habits?|signs?|truths?|flags?|rules?|principles?|keys?|pillars?|secrets?) (you|that|to|every|I|for|of|no one)|let me (explain|share|break|tell)|stop (doing|making|saying)|most people (don't|never|won't|fail)|why (most|nobody|no one|you should|you need|this matters|it matters))\b/gi;
const NUMBERED_LIST_RE = /(?:^|\n)\s*\d+[\.\)]\s+/g;
const HASHTAG_RE = /#(\w+)/g;
const GENERIC_HASHTAGS = new Set([
  "leadership", "innovation", "growth", "success", "motivation",
  "productivity", "entrepreneurship", "networking", "mindset", "inspiration",
  "career", "hiring", "strategy", "marketing", "technology",
  "branding", "coaching", "mentorship", "teamwork", "excellence",
  "resilience", "sustainability", "wellness", "diversity", "inclusion",
  "empowerment", "transformation", "disruption", "agile", "culture",
  "personalgrowth", "personalbranding", "digitaltransformation",
  "futureofwork", "thoughtleadership", "professionaldevelopment",
  "worklifebalance", "lifelessons", "leadershipdevelopment",
  "careeradvice", "careergrowth", "jobsearch",
  "mondaymotivation", "tuesdaythoughts", "wednesdaywisdom",
  "thursdaythoughts", "fridayfeeling",
  "contentcreation", "socialmedia", "contentmarketing",
]);

export const STRUCTURAL_SIGNALS = [
  {
    label: "em-dash density",
    weight: 8,
    test(text) {
      const words = text.split(/\s+/).length;
      const dashes = (text.match(EM_DASH_RE) || []).length;
      const per100 = (dashes / words) * 100;
      if (per100 > 2) {
        return { score: this.weight, matches: [`${dashes} em-dashes`] };
      }
      return { score: 0, matches: [] };
    },
  },
  {
    label: "emoji/arrow bullet lists",
    weight: 12,
    test(text) {
      const emojiHits = text.match(EMOJI_BULLET_RE) || [];
      const arrowHits = text.match(ARROW_BULLET_RE) || [];
      const total = emojiHits.length + arrowHits.length;
      if (total >= 3) {
        return { score: Math.min(this.weight, 6 + total * 2), matches: [`${total} bullet points`] };
      }
      return { score: 0, matches: [] };
    },
  },
  {
    label: "formulaic patterns",
    weight: 6,
    test(text) {
      const hits = text.match(FORMULAIC_RE) || [];
      if (hits.length > 0) {
        return {
          score: Math.min(this.weight, hits.length * 3),
          matches: hits.map((h) => h.trim()),
        };
      }
      return { score: 0, matches: [] };
    },
  },
  {
    label: "numbered list uniformity",
    weight: 5,
    test(text) {
      const items = text.split(NUMBERED_LIST_RE).filter(Boolean);
      if (items.length < 3) return { score: 0, matches: [] };
      const lengths = items.map((s) => s.trim().split(/\s+/).length);
      const mean = lengths.reduce((a, b) => a + b, 0) / lengths.length;
      if (mean === 0) return { score: 0, matches: [] };
      const variance =
        lengths.reduce((sum, l) => sum + (l - mean) ** 2, 0) / lengths.length;
      const cv = Math.sqrt(variance) / mean;
      if (cv < 0.3) {
        return { score: this.weight, matches: [`${items.length} uniform items`] };
      }
      return { score: 0, matches: [] };
    },
  },
  {
    label: "generic hashtag stuffing",
    weight: 6,
    test(text) {
      const generic = [];
      let m;
      const re = new RegExp(HASHTAG_RE.source, HASHTAG_RE.flags);
      while ((m = re.exec(text)) !== null) {
        if (GENERIC_HASHTAGS.has(m[1].toLowerCase())) generic.push(m[0]);
      }
      if (generic.length >= 3) {
        return { score: this.weight, matches: [`${generic.length} generic hashtags`] };
      }
      return { score: 0, matches: [] };
    },
  },
  {
    label: "line-per-sentence formatting",
    weight: 5,
    test(text) {
      const lines = text.split(/\n/).filter((l) => l.trim().length > 0);
      if (lines.length < 8) return { score: 0, matches: [] };
      let singleSentenceLines = 0;
      for (const line of lines) {
        const trimmed = line.trim();
        const periods = (trimmed.match(/\.\s/g) || []).length;
        if (periods === 0) singleSentenceLines++;
      }
      const ratio = singleSentenceLines / lines.length;
      if (ratio > 0.8) {
        return { score: this.weight, matches: [`${Math.round(ratio * 100)}% single-sentence lines`] };
      }
      return { score: 0, matches: [] };
    },
  },
  {
    label: "hook-body-CTA structure",
    weight: 6,
    test(text) {
      const parts = text.split(/\n\s*\n/).filter((p) => p.trim().length > 0);
      if (parts.length < 3) return { score: 0, matches: [] };
      const firstWords = parts[0].trim().split(/\s+/).length;
      const lastPart = parts[parts.length - 1].trim().toLowerCase();
      const hasCTA =
        /\b(follow|like|comment|share|repost|agree\??|thoughts\??|drop|tag|dm me|link in|what do you think)\b/i.test(lastPart);
      if (firstWords <= 15 && hasCTA) {
        return { score: this.weight, matches: ["hook + CTA structure"] };
      }
      return { score: 0, matches: [] };
    },
  },
];

export const STYLISTIC = {
  MIN_WORDS: 30,
  TTR_THRESHOLD: 0.45,
  SENTENCE_CV_THRESHOLD: 0.15,
  HEDGING_PHRASES: [
    "it's important to note",
    "it's worth mentioning",
    "it should be noted",
    "needless to say",
    "as we all know",
    "in my humble opinion",
    "to be honest",
    "the reality is",
    "the truth is",
    "at its core",
    "make no mistake",
    "let's be real",
    "let's be honest",
    "I'll be the first to admit",
    "whether you like it or not",
    "believe it or not",
    "here's what most people miss",
    "here's what nobody tells you",
    "contrary to popular belief",
    "the uncomfortable truth is",
  ].map((p) => phraseRegex(p)),
};
