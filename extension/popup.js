"use strict";
const form = document.getElementById("add-form");
const input = document.getElementById("keyword-input");
const list = document.getElementById("keyword-list");
const toggleInput = document.getElementById("toggle-input");
const keywordCount = document.getElementById("keyword-count");
const resetBtn = document.getElementById("reset-btn");
const statsText = document.getElementById("stats-text");
function render(keywords) {
  list.textContent = "";
  keywordCount.textContent = `Keywords (${keywords.length})`;
  keywords.forEach((kw) => {
    const li = document.createElement("li");
    const span = document.createElement("span");
    span.textContent = kw;
    const btn = document.createElement("button");
    btn.textContent = "\u2715";
    btn.title = "Remove keyword";
    btn.addEventListener("click", () => removeKeyword(kw));
    li.appendChild(span);
    li.appendChild(btn);
    list.appendChild(li);
  });
}
function loadSettings() {
  chrome.storage.sync.get(
    { keywords: null, enabled: false, seeded: false, version: 1 },
    (result) => {
      toggleInput.checked = result.enabled;
      let kw = result.keywords;
      if (kw === null || !result.seeded) {
        kw = DEFAULT_KEYWORDS;
        chrome.storage.sync.set(
          { keywords: kw, seeded: true, version: KEYWORDS_VERSION },
          () => render(kw)
        );
      } else if (result.version !== KEYWORDS_VERSION) {
        const newKws = DEFAULT_KEYWORDS.filter((k) => !kw.includes(k));
        if (newKws.length > 0) {
          kw = [...kw, ...newKws];
          kw = Array.from(new Set(kw));
        }
        chrome.storage.sync.set(
          { keywords: kw, version: KEYWORDS_VERSION },
          () => render(kw)
        );
      } else {
        render(kw);
      }
    }
  );
}

function addKeyword(keyword) {
  const trimmed = keyword.trim();
  if (!trimmed) return;
  chrome.storage.sync.get({ keywords: [] }, (result) => {
    const keywords = result.keywords;
    const exists = keywords.some(
      (kw) => kw.toLowerCase() === trimmed.toLowerCase()
    );
    if (exists) return;
    keywords.push(trimmed);
    chrome.storage.sync.set({ keywords }, () => render(keywords));
  });
}
function removeKeyword(keyword) {
  chrome.storage.sync.get({ keywords: [] }, (result) => {
    const keywords = result.keywords.filter((kw) => kw !== keyword);
    chrome.storage.sync.set({ keywords }, () => render(keywords));
  });
}
function resetToDefaults() {
  chrome.storage.sync.set({ keywords: DEFAULT_KEYWORDS, version: KEYWORDS_VERSION }, () => {
    render(DEFAULT_KEYWORDS);
  });
}
form.addEventListener("submit", (e) => {
  e.preventDefault();
  addKeyword(input.value);
  input.value = "";
  input.focus();
});
toggleInput.addEventListener("change", () => {
  chrome.storage.sync.set({ enabled: toggleInput.checked });
});
resetBtn.addEventListener("click", resetToDefaults);
function updateStats() {
  chrome.storage.local.get({ stats: { scanned: 0, hidden: 0 } }, (result) => {
    const { scanned, hidden } = result.stats;
    if (scanned === 0) {
      statsText.textContent = "No posts scanned yet";
    } else {
      statsText.textContent = `${hidden} blocked of ${scanned} posts`;
    }
  });
}
chrome.storage.onChanged.addListener((changes, area) => {
  if (area === "local" && changes.stats) {
    const { scanned, hidden } = changes.stats.newValue || { scanned: 0, hidden: 0 };
    if (scanned === 0) {
      statsText.textContent = "No posts scanned yet";
    } else {
      statsText.textContent = `${hidden} blocked of ${scanned} posts`;
    }
  }
});
loadSettings();
updateStats();
