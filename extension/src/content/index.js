import { getSettings, getKeywords } from "../lib/storage.js";
import { resolveKeywords } from "../lib/keywords.js";
import { injectStyles } from "./styles.js";
import { buildRegex, scanAllPosts, fullRescan, restoreAll } from "./filter.js";
import { startObserver, stopObserver } from "./observer.js";

injectStyles();

const state = {
  filterEnabled: false,
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
      state.filterEnabled = result.enabled;

      if (state.filterEnabled) {
        scanAllPosts(state);
        startObserver(() => scanAllPosts(state));
      } else {
        restoreAll();
        stopObserver();
      }
    });
  });
}

chrome.storage.onChanged.addListener((changes, area) => {
  if (area !== "sync") return;

  if (changes.enabled) state.filterEnabled = changes.enabled.newValue;
  if (changes.wholeWord) state.wholeWordEnabled = changes.wholeWord.newValue;
  if (changes.hideMode) state.hideMode = changes.hideMode.newValue;
  if (changes.whitelist) state.whitelist = changes.whitelist.newValue || [];

  function applyChanges() {
    if (state.filterEnabled) {
      fullRescan(state);
      startObserver(() => scanAllPosts(state));
    } else {
      restoreAll();
      stopObserver();
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
