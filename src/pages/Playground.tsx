"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import {
  Send,
  RotateCcw,
  Download,
  ChevronDown,
  Sparkles,
  Layers,
  Shield,
  Info,
  FileJson,
} from "lucide-react";
import AppShell from "@/components/layout/AppShell";
import SectionCard from "@/components/mate/SectionCard";
import Badge from "@/components/mate/Badge";
import { builderRules, companions, memoryCategories } from "@/data/mockData";
import { createContextPacket, stringifyContextPacket, validateContextPacket } from "@/lib/contextPackets";
import {
  clearCompanionProfileLaunch,
  loadCompanionProfileDraft,
  loadCompanionProfileLaunch,
} from "@/lib/companionProfileStorage";
import type { ContextPacket } from "@/types/contextPacket";
import type { CompanionProfile } from "@/types/companionProfile";

type ChatMessage = {
  id: number;
  role: "system" | "user" | "assistant";
  content: string;
};

type PlaygroundCompanion = {
  id: string;
  name: string;
  category: string;
  status: string;
  initials: string;
  description?: string;
  source: "mock" | "local";
  profile?: CompanionProfile;
};

const STABLE_CONTEXT_PACKET_CREATED_AT = "2026-01-01T00:00:00.000Z";

const getInitials = (value: string) =>
  value
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join("") || "MM";

const toMockCompanion = (companion: (typeof companions)[number]): PlaygroundCompanion => ({
  ...companion,
  source: "mock",
});

const toLocalCompanion = (profile: CompanionProfile): PlaygroundCompanion => ({
  id: `local-${profile.id}`,
  name: profile.name,
  category: profile.category,
  status: "Local Draft",
  initials: getInitials(profile.name),
  description: profile.description,
  source: "local",
  profile,
});

const getCompanionRules = (companion: PlaygroundCompanion) =>
  companion.profile?.systemRules?.length ? companion.profile.systemRules : builderRules;

const getCompanionMemoryLabels = (companion: PlaygroundCompanion) => {
  if (companion.profile?.memoryCategories?.length) {
    return companion.profile.memoryCategories
      .filter((category) => category.enabled)
      .map((category) => category.label);
  }

  return memoryCategories.map((category) => category.label);
};

const createInitialMessages = (companion: PlaygroundCompanion): ChatMessage[] => {
  const memoryCount = getCompanionMemoryLabels(companion).length;
  const ruleCount = getCompanionRules(companion).length;

  return [
    {
      id: 1,
      role: "system",
      content: `Companion: ${companion.name} · Memory loaded: ${memoryCount} categories · Rules: ${ruleCount}`,
    },
    {
      id: 2,
      role: "user",
      content:
        "Here's the cold open for act one. Does the tone match the rest of the script and the character bible?",
    },
    {
      id: 3,
      role: "assistant",
      content:
        companion.source === "local"
          ? `Using your saved local profile for ${companion.name}, I would check the current scene against its configured role, tone, memory categories, and guardrails. (Mock response — no real model call.)`
          : "Based on the companion profile and the context provided, I'd focus this companion on concise, context-aware guidance. The current rule set is clear, but you may want to add one guardrail about not inventing missing project facts.",
    },
  ];
};

const createMockContextPacket = (companion: PlaygroundCompanion): ContextPacket => {
  const rules = getCompanionRules(companion);
  const memoryLabels = getCompanionMemoryLabels(companion);
  const persona = companion.profile?.persona;

  return createContextPacket({
    sourceApp: {
      id: "mod-mate-playground",
      name: "Mod-Mate Playground",
      version: "0.1.0",
      environment: "local",
    },
    projectId: "demo-workspace",
    activeTool: "playground",
    currentScreenContext:
      companion.source === "local"
        ? "User is testing a saved local companion profile inside the Mod-Mate Playground. The profile came from browser storage."
        : "User is testing a mock companion inside the Mod-Mate Playground with mock project context only.",
    selectedText:
      "The companion should answer using the active profile, visible context packet, and configured guardrails.",
    selectedEntity: {
      id: companion.id,
      type: companion.source === "local" ? "local-companion-profile" : "mock-companion-profile",
      label: companion.name,
      value: companion.description ?? "Selected companion profile for this playground test.",
      metadata: {
        category: companion.category,
        status: companion.status,
        source: companion.source,
      },
    },
    memorySections: [
      {
        id: "project-facts",
        label: "Project facts",
        content:
          companion.source === "local"
            ? "This playground is using a saved local Builder profile. No backend, auth, database, or model call is active yet."
            : "This is a UI-only preview. No backend, auth, database, or model call is active yet.",
        priority: "high",
        source: companion.source === "local" ? "local-builder-draft" : "mock-playground",
      },
      {
        id: "rules",
        label: "Active guardrails",
        content: rules.join("\n"),
        priority: "normal",
        source: companion.source === "local" ? "saved-profile" : "builder-defaults",
      },
      {
        id: "memory-categories",
        label: "Memory categories",
        content: memoryLabels.join(", "),
        priority: "normal",
        source: companion.source === "local" ? "saved-profile" : "mock-data",
      },
      {
        id: "persona",
        label: "Persona",
        content: persona
          ? `${persona.role} · ${persona.tone} · ${persona.responseStyle}`
          : `${companion.category} companion · mock profile`,
        priority: "normal",
        source: companion.source === "local" ? "saved-profile" : "mock-data",
      },
    ],
    warnings: [
      {
        id: "mock-runtime",
        level: "info",
        message: "No real LLM call — responses are static placeholders.",
      },
      {
        id: companion.source === "local" ? "local-draft" : "local-context",
        level: "warning",
        message:
          companion.source === "local"
            ? "Using browser-local saved profile only. This is not synced to an account or database yet."
            : "Context packet is mock-only and is not persisted or sent to a server yet.",
      },
    ],
    metadata: {
      runtimeMode: "mock",
      source: "playground-preview",
      selectedCompanion: companion.name,
      companionSource: companion.source,
      profileSchemaVersion: companion.profile?.schemaVersion,
    },
    actionHints: [
      {
        id: "copy-response",
        label: "Copy response",
        kind: "copy-to-clipboard",
        description: "Future host apps may expose safe response actions.",
      },
      {
        id: "export-to-memory",
        label: "Export useful detail to memory",
        kind: "export-to-memory",
        description: "Future action hint for saving useful facts with confirmation.",
      },
    ],
    createdAt: companion.profile?.updatedAt ?? STABLE_CONTEXT_PACKET_CREATED_AT,
  });
};

const mockCompanionOptions = companions.map(toMockCompanion);

const Playground = () => {
  const [localCompanion, setLocalCompanion] = useState<PlaygroundCompanion | null>(null);
  const [selected, setSelected] = useState<PlaygroundCompanion>(mockCompanionOptions[0]);
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>(() => createInitialMessages(mockCompanionOptions[0]));
  const [draft, setDraft] = useState("");
  const [loadNotice, setLoadNotice] = useState<string | null>(null);
  const endRef = useRef<HTMLDivElement | null>(null);

  const companionOptions = useMemo(
    () => (localCompanion ? [localCompanion, ...mockCompanionOptions] : mockCompanionOptions),
    [localCompanion],
  );

  const contextPacket = useMemo(() => createMockContextPacket(selected), [selected]);
  const contextValidation = validateContextPacket(contextPacket);
  const contextJson = stringifyContextPacket(contextPacket);

  useEffect(() => {
    const launched = loadCompanionProfileLaunch();
    const stored = launched.ok === true ? launched : loadCompanionProfileDraft();

    if (stored.ok === true) {
      const savedCompanion = toLocalCompanion(stored.profile);
      setLocalCompanion(savedCompanion);
      setSelected(savedCompanion);
      setMessages(createInitialMessages(savedCompanion));
      setLoadNotice(
        launched.ok === true
          ? `Loaded launch draft: ${savedCompanion.name}.`
          : `Loaded saved local draft: ${savedCompanion.name}.`,
      );
      if (launched.ok === true) clearCompanionProfileLaunch();
    } else if (stored.ok === false) {
      setLoadNotice(`Saved local draft could not load: ${stored.errors.slice(0, 2).join(" ")}`);
    }
  }, []);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const send = () => {
    if (!draft.trim()) return;
    const userMsg: ChatMessage = {
      id: messages.length + 1,
      role: "user",
      content: draft.trim(),
    };
    const stub: ChatMessage = {
      id: messages.length + 2,
      role: "assistant",
      content: `Using ${selected.name} (${selected.source === "local" ? "your saved local draft" : "mock profile"}) and the standard context packet, I would answer with ${contextPacket.memorySections.length} memory sections and ${getCompanionRules(selected).length} guardrails available. (Mock response — no real model call.)`,
    };
    setMessages([...messages, userMsg, stub]);
    setDraft("");
  };

  const reset = () => setMessages(createInitialMessages(selected));

  const exportContextPacket = () => {
    const blob = new Blob([contextJson], { type: "application/json;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "mod-mate-context-packet.json";
    document.body.appendChild(link);
    link.click();
    link.remove();
    URL.revokeObjectURL(url);
  };

  const selectCompanion = (companion: PlaygroundCompanion) => {
    setSelected(companion);
    setMessages(createInitialMessages(companion));
    setOpen(false);
  };

  return (
    <AppShell>
      <div data-testid="playground-page" className="space-y-6">
        <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-4">
          <div>
            <p className="eyebrow">Playground</p>
            <h1 className="font-heading text-3xl md:text-4xl font-medium tracking-tight mt-2">
              Test the companion before anyone else does.
            </h1>
            <p className="text-sm text-muted-foreground mt-2 max-w-2xl">
              Sample messages only — now using saved Builder profiles plus the standard context packet contract.
            </p>
            {loadNotice && (
              <p className="mt-2 text-xs text-muted-foreground" data-testid="playground-load-notice">
                {loadNotice}
              </p>
            )}
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={reset}
              data-testid="playground-reset"
              className="inline-flex items-center gap-1.5 rounded-full bg-white border border-border px-4 py-2 text-sm hover:bg-muted"
            >
              <RotateCcw className="h-4 w-4" /> Reset chat
            </button>
            <button
              type="button"
              onClick={exportContextPacket}
              data-testid="playground-export-context"
              className="inline-flex items-center gap-1.5 rounded-full bg-white border border-border px-4 py-2 text-sm hover:bg-muted"
            >
              <Download className="h-4 w-4" /> Export context
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-[1fr,360px] gap-6">
          <div className="surface-card flex flex-col h-[72vh] min-h-[520px]">
            <div className="p-4 border-b border-border flex items-center justify-between gap-3">
              <div className="relative">
                <button
                  type="button"
                  onClick={() => setOpen((value) => !value)}
                  data-testid="playground-companion-picker"
                  className="flex items-center gap-3 rounded-xl px-3 py-2 hover:bg-muted"
                >
                  <span className="h-9 w-9 rounded-xl bg-accent-ochre/25 text-[#7B5A1F] flex items-center justify-center font-heading text-sm font-medium">
                    {selected.initials}
                  </span>
                  <span className="text-left">
                    <span className="block text-sm font-medium leading-tight">{selected.name}</span>
                    <span className="block text-xs text-muted-foreground">
                      {selected.category} · {selected.source === "local" ? "Saved local draft" : "Mock template"}
                    </span>
                  </span>
                  <ChevronDown className="h-4 w-4 text-muted-foreground" />
                </button>

                {open && (
                  <div
                    className="absolute z-20 top-full left-0 mt-2 w-80 rounded-2xl border border-border bg-white shadow-lift p-1.5"
                    data-testid="companion-dropdown"
                  >
                    {companionOptions.map((companion) => (
                      <button
                        key={companion.id}
                        type="button"
                        onClick={() => selectCompanion(companion)}
                        data-testid={`companion-option-${companion.id}`}
                        className={`flex items-center gap-3 w-full rounded-xl px-3 py-2 text-left text-sm hover:bg-muted ${
                          selected.id === companion.id ? "bg-muted" : ""
                        }`}
                      >
                        <span className="h-7 w-7 rounded-lg bg-muted flex items-center justify-center text-[11px] font-medium">
                          {companion.initials}
                        </span>
                        <span className="flex-1">
                          <span className="block font-medium text-sm">{companion.name}</span>
                          <span className="block text-xs text-muted-foreground">
                            {companion.category} · {companion.source === "local" ? "Saved local draft" : "Mock template"}
                          </span>
                        </span>
                        <Badge tone={companion.source === "local" ? "sage" : "neutral"}>{companion.status}</Badge>
                      </button>
                    ))}
                  </div>
                )}
              </div>
              <Badge tone={selected.source === "local" ? "sage" : "neutral"} data-testid="playground-status">
                {selected.status}
              </Badge>
            </div>

            <div className="flex-1 overflow-auto p-6 space-y-4" data-testid="playground-messages">
              {messages.map((message) => {
                if (message.role === "system") {
                  return (
                    <div
                      key={message.id}
                      className="text-center text-[11px] uppercase tracking-widest text-muted-foreground"
                      data-testid={`msg-system-${message.id}`}
                    >
                      {message.content}
                    </div>
                  );
                }
                const isUser = message.role === "user";
                return (
                  <div
                    key={message.id}
                    data-testid={`msg-${message.role}-${message.id}`}
                    className={`flex ${isUser ? "justify-end" : "justify-start"}`}
                  >
                    <div
                      className={`max-w-[78%] px-4 py-3 text-sm leading-relaxed ${
                        isUser
                          ? "bg-primary text-primary-foreground rounded-2xl rounded-tr-sm"
                          : "bg-muted text-foreground rounded-2xl rounded-tl-sm"
                      }`}
                    >
                      {message.content}
                    </div>
                  </div>
                );
              })}
              <div ref={endRef} />
            </div>

            <div className="p-4 border-t border-border">
              <div className="flex items-end gap-2">
                <textarea
                  value={draft}
                  onChange={(event) => setDraft(event.target.value)}
                  onKeyDown={(event) => {
                    if (event.key === "Enter" && !event.shiftKey) {
                      event.preventDefault();
                      send();
                    }
                  }}
                  rows={1}
                  placeholder={`Message ${selected.name}…`}
                  data-testid="playground-input"
                  className="flex-1 resize-none rounded-2xl border border-border bg-white px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
                />
                <button
                  type="button"
                  onClick={send}
                  data-testid="playground-send"
                  className="inline-flex items-center gap-1.5 rounded-full bg-primary text-primary-foreground px-4 py-2.5 text-sm font-medium hover:-translate-y-0.5 hover:shadow-lift transition-all"
                >
                  <Send className="h-4 w-4" /> Send
                </button>
              </div>
              <p className="mt-2 text-[11px] text-muted-foreground">
                Mock response only — future runtime calls will send saved profile + context packet + user message.
              </p>
            </div>
          </div>

          <aside className="space-y-5">
            <SectionCard eyebrow="Context packet" title="Sent with each message" testId="context-packet">
              <ul className="space-y-3 text-sm">
                <li className="flex items-start gap-2">
                  <Sparkles className="h-4 w-4 mt-0.5 text-secondary" />
                  <span>
                    <span className="block font-medium">Companion source</span>
                    <span className="text-muted-foreground text-xs">
                      {selected.source === "local" ? "Saved local Builder draft" : "Mock template"}
                    </span>
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <Layers className="h-4 w-4 mt-0.5 text-accent-ochre" />
                  <span>
                    <span className="block font-medium">Memory sections</span>
                    <span className="text-muted-foreground text-xs">
                      {contextPacket.memorySections.length} sections attached
                    </span>
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <Shield className="h-4 w-4 mt-0.5 text-accent-sage" />
                  <span>
                    <span className="block font-medium">Validation</span>
                    <span className="text-muted-foreground text-xs">
                      {contextValidation.ok ? "Context packet valid" : contextValidation.errors[0]}
                    </span>
                  </span>
                </li>
              </ul>
            </SectionCard>

            <SectionCard eyebrow="Packet JSON" title="Context preview" testId="context-packet-json">
              <div className="rounded-xl bg-primary text-primary-foreground p-4 max-h-[340px] overflow-auto">
                <pre className="text-[11px] leading-relaxed mono whitespace-pre-wrap" data-testid="context-packet-pre">
                  {contextJson}
                </pre>
              </div>
            </SectionCard>

            <SectionCard eyebrow="Warnings" title="Metadata" testId="playground-warnings">
              <ul className="space-y-2 text-xs text-muted-foreground">
                {contextPacket.warnings.map((warning) => (
                  <li key={warning.id} className="flex items-start gap-2">
                    <Info className="h-3.5 w-3.5 mt-0.5" />
                    {warning.message}
                  </li>
                ))}
                <li className="flex items-start gap-2">
                  <FileJson className="h-3.5 w-3.5 mt-0.5" />
                  Context packet contract is typed and validated, but still mock-only.
                </li>
              </ul>
            </SectionCard>
          </aside>
        </div>
      </div>
    </AppShell>
  );
};

export default Playground;
