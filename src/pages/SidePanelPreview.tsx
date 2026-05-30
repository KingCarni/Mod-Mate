"use client";

import React, { useMemo, useState } from "react";
import { ArrowLeft, CheckCircle2, Code2, PanelRight, ShieldCheck } from "lucide-react";
import { Link } from "@/components/compat/Router";
import AppShell from "@/components/layout/AppShell";
import ModMateSidePanel from "@/components/mate/ModMateSidePanel";
import SectionCard from "@/components/mate/SectionCard";
import { createHostAdapterPreview, hostAppAdapters } from "@/lib/hostAppAdapters";

type AdapterId = "master-draft" | "qatalyst";

const panelContract = `type HostAppAdapter<THostState> = {
  id: string;
  hostApp: HostAppIdentity;
  companionProfileId: string;
  surface: HostAdapterSurfaceConfig;
  runtimeDefaults: RuntimeDefaults;
  build(input: {
    hostState: THostState;
    message?: string;
  }): {
    embedConfig: EmbedConfig;
    companionProfile: CompanionProfile;
    contextPacket: ContextPacket;
    actionHints: IntegrationActionHint[];
    warnings: ContextPacketWarning[];
  };
};`;

const SidePanelPreview = () => {
  const [selectedAdapterId, setSelectedAdapterId] = useState<AdapterId>("master-draft");
  const preview = useMemo(() => createHostAdapterPreview(selectedAdapterId), [selectedAdapterId]);

  return (
    <AppShell>
      <div data-testid="side-panel-preview-page" className="space-y-8">
        <section className="surface-card overflow-hidden relative p-7 md:p-9 grain">
          <div className="absolute -right-16 -top-20 h-64 w-64 rounded-full bg-accent-sage/20 blur-3xl" />
          <div className="relative z-10 flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6">
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <p className="eyebrow">MOD-27 · Host adapter contract</p>
                <span className="rounded-full border border-accent-sage/40 bg-accent-sage/10 px-3 py-1 text-xs font-medium">
                  Adapter preview
                </span>
              </div>
              <h1 className="font-heading text-3xl md:text-5xl font-medium tracking-tight mt-3 max-w-4xl">
                One adapter contract for every host app.
              </h1>
              <p className="text-sm md:text-base text-muted-foreground mt-4 max-w-2xl leading-relaxed">
                Host apps translate their own state into a Mod-Mate context packet, companion profile, embed config, and confirm-first action hints.
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
                  <p className="font-heading text-lg font-medium">Contract only</p>
                  <p className="text-xs text-muted-foreground mt-0.5">No SDK, auth, install script, or external writes yet.</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        <div className="grid grid-cols-1 xl:grid-cols-[1fr,420px] gap-6 items-start">
          <div className="space-y-6">
            <SectionCard
              eyebrow="Adapter samples"
              title="Choose a host app shape"
              description="These samples use the same adapter contract while keeping product-specific state inside the host app."
              testId="side-panel-adapter-picker"
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {hostAppAdapters.map((adapter) => (
                  <button
                    key={adapter.id}
                    type="button"
                    onClick={() => setSelectedAdapterId(adapter.id as AdapterId)}
                    className={`rounded-2xl border p-5 text-left transition-all hover:-translate-y-0.5 ${
                      selectedAdapterId === adapter.id
                        ? "border-primary bg-primary/10 shadow-soft"
                        : "border-border bg-muted/35 hover:bg-muted/60"
                    }`}
                    data-testid={`adapter-${adapter.id}`}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <p className="eyebrow">{adapter.hostApp.name}</p>
                        <h3 className="font-heading text-xl font-medium mt-2">{adapter.name}</h3>
                      </div>
                      <span className="rounded-full border border-border bg-white px-2.5 py-1 text-[11px] font-medium dark:bg-card">
                        {adapter.surface.preferredSurface}
                      </span>
                    </div>
                    <p className="mt-3 text-sm text-muted-foreground leading-relaxed">{adapter.description}</p>
                    <p className="mt-4 text-xs text-muted-foreground">
                      Companion: <span className="text-foreground">{adapter.companionProfileId}</span>
                    </p>
                  </button>
                ))}
              </div>
            </SectionCard>

            <SectionCard
              eyebrow="Contract shape"
              title="What each adapter builds"
              description="The adapter is the boundary between a host app's private state and the reusable Mod-Mate companion surface."
              testId="side-panel-contract"
            >
              <div className="rounded-2xl bg-primary text-primary-foreground p-5 overflow-auto">
                <pre className="text-xs leading-relaxed mono whitespace-pre-wrap">{panelContract}</pre>
              </div>
            </SectionCard>

            <SectionCard
              eyebrow="Ownership boundaries"
              title="Keep the split clean"
              description="This line keeps Master Draft, QAtalyst, extensions, and future apps from turning into one-off spaghetti."
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

          {preview && (
            <ModMateSidePanel
              companion={preview.companion}
              hostApp={preview.hostApp}
              contextSections={preview.contextSections}
              messages={preview.messages}
              actionHints={preview.actionHints}
            />
          )}
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
      <CheckCircle2 className="h-3.5 w-3.5 text-accent-sage" /> MOD-27 scope
    </div>
  </article>
);

export default SidePanelPreview;
