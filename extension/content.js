const MOD_MATE_EXTENSION_MESSAGE = "MOD_MATE_GET_SELECTED_CONTEXT";

const getSelectedText = () => {
  const selection = window.getSelection();
  const selectedText = selection ? selection.toString().trim() : "";

  return {
    selectedText,
    title: document.title || "Untitled page",
    url: window.location.href,
    host: window.location.host,
  };
};

chrome.runtime.onMessage.addListener((message, _sender, sendResponse) => {
  if (message?.type !== MOD_MATE_EXTENSION_MESSAGE) return false;

  sendResponse({ ok: true, context: getSelectedText() });
  return true;
});
