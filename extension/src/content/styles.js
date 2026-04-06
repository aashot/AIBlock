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
    .aiblock-badge-wrapper {
      display: flex; justify-content: flex-end; align-items: center;
      padding: 12px 12px 0; position: relative;
    }
    .aiblock-badge {
      font-size: 11px; font-weight: 600; padding: 2px 8px; border-radius: 10px;
      cursor: pointer; user-select: none; opacity: 0.9;
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
      transition: transform 0.15s, opacity 0.15s;
    }
    .aiblock-badge:hover { transform: scale(1.08); opacity: 1; }
    .aiblock-badge--none { background: rgba(128,128,128,0.15); color: #888; }
    .aiblock-badge--low { background: #e8f5e9; color: #2e7d32; }
    .aiblock-badge--medium { background: #fff3e0; color: #e65100; }
    .aiblock-badge--high { background: #fce4ec; color: #cc1016; }
    .aiblock-badge--active { outline: 2px solid currentColor; outline-offset: 1px; }
    .aiblock-hl-word {
      background: rgba(255, 160, 0, 0.3) !important;
      border-bottom: 2px solid rgba(255, 160, 0, 0.7) !important;
      border-radius: 2px !important;
    }
    .aiblock-hl-struct {
      background: rgba(138, 43, 226, 0.3) !important;
      border-bottom: 2px solid rgba(138, 43, 226, 0.7) !important;
      border-radius: 2px !important;
    }
    .aiblock-signals {
      position: absolute; top: 100%; right: 0; z-index: 10; margin-top: 4px;
      background: rgba(20, 20, 20, 0.92); color: #e0e0e0;
      border-radius: 8px; padding: 8px 10px;
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
      font-size: 11px; min-width: 160px; max-width: 240px;
      box-shadow: 0 4px 12px rgba(0,0,0,0.3);
    }
    .aiblock-signal-row {
      display: flex; justify-content: space-between; align-items: center;
      padding: 2px 0; gap: 8px;
    }
    .aiblock-signal-label { color: #ccc; }
    .aiblock-signal-weight {
      color: #ff9800; font-weight: 600; flex-shrink: 0;
    }
  `;
  (document.head || document.documentElement).appendChild(style);
}
