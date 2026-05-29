"use client";

import React from "react";
import {
  ArrowRight,
  CheckCircle2,
  FileJson,
  LockKeyhole,
  PanelRight,
  ShieldCheck,
  Sparkles,
} from "lucide-react";
import AppShell from "@/components/layout/AppShell";
import Badge from "@/components/mate/Badge";
import SectionCard from "@/components/mate/SectionCard";
import { Link } from "@/components/compat/Router";
import {
  createMasterDraftSampleActionHints,
  createMasterDraftSampleContextPacket,
  createMasterDraftSampleEmbedConfig,
  createMasterDraftSampleRuntimeRequest,
  MASTER_DRAFT_SAMPLE_USER_MESSAGE,
} from "@/lib/integrationSamples/masterDraftAdapter";
import { stringifyContextPacket } from "@/lib/contextPackets";

const contextPacket = createMasterDraftSampleContextPacket();
const embedConfig = createMasterDraftSampleEmbedConfig();
const actionHints = createMasterDraftSampleActionHints();
const runtimeRequest = createMasterDraftSampleRuntimeRequest();

const packetJson = stringifyContextPacket(contextPacket);
const embedConfigJson = JSON.stringify(embedConfig, null, 2);
const runtimeRequestJson = JSON.stringify(runtimeRequest, null, 2);

const summaryStats = [
  { label: "Memory sections", value: contextPacket.memorySections.length.toString() },
  { label: "Action hints", value: actionHints.length.toString() },
  { label: "Surface", value: embedConfig.surface },
  { label: "Runtime", value: `${embedConfig.defaultRuntimeMode} / ${embedConfig.defaultProvider}` },
];

const flowSteps = [
  {
    title: "Master Draft owns the story state",
    body: "The writing app chooses the active scene, selected line, Story Bible facts, canon, and Never Break rules.",
    icon: FileJson,
  },
  {
    title: "Mod-Mate runs the companion",
    body: "The sample request pairs the Master Draft Story Companion profile with a host-owned context packet.",
    icon: Sparkles,
  },
  {
    title: "Writes stay confirm-first",
    body: "Apply/export actions are hints only. Master Draft would confirm before changing selected text or Story Bible memory.",
    icon: ShieldCheck,
  },
];

const MasterDraftIntegrationPreview = () => {
  return (
    <AppShell>
      <div data-testid="master-draft-integration-preview" className="space-y-8">
        <section className="surface-card grain p-7 md:p-9 overflow-hidden relative">
          <div className="absolute -right-16 -top-20 h-64 w-64 rounded-full bg-accent-ochre/25 blur-3xl" />
          <div className="relative z-10 flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6">
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <p className="eyebrow">Proof integration · Developer preview</p>
                <Badge tone="ochre">MOD-5</Badge>
                <Badge tone="neutral">Sample only</Badge>
              </div>
              <h1 className="font-heading text-3xl md:text-5xl font-medium tracking-tight mt-3 max-w-4xl">
                Master Draft can use Mod-Mate without owning the companion engine.
              </h1>
              <p className="text-sm md:text-base text-muted-foreground mt-4 max-w-2xl leading-relaxed">
                This preview shows the first safe integration shape: Master Draft builds a story-aware
                context packet, Mod-Mate runs the companion, and Master Draft confirms any write action.
              </p>
              <div className="mt-6 flex flex-wrap gap-3">
                <Link
                  to="/integrations"
                  className="inline-flex items-center gap-2 rounded-full bg-primary text-primary-foreground px-4 py-2 text-sm font-medium hover:-translate-y-0.5 transition-all"
                >
                  Back to Integrations <ArrowRight className="h-4 w-4" />
                </Link>
                <Link
                  to="/templates"
                  className="inline-flex items-center gap-2 rounded-full border border-border bg-white px-4 py-2 text-sm font-medium hover:bg-muted transition-colors"
                >
                  View companion templates
                </Link>
              </div>
            </div>
            <div className="rounded-3xl border border-border bg-white/75 backdrop-blur p-5 max-w-sm">
              <div className="flex items-center gap-3">
                <div className="h-11 w-11 rounded-2xl bg-primary text-primary-foreground flex items-center justify-center">
                  <PanelRight className="h-5 w-5" />
                </div>
                <div>
                  <p className="font-heading text-lg font-medium">Side panel sample</p>
                  <p className="text-xs text-muted-foreground mt-0.5">No live Master Draft app connection yet.</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4" data-testid="master-draft-integration-stats">
          {summaryStats.map((stat) => (
            <div key={stat.label} className="surface-card p-5">
              <p className="eyebrow">{stat.label}</p>
              <p className="font-heading text-xl font-medium mt-2">{stat.value}</p>
            </div>
          ))}
        </div>

        <SectionCard
          eyebrow="Integration flow"
          title="A safe host-owned context path"
          description="The sample adapter demonstrates the ownership split before we build a production Master Draft panel."
          testId="master-draft-integration-flow"
        >
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            {flowSteps.map((step, index) => {
              const Icon = step.icon;
              return (
                <article key={step.title} className="rounded-2xl border border-border bg-white p-5">
                  <div className="flex items-center justify-between">
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
            eyebrow="Action hints"
            title="Suggested actions require host confirmation"
            description="These are possible actions the companion may shape around. They do not execute inside Mod-Mate."
            testId="master-draft-action-hints"
          >
            <div className="space-y-3">
              {actionHints.map((action) => (
                <div key={action.id} className="rounded-2xl border border-border bg-white p-4">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="font-heading text-base font-medium">{action.label}</p>
                      <p className="text-xs text-muted-foreground mt-1 leading-relaxed">{action.description}</p>
                    </div>
                    <Badge tone="sage">Confirm first</Badge>
                  </div>
                  <p className="text-xs text-muted-foreground mt-3">
                    <span className="font-semibold text-foreground">Kind:</span> {action.kind}
                  </p>
                </div>
              ))}
            </div>
          </SectionCard>

          <SectionCard
            eyebrow="Runtime prompt"
            title="Sample user message"
            description="This is the question the sample runtime request would send with the context packet."
            testId="master-draft-runtime-message"
          >
            <div className="rounded-2xl bg-primary text-primary-foreground p-5">
              <p className="font-heading text-xl leading-snug">{MASTER_DRAFT_SAMPLE_USER_MESSAGE}</p>
            </div>
            <div className="mt-4 rounded-2xl border border-border bg-muted/40 p-4 flex items-start gap-3">
              <LockKeyhole className="h-4 w-4 text-secondary mt-0.5 shrink-0" />
              <p className="text-xs text-muted-foreground leading-relaxed">
                This preview does not call the live runtime or write back to Master Draft. It shows the request shape only.
              </p>
            </div>
          </SectionCard>
        </div>

        <SectionCard
          eyebrow="Context packet"
          title="What Master Draft would send"
          description="The host app owns this packet. Mod-Mate does not directly read Master Draft storage."
          testId="master-draft-context-packet"
        >
          <div className="rounded-2xl bg-primary text-primary-foreground p-5 max-h-[420px] overflow-auto">
            <pre className="text-[11px] leading-relaxed mono whitespace-pre-wrap">{packetJson}</pre>
          </div>
        </SectionCard>

        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
          <SectionCard
            eyebrow="Embed config"
            title="Planned panel configuration"
            description="This mirrors the shared integration foundation. It is not a live SDK install yet."
            testId="master-draft-embed-config"
          >
            <div className="rounded-2xl bg-primary text-primary-foreground p-5 max-h-[360px] overflow-auto">
              <pre className="text-[11px] leading-relaxed mono whitespace-pre-wrap">{embedConfigJson}</pre>
            </div>
          </SectionCard>

          <SectionCard
            eyebrow="Runtime request"
            title="Sample request shape"
            description="The same profile + packet shape can go to /api/runtime in mock or live mode."
            testId="master-draft-runtime-request"
          >
            <div className="rounded-2xl bg-primary text-primary-foreground p-5 max-h-[360px] overflow-auto">
              <pre className="text-[11px] leading-relaxed mono whitespace-pre-wrap">{runtimeRequestJson}</pre>
            </div>
          </SectionCard>
        </div>

        <SectionCard
          eyebrow="Boundary check"
          title="What this preview proves — and what it does not"
          testId="master-draft-boundary-check"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="rounded-2xl border border-accent-sage/30 bg-accent-sage/10 p-5">
              <div className="flex items-center gap-2 text-primary">
                <CheckCircle2 className="h-4 w-4" />
                <p className="font-heading font-medium">Proves</p>
              </div>
              <ul className="mt-4 space-y-2 text-sm text-muted-foreground">
                <li>Master Draft can build a standard context packet.</li>
                <li>Mod-Mate can own the companion profile and runtime shape.</li>
                <li>Apply/export actions stay confirm-before-write.</li>
              </ul>
            </div>
            <div className="rounded-2xl border border-secondary/25 bg-secondary/10 p-5">
              <div className="flex items-center gap-2 text-secondary">
                <LockKeyhole className="h-4 w-4" />
                <p className="font-heading font-medium">Does not build yet</p>
              </div>
              <ul className="mt-4 space-y-2 text-sm text-muted-foreground">
                <li>No real embedded widget package.</li>
                <li>No Master Draft database or file access.</li>
                <li>No production write actions or token system.</li>
              </ul>
            </div>
          </div>
        </SectionCard>
      </div>
    </AppShell>
  );
};

export default MasterDraftIntegrationPreview;
