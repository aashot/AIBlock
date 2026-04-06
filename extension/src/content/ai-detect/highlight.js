const HL_ATTR = "data-aiblock-highlight";
const HL_WORD = "aiblock-hl-word";
const HL_STRUCT = "aiblock-hl-struct";

const SKIP_TAGS = new Set(["BUTTON", "TIME", "IMG", "SVG", "VIDEO", "STYLE", "SCRIPT"]);
const SKIP_CLASSES = [
  "update-components-actor", "feed-shared-actor",
  "social-details-social-counts", "social-details-social-activity",
  "feed-shared-social-actions", "comments-comments-list",
  "artdeco-card__actions", "feed-shared-header",
  "update-components-header", "update-components-mini-update-v2",
  "aiblock-badge-wrapper", "aiblock-signals", "aiblock-badge",
];

function shouldSkip(node) {
  let el = node.nodeType === Node.TEXT_NODE ? node.parentElement : node;
  while (el) {
    if (SKIP_TAGS.has(el.tagName)) return true;
    for (const cls of SKIP_CLASSES) {
      if (el.classList && el.classList.contains(cls)) return true;
    }
    el = el.parentElement;
  }
  return false;
}

const STAT_RE = /^(TTR:|CV:|\d+ |hook|\d+%)/;

function collectVocabWords(signals) {
  const words = [];
  for (const sig of signals) {
    for (const match of sig.matches) {
      if (match.length >= 3 && !STAT_RE.test(match)) {
        words.push(match);
      }
    }
  }
  return [...new Set(words)];
}

function buildRegex(vocabWords) {
  const parts = [];

  for (const w of vocabWords) {
    const escaped = w.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    parts.push(`\\b${escaped}\\b`);
  }

  parts.push("(?:\\p{Emoji_Presentation}|\\p{Emoji}\\uFE0F)");
  parts.push("[→➜➤➔▸►‣↪↩⤴⤵↳↱]");
  parts.push("—");
  parts.push("#\\w+");

  return new RegExp(`(${parts.join("|")})`, "giu");
}

export function highlightPost(post, scoreResult) {
  try {
    if (!scoreResult || !scoreResult.signals || scoreResult.signals.length === 0) return;

    const vocabWords = collectVocabWords(scoreResult.signals);
    const regex = buildRegex(vocabWords);

    // LinkedIn splits hashtags: <span><span>#</span>Word</span>
    const hashSpans = post.querySelectorAll('span > span[aria-hidden="true"]');
    for (const hashMark of hashSpans) {
      if (hashMark.textContent.trim() === "#" && !shouldSkip(hashMark)) {
        const parent = hashMark.parentElement;
        if (parent && !parent.hasAttribute(HL_ATTR)) {
          parent.classList.add(HL_STRUCT);
          parent.setAttribute(HL_ATTR, "true");
        }
      }
    }

    const walker = document.createTreeWalker(post, NodeFilter.SHOW_TEXT);
    const textNodes = [];
    let node;
    while ((node = walker.nextNode())) {
      if (!shouldSkip(node)) textNodes.push(node);
    }

    for (const tn of textNodes) {
      const text = tn.nodeValue;
      if (!text || text.trim().length === 0) continue;
      regex.lastIndex = 0;
      if (!regex.test(text)) continue;
      regex.lastIndex = 0;

      const frag = document.createDocumentFragment();
      let lastIndex = 0;
      let m;
      while ((m = regex.exec(text)) !== null) {
        if (m.index > lastIndex) {
          frag.appendChild(document.createTextNode(text.slice(lastIndex, m.index)));
        }
        const span = document.createElement("span");
        const isVocab = vocabWords.some((w) => m[0].toLowerCase() === w.toLowerCase());
        span.className = isVocab ? HL_WORD : HL_STRUCT;
        span.setAttribute(HL_ATTR, "true");
        span.textContent = m[0];
        frag.appendChild(span);
        lastIndex = regex.lastIndex;
      }
      if (lastIndex < text.length) {
        frag.appendChild(document.createTextNode(text.slice(lastIndex)));
      }
      tn.parentNode.replaceChild(frag, tn);
    }
  } catch (e) {}
}

export function removeAllHighlights() {
  const spans = document.querySelectorAll(`[${HL_ATTR}]`);
  for (const span of spans) {
    if (span.querySelector('span[aria-hidden="true"]')) {
      span.classList.remove(HL_STRUCT, HL_WORD);
      span.removeAttribute(HL_ATTR);
      continue;
    }
    const parent = span.parentNode;
    while (span.firstChild) {
      parent.insertBefore(span.firstChild, span);
    }
    parent.removeChild(span);
    parent.normalize();
  }
}

export function removeHighlights(post) {
  const spans = post.querySelectorAll(`[${HL_ATTR}]`);
  for (const span of spans) {
    if (span.querySelector('span[aria-hidden="true"]')) {
      span.classList.remove(HL_STRUCT, HL_WORD);
      span.removeAttribute(HL_ATTR);
      continue;
    }
    const parent = span.parentNode;
    while (span.firstChild) {
      parent.insertBefore(span.firstChild, span);
    }
    parent.removeChild(span);
    parent.normalize();
  }
}
