export const STORAGE_DEFAULTS = {
  keywords: null,
  enabled: false,
  seeded: false,
  version: 1,
  wholeWord: false,
  hideMode: "blur",
  whitelist: [],
  mode: "filter",
};

export function getSettings(cb) {
  chrome.storage.sync.get(STORAGE_DEFAULTS, cb);
}

export function getKeywords(cb) {
  chrome.storage.sync.get({ keywords: [] }, (result) => cb(result.keywords));
}

export function saveSettings(obj, cb) {
  chrome.storage.sync.set(obj, cb);
}
