"use client";

import React from "react";
import { ArrowLeft, CheckCircle2, Code2, PanelRight, ShieldCheck } from "lucide-react";
import { Link } from "@/components/compat/Router";
import AppShell from "@/components/layout/AppShell";
import ModMateSidePanel from "@/components/mate/ModMateSidePanel";
import SectionCard from "@/components/mate/SectionCard";

const contextSections = [
  {
    id: "selected-text",
    label: "Selected text",
    detail: "The host app decides what selected text or current record is safe to send.",
  },
  {
    id: "memory",
    label: "Memory sections",
    detail: "Project notes, rules, active objects, and workflow state arrive as structured sections.",
  },
  {
    id: "warnings",
    label: "Warnings",
    detail: "Potential missing context, risky claims, or stale data can be flagged before answering.",
  },
];

const messages = [
  {
    id: "user-1",
    role: "user" as const,
    content: "Can you review this selected section and tell me what risks or continuity issues I should check?",
  },
  {
    id: "assistant-1",
    role: "assistant" as const,
    content:
      "I can review it against the host-provided context. I see three loaded memory sections and two confirm-first action hints. I would flag missing setup, unclear ownership, and any rule conflicts before suggesting edits.",
  },
];

const actionHints = [
  {
    id: "suggest-rewrite",
    label: "Suggest rewrite",
    description: "Return a proposed edit for the host app to preview before applying.",
    requiresConfirmation: true,
  },
  {
    id: "save-note",
    label: "Save note to project memory",
    description: "Prepare a memory update that the host app must confirm first.",
    requiresConfirmation: true,
  },
];

const panelContract = `type SidePanelInput = {
  companionProfileId: string;
  hostApp: {
    id: string;
    name: string;
    surface: "side-panel";
    activeView: string;
  };
  contextPacket: {
    sections: ContextSection[];
    warnings: string[];
    actionHints: ActionHint[];
  };
};`;

const SidePanelPreview = () => {
  return (
    <AppShell>
      <div data-testid="side-panel-preview-page" className="space-y-8">
        <section className="surface-card overflow-hidden relative p-7 md:p-9 grain">
          <div className="absolute -right-16 -top-20 h-64 w-64 rounded-full bg-accent-sage/20 blur-3xl" />
          <div className="relative z-10 flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6">
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <p className="eyebrow">MOD-26 · Side panel contract</p>
                <span className="rounded-full border border-accent-sage/40 bg-accent-sage/10 px-3 py-1 text-xs font-medium">
                  Foundation preview
                </span>
              </div>
              <h1 className="font-heading text-3xl md:text-5xl font-medium tracking-tight mt-3 max-w-4xl">
                A reusable companion panel for any host app.
              </h1>
              <p className="text-sm md:text-base text-muted-foreground mt-4 max-w-2xl leading-relaxed">
                This preview proves the generic side-panel surface: host-owned context in, Mod-Mate companion response out, and confirm-first actions only.
              </p>
              <Link
                to="/integrations"
                className="mt-5 inline-flex items-center gap-2 rounded-full border border-border bg-white px-4 py-2 text-sm font-medium hover:bg-muted dark:bg-card"
              >
                <ArrowLeft className="h-4 w-4" /> Back to Integrations
              </Link>
            </div>
            <div className="rounded-3xl border border-border bg-white/70 p-5 dark:bg-card max-w-sm">
              <div className="flex items-center gap-3">
                <div className="h-11 w-11 rounded-2xl bg-primary text-primary-foreground flex items-center justify-center">
                  <PanelRight className="h-5 w-5" />
                </div>
                <div>
                  <p className="font-heading text-lg font-medium">Preview only</p>
                  <p className="text-xs text-muted-foreground mt-0.5">No SDK, auth, install script, or external writes yet.</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        <div className="grid grid-cols-1 xl:grid-cols-[1fr,420px] gap-6 items-start">
          <div className="space-y-6">
            <SectionCard
              eyebrow="Contract shape"
              title="What the host app sends"
              description="The side panel does not scrape silently. The host app chooses the current view, safe context sections, warnings, and action hints."
              testId="side-panel-contract"
            >
              <div className="rounded-2xl bg-primary text-primary-foreground p-5 overflow-auto">
                <pre className="text-xs leading-relaxed mono whitespace-pre-wrap">{panelContract}</pre>
              </div>
            </SectionCard>

            <SectionCard
              eyebrow="Ownership boundaries"
              title="Keep the split clean"
              description="This is the line that keeps Master Draft, QAtalyst, extensions, and future apps from turning into one-off spaghetti."
              testId="side-panel-boundaries"
            >
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <BoundaryCard
                  icon={<PanelRight className="h-4 w-4" />}
                  title="Surface"
                  body="Mod-Mate owns the reusable panel shell, messages, context summary, and action display."
                />
                <BoundaryCard
                  icon={<Code2 className="h-4 w-4" />}
                  title="Context"
                  body="Host apps own their data and explicitly decide what context packet to send."
                />
                <BoundaryCard
                  icon={<ShieldCheck className="h-4 w-4" />}
                  title="Actions"
                  body="Write-like actions are hints until the user confirms inside the host app."
                />
              </div>
            </SectionCard>
          </div>

          <ModMateSidePanel
            companion={{
              name: "Workflow Companion",
              category: "Generic host app assistant",
              status: "Preview",
            }}
            hostApp={{
              name: "Example Host App",
              surface: "side-panel",
              activeView: "Selected workflow section",
            }}
            contextSections={contextSections}
            messages={messages}
            actionHints={actionHints}
          />
        </div>
      </div>
    </AppShell>
  );
};

const BoundaryCard = ({ icon, title, body }: { icon: React.ReactNode; title: string; body: string }) => (
  <article className="rounded-2xl border border-border bg-muted/35 p-5">
    <div className="h-10 w-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center">{icon}</div>
    <h3 className="font-heading text-lg font-medium mt-4">{title}</h3>
    <p className="text-sm text-muted-foreground mt-2 leading-relaxed">{body}</p>
    <div className="mt-4 inline-flex items-center gap-1.5 text-xs text-muted-foreground">
      <CheckCircle2 className="h-3.5 w-3.5 text-accent-sage" /> MOD-26 scope
    </div>
  </article>
);

export default SidePanelPreview;
