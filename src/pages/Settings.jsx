import React from "react";
import {
  Building2,
  User,
  KeyRound,
  Gauge,
  CreditCard,
  Palette,
  ChevronRight,
} from "lucide-react";
import AppShell from "@/components/layout/AppShell";
import SectionCard from "@/components/mate/SectionCard";
import Badge from "@/components/mate/Badge";

const SECTIONS = [
  {
    id: "workspace",
    icon: Building2,
    title: "Workspace",
    description: "Name, members, default visibility for new companions.",
  },
  {
    id: "profile",
    icon: User,
    title: "Profile",
    description: "Your display name, email, and avatar.",
  },
  {
    id: "api-keys",
    icon: KeyRound,
    title: "API keys",
    description: "Provider keys for the models your companions will eventually use.",
  },
  {
    id: "usage",
    icon: Gauge,
    title: "Usage",
    description: "Token spend, conversations, and per-companion activity.",
  },
  {
    id: "billing",
    icon: CreditCard,
    title: "Billing",
    description: "Plan, seats, and invoice history.",
  },
  {
    id: "appearance",
    icon: Palette,
    title: "Appearance",
    description: "Theme, density, and Mod-Mate accents.",
  },
];

const Settings = () => {
  return (
    <AppShell>
      <div data-testid="settings-page" className="space-y-8">
        <div>
          <p className="eyebrow">Settings</p>
          <h1 className="font-heading text-3xl md:text-4xl font-medium tracking-tight mt-2">
            Workspace preferences
          </h1>
          <p className="text-sm text-muted-foreground mt-2 max-w-2xl">
            Placeholder sections — none of these are wired up yet. They'll come back functional once
            we connect billing, accounts, and providers.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5" data-testid="settings-grid">
          {SECTIONS.map((s) => {
            const Icon = s.icon;
            return (
              <button
                type="button"
                key={s.id}
                data-testid={`settings-${s.id}`}
                className="surface-card p-6 text-left lift-on-hover flex items-start gap-4"
              >
                <div className="h-11 w-11 rounded-2xl bg-muted flex items-center justify-center shrink-0">
                  <Icon className="h-5 w-5 text-primary" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <h2 className="font-heading text-lg font-medium">{s.title}</h2>
                    <Badge tone="neutral">UI placeholder</Badge>
                  </div>
                  <p className="text-sm text-muted-foreground mt-1.5 leading-relaxed">
                    {s.description}
                  </p>
                </div>
                <ChevronRight className="h-5 w-5 text-muted-foreground shrink-0 mt-1" />
              </button>
            );
          })}
        </div>

        <SectionCard
          eyebrow="Danger zone"
          title="Reset workspace"
          description="Removes mock companions and resets the UI to its default state. (Non-functional — UI only.)"
          testId="settings-danger"
          action={
            <button
              type="button"
              data-testid="settings-reset"
              className="rounded-full bg-secondary text-secondary-foreground px-4 py-2 text-sm font-medium hover:-translate-y-0.5 hover:shadow-lift transition-all"
            >
              Reset workspace
            </button>
          }
        >
          <p className="text-xs text-muted-foreground">
            Nothing actually resets — this button is a visual placeholder for the future settings flow.
          </p>
        </SectionCard>
      </div>
    </AppShell>
  );
};

export default Settings;
