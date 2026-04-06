# Contributing to AIBlock

First off, thank you for considering contributing to AIBlock! It's people like you that make AIBlock such a great tool.

## 📝 How to Contribute

There are several ways you can contribute to this project:

### 1. Adding New Block Words
If you notice new AI buzzwords or companies crowding your feed that aren't blocked by default, I want them!

1. Fork the repository.
2. Open `extension/src/defaults.js`.
3. Add the new keywords to the `DEFAULT_KEYWORDS` array. (Try to place them in the relevant categorized section, e.g., "Models & products" or "Buzzwords & hype phrases").
4. Please ensure the keywords are lowercase for consistency.
5. Submit a Pull Request.

### 2. Reporting Bugs
If you find a bug (e.g., LinkedIn changed their HTML classes and the extension is no longer hiding posts):
* Open an Issue on GitHub.
* Include detailed steps on how to reproduce the bug.
* If possible, provide a screenshot or the specific HTML snippet of the LinkedIn post that bypassed the filter.

### 3. Updating LinkedIn Selectors
LinkedIn frequently updates its DOM structure and class names. If the extension suddenly stops blocking posts, it's usually because the feed container selector has changed.
1. Inspect the LinkedIn feed to find the new attribute or class wrapper for the main feed post elements.
2. Update the `findPostElements()` function in `extension/src/content/selectors.js` with the new primary or fallback selector.
3. Run `npm run build`, reload the extension, test thoroughly on the live feed, and submit a Pull Request.

### 4. Improving AI Detection Signals
The AI scorer in `extension/src/content/ai-detect/signals.js` uses weighted vocabulary words, structural patterns, and stylistic heuristics. You can help improve detection accuracy:

1. **Add vocabulary signals:** Add overused AI-typical words to the appropriate weight tier (3 = strong markers, 2 = moderate, 1 = weak).
2. **Add structural signals:** Write a new `test(text)` function that detects a formatting pattern common in AI-generated posts.
3. **Tune weights:** If you notice false positives or missed detections, propose weight adjustments with before/after examples.
4. Run `npm run build`, reload the extension, switch to AI Score mode, and verify on real LinkedIn posts.

### 5. Code Improvements / Features
If you want to improve performance or add a feature (e.g., Firefox support, advanced regex rules):
1. Open an Issue first to discuss your idea with me.
2. Fork the repo and create a new branch (`git checkout -b feature/amazing-feature`).
3. Write clean, vanilla JavaScript and CSS. The project uses Vite as a bundler but intentionally avoids frameworks and heavy dependencies.
4. Run `npm run build`, test thoroughly on the live LinkedIn feed.
5. Submit a Pull Request.

## 💡 Ideas for Contribution (Roadmap)

Looking for something to work on? Here are some planned improvements and feature ideas you can help with:

### Core Functionality
- [ ] **Regex Support:** Allow advanced users to use custom regular expressions in their blocklist.
- [ ] **Expand beyond LinkedIn:** Enable the extension to work on additional social media platforms (X, Reddit, etc.).
- [ ] **Category Toggles:** Group keywords by category (companies, buzzwords, models) and let users enable/disable entire categories at once.
- [ ] **Score Threshold Filtering:** Auto-hide or blur posts above a user-defined AI score threshold.

### AI Detection
- [ ] **Per-Author Score History:** Track average AI scores per author over time.
- [ ] **Custom Signal Rules:** Let users add their own vocabulary words or phrases to the scorer.
- [ ] **Confidence Calibration:** Collect community feedback to tune signal weights for better accuracy.

### Statistics & UI
- [ ] **Historical Stats:** Track blocks per day and show a mini-chart in the popup of "Posts Saved this Week".
- [ ] **Keyboard Shortcuts:** A quick hotkey to toggle the filter ON/OFF without opening the popup.
- [ ] **Dark Mode:** Match the popup theme to the user's system/browser preference.

### Code & Performance
- [x] **Debounced Storage Writes:** Throttle `chrome.storage.local.set({ stats })` calls during rapid scrolling to avoid hitting Chrome storage write limits.
- [ ] **Firefox Support:** Port the extension to Firefox using WebExtension APIs.

## 🧑‍💻 Development Setup

1. Clone your fork locally.
2. Install dependencies: `npm install`
3. Build: `npm run build`
4. Open Chrome and go to `chrome://extensions/`.
5. Enable "Developer mode".
6. Click "Load unpacked" and select the `dist/extension/` folder.
7. After any source change: run `npm run build`, click the **Reload** icon `↻` on the extension card in `chrome://extensions/`, and refresh LinkedIn. Popup-only changes just need a rebuild and reopening the popup.

## 📐 Code Style Guidelines
* **No libraries**: Use Vanilla JS and CSS whenever possible. 
* **Zero telemetry**: Never add analytics, tracking pixels, or external HTTP requests. Complete privacy is a core tenet of this extension.
* **Performance first**: Content scripts run on every page load and scroll. Ensure DOM manipulation is minimal and batched when possible.

Thank you for helping keep our LinkedIn feeds clean!
