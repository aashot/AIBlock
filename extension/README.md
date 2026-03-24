# AIBlock: LinkedIn AI Feed Filter

Tired of your LinkedIn feed being completely flooded with AI hype, ChatGPT prompts, and "10x your productivity" posts? 

**AIBlock** acts exactly like an adblocker—but specifically for AI content on LinkedIn. It scans your feed in real-time and instantly hides any post containing AI buzzwords, products, acronyms, or tech jargon, giving you back a clean, highly relevant professional feed.

![AIBlock Logo](icons/icon128.png)

## Features

* **Massive Dedicated Blocklist:** Comes pre-loaded with over 200 carefully curated AI-related keywords, companies, and buzzwords (ChatGPT, Copilot, LLM, prompt engineering, Midjourney, etc.).
* **Fully Customizable:** Easily add your own custom keywords, acronyms, or specific company names to the blocklist.
* **Live Stats:** See exactly how many AI posts AIBlock has successfully hidden from your feed right in the popup window.
* **Lightning Fast:** Built with high-performance `MutationObserver`s and `requestIdleCallback`s to ensure your feed scrolls perfectly smoothly with zero lag or jank. 
* **100% Private & Secure:** AIBlock runs entirely on your local machine. It does not track you, does not collect analytics, and never sends your data to any external servers.

## 🚀 Installation 

### Chrome Web Store (Coming Soon)
*(Link to Chrome Web Store will be placed here once published)*

### Manual Installation (Developer Mode)

If you want to try the extension locally or contribute to the code:

1. Clone or download this repository.
2. Open Google Chrome and navigate to `chrome://extensions/`.
3. Enable **Developer mode** (toggle switch in the top right corner).
4. Click the **Load unpacked** button.
5. Select the `extension` folder you just cloned.
6. The extension is now installed! Navigate to LinkedIn to see it in action.

## 🛠️ How it Works

The extension uses two simple mechanisms:
1. A **Performance-Optimized Content Script** (`content.js`): Injects onto LinkedIn, compiling the blocklist into a single regular expression. It hooks into LinkedIn's infinite scroll, quickly iterating over posts during browser idle time to apply `display: none` to matches.
2. A **Popup Interface** (`popup.html` / `popup.js`): Allows you to view live stats, pause the blocker, or append custom strings to the local storage filter list.

## 🤝 Contributing

I welcome contributions, especially additions to the `defaults.js` keyword list! See the [Contributing Guidelines](CONTRIBUTING.md) for more details on how to get started.

## 📄 License

This project is licensed under the [Creative Commons Attribution-NonCommercial 4.0 International License](LICENSE). 
You are free to view, modify, and distribute the code for non-commercial purposes, but you may not use it to make a profit. See the [LICENSE](LICENSE) file for more details.
