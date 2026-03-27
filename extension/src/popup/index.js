import { getSettings, getKeywords, saveSettings } from "../lib/storage.js";
import { resolveKeywords } from "../lib/keywords.js";
import { DEFAULT_KEYWORDS, KEYWORDS_VERSION } from "../defaults.js";

/* --- DOM references --- */
const form = document.getElementById("add-form");
const input = document.getElementById("keyword-input");
const list = document.getElementById("keyword-list");
const toggleInput = document.getElementById("toggle-input");
const keywordCount = document.getElementById("keyword-count");
const resetBtn = document.getElementById("reset-btn");
const exportBtn = document.getElementById("export-btn");
const importBtn = document.getElementById("import-btn");
const importFile = document.getElementById("import-file");
const importError = document.getElementById("import-error");
const statsText = document.getElementById("stats-text");
const wholeWordInput = document.getElementById("whole-word-input");
const hideModeToggle = document.getElementById("hide-mode-toggle");
const whitelistForm = document.getElementById("whitelist-form");
const whitelistInput = document.getElementById("whitelist-input");
const whitelistList = document.getElementById("whitelist-list");
const whitelistCount = document.getElementById("whitelist-count");

/* --- Generic list renderer --- */

function renderList(listEl, counterEl, label, items, dataAttr) {
  listEl.textContent = "";
  counterEl.textContent = `${label} (${items.length})`;
  const frag = document.createDocumentFragment();
  items.forEach((item) => {
    const li = document.createElement("li");
    const span = document.createElement("span");
    span.textContent = item;
    const btn = document.createElement("button");
    btn.textContent = "\u2715";
    btn.title = "Remove";
    btn.dataset[dataAttr] = item;
    li.appendChild(span);
    li.appendChild(btn);
    frag.appendChild(li);
  });
  listEl.appendChild(frag);
}

function renderKeywords(keywords) {
  renderList(list, keywordCount, "Keywords", keywords, "keyword");
}

function renderWhitelist(entries) {
  renderList(whitelistList, whitelistCount, "Allowed authors", entries, "author");
}

/* --- Keyword management --- */

list.addEventListener("click", (e) => {
  const btn = e.target.closest("button[data-keyword]");
  if (btn) removeKeyword(btn.dataset.keyword);
});

function addKeyword(keyword) {
  const trimmed = keyword.trim();
  if (!trimmed) return;
  getKeywords((keywords) => {
    if (keywords.some((kw) => kw.toLowerCase() === trimmed.toLowerCase())) return;
    keywords.push(trimmed);
    saveSettings({ keywords }, () => renderKeywords(keywords));
  });
}

function removeKeyword(keyword) {
  getKeywords((keywords) => {
    const filtered = keywords.filter((kw) => kw !== keyword);
    saveSettings({ keywords: filtered }, () => renderKeywords(filtered));
  });
}

function resetToDefaults() {
  saveSettings({ keywords: DEFAULT_KEYWORDS, version: KEYWORDS_VERSION }, () => {
    renderKeywords(DEFAULT_KEYWORDS);
  });
}

/* --- Whitelist management --- */

whitelistList.addEventListener("click", (e) => {
  const btn = e.target.closest("button[data-author]");
  if (!btn) return;
  chrome.storage.sync.get({ whitelist: [] }, (result) => {
    const updated = result.whitelist.filter((n) => n !== btn.dataset.author);
    saveSettings({ whitelist: updated }, () => renderWhitelist(updated));
  });
});

whitelistForm.addEventListener("submit", (e) => {
  e.preventDefault();
  const trimmed = whitelistInput.value.trim();
  if (!trimmed) return;
  chrome.storage.sync.get({ whitelist: [] }, (result) => {
    const wl = result.whitelist;
    if (wl.some((n) => n.toLowerCase() === trimmed.toLowerCase())) return;
    wl.push(trimmed);
    saveSettings({ whitelist: wl }, () => renderWhitelist(wl));
  });
  whitelistInput.value = "";
  whitelistInput.focus();
});

/* --- Settings bootstrap --- */

function loadSettings() {
  getSettings((result) => {
    toggleInput.checked = result.enabled;
    wholeWordInput.checked = result.wholeWord;
    hideModeToggle.querySelectorAll("button").forEach((btn) => {
      btn.classList.toggle("active", btn.dataset.mode === result.hideMode);
    });
    renderWhitelist(result.whitelist);

    resolveKeywords(result, (kw) => renderKeywords(kw));
  });
}

/* --- Event listeners --- */

form.addEventListener("submit", (e) => {
  e.preventDefault();
  addKeyword(input.value);
  input.value = "";
  input.focus();
});

toggleInput.addEventListener("change", () => {
  saveSettings({ enabled: toggleInput.checked });
});

wholeWordInput.addEventListener("change", () => {
  saveSettings({ wholeWord: wholeWordInput.checked });
});

hideModeToggle.addEventListener("click", (e) => {
  const btn = e.target.closest("button[data-mode]");
  if (!btn || btn.classList.contains("active")) return;
  hideModeToggle.querySelectorAll("button").forEach((b) => b.classList.remove("active"));
  btn.classList.add("active");
  saveSettings({ hideMode: btn.dataset.mode });
});

resetBtn.addEventListener("click", resetToDefaults);

/* --- Export / Import --- */

exportBtn.addEventListener("click", () => {
  getKeywords((keywords) => {
    const json = JSON.stringify(keywords, null, 2);
    const blob = new Blob([json], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "aiblock-keywords.json";
    a.click();
    URL.revokeObjectURL(url);
  });
});

importBtn.addEventListener("click", () => {
  importFile.click();
});

importFile.addEventListener("change", () => {
  const file = importFile.files[0];
  if (!file) return;
  importError.hidden = true;
  const reader = new FileReader();
  reader.onload = () => {
    try {
      const data = JSON.parse(reader.result);
      if (!Array.isArray(data) || !data.every((k) => typeof k === "string")) {
        throw new Error("Invalid format");
      }
      getKeywords((keywords) => {
        const merged = Array.from(
          new Set([...keywords, ...data.map((k) => k.trim()).filter(Boolean)])
        );
        if (merged.length > 500) {
          throw new Error("Too many keywords");
        }
        saveSettings({ keywords: merged }, () => renderKeywords(merged));
      });
    } catch {
      importError.textContent = e.message === "Too many keywords"
        ? "Import would exceed the 500 keyword limit. Remove some keywords first."
        : "Invalid file. Expected a JSON array of strings.";
      importError.hidden = false;
    }
    importFile.value = "";
  };
  reader.readAsText(file);
});

/* --- Stats --- */

function updateStats() {
  chrome.storage.local.get({ stats: { scanned: 0, hidden: 0 } }, (result) => {
    const { scanned, hidden } = result.stats;
    statsText.textContent =
      scanned === 0 ? "No posts scanned yet" : `${hidden} blocked of ${scanned} posts`;
  });
}

chrome.storage.onChanged.addListener((changes, area) => {
  if (area === "local" && changes.stats) {
    const { scanned, hidden } = changes.stats.newValue || { scanned: 0, hidden: 0 };
    statsText.textContent =
      scanned === 0 ? "No posts scanned yet" : `${hidden} blocked of ${scanned} posts`;
  }
});

/* --- Init --- */
loadSettings();
updateStats();
