let feedContainer = null;

export function getFeedContainer() {
  if (feedContainer && feedContainer.isConnected) return feedContainer;
  feedContainer =
    document.querySelector("main.scaffold-layout__main") ||
    document.querySelector("[role=\"main\"]") ||
    document.querySelector("main") ||
    null;
  return feedContainer;
}

export function findPostElements() {
  const postSelectors = [
    "[data-urn^=\"urn:li:activity\"]",
    "[data-urn^=\"urn:li:ugcPost\"]",
    "[data-urn^=\"urn:li:aggregate\"]",
    "div.feed-shared-update-v2",
    ".occludable-update",
  ];

  const root = getFeedContainer() || document;
  const all = root.querySelectorAll(postSelectors.join(", "));

  const allSet = new Set(all);
  const hasDescendant = new Set();
  for (const el of all) {
    let p = el.parentElement;
    while (p) {
      if (allSet.has(p)) { hasDescendant.add(p); break; }
      p = p.parentElement;
    }
  }
  const result = [];
  for (const el of all) {
    if (!hasDescendant.has(el)) result.push(el);
  }

  const feedScroll = document.querySelector(".scaffold-finite-scroll__content");
  if (feedScroll) {
    const found = new Set(result);
    for (const child of feedScroll.children) {
      if (child.tagName === "H2" || child.tagName === "HR") continue;
      if (!child.textContent || child.textContent.trim().length < 30) continue;

      let alreadyCovered = false;
      for (const existing of found) {
        if (child.contains(existing) || child === existing) {
          alreadyCovered = true;
          break;
        }
      }
      if (alreadyCovered) continue;

      const inner =
        child.querySelector("div.feed-shared-update-v2") ||
        child.querySelector("[data-urn^=\"urn:li:activity\"]") ||
        child.querySelector(".occludable-update");
      const el = inner || child;
      result.push(el);
      found.add(el);
    }
  }

  return result;
}

export function getPostText(post) {
  return post.textContent;
}

const POST_BODY_SELECTORS = [
  '[data-test-id="main-feed-activity-card__commentary"]',
  ".feed-shared-update-v2__commentary",
  ".feed-shared-text",
  ".feed-shared-inline-show-more-text",
  ".feed-shared-update-v2__description",
  ".update-components-text",
  ".break-words",
  ".feed-shared-text__text-view",
];

const ACTOR_CONTAINERS = [
  ".update-components-actor",
  ".feed-shared-actor",
  ".comments-comments-list",
  ".comments-comment-entity",
  ".comments-comment-item",
  ".feed-shared-update-v2__controls",
  ".update-components-header",
  ".feed-shared-header",
];

const NOISE_SELECTORS = [
  ".update-components-actor",
  ".feed-shared-actor",
  ".social-details-social-counts",
  ".social-details-social-activity",
  ".feed-shared-social-actions",
  ".comments-comments-list",
  ".comments-comment-entity",
  ".comments-comment-item",
  ".feed-shared-update-v2__controls",
  ".update-components-header",
  ".feed-shared-header",
  "button",
  "time",
  ".artdeco-card__actions",
  ".feed-shared-article",
  ".update-components-mini-update-v2",
];

const ACTOR_SELECTOR = ACTOR_CONTAINERS.join(", ");
const NOISE_SELECTOR = NOISE_SELECTORS.join(", ");

export function getPostBodyText(post) {
  for (const sel of POST_BODY_SELECTORS) {
    const el = post.querySelector(sel);
    if (!el || el.innerText.trim().length <= 20) continue;
    const actor = el.closest(ACTOR_SELECTOR);
    if (actor && actor !== post) continue;
    return el.innerText;
  }

  const noiseEls = post.querySelectorAll(NOISE_SELECTOR);
  const noiseSet = new Set();
  for (const n of noiseEls) noiseSet.add(n);

  const walker = document.createTreeWalker(post, NodeFilter.SHOW_TEXT, {
    acceptNode(node) {
      let p = node.parentElement;
      while (p && p !== post) {
        if (noiseSet.has(p)) return NodeFilter.FILTER_REJECT;
        p = p.parentElement;
      }
      return NodeFilter.FILTER_ACCEPT;
    },
  });

  const parts = [];
  let n;
  while ((n = walker.nextNode())) {
    const t = n.nodeValue.trim();
    if (t) parts.push(t);
  }
  return parts.join(" ");
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
