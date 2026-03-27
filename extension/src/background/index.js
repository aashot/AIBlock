chrome.runtime.onInstalled.addListener(() => {
  chrome.contextMenus.create({
    id: "add-keyword",
    title: "Block \"%s\" in Feed Filter",
    contexts: ["selection"],
  });
});

chrome.contextMenus.onClicked.addListener((info) => {
  if (info.menuItemId !== "add-keyword") return;
  const keyword = (info.selectionText || "").trim();
  if (!keyword) return;
  chrome.storage.sync.get({ keywords: [] }, (result) => {
    const keywords = result.keywords;
    if (keywords.some((kw) => kw.toLowerCase() === keyword.toLowerCase())) return;
    keywords.push(keyword);
    chrome.storage.sync.set({ keywords });
  });
});
