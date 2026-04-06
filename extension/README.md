# AIBlock: LinkedIn AI Feed Filter & Detector

Tired of your LinkedIn feed being completely flooded with AI hype, ChatGPT prompts, and "10x your productivity" posts? Can't tell which posts were actually written by a human?

**AIBlock** gives you two ways to fight back. **Filter mode** works like an adblocker—hiding or blurring posts that match AI keywords. **AI Score mode** analyzes every post for AI-written patterns and shows a percentage badge so you can see for yourself.

## Features

### Filter Mode
* **Massive Dedicated Blocklist:** Pre-loaded with 220+ carefully curated AI-related keywords, companies, and buzzwords (ChatGPT, Copilot, LLM, prompt engineering, Midjourney, etc.).
* **Fully Customizable:** Easily add or remove keywords, acronyms, or specific company names from the blocklist.
* **Hide or Blur:** Choose to completely hide AI posts or blur them with a click-to-reveal overlay.
* **Whole-Word Matching:** Optional toggle to prevent short keywords like "AI" from matching inside words like "email" or "train".
* **Author Whitelist:** Allow specific LinkedIn authors through the filter, even if their posts contain blocked keywords.
* **Right-Click Blocking:** Highlight text on LinkedIn and right-click → "Block in Feed Filter" to instantly add it.

### AI Score Mode
* **Per-Post AI Scoring:** Each post is analyzed for AI-written patterns across vocabulary, structure, and style, producing a 0–100% score badge.
* **Signal Breakdown:** Click any badge to see exactly which signals triggered the score (e.g., overused AI vocabulary, emoji bullet lists, uniform sentence lengths).
* **Word Highlighting:** Expand a badge to highlight flagged words and structural patterns directly in the post text.

### Shared
* **Live Stats:** See how many posts have been filtered or scored right in the popup.
* **Lightning Fast:** Built with `MutationObserver` and `requestIdleCallback` for smooth scrolling with zero lag.
* **100% Private & Secure:** Runs entirely on your local machine. No tracking, no analytics, no external requests.

## 🚀 Installation 

### Chrome Web Store (Coming Soon)
*(Link to Chrome Web Store will be placed here once published)*

### Manual Installation (Developer Mode)

If you want to try the extension locally or contribute to the code:

1. Clone or download this repository.
2. Install dependencies and build:
   ```bash
   npm install
   npm run build
   ```
3. Open Google Chrome and navigate to `chrome://extensions/`.
4. Enable **Developer mode** (toggle switch in the top right corner).
5. Click the **Load unpacked** button.
6. Select the **`dist/extension`** folder (not the source `extension/` folder).
7. Navigate to LinkedIn to see it in action!

## 🛠️ How it Works

The extension is built with **Vite** and uses ES modules internally, bundled into Chrome-compatible IIFE scripts:

1. A **Content Script** (`content/`): Injected onto LinkedIn pages. In filter mode, compiles the blocklist into a single regex and hides/blurs matches. In score mode, runs each post through a heuristic scorer (`ai-detect/`) that checks vocabulary, structural patterns, and stylistic metrics. Both modes use `MutationObserver` and `requestIdleCallback` for non-blocking processing.
2. A **Popup Interface** (`popup/`): Switch between filter and score modes, view live stats, manage keywords, configure hide/blur, and set up author whitelists.
3. A **Background Worker** (`background/`): Handles the right-click context menu for quick keyword addition.

## 🤝 Contributing

Contributions are welcome, especially additions to the keyword list! See the [Contributing Guidelines](CONTRIBUTING.md) for more details on how to get started.

## 📄 License

This project is licensed under the [Creative Commons Attribution-NonCommercial 4.0 International License](LICENSE). 
You are free to view, modify, and distribute the code for non-commercial purposes, but you may not use it to make a profit. See the [LICENSE](LICENSE) file for more details.
