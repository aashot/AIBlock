import { HIDDEN_ATTR, BLURRED_ATTR } from "./styles.js";
import { findPostElements, getPostText, isWhitelisted } from "./selectors.js";

let processedPosts = new WeakSet();
let revealedPosts = new WeakSet();
let stats = { scanned: 0, hidden: 0 };
let saveStatsTimer = null;

function saveStats() {
  if (saveStatsTimer) return;
  saveStatsTimer = setTimeout(() => {
    saveStatsTimer = null;
    chrome.storage.local.set({ stats });
  }, 1000);
}

export function buildRegex(keywords, wholeWord) {
  if (!keywords || keywords.length === 0) return null;
  const escaped = keywords.map((kw) =>
    kw.toLowerCase().replace(/[.*+?^${}()|[\]\\]/g, "\\$&")
  );
  escaped.sort((a, b) => b.length - a.length);
  const pattern = wholeWord
    ? escaped.map((kw) => `\\b${kw}\\b`).join("|")
    : escaped.join("|");
  return new RegExp(pattern, "i");
}

function findMatchedKeywords(text, keywordRegex) {
  if (!keywordRegex) return [];
  const globalRegex = new RegExp(keywordRegex.source, "gi");
  const matches = [...text.matchAll(globalRegex)].map((m) => m[0]);
  return [...new Set(matches.map((m) => m.toLowerCase()))];
}

function applyFilter(post, hideMode, matchedKeywords) {
  if (hideMode === "blur") {
    post.removeAttribute(HIDDEN_ATTR);
    post.setAttribute(BLURRED_ATTR, "true");
    if (!post.querySelector(".feed-filter-blur-overlay")) {
      const overlay = document.createElement("div");
      overlay.className = "feed-filter-blur-overlay";

      const title = document.createElement("div");
      title.className = "feed-filter-blur-title";
      title.textContent = "Post hidden by AIBlock";
      overlay.appendChild(title);

      if (matchedKeywords && matchedKeywords.length > 0) {
        const kw = document.createElement("div");
        kw.className = "feed-filter-blur-keywords";
        kw.textContent =
          "Matched keywords: " +
          matchedKeywords.map((k) => `\u201c${k}\u201d`).join(", ");
        overlay.appendChild(kw);
      }

      const hint = document.createElement("div");
      hint.className = "feed-filter-blur-hint";
      hint.textContent = "Click to reveal";
      overlay.appendChild(hint);

      overlay.addEventListener("click", () => {
        post.removeAttribute(BLURRED_ATTR);
        overlay.remove();
        revealedPosts.add(post);
      });
      post.style.position = "relative";
      post.appendChild(overlay);
    }
  } else {
    post.setAttribute(HIDDEN_ATTR, "true");
    post.removeAttribute(BLURRED_ATTR);
  }
}

function clearFilter(post) {
  post.removeAttribute(HIDDEN_ATTR);
  post.removeAttribute(BLURRED_ATTR);
  post.style.position = "";
  const overlay = post.querySelector(".feed-filter-blur-overlay");
  if (overlay) overlay.remove();
}

function processPost(post, state) {
  if (!state.filterEnabled || !state.keywordRegex) return;
  if (processedPosts.has(post)) return;

  processedPosts.add(post);
  stats.scanned++;

  if (revealedPosts.has(post)) return;
  if (isWhitelisted(post, state.whitelist)) return;
  const text = getPostText(post);
  const matchedKeywords = findMatchedKeywords(text, state.keywordRegex);
  if (matchedKeywords.length > 0) {
    applyFilter(post, state.hideMode, matchedKeywords);
    stats.hidden++;
  }
}

export function scanAllPosts(state) {
  if (!state.filterEnabled || !state.keywordRegex) return;

  const posts = findPostElements();
  let i = 0;

  function processBatch(deadline) {
    while (i < posts.length && deadline.timeRemaining() > 2) {
      processPost(posts[i], state);
      i++;
    }

    if (i < posts.length) {
      requestIdleCallback(processBatch, { timeout: 500 });
    } else {
      saveStats();
    }
  }

  requestIdleCallback(processBatch, { timeout: 1000 });
}

export function fullRescan(state) {
  processedPosts = new WeakSet();
  revealedPosts = new WeakSet();
  stats = { scanned: 0, hidden: 0 };

  const posts = findPostElements();
  let i = 0;

  function processBatch(deadline) {
    while (i < posts.length && deadline.timeRemaining() > 2) {
      const post = posts[i];
      stats.scanned++;
      const text = getPostText(post);
      const matchedKeywords = state.keywordRegex
        ? findMatchedKeywords(text, state.keywordRegex)
        : [];
      if (!state.keywordRegex || isWhitelisted(post, state.whitelist) || matchedKeywords.length === 0) {
        clearFilter(post);
      } else {
        applyFilter(post, state.hideMode, matchedKeywords);
        stats.hidden++;
      }
      processedPosts.add(post);
      i++;
    }

    if (i < posts.length) {
      requestIdleCallback(processBatch, { timeout: 500 });
    } else {
      saveStats();
    }
  }

  requestIdleCallback(processBatch, { timeout: 1000 });
}

export function restoreAll() {
  const hidden = document.querySelectorAll(`[${HIDDEN_ATTR}], [${BLURRED_ATTR}]`);
  for (const el of hidden) {
    clearFilter(el);
  }
  processedPosts = new WeakSet();
  revealedPosts = new WeakSet();
  stats = { scanned: 0, hidden: 0 };
  saveStats();
}
