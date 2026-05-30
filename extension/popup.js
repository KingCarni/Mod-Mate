const MESSAGE_GET_SELECTED_CONTEXT = "MOD_MATE_GET_SELECTED_CONTEXT";

const elements = {
  status: document.getElementById("status"),
  baseUrl: document.getElementById("baseUrl"),
  saveUrl: document.getElementById("saveUrl"),
  pageTitle: document.getElementById("pageTitle"),
  pageUrl: document.getElementById("pageUrl"),
  selectedText: document.getElementById("selectedText"),
  promptDraft: document.getElementById("promptDraft"),
  refreshContext: document.getElementById("refreshContext"),
  copyContext: document.getElementById("copyContext"),
  openPreview: document.getElementById("openPreview"),
};

let currentContext = null;

const setStatus = (message, type = "") => {
  elements.status.textContent = message;
  elements.status.className = `notice ${type}`.trim();
};

const getActiveTab = async () => {
  const tabs = await chrome.tabs.query({ active: true, currentWindow: true });
  return tabs[0] || null;
};

const loadSettings = async () => {
  const stored = await chrome.storage.local.get(["modMateBaseUrl"]);
  elements.baseUrl.value = stored.modMateBaseUrl || "http://localhost:3000";
};

const saveSettings = async () => {
  const value = elements.baseUrl.value.trim() || "http://localhost:3000";
  await chrome.storage.local.set({ modMateBaseUrl: value.replace(/\/$/, "") });
  elements.baseUrl.value = value.replace(/\/$/, "");
  setStatus("Saved Mod-Mate URL.", "success");
};

const renderContext = (context) => {
  currentContext = context;
  elements.pageTitle.textContent = context.title || "Untitled page";
  elements.pageUrl.textContent = context.url || "";
  elements.selectedText.value = context.selectedText || "";

  if (context.selectedText) {
    setStatus("Selected text captured. No page data was sent automatically.", "success");
    elements.copyContext.disabled = false;
  } else {
    setStatus("No selected text found. Highlight text on the page and refresh.", "error");
    elements.copyContext.disabled = true;
  }
};

const requestSelectedContext = async () => {
  const tab = await getActiveTab();
  if (!tab?.id) {
    setStatus("Could not find the active tab.", "error");
    return;
  }

  try {
    const response = await chrome.tabs.sendMessage(tab.id, { type: MESSAGE_GET_SELECTED_CONTEXT });
    if (!response?.ok) throw new Error("No content-script response.");
    renderContext(response.context);
  } catch (error) {
    setStatus("Could not read the selection on this page. Try refreshing the tab, then open the popup again.", "error");
    currentContext = {
      title: tab.title || "Untitled page",
      url: tab.url || "",
      selectedText: "",
    };
    renderContext(currentContext);
  }
};

const buildContextPayload = () => ({
  source: "mod-mate-browser-extension-mvp",
  capturedAt: new Date().toISOString(),
  page: {
    title: currentContext?.title || "Untitled page",
    url: currentContext?.url || "",
    host: currentContext?.host || "",
  },
  selectedText: elements.selectedText.value.trim(),
  prompt: elements.promptDraft.value.trim(),
  privacy: {
    captureMode: "explicit-selection-only",
    silentScraping: false,
    writeBack: false,
  },
});

const copyContext = async () => {
  const payload = buildContextPayload();
  await navigator.clipboard.writeText(JSON.stringify(payload, null, 2));
  setStatus("Copied selected-text context JSON.", "success");
};

const openSidePanelPreview = async () => {
  const baseUrl = (elements.baseUrl.value.trim() || "http://localhost:3000").replace(/\/$/, "");
  await chrome.storage.local.set({ modMateBaseUrl: baseUrl });
  const url = `${baseUrl}/integrations/side-panel-preview?source=extension`;
  await chrome.tabs.create({ url });
};

elements.saveUrl.addEventListener("click", saveSettings);
elements.refreshContext.addEventListener("click", requestSelectedContext);
elements.copyContext.addEventListener("click", copyContext);
elements.openPreview.addEventListener("click", openSidePanelPreview);

elements.copyContext.disabled = true;

loadSettings().then(requestSelectedContext).catch(() => {
  setStatus("Extension popup failed to initialize.", "error");
});
