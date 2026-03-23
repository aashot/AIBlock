# Contributing to AIBlock

First off, thank you for considering contributing to AIBlock! It's people like you that make AIBlock such a great tool.

## 📝 How to Contribute

There are several ways you can contribute to this project:

### 1. Adding New Block Words (`defaults.js`)
If you notice new AI buzzwords or companies crowding your feed that aren't blocked by default, I want them!

1. Fork the repository.
2. Open `defaults.js`.
3. Add the new keywords to the `DEFAULT_KEYWORDS` array. (Try to place them in the relevant categorized section, e.g., "Models & products" or "Buzzwords & hype phrases").
4. Please ensure the keywords are lowercase for consistency.
5. Submit a Pull Request.

### 2. Reporting Bugs
If you find a bug (e.g., LinkedIn changed their HTML classes and the extension is no longer hiding posts):
* Open an Issue on GitHub.
* Include detailed steps on how to reproduce the bug.
* If possible, provide a screenshot or the specific HTML snippet of the LinkedIn post that bypassed the filter.

### 3. Updating LinkedIn Selectors (`content.js`)
LinkedIn frequently updates its DOM structure and class names. If the extension suddenly stops blocking posts, it's usually because the feed container selector has changed.
1. Inspect the LinkedIn feed to find the new attribute or class wrapper for the main feed post elements.
2. Update the `findPostElements()` function in `content.js` with the new primary or fallback selector.
3. Test thoroughly on the live feed and submit a Pull Request.

### 4. Code Improvements / Features
If you want to improve performance or add a feature (e.g., Firefox support, advanced regex rules):
1. Open an Issue first to discuss your idea with me.
2. Fork the repo and create a new branch (`git checkout -b feature/amazing-feature`).
3. Write clean, vanilla JavaScript and CSS. *(Note: I am purposefully avoiding heavy build tools, frameworks like React, or massive dependencies to keep the extension lean and secure).*
4. Test thoroughly on the live LinkedIn feed.
5. Submit a Pull Request.

## 🧑‍💻 Development Setup

1. Clone your fork locally.
2. Open Chrome and go to `chrome://extensions/`.
3. Enable "Developer mode".
4. Click "Load unpacked" and select the repository directory.
5. Whenever you make changes to `content.js` or `defaults.js`, you must click the **Reload** icon `↻` on the extension card in `chrome://extensions/`, and then refresh the LinkedIn page. Changes to `popup.html/.css/.js` apply instantly the next time you open the popup.

## 📐 Code Style Guidelines
* **No libraries**: Use Vanilla JS and CSS whenever possible. 
* **Zero telemetry**: Never add analytics, tracking pixels, or external HTTP requests. Complete privacy is a core tenet of this extension.
* **Performance first**: Content scripts run on every page load and scroll. Ensure DOM manipulation is minimal and batched when possible.

Thank you for helping keep our LinkedIn feeds clean!
