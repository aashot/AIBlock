export const HIDDEN_ATTR = "data-feed-filter-hidden";
export const BLURRED_ATTR = "data-feed-filter-blurred";

export function injectStyles() {
  const style = document.createElement("style");
  style.textContent = `
    [${HIDDEN_ATTR}] { display: none !important; }
    [${BLURRED_ATTR}] { user-select: none; position: relative; }
    [${BLURRED_ATTR}] > *:not(.feed-filter-blur-overlay) { filter: blur(8px); pointer-events: none; }
    .feed-filter-blur-overlay {
      position: absolute; inset: 0; z-index: 10;
      display: flex; flex-direction: column; align-items: center; justify-content: center;
      gap: 6px; text-align: center;
      background: rgba(0,0,0,0.55); cursor: pointer;
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
      color: #fff;
    }
    .feed-filter-blur-title {
      font-size: 16px; font-weight: 700;
    }
    .feed-filter-blur-keywords {
      font-size: 13px; color: rgba(255,255,255,0.75); font-weight: 400;
    }
    .feed-filter-blur-hint {
      font-size: 12px; color: rgba(255,255,255,0.5); font-style: italic; font-weight: 400;
      margin-top: 2px;
    }
  `;
  (document.head || document.documentElement).appendChild(style);
}
