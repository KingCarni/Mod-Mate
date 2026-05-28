import React, { useState, useRef, useEffect } from "react";
import {
  Send,
  RotateCcw,
  Download,
  ChevronDown,
  Sparkles,
  Layers,
  Shield,
  Info,
} from "lucide-react";
import AppShell from "@/components/layout/AppShell";
import SectionCard from "@/components/mate/SectionCard";
import Badge from "@/components/mate/Badge";
import { companions, sampleChat, builderRules, memoryCategories } from "@/data/mockData";

const Playground = () => {
  const [selected, setSelected] = useState(companions[0]);
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState(sampleChat);
  const [draft, setDraft] = useState("");
  const endRef = useRef(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const send = () => {
    if (!draft.trim()) return;
    const userMsg = {
      id: messages.length + 1,
      role: "user",
      content: draft.trim(),
    };
    const stub = {
      id: messages.length + 2,
      role: "assistant",
      content:
        "Based on the companion profile and the context provided, I'd focus this companion on concise, context-aware guidance. (Mock response — no real model call.)",
    };
    setMessages([...messages, userMsg, stub]);
    setDraft("");
  };

  const reset = () => setMessages(sampleChat);

  return (
    <AppShell>
      <div data-testid="playground-page" className="space-y-6">
        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-4">
          <div>
            <p className="eyebrow">Playground</p>
            <h1 className="font-heading text-3xl md:text-4xl font-medium tracking-tight mt-2">
              Test the companion before anyone else does.
            </h1>
            <p className="text-sm text-muted-foreground mt-2 max-w-2xl">
              Sample messages only — no real model calls in this preview.
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
              data-testid="playground-export"
              className="inline-flex items-center gap-1.5 rounded-full bg-white border border-border px-4 py-2 text-sm hover:bg-muted"
            >
              <Download className="h-4 w-4" /> Export profile
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-[1fr,320px] gap-6">
          {/* Chat */}
          <div className="surface-card flex flex-col h-[72vh] min-h-[520px]">
            {/* Companion picker */}
            <div className="p-4 border-b border-border flex items-center justify-between gap-3">
              <div className="relative">
                <button
                  type="button"
                  onClick={() => setOpen((v) => !v)}
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
                  {companions.map((c) => (
                    <button
                      key={c.id}
                      type="button"
                      onClick={() => {
                        setSelected(c);
                        setOpen(false);
                      }}
                      data-testid={`companion-option-${c.id}`}
                      className={`flex items-center gap-3 w-full rounded-xl px-3 py-2 text-left text-sm hover:bg-muted ${
                        selected.id === c.id ? "bg-muted" : ""
                      }`}
                    >
                      <span className="h-7 w-7 rounded-lg bg-muted flex items-center justify-center text-[11px] font-medium">
                        {c.initials}
                      </span>
                      <span className="flex-1">
                        <span className="block font-medium text-sm">{c.name}</span>
                        <span className="block text-xs text-muted-foreground">{c.category}</span>
                      </span>
                      <Badge tone="neutral">{c.status}</Badge>
                    </button>
                  ))}
                </div>
              )}
              </div>
              <Badge tone="sage" data-testid="playground-status">{selected.status}</Badge>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-auto p-6 space-y-4" data-testid="playground-messages">
              {messages.map((m) => {
                if (m.role === "system") {
                  return (
                    <div
                      key={m.id}
                      className="text-center text-[11px] uppercase tracking-widest text-muted-foreground"
                      data-testid={`msg-system-${m.id}`}
                    >
                      {m.content}
                    </div>
                  );
                }
                const isUser = m.role === "user";
                return (
                  <div
                    key={m.id}
                    data-testid={`msg-${m.role}-${m.id}`}
                    className={`flex ${isUser ? "justify-end" : "justify-start"}`}
                  >
                    <div
                      className={`max-w-[78%] px-4 py-3 text-sm leading-relaxed ${
                        isUser
                          ? "bg-primary text-primary-foreground rounded-2xl rounded-tr-sm"
                          : "bg-muted text-foreground rounded-2xl rounded-tl-sm"
                      }`}
                    >
                      {m.content}
                    </div>
                  </div>
                );
              })}
              <div ref={endRef} />
            </div>

            {/* Input */}
            <div className="p-4 border-t border-border">
              <div className="flex items-end gap-2">
                <textarea
                  value={draft}
                  onChange={(e) => setDraft(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && !e.shiftKey) {
                      e.preventDefault();
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
                Mock response only — wired to real models in a later pass.
              </p>
            </div>
          </div>

          {/* Context sidebar */}
          <aside className="space-y-5">
            <SectionCard eyebrow="Context packet" title="Sent with each message" testId="context-packet">
              <ul className="space-y-3 text-sm">
                <li className="flex items-start gap-2">
                  <Sparkles className="h-4 w-4 mt-0.5 text-secondary" />
                  <span>
                    <span className="block font-medium">Persona</span>
                    <span className="text-muted-foreground text-xs">Editorial · Concise</span>
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <Layers className="h-4 w-4 mt-0.5 text-accent-ochre" />
                  <span>
                    <span className="block font-medium">Memory</span>
                    <span className="text-muted-foreground text-xs">
                      {memoryCategories.length} categories loaded
                    </span>
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <Shield className="h-4 w-4 mt-0.5 text-accent-sage" />
                  <span>
                    <span className="block font-medium">Rules</span>
                    <span className="text-muted-foreground text-xs">
                      {builderRules.length} guardrails active
                    </span>
                  </span>
                </li>
              </ul>
            </SectionCard>

            <SectionCard eyebrow="Warnings" title="Metadata" testId="playground-warnings">
              <ul className="space-y-2 text-xs text-muted-foreground">
                <li className="flex items-start gap-2">
                  <Info className="h-3.5 w-3.5 mt-0.5" />
                  No real LLM call — responses are static placeholders.
                </li>
                <li className="flex items-start gap-2">
                  <Info className="h-3.5 w-3.5 mt-0.5" />
                  Memory categories are not persisted across reloads.
                </li>
                <li className="flex items-start gap-2">
                  <Info className="h-3.5 w-3.5 mt-0.5" />
                  Export is a UI placeholder.
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
