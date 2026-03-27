# AIBlock Workspace

AIBlock is a Chrome extension that acts as an adblocker for AI hype on LinkedIn. It automatically hides or blurs posts containing AI buzzwords, products, and tech jargon to keep your feed clean.

This repository is a monorepo containing both the Chrome extension and the promotional landing page, built with **Vite**.

## Quick Start

```bash
npm install
npm run build
```

Then load `dist/extension/` as an unpacked extension in Chrome (`chrome://extensions/` → Developer mode → Load unpacked).

To preview the landing page locally:

```bash
npm run dev
```

## Directory Structure

* [**`/extension/src`**](./extension/src): Extension source code (ES modules). Content scripts, popup UI, background worker, and shared libraries.
* [**`/extension/public`**](./extension/public): Static assets copied to dist as-is (manifest.json, icons).
* [**`/landing-page`**](./landing-page): Static landing page source (HTML/CSS).
* [**`/scripts/build.js`**](./scripts/build.js): Build script that bundles both targets via the Vite API.
* **`/dist`**: Build output (gitignored). `dist/extension/` is what Chrome loads; `dist/landing-page/` is the deployable site.

## Contributing

We welcome contributions! See the [Contributing Guidelines](extension/CONTRIBUTING.md) for how to get started.

## License

This project is licensed under the Creative Commons Attribution-NonCommercial (CC BY-NC 4.0) License. This means the code is open source and you are free to view, learn from, and modify it, but **you cannot use it for commercial purposes or to make a profit**. See the [`LICENSE`](./LICENSE) file for more details.
