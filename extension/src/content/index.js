import { getSettings, getKeywords } from "../lib/storage.js";
import { resolveKeywords } from "../lib/keywords.js";
import { injectStyles } from "./styles.js";
import { buildRegex, scanAllPosts, fullRescan, restoreAll, startPeriodicRescan, stopPeriodicRescan } from "./filter.js";
import { startObserver, stopObserver } from "./observer.js";

injectStyles();

const state = {
  enabled: false,
  mode: "filter",
  wholeWordEnabled: false,
  hideMode: "blur",
  keywordRegex: null,
  whitelist: [],
};

function loadSettingsAndScan() {
  getSettings((result) => {
    resolveKeywords(result, (kw) => {
      state.wholeWordEnabled = result.wholeWord;
      state.hideMode = result.hideMode;
      state.whitelist = result.whitelist;
      state.keywordRegex = buildRegex(kw, state.wholeWordEnabled);
      state.enabled = result.enabled;
      state.mode = result.mode;

      if (state.enabled) {
        scanAllPosts(state);
        startObserver(() => scanAllPosts(state));
        startPeriodicRescan(state);
      } else {
        restoreAll();
        stopObserver();
        stopPeriodicRescan();
      }
    });
  });
}

chrome.storage.onChanged.addListener((changes, area) => {
  if (area !== "sync") return;

  if (changes.enabled) state.enabled = changes.enabled.newValue;
  if (changes.mode) state.mode = changes.mode.newValue;
  if (changes.wholeWord) state.wholeWordEnabled = changes.wholeWord.newValue;
  if (changes.hideMode) state.hideMode = changes.hideMode.newValue;
  if (changes.whitelist) state.whitelist = changes.whitelist.newValue || [];

  function applyChanges() {
    if (state.enabled) {
      fullRescan(state);
      startObserver(() => scanAllPosts(state));
      startPeriodicRescan(state);
    } else {
      restoreAll();
      stopObserver();
      stopPeriodicRescan();
    }
  }

  if (changes.keywords || changes.wholeWord) {
    getKeywords((kw) => {
      state.keywordRegex = buildRegex(kw, state.wholeWordEnabled);
      applyChanges();
    });
  } else {
    applyChanges();
  }
});

loadSettingsAndScan();
