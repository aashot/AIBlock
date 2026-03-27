import { getFeedContainer } from "./selectors.js";

let debounceTimer = null;
let observer = null;

export function startObserver(onNewNodes) {
  if (observer) return;

  const mutationCb = (mutations) => {
    let hasNewNodes = false;
    for (const m of mutations) {
      if (m.addedNodes.length > 0) {
        hasNewNodes = true;
        break;
      }
    }
    if (!hasNewNodes) return;

    clearTimeout(debounceTimer);
    debounceTimer = setTimeout(onNewNodes, 200);
  };

  observer = new MutationObserver(mutationCb);

  const container = getFeedContainer();
  if (container) {
    observer.observe(container, { childList: true, subtree: true });
  } else {
    observer.observe(document.body, { childList: true, subtree: true });
    const narrowInterval = setInterval(() => {
      const feed = getFeedContainer();
      if (feed) {
        clearInterval(narrowInterval);
        observer.disconnect();
        observer.observe(feed, { childList: true, subtree: true });
      }
    }, 2000);
  }
}

export function stopObserver() {
  if (observer) {
    observer.disconnect();
    observer = null;
  }
  clearTimeout(debounceTimer);
}
