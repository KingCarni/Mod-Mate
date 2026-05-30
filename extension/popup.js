const MESSAGE_GET_SELECTED_CONTEXT = "MOD_MATE_GET_SELECTED_CONTEXT";

const companionTemplates = [
  {
    id: "general-review",
    label: "General Review Companion",
    description: "Balanced review for risks, missing context, and next steps.",
    prompt: "Review the selected text and flag the most important risks, missing context, and next steps.",
  },
  {
    id: "writing-story",
    label: "Writing / Story Companion",
    description: "Story, tone, continuity, scene clarity, and character motivation.",
    prompt: "Review the selected writing for tone, continuity, character motivation, unclear setup/payoff, and useful revision notes.",
  },
  {
    id: "qa-triage",
    label: "QA Triage Companion",
    description: "Bug reports, repro gaps, risk, coverage, and release-readiness notes.",
    prompt: "Review the selected QA/workflow text. Separate confirmed facts, assumptions, risks, missing repro details, and recommended test coverage.",
  },
  {
    id: "docs-support",
    label: "Docs / Support Companion",
    description: "Documentation clarity, support answers, setup gaps, and user blockers.",
    prompt: "Review the selected documentation or support text. Flag unclear steps, missing prerequisites, likely user confusion, and a clearer answer.",
  },
  {
    id: "product-feedback",
    label: "Product Feedback Companion",
    description: "UX friction, product risks, customer impact, and next experiments.",
    prompt: "Review the selected product feedback. Identify user pain, likely root causes, product risk, and the next practical follow-up.",
  },
];

const elements = {
  status: document.getElementById("status"),
  baseUrl: document.getElementById("baseUrl"),
  saveUrl: document.getElementById("saveUrl"),
  companionTemplate: document.getElementById("companionTemplate"),
  templateDescription: document.getElementById("templateDescription"),
  pageTitle: document.getElementById("pageTitle"),
  pageUrl: document.getElementById("pageUrl"),
  selectedText: document.getElementById("selectedText"),
  promptDraft: document.getElementById("promptDraft"),
  refreshContext: document.getElementById("refreshContext"),
  askCompanion: document.getElementById("askCompanion"),
  copyContext: document.getElementById("copyContext"),
  copyAnswer: document.getElementById("copyAnswer"),
  openPreview: document.getElementById("openPreview"),
  answerCard: document.getElementById("answerCard"),
  answerMeta: document.getElementById("answerMeta"),
  answerOutput: document.getElementById("answerOutput"),
};

let currentContext = null;
let currentTemplate = companionTemplates[0];
let currentAnswer = "";

const setStatus = (message, type = "") => {
  elements.status.textContent = message;
  elements.status.className = `notice ${type}`.trim();
};

const getActiveTab = async () => {
  const tabs = await chrome.tabs.query({ active: true, currentWindow: true });
  return tabs[0] || null;
};

const renderTemplateOptions = () => {
  elements.companionTemplate.innerHTML = companionTemplates
    .map((template) => `<option value="${template.id}">${template.label}</option>`)
    .join("");
};

const applyTemplate = (templateId, options = { updatePrompt: true }) => {
  currentTemplate = companionTemplates.find((template) => template.id === templateId) || companionTemplates[0];
  elements.companionTemplate.value = currentTemplate.id;
  elements.templateDescription.textContent = currentTemplate.description;
  if (options.updatePrompt) elements.promptDraft.value = currentTemplate.prompt;
};

const loadSettings = async () => {
  renderTemplateOptions();
  const stored = await chrome.storage.local.get(["modMateBaseUrl", "modMateCompanionTemplate"]);
  elements.baseUrl.value = stored.modMateBaseUrl || "http://localhost:3000";
  applyTemplate(stored.modMateCompanionTemplate || "general-review", { updatePrompt: true });
};

const saveSettings = async () => {
  const value = elements.baseUrl.value.trim() || "http://localhost:3000";
  await chrome.storage.local.set({
    modMateBaseUrl: value.replace(/\/$/, ""),
    modMateCompanionTemplate: currentTemplate.id,
  });
  elements.baseUrl.value = value.replace(/\/$/, "");
  setStatus("Saved extension options.", "success");
};

const renderContext = (context) => {
  currentContext = context;
  elements.pageTitle.textContent = context.title || "Untitled page";
  elements.pageUrl.textContent = context.topUrl || context.url || "";
  elements.selectedText.value = context.selectedText || "";

  if (context.selectedText) {
    const source = context.captureMethod === "context-menu" ? " from right-click menu" : context.captureMethod === "direct-injection" ? " from page capture" : "";
    setStatus(`Selected text captured${source}. No page data was sent automatically.`, "success");
    elements.copyContext.disabled = false;
    elements.askCompanion.disabled = false;
  } else {
    setStatus("No selected text found. Try clicking Refresh selection, or right-click selected text and choose Send selection to Mod-Mate.", "error");
    elements.copyContext.disabled = true;
    elements.askCompanion.disabled = true;
  }
};

const renderAnswer = (payload) => {
  currentAnswer = payload.answer || "";
  elements.answerCard.hidden = false;
  elements.answerMeta.textContent = `Provider: ${payload.provider || "unknown"} · ${currentTemplate.label}`;
  elements.answerOutput.textContent = currentAnswer;
  elements.copyAnswer.disabled = !currentAnswer;
};

const loadContextMenuSelection = async () => {
  const stored = await chrome.storage.local.get(["modMateContextMenuSelection"]);
  const selection = stored.modMateContextMenuSelection;
  if (selection?.selectedText) return selection;
  return null;
};

const runDirectSelectionCapture = async (tab) => {
  if (!tab?.id || !chrome.scripting?.executeScript) return null;

  const results = await chrome.scripting.executeScript({
    target: { tabId: tab.id, allFrames: true },
    func: () => {
      const getSelectedFromElement = () => {
        const active = document.activeElement;
        if (!active) return "";
        const tagName = active.tagName?.toLowerCase();
        if ((tagName === "textarea" || tagName === "input") && typeof active.value === "string") {
          const start = typeof active.selectionStart === "number" ? active.selectionStart : 0;
          const end = typeof active.selectionEnd === "number" ? active.selectionEnd : 0;
          return end > start ? active.value.slice(start, end).trim() : "";
        }
        if (active.isContentEditable) {
          return window.getSelection()?.toString().trim() || active.textContent?.trim() || "";
        }
        return "";
      };

      const selectionText = window.getSelection()?.toString().trim() || getSelectedFromElement();
      return {
        selectedText: selectionText,
        title: document.title || "Untitled page",
        url: window.location.href,
        topUrl: window.location.href,
        host: window.location.host,
        frameUrl: window.location.href,
        capturedAt: new Date().toISOString(),
        captureMethod: "direct-injection",
      };
    },
  });

  const contexts = results.map((result) => result.result).filter(Boolean);
  return contexts.find((context) => context.selectedText) || null;
};

const requestSelectedContext = async () => {
  const tab = await getActiveTab();
  if (!tab?.id) {
    setStatus("Could not find the active tab.", "error");
    return;
  }

  try {
    const directContext = await runDirectSelectionCapture(tab);
    if (directContext?.selectedText) {
      renderContext({
        ...directContext,
        title: directContext.title || tab.title || "Untitled page",
        url: directContext.topUrl || directContext.url || tab.url || "",
      });
      return;
    }
  } catch {
    // Direct injection can fail on restricted pages. Fall through to content-script/context-menu paths.
  }

  try {
    const frames = await chrome.webNavigation?.getAllFrames?.({ tabId: tab.id });
    const frameIds = Array.isArray(frames) ? frames.map((frame) => frame.frameId) : [0];
    const responses = await Promise.allSettled(
      frameIds.map((frameId) => chrome.tabs.sendMessage(tab.id, { type: MESSAGE_GET_SELECTED_CONTEXT }, { frameId })),
    );
    const successful = responses
      .filter((result) => result.status === "fulfilled" && result.value?.ok)
      .map((result) => result.value.context)
      .filter(Boolean);
    const selected = successful.find((context) => context.selectedText) || successful[0];
    if (selected?.selectedText) {
      renderContext({
        ...selected,
        title: selected.title || tab.title || "Untitled page",
        url: selected.topUrl || selected.url || tab.url || "",
      });
      return;
    }

    const contextMenuSelection = await loadContextMenuSelection();
    if (contextMenuSelection?.selectedText) {
      renderContext(contextMenuSelection);
      return;
    }

    if (!selected) throw new Error("No content-script response.");
    renderContext({
      ...selected,
      title: selected.title || tab.title || "Untitled page",
      url: selected.topUrl || selected.url || tab.url || "",
    });
  } catch (error) {
    const contextMenuSelection = await loadContextMenuSelection();
    if (contextMenuSelection?.selectedText) {
      renderContext(contextMenuSelection);
      return;
    }

    setStatus("Could not read selection. Try right-clicking selected text and choosing Send selection to Mod-Mate.", "error");
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
  companionTemplate: {
    id: currentTemplate.id,
    label: currentTemplate.label,
    description: currentTemplate.description,
  },
  page: {
    title: currentContext?.title || "Untitled page",
    url: currentContext?.topUrl || currentContext?.url || "",
    host: currentContext?.host || "",
    frameUrl: currentContext?.frameUrl || "",
  },
  selectedText: elements.selectedText.value.trim(),
  prompt: elements.promptDraft.value.trim(),
  privacy: {
    captureMode: currentContext?.captureMethod || "explicit-selection-only",
    silentScraping: false,
    writeBack: false,
  },
});

const copyContext = async () => {
  const payload = buildContextPayload();
  await navigator.clipboard.writeText(JSON.stringify(payload, null, 2));
  setStatus(`Copied context for ${currentTemplate.label}.`, "success");
};

const askCompanion = async () => {
  const selectedText = elements.selectedText.value.trim();
  if (!selectedText) {
    setStatus("Select text before asking the companion.", "error");
    return;
  }

  const baseUrl = (elements.baseUrl.value.trim() || "http://localhost:3000").replace(/\/$/, "");
  const payload = buildContextPayload();

  elements.askCompanion.disabled = true;
  setStatus(`Asking ${currentTemplate.label}...`, "success");

  try {
    const response = await fetch(`${baseUrl}/api/extension/ask`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.error || "Companion request failed.");
    renderAnswer(data);
    setStatus(`Answer ready from ${data.provider || "companion"}.`, "success");
  } catch (error) {
    setStatus(error instanceof Error ? error.message : "Companion request failed.", "error");
  } finally {
    elements.askCompanion.disabled = false;
  }
};

const copyAnswer = async () => {
  if (!currentAnswer) {
    setStatus("No companion answer to copy yet.", "error");
    return;
  }
  await navigator.clipboard.writeText(currentAnswer);
  setStatus("Copied companion answer.", "success");
};

const openSidePanelPreview = async () => {
  const baseUrl = (elements.baseUrl.value.trim() || "http://localhost:3000").replace(/\/$/, "");
  await chrome.storage.local.set({
    modMateBaseUrl: baseUrl,
    modMateCompanionTemplate: currentTemplate.id,
  });
  const params = new URLSearchParams({
    source: "extension",
    template: currentTemplate.id,
  });
  const url = `${baseUrl}/integrations/side-panel-preview?${params.toString()}`;
  await chrome.tabs.create({ url });
};

elements.saveUrl.addEventListener("click", saveSettings);
elements.companionTemplate.addEventListener("change", async (event) => {
  applyTemplate(event.target.value, { updatePrompt: true });
  await chrome.storage.local.set({ modMateCompanionTemplate: currentTemplate.id });
  setStatus(`Using ${currentTemplate.label}.`, "success");
});
elements.refreshContext.addEventListener("click", requestSelectedContext);
elements.askCompanion.addEventListener("click", askCompanion);
elements.copyContext.addEventListener("click", copyContext);
elements.copyAnswer.addEventListener("click", copyAnswer);
elements.openPreview.addEventListener("click", openSidePanelPreview);

elements.copyContext.disabled = true;
elements.copyAnswer.disabled = true;
elements.askCompanion.disabled = true;

loadSettings().then(requestSelectedContext).catch(() => {
  setStatus("Extension popup failed to initialize.", "error");
});
