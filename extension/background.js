const CONTEXT_MENU_ID = "mod-mate-send-selection";

chrome.runtime.onInstalled.addListener(() => {
  chrome.storage.local.set({
    modMateBaseUrl: "http://localhost:3000",
  });

  chrome.contextMenus.removeAll(() => {
    chrome.contextMenus.create({
      id: CONTEXT_MENU_ID,
      title: "Send selection to Mod-Mate",
      contexts: ["selection"],
    });
  });
});

chrome.contextMenus.onClicked.addListener((info, tab) => {
  if (info.menuItemId !== CONTEXT_MENU_ID) return;

  const selectedText = (info.selectionText || "").trim();
  if (!selectedText) return;

  chrome.storage.local.set({
    modMateContextMenuSelection: {
      selectedText,
      title: tab?.title || "Untitled page",
      url: tab?.url || "",
      topUrl: tab?.url || "",
      host: tab?.url ? new URL(tab.url).host : "",
      frameUrl: tab?.url || "",
      capturedAt: new Date().toISOString(),
      captureMethod: "context-menu",
    },
  });
});
