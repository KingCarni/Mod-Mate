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
import { builderRules, companions, memoryCategories, sampleChat } from "@/data/mockData";
import { createContextPacket, stringifyContextPacket, validateContextPacket } from "@/lib/contextPackets";
import type { ContextPacket } from "@/types/contextPacket";

type ChatMessage = {
  id: number;
  role: "system" | "user" | "assistant";
  content: string;
};

const createMockContextPacket = (companionName: string): ContextPacket =>
  createContextPacket({
    sourceApp: {
      id: "mod-mate-playground",
      name: "Mod-Mate Playground",
      version: "0.1.0",
      environment: "local",
    },
    projectId: "demo-workspace",
    activeTool: "playground",
    currentScreenContext:
      "User is testing a companion inside the Mod-Mate Playground with mock project context only.",
    selectedText:
      "The companion should answer using the active profile, visible context packet, and configured guardrails.",
    selectedEntity: {
      id: companionName.toLowerCase().replace(/[^a-z0-9]+/g, "-"),
      type: "companion-profile",
      label: companionName,
      value: "Selected companion profile for this playground test.",
    },
    memorySections: [
      {
        id: "project-facts",
        label: "Project facts",
        content: "This is a UI-only preview. No backend, auth, database, or model call is active yet.",
        priority: "high",
        source: "mock-playground",
      },
      {
        id: "rules",
        label: "Active guardrails",
        content: builderRules.join("\n"),
        priority: "normal",
        source: "builder-defaults",
      },
      {
        id: "memory-categories",
        label: "Memory categories",
        content: memoryCategories.map((category) => category.label).join(", "),
        priority: "normal",
        source: "mock-data",
      },
    ],
    warnings: [
      {
        id: "mock-runtime",
        level: "info",
        message: "No real LLM call — responses are static placeholders.",
      },
      {
        id: "local-context",
        level: "warning",
        message: "Context packet is mock-only and is not persisted or sent to a server yet.",
      },
    ],
    metadata: {
      runtimeMode: "mock",
      source: "playground-preview",
      selectedCompanion: companionName,
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
  });

const Playground = () => {
  const [selected, setSelected] = useState(companions[0]);
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>(sampleChat as ChatMessage[]);
  const [draft, setDraft] = useState("");
  const endRef = useRef<HTMLDivElement | null>(null);

  const contextPacket = useMemo(() => createMockContextPacket(selected.name), [selected.name]);
  const contextValidation = validateContextPacket(contextPacket);
  const contextJson = stringifyContextPacket(contextPacket);

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
      content:
        "Based on the companion profile and the standard context packet, I would answer using the visible screen context, memory sections, warnings, and action hints. (Mock response — no real model call.)",
    };
    setMessages([...messages, userMsg, stub]);
    setDraft("");
  };

  const reset = () => setMessages(sampleChat as ChatMessage[]);

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
              Sample messages only — now backed by the standard Mod-Mate context packet contract.
            </p>
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
                    <span className="block text-xs text-muted-foreground">{selected.category}</span>
                  </span>
                  <ChevronDown className="h-4 w-4 text-muted-foreground" />
                </button>

                {open && (
                  <div
                    className="absolute z-20 top-full left-0 mt-2 w-72 rounded-2xl border border-border bg-white shadow-lift p-1.5"
                    data-testid="companion-dropdown"
                  >
                    {companions.map((companion) => (
                      <button
                        key={companion.id}
                        type="button"
                        onClick={() => {
                          setSelected(companion);
                          setOpen(false);
                        }}
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
                          <span className="block text-xs text-muted-foreground">{companion.category}</span>
                        </span>
                        <Badge tone="neutral">{companion.status}</Badge>
                      </button>
                    ))}
                  </div>
                )}
              </div>
              <Badge tone="sage" data-testid="playground-status">
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
                Mock response only — future runtime calls will send profile + context packet + user message.
              </p>
            </div>
          </div>

          <aside className="space-y-5">
            <SectionCard eyebrow="Context packet" title="Sent with each message" testId="context-packet">
              <ul className="space-y-3 text-sm">
                <li className="flex items-start gap-2">
                  <Sparkles className="h-4 w-4 mt-0.5 text-secondary" />
                  <span>
                    <span className="block font-medium">Source app</span>
                    <span className="text-muted-foreground text-xs">{contextPacket.sourceApp.name}</span>
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
