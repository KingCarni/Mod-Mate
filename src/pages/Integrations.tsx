"use client";

import React from "react";
import {
  Braces,
  CheckCircle2,
  Code2,
  FileJson,
  Layers,
  LockKeyhole,
  PanelRight,
  ShieldCheck,
  Sparkles,
  Workflow,
} from "lucide-react";
import AppShell from "@/components/layout/AppShell";
import Badge from "@/components/mate/Badge";
import IntegrationCard from "@/components/mate/IntegrationCard";
import SectionCard from "@/components/mate/SectionCard";
import { integrations } from "@/data/mockData";

const embedSurfaces = [
  {
    id: "floating-widget",
    title: "Floating Widget",
    description: "A small companion launcher that can sit above any product screen.",
    bestFor: "Lightweight support, onboarding, and quick help.",
    status: "Coming Soon",
    tone: "ochre",
  },
  {
    id: "side-panel",
    title: "Side Panel",
    description: "A persistent companion beside the active workflow or editor.",
    bestFor: "Writing tools, QA workflows, dashboards, and admin screens.",
    status: "Foundation Ready",
    tone: "sage",
  },
  {
    id: "inline-panel",
    title: "Inline Panel",
    description: "A companion placed directly inside a form, document, or workflow section.",
    bestFor: "Field-level help, review steps, and guided edits.",
    status: "Planned",
    tone: "neutral",
  },
  {
    id: "full-page",
    title: "Full Page",
    description: "A complete hosted companion experience for deeper testing or internal tools.",
    bestFor: "Standalone copilots, testing surfaces, and team workflows.",
    status: "Planned",
    tone: "neutral",
  },
  {
    id: "custom-surface",
    title: "Custom Surface",
    description: "A host-defined placement that uses the same context and runtime contract.",
    bestFor: "Specialized products that need their own UI shell.",
    status: "Planned",
    tone: "neutral",
  },
];

const howItWorks = [
  {
    id: "identify",
    title: "Host app identifies itself",
    body: "The host sends its app ID, version, environment, and intended embed surface.",
    icon: Layers,
  },
  {
    id: "context",
    title: "Host sends context packet",
    body: "The host app chooses the active screen, selected text, memory sections, warnings, and action hints.",
    icon: FileJson,
  },
  {
    id: "runtime",
    title: "Mod-Mate runs the companion",
    body: "The runtime combines the companion profile, context packet, message, and history.",
    icon: Sparkles,
  },
  {
    id: "confirm",
    title: "User confirms write actions",
    body: "Host apps apply changes only after confirmation. No silent writes, no hidden mutations.",
    icon: ShieldCheck,
  },
];

const safetyRules = [
  "Host apps own source data and decide what context is safe to send.",
  "Mod-Mate owns profile execution, runtime prompting, warnings, and response shape.",
  "Write-like actions require confirmation before the host app changes anything.",
  "Secrets, tokens, credentials, and unrelated private data should never be sent.",
];

const proofIntegrations = [
  {
    id: "master-draft",
    title: "Writing app sample",
    body: "Shows how a story editor could send scene, Story Bible, character, canon, and Never Break context.",
    docs: "docs/integrations/master-draft-contract.md",
    sample: "src/lib/integrationSamples/masterDraftAdapter.ts",
  },
  {
    id: "qatalyst",
    title: "QA workflow sample",
    body: "Shows how a QA product could send active workflow, source input, generated output, Project Brain, risks, and Jira/TestRail state.",
    docs: "docs/integrations/qatalyst-contract.md",
    sample: "src/lib/integrationSamples/qatalystAdapter.ts",
  },
];

const codePreview = `const embedConfig = {
  hostApp: {
    id: "custom",
    name: "Your App",
    environment: "production",
  },
  surface: "side-panel",
  companionProfileId: "your-companion-id",
  defaultRuntimeMode: "live",
  defaultProvider: "openai",
  allowHostActions: true,
};`;

const getIntegrationTestId = (id: string) => `integration-option-${id}`;

const Integrations = () => {
  return (
    <AppShell>
      <div data-testid="integrations-page" className="space-y-8">
        <section
          data-testid="integration-hero"
          className="surface-card overflow-hidden relative p-7 md:p-9 grain"
        >
          <div className="absolute -right-16 -top-20 h-64 w-64 rounded-full bg-accent-sage/20 blur-3xl" />
          <div className="absolute right-20 bottom-0 h-36 w-36 rounded-full bg-accent-ochre/20 blur-2xl" />
          <div className="relative z-10 flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6">
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <p className="eyebrow">Integrations</p>
                <Badge tone="sage">Foundation ready · production embeds coming soon</Badge>
              </div>
              <h1 className="font-heading text-3xl md:text-5xl font-medium tracking-tight mt-3 max-w-4xl">
                Bring companions into your product.
              </h1>
              <p className="text-sm md:text-base text-muted-foreground mt-4 max-w-2xl leading-relaxed">
                Mod-Mate is being shaped to power side panels, inline assistants, dashboard helpers,
                documentation companions, and custom API integrations inside host apps.
              </p>
            </div>
            <div className="rounded-3xl border border-border bg-white/70 backdrop-blur p-5 max-w-sm">
              <div className="flex items-center gap-3">
                <div className="h-11 w-11 rounded-2xl bg-primary text-primary-foreground flex items-center justify-center">
                  <PanelRight className="h-5 w-5" />
                </div>
                <div>
                  <p className="font-heading text-lg font-medium">Phase 2 UI preview</p>
                  <p className="text-xs text-muted-foreground mt-0.5">No auth, tokens, billing, or real installs yet.</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        <SectionCard
          eyebrow="Embed surfaces"
          title="Choose where the companion lives"
          description="These are planned surfaces for host apps. Phase 1 defines the foundation; production embedding comes later."
          testId="embed-surfaces"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-5 gap-4">
            {embedSurfaces.map((surface) => (
              <article
                key={surface.id}
                data-testid={`embed-surface-${surface.id}`}
                className="rounded-2xl border border-border bg-muted/35 p-5 flex flex-col gap-3 min-h-[210px]"
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="h-10 w-10 rounded-xl bg-white border border-border flex items-center justify-center text-primary">
                    <PanelRight className="h-4 w-4" />
                  </div>
                  <Badge tone={surface.tone}>{surface.status}</Badge>
                </div>
                <div>
                  <h3 className="font-heading text-lg font-medium">{surface.title}</h3>
                  <p className="text-sm text-muted-foreground mt-1 leading-relaxed">{surface.description}</p>
                </div>
                <p className="text-xs text-muted-foreground mt-auto">
                  <span className="font-semibold text-foreground">Best for:</span> {surface.bestFor}
                </p>
              </article>
            ))}
          </div>
        </SectionCard>

        <SectionCard
          eyebrow="Integration options"
          title="Generic ways products can use Mod-Mate"
          description="Public-facing integrations stay generic. These cards describe the future shape without pretending anything is installed yet."
          testId="integration-options"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5" data-testid="integrations-grid">
            {integrations.map((integration) => (
              <div key={integration.id} data-testid={getIntegrationTestId(integration.id)}>
                <IntegrationCard integration={integration} />
              </div>
            ))}
          </div>
        </SectionCard>

        <SectionCard
          eyebrow="Runtime flow"
          title="How host apps will talk to Mod-Mate"
          description="The integration model is simple: host-owned context in, companion response out, user-confirmed actions only."
          testId="integration-how-it-works"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
            {howItWorks.map((step, index) => {
              const Icon = step.icon;
              return (
                <article key={step.id} className="rounded-2xl border border-border bg-white p-5">
                  <div className="flex items-center justify-between gap-3">
                    <div className="h-10 w-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center">
                      <Icon className="h-4 w-4" />
                    </div>
                    <span className="font-heading text-2xl text-muted-foreground/60">0{index + 1}</span>
                  </div>
                  <h3 className="font-heading text-lg font-medium mt-5">{step.title}</h3>
                  <p className="text-sm text-muted-foreground mt-2 leading-relaxed">{step.body}</p>
                </article>
              );
            })}
          </div>
        </SectionCard>

        <div className="grid grid-cols-1 xl:grid-cols-[0.9fr,1.1fr] gap-6">
          <SectionCard
            eyebrow="Safety & control"
            title="No silent writes. No hidden data grabs."
            description="The host app stays in control of source data and applies changes only after user confirmation."
            testId="integration-safety"
          >
            <ul className="space-y-3">
              {safetyRules.map((rule) => (
                <li key={rule} className="flex items-start gap-3 text-sm text-muted-foreground">
                  <CheckCircle2 className="h-4 w-4 text-accent-sage mt-0.5 shrink-0" />
                  <span>{rule}</span>
                </li>
              ))}
            </ul>
            <div className="mt-5 rounded-2xl bg-secondary/10 border border-secondary/25 p-4 flex items-start gap-3">
              <LockKeyhole className="h-4 w-4 text-secondary mt-0.5 shrink-0" />
              <p className="text-xs text-muted-foreground leading-relaxed">
                Integration keys, token issuing, auth, billing, workspaces, and real host-app write actions are intentionally not part of this UI pass.
              </p>
            </div>
          </SectionCard>

          <SectionCard
            eyebrow="Developer preview"
            title="Planned embed config shape"
            description="This mirrors the Phase 1 foundation types. It is a preview, not a live SDK or install snippet."
            testId="integration-code-preview"
          >
            <div className="rounded-2xl bg-primary text-primary-foreground p-5 overflow-auto">
              <pre className="text-xs leading-relaxed mono whitespace-pre-wrap">{codePreview}</pre>
            </div>
            <div className="mt-4 flex items-center gap-2 text-xs text-muted-foreground">
              <Code2 className="h-3.5 w-3.5" />
              Preview only — no token generation, install flow, or script loader exists yet.
            </div>
          </SectionCard>
        </div>

        <SectionCard
          eyebrow="Proof integrations"
          title="Developer samples in this repo"
          description="These samples prove the same integration foundation can support a writing app and a QA workflow app without making the public product all about our internal projects."
          testId="proof-integrations"
        >
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
            {proofIntegrations.map((sample) => (
              <article key={sample.id} className="rounded-2xl border border-border bg-muted/35 p-5">
                <div className="flex items-start justify-between gap-3">
                  <div className="h-10 w-10 rounded-xl bg-white border border-border flex items-center justify-center text-primary">
                    <Workflow className="h-4 w-4" />
                  </div>
                  <Badge tone="neutral">Developer sample</Badge>
                </div>
                <h3 className="font-heading text-xl font-medium mt-4">{sample.title}</h3>
                <p className="text-sm text-muted-foreground mt-2 leading-relaxed">{sample.body}</p>
                <div className="mt-5 space-y-2 text-xs text-muted-foreground">
                  <div className="rounded-xl bg-white border border-border px-3 py-2 flex items-center gap-2">
                    <Braces className="h-3.5 w-3.5" />
                    {sample.sample}
                  </div>
                  <div className="rounded-xl bg-white border border-border px-3 py-2 flex items-center gap-2">
                    <FileJson className="h-3.5 w-3.5" />
                    {sample.docs}
                  </div>
                </div>
              </article>
            ))}
          </div>
        </SectionCard>
      </div>
    </AppShell>
  );
};

export default Integrations;
