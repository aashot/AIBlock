import { saveSettings } from "./storage.js";
import { DEFAULT_KEYWORDS, KEYWORDS_VERSION } from "../defaults.js";

export function resolveKeywords(result, cb) {
  let kw = result.keywords;
  let needsSave = false;
  const updates = {};

  if (kw === null || !result.seeded) {
    kw = DEFAULT_KEYWORDS;
    updates.keywords = kw;
    updates.seeded = true;
    updates.version = KEYWORDS_VERSION;
    needsSave = true;
  } else if (result.version !== KEYWORDS_VERSION) {
    const newKws = DEFAULT_KEYWORDS.filter((k) => !kw.includes(k));
    if (newKws.length > 0) {
      kw = Array.from(new Set([...kw, ...newKws]));
    }
    updates.keywords = kw;
    updates.version = KEYWORDS_VERSION;
    needsSave = true;
  }

  if (needsSave) {
    saveSettings(updates, () => cb(kw));
  } else {
    cb(kw);
  }
}
