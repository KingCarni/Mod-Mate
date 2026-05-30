chrome.runtime.onInstalled.addListener(() => {
  chrome.storage.local.set({
    modMateBaseUrl: "http://localhost:3000",
  });
});
