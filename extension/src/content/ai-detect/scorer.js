import {
  VOCABULARY_SIGNALS,
  STRUCTURAL_SIGNALS,
  STYLISTIC,
} from "./signals.js";

export function scorePost(text) {
  const empty = { score: 0, signals: [] };
  if (!text) return empty;

  const words = text.split(/\s+/).filter(Boolean);
  if (words.length < STYLISTIC.MIN_WORDS) return empty;

  const lower = text.toLowerCase();
  const signals = [];
  let rawTotal = 0;

  let vocabMatchCount = 0;
  let vocabRawPts = 0;
  const vocabSignals = [];

  for (const sig of VOCABULARY_SIGNALS) {
    sig.regex.lastIndex = 0;
    const positions = [];
    let m;
    while ((m = sig.regex.exec(text)) !== null) {
      positions.push({ start: m.index, end: m.index + m[0].length });
    }
    if (positions.length > 0) {
      vocabMatchCount += positions.length;
      vocabRawPts += sig.weight * positions.length;
      vocabSignals.push({
        label: sig.label,
        weight: sig.weight,
        matches: positions.map((p) => text.slice(p.start, p.end)),
        positions,
      });
    }
  }

  let vocabMultiplier = 0;
  if (vocabMatchCount >= 5) vocabMultiplier = 1.5;
  else if (vocabMatchCount >= 3) vocabMultiplier = 1.0;
  else if (vocabMatchCount === 2) vocabMultiplier = 0.5;
  else if (vocabMatchCount === 1) vocabMultiplier = 0.15;

  const vocabScore = Math.round(vocabRawPts * vocabMultiplier);
  rawTotal += vocabScore;

  for (const sig of vocabSignals) {
    signals.push({
      ...sig,
      weight: Math.round(sig.weight * vocabMultiplier),
    });
  }

  for (const sig of STRUCTURAL_SIGNALS) {
    const result = sig.test(text);
    if (result.score > 0) {
      rawTotal += result.score;
      signals.push({
        label: sig.label,
        weight: result.score,
        matches: result.matches,
        positions: [],
      });
    }
  }

  const lowerWords = words.map((w) => w.toLowerCase().replace(/[^a-z']/g, "")).filter(Boolean);
  if (lowerWords.length > 0) {
    const unique = new Set(lowerWords);
    const ttr = unique.size / lowerWords.length;
    if (ttr < STYLISTIC.TTR_THRESHOLD) {
      const pts = ((STYLISTIC.TTR_THRESHOLD - ttr) / STYLISTIC.TTR_THRESHOLD) * 15;
      rawTotal += pts;
      signals.push({
        label: "low vocabulary diversity",
        weight: Math.round(pts),
        matches: [`TTR: ${ttr.toFixed(2)}`],
        positions: [],
      });
    }
  }

  const sentences = text
    .split(/[.!?]+\s+/)
    .map((s) => s.trim())
    .filter((s) => s.length > 0);
  if (sentences.length >= 3) {
    const lens = sentences.map((s) => s.split(/\s+/).length);
    const mean = lens.reduce((a, b) => a + b, 0) / lens.length;
    if (mean > 0) {
      const variance = lens.reduce((sum, l) => sum + (l - mean) ** 2, 0) / lens.length;
      const cv = Math.sqrt(variance) / mean;
      if (cv < STYLISTIC.SENTENCE_CV_THRESHOLD) {
        const pts =
          ((STYLISTIC.SENTENCE_CV_THRESHOLD - cv) / STYLISTIC.SENTENCE_CV_THRESHOLD) * 10;
        rawTotal += pts;
        signals.push({
          label: "uniform sentence lengths",
          weight: Math.round(pts),
          matches: [`CV: ${cv.toFixed(2)}`],
          positions: [],
        });
      }
    }
  }

  let hedgeCount = 0;
  for (const re of STYLISTIC.HEDGING_PHRASES) {
    re.lastIndex = 0;
    const hits = lower.match(re);
    if (hits) hedgeCount += hits.length;
  }
  const hedgePer100 = (hedgeCount / words.length) * 100;
  if (hedgePer100 > 1.5) {
    const pts = Math.min(10, (hedgePer100 / 3) * 10);
    rawTotal += pts;
    signals.push({
      label: "excessive hedging",
      weight: Math.round(pts),
      matches: [`${hedgeCount} hedging phrases`],
      positions: [],
    });
  }

  const score = Math.round(Math.min(100, rawTotal * 3.5));

  return { score, signals };
}
