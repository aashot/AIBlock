"use strict";

console.log("[Feed Filter] Content script loaded");

const HIDDEN_ATTR = "data-feed-filter-hidden";

let filterEnabled = false;
let keywordRegex = null;
let processedPosts = new WeakSet();

let stats = { scanned: 0, hidden: 0 };

function saveStats() {
  chrome.storage.local.set({ stats });
}

function buildRegex(keywords) {
  if (!keywords || keywords.length === 0) return null;
  const escaped = keywords.map((kw) =>
    kw.toLowerCase().replace(/[.*+?^${}()|[\]\\]/g, "\\$&")
  );
  escaped.sort((a, b) => b.length - a.length);

  return new RegExp(escaped.join("|"), "i");
}

function findPostElements() {
  const posts = document.querySelectorAll(
    '[componentkey*="MAIN_FEED_RELEVANCE"]'
  );
  if (posts.length > 0) return posts;

  const fallback = document.querySelectorAll(
    'div[data-urn^="urn:li:activity"], div[data-urn^="urn:li:ugcPost"], div.feed-shared-update-v2'
  );
  return fallback;
}

function processPost(post) {
  if (!filterEnabled || !keywordRegex) return;
  if (processedPosts.has(post)) return;

  processedPosts.add(post);
  stats.scanned++;

  if (keywordRegex.test(post.textContent)) {
    post.style.display = "none";
    post.setAttribute(HIDDEN_ATTR, "true");
    stats.hidden++;
  }
}

function scanAllPosts() {
  if (!filterEnabled || !keywordRegex) return;

  const posts = findPostElements();
  let i = 0;

  function processBatch(deadline) {
    while (i < posts.length && deadline.timeRemaining() > 2) {
      processPost(posts[i]);
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

function fullRescan() {
  processedPosts = new WeakSet();
  stats = { scanned: 0, hidden: 0 };

  const posts = findPostElements();
  for (const post of posts) {
    stats.scanned++;
    if (!keywordRegex || !keywordRegex.test(post.textContent)) {
      if (post.getAttribute(HIDDEN_ATTR) === "true") {
        post.style.display = "";
        post.removeAttribute(HIDDEN_ATTR);
      }
    } else {
      post.style.display = "none";
      post.setAttribute(HIDDEN_ATTR, "true");
      stats.hidden++;
    }
    processedPosts.add(post);
  }
  saveStats();
}

function restoreAll() {
  const hidden = document.querySelectorAll(`[${HIDDEN_ATTR}]`);
  for (const el of hidden) {
    el.style.display = "";
    el.removeAttribute(HIDDEN_ATTR);
  }
  processedPosts = new WeakSet();
  stats = { scanned: 0, hidden: 0 };
  saveStats();
}

let debounceTimer = null;
let observer = null;

function startObserver() {
  if (observer) return;

  observer = new MutationObserver((mutations) => {
    let hasNewNodes = false;
    for (const m of mutations) {
      if (m.addedNodes.length > 0) {
        hasNewNodes = true;
        break;
      }
    }
    if (!hasNewNodes) return;

    clearTimeout(debounceTimer);
    debounceTimer = setTimeout(scanAllPosts, 200);
  });

  observer.observe(document.body, { childList: true, subtree: true });
}

function stopObserver() {
  if (observer) {
    observer.disconnect();
    observer = null;
  }
  clearTimeout(debounceTimer);
}

function loadSettingsAndScan() {
  chrome.storage.sync.get(
    { keywords: null, enabled: false, seeded: false },
    (result) => {
      let kw = result.keywords;

      if (kw === null || !result.seeded) {
        kw = DEFAULT_KEYWORDS;
        chrome.storage.sync.set({ keywords: kw, seeded: true });
      }

      keywordRegex = buildRegex(kw);
      filterEnabled = result.enabled;

      console.log(
        `[Feed Filter] Loaded: enabled=${filterEnabled}, keywords=${kw.length}`
      );

      if (filterEnabled) {
        scanAllPosts();
        startObserver();
      } else {
        restoreAll();
        stopObserver();
      }
    }
  );
}

chrome.storage.onChanged.addListener((changes) => {
  if (changes.keywords) {
    keywordRegex = buildRegex(changes.keywords.newValue || []);
  }
  if (changes.enabled) {
    filterEnabled = changes.enabled.newValue;
  }

  if (filterEnabled) {
    fullRescan();
    startObserver();
  } else {
    restoreAll();
    stopObserver();
  }
});

loadSettingsAndScan();
