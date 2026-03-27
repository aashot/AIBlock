let feedContainer = null;

export function getFeedContainer() {
  if (feedContainer && feedContainer.isConnected) return feedContainer;
  feedContainer =
    document.querySelector("main.scaffold-layout__main") ||
    document.querySelector("[role=\"main\"]") ||
    null;
  return feedContainer;
}

export function findPostElements() {
  const selectors = [
    "[data-urn^=\"urn:li:activity\"]",
    "[data-urn^=\"urn:li:ugcPost\"]",
    "[data-urn^=\"urn:li:aggregate\"]",
    "div.feed-shared-update-v2",
    "[data-id] .feed-shared-update-v2",
  ];
  const root = getFeedContainer() || document;
  return root.querySelectorAll(selectors.join(", "));
}

export function getPostText(post) {
  return post.textContent;
}

export function getPostAuthor(post) {
  const el = post.querySelector(
    ".update-components-actor__name span, .feed-shared-actor__name span, " +
    "a[data-tracking-control-name*=\"actor\"] span, .update-components-actor__title span"
  );
  return el ? el.textContent.trim() : "";
}

export function isWhitelisted(post, whitelist) {
  if (whitelist.length === 0) return false;
  const author = getPostAuthor(post).toLowerCase();
  if (!author) return false;
  return whitelist.some((entry) => author.includes(entry.toLowerCase()));
}
