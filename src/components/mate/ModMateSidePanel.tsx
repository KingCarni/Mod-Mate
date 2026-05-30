"use client";

import React, { type ReactNode, useState } from "react";
import { CheckCircle2, ChevronDown, PanelRight, Send, ShieldCheck, Sparkles } from "lucide-react";
import CompanionAvatar from "@/components/mate/CompanionAvatar";
import type { CompanionAvatar as CompanionAvatarMetadata } from "@/types/companionProfile";

type SidePanelMessage = {
  id: string;
  role: "user" | "assistant";
  content: string;
};

type SidePanelActionHint = {
  id: string;
  label: string;
  description: string;
  requiresConfirmation?: boolean;
};

type SidePanelContextSection = {
  id: string;
  label: string;
  detail: string;
};

type ModMateSidePanelProps = {
  companion: {
    name: string;
    category: string;
    status?: string;
    avatar?: CompanionAvatarMetadata;
  };
  hostApp: {
    name: string;
    surface: string;
    activeView: string;
  };
  contextSections: SidePanelContextSection[];
  messages: SidePanelMessage[];
  actionHints: SidePanelActionHint[];
  footer?: ReactNode;
};

const ModMateSidePanel = ({
  companion,
  hostApp,
  contextSections,
  messages,
  actionHints,
  footer,
}: ModMateSidePanelProps) => {
  const [contextOpen, setContextOpen] = useState(true);
  const [draft, setDraft] = useState("");

  return (
    <aside
      className="surface-card overflow-hidden flex h-[760px] max-h-[calc(100vh-8rem)] w-full max-w-[420px] flex-col shadow-soft"
      data-testid="modmate-side-panel"
    >
      <header className="border-b border-border bg-muted/35 px-5 py-4">
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-center gap-3 min-w-0">
            <CompanionAvatar name={companion.name} avatar={companion.avatar} size="md" />
            <div className="min-w-0">
              <p className="truncate font-heading text-lg font-medium leading-tight">{companion.name}</p>
              <p className="mt-0.5 text-xs text-muted-foreground">{companion.category}</p>
            </div>
          </div>
          <span className="rounded-full border border-accent-sage/40 bg-accent-sage/10 px-2.5 py-1 text-[11px] font-medium text-foreground">
            {companion.status ?? "Preview"}
          </span>
        </div>
        <div className="mt-4 grid grid-cols-2 gap-2 text-xs text-muted-foreground">
          <div className="rounded-xl border border-border bg-white/60 px-3 py-2 dark:bg-card">
            <span className="block font-medium text-foreground">Host</span>
            {hostApp.name}
          </div>
          <div className="rounded-xl border border-border bg-white/60 px-3 py-2 dark:bg-card">
            <span className="block font-medium text-foreground">Surface</span>
            {hostApp.surface}
          </div>
        </div>
      </header>

      <section className="border-b border-border px-5 py-4" data-testid="side-panel-context-summary">
        <button
          type="button"
          onClick={() => setContextOpen((value) => !value)}
          className="flex w-full items-center justify-between gap-3 text-left"
        >
          <span>
            <span className="eyebrow">Context loaded</span>
            <span className="mt-1 block text-sm font-medium text-foreground">{hostApp.activeView}</span>
          </span>
          <ChevronDown className={`h-4 w-4 text-muted-foreground transition-transform ${contextOpen ? "rotate-180" : ""}`} />
        </button>
        {contextOpen && (
          <div className="mt-3 space-y-2">
            {contextSections.map((section) => (
              <div key={section.id} className="rounded-xl border border-border bg-muted/30 px-3 py-2">
                <p className="text-xs font-medium text-foreground">{section.label}</p>
                <p className="mt-0.5 text-xs text-muted-foreground">{section.detail}</p>
              </div>
            ))}
          </div>
        )}
      </section>

      <div className="flex-1 space-y-3 overflow-auto px-5 py-4" data-testid="side-panel-messages">
        {messages.map((message) => (
          <article
            key={message.id}
            className={`rounded-2xl px-4 py-3 text-sm leading-relaxed ${
              message.role === "user"
                ? "ml-8 bg-primary text-primary-foreground"
                : "mr-8 border border-border bg-muted/40 text-foreground"
            }`}
          >
            {message.content}
          </article>
        ))}

        <div className="rounded-2xl border border-accent-sage/35 bg-accent-sage/10 p-4" data-testid="side-panel-actions">
          <div className="flex items-center gap-2">
            <ShieldCheck className="h-4 w-4 text-accent-sage" />
            <p className="text-sm font-medium">Confirm-first action hints</p>
          </div>
          <div className="mt-3 space-y-2">
            {actionHints.map((action) => (
              <div key={action.id} className="rounded-xl border border-border bg-white/70 px-3 py-2 dark:bg-card">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="text-xs font-medium text-foreground">{action.label}</p>
                    <p className="mt-0.5 text-xs text-muted-foreground">{action.description}</p>
                  </div>
                  {action.requiresConfirmation !== false && (
                    <span className="shrink-0 rounded-full bg-accent-ochre/20 px-2 py-0.5 text-[10px] font-semibold text-foreground">
                      Confirm
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <footer className="border-t border-border bg-muted/25 px-5 py-4">
        <div className="flex items-center gap-2 rounded-2xl border border-border bg-white p-2 dark:bg-card">
          <input
            value={draft}
            onChange={(event) => setDraft(event.target.value)}
            placeholder="Ask this companion..."
            className="min-w-0 flex-1 bg-transparent px-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none"
            data-testid="side-panel-input"
          />
          <button
            type="button"
            className="inline-flex h-9 w-9 items-center justify-center rounded-xl bg-primary text-primary-foreground"
            aria-label="Send preview message"
            data-testid="side-panel-send"
          >
            <Send className="h-4 w-4" />
          </button>
        </div>
        <div className="mt-3 flex items-center justify-between gap-3 text-xs text-muted-foreground">
          <span className="inline-flex items-center gap-1.5">
            <CheckCircle2 className="h-3.5 w-3.5 text-accent-sage" /> Preview only
          </span>
          <span className="inline-flex items-center gap-1.5">
            <PanelRight className="h-3.5 w-3.5" /> Host-owned context
          </span>
        </div>
        {footer}
      </footer>
    </aside>
  );
};

export default ModMateSidePanel;
export type { SidePanelActionHint, SidePanelContextSection, SidePanelMessage, ModMateSidePanelProps };
