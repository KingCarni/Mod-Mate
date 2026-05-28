import React from "react";
import { Code2 } from "lucide-react";
import AppShell from "@/components/layout/AppShell";
import IntegrationCard from "@/components/mate/IntegrationCard";
import SectionCard from "@/components/mate/SectionCard";
import { integrations } from "@/data/mockData";

const Integrations = () => {
  return (
    <AppShell>
      <div data-testid="integrations-page" className="space-y-8">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4">
          <div>
            <p className="eyebrow">Integrations</p>
            <h1 className="font-heading text-3xl md:text-4xl font-medium tracking-tight mt-2 max-w-3xl">
              Where your companions are headed next.
            </h1>
            <p className="text-sm text-muted-foreground mt-2 max-w-2xl">
              Mod-Mate will eventually plug into the apps where work already happens. These cards
              are a preview — nothing is wired up yet.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5" data-testid="integrations-grid">
          {integrations.map((i) => (
            <IntegrationCard key={i.id} integration={i} />
          ))}
        </div>

        <SectionCard
          eyebrow="Embed snippet"
          title="React widget preview"
          description="Mock snippet — actual embed code will be generated when integrations ship."
          testId="embed-preview"
        >
          <div className="rounded-2xl bg-primary text-primary-foreground p-5 overflow-auto">
            <pre className="text-xs leading-relaxed mono" data-testid="embed-snippet">{`import { ModMate } from "@modmate/react";

export default function App() {
  return (
    <ModMate
      companion="draftmate"
      context={{ project: "act-one", scene: "cold-open" }}
      memory={["facts", "characters", "decisions"]}
    />
  );
}`}</pre>
          </div>
          <div className="mt-4 flex items-center gap-2 text-xs text-muted-foreground">
            <Code2 className="h-3.5 w-3.5" />
            Snippet shown for UI preview only — copy will work in a later pass.
          </div>
        </SectionCard>
      </div>
    </AppShell>
  );
};

export default Integrations;
