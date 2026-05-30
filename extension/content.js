const MOD_MATE_EXTENSION_MESSAGE = "MOD_MATE_GET_SELECTED_CONTEXT";
const MOD_MATE_SELECTION_CACHE_KEY = "modMateLastSelection";

let lastSelectionContext = null;

const safeTopTitle = () => {
  try {
    return window.top?.document?.title || document.title || "Untitled page";
  } catch {
    return document.title || "Untitled page";
  }
};

const readSelectionFromDocument = () => {
  const selection = window.getSelection();
  const selectedText = selection ? selection.toString().trim() : "";

  return {
    selectedText,
    title: safeTopTitle(),
    url: window.location.href,
    topUrl: window.top === window ? window.location.href : document.referrer,
    host: window.location.host,
    frameUrl: window.location.href,
    capturedAt: new Date().toISOString(),
  };
};

const getFocusedEditableText = () => {
  const active = document.activeElement;
  if (!active) return "";

  const tagName = active.tagName?.toLowerCase();
  if (tagName === "textarea" || tagName === "input") {
    const input = active;
    const start = typeof input.selectionStart === "number" ? input.selectionStart : 0;
    const end = typeof input.selectionEnd === "number" ? input.selectionEnd : 0;
    if (end > start) return input.value.slice(start, end).trim();
  }

  if (active.isContentEditable) {
    const selection = window.getSelection();
    return selection ? selection.toString().trim() : "";
  }

  return "";
};

const cacheSelection = () => {
  const context = readSelectionFromDocument();
  const editableSelection = getFocusedEditableText();
  const selectedText = context.selectedText || editableSelection;

  if (!selectedText) return;

  lastSelectionContext = {
    ...context,
    selectedText,
  };

  try {
    sessionStorage.setItem(MOD_MATE_SELECTION_CACHE_KEY, JSON.stringify(lastSelectionContext));
  } catch {
    // sessionStorage can be unavailable in some frames. Runtime cache still helps.
  }
};

const loadCachedSelection = () => {
  if (lastSelectionContext?.selectedText) return lastSelectionContext;

  try {
    const raw = sessionStorage.getItem(MOD_MATE_SELECTION_CACHE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    if (typeof parsed?.selectedText === "string" && parsed.selectedText.trim()) return parsed;
  } catch {
    return null;
  }

  return null;
};

const getSelectedContext = () => {
  const liveContext = readSelectionFromDocument();
  const editableSelection = getFocusedEditableText();
  const selectedText = liveContext.selectedText || editableSelection;

  if (selectedText) {
    const context = { ...liveContext, selectedText };
    lastSelectionContext = context;
    return context;
  }

  const cached = loadCachedSelection();
  if (cached?.selectedText) return cached;

  return liveContext;
};

["selectionchange", "mouseup", "keyup", "pointerup", "touchend"].forEach((eventName) => {
  document.addEventListener(eventName, cacheSelection, true);
});

chrome.runtime.onMessage.addListener((message, _sender, sendResponse) => {
  if (message?.type !== MOD_MATE_EXTENSION_MESSAGE) return false;

  sendResponse({ ok: true, context: getSelectedContext() });
  return true;
});
