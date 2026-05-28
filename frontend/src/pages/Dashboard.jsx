import React from "react";
import { Link } from "react-router-dom";
import { PlusCircle, ArrowUpRight } from "lucide-react";
import AppShell from "@/components/layout/AppShell";
import CompanionCard from "@/components/mate/CompanionCard";
import StatCard from "@/components/mate/StatCard";
import SectionCard from "@/components/mate/SectionCard";
import TemplateCard from "@/components/mate/TemplateCard";
import { companions, stats, recentActivity, templates, integrations } from "@/data/mockData";
import Badge from "@/components/mate/Badge";

const Dashboard = () => {
  const featured = templates.slice(0, 3);

  return (
    <AppShell>
      <div data-testid="dashboard-page" className="space-y-10">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4">
          <div>
            <p className="eyebrow">Dashboard</p>
            <h1 className="font-heading text-3xl md:text-4xl font-medium tracking-tight mt-2">
              Good to see you. Here's what your companions are up to.
            </h1>
          </div>
          <Link
            to="/app/builder"
            data-testid="dashboard-create-companion"
            className="inline-flex items-center gap-2 rounded-full bg-primary text-primary-foreground px-5 py-2.5 text-sm font-medium hover:-translate-y-0.5 hover:shadow-lift transition-all w-fit"
          >
            <PlusCircle className="h-4 w-4" /> Create Companion
          </Link>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {stats.map((s) => (
            <StatCard key={s.id} stat={s} />
          ))}
        </div>

        {/* Companions grid */}
        <SectionCard
          eyebrow="Your companions"
          title="Companions"
          description="Edit, test, or embed any companion. Mock data — wiring comes later."
          testId="dashboard-companions"
          action={
            <Link
              to="/app/templates"
              className="text-sm text-primary hover:underline underline-offset-4"
              data-testid="dashboard-browse-templates"
            >
              Browse templates →
            </Link>
          }
        >
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
            {companions.map((c) => (
              <CompanionCard key={c.id} companion={c} />
            ))}
          </div>
        </SectionCard>

        {/* Activity + Templates row */}
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
          <SectionCard
            eyebrow="Recent activity"
            title="Last few moves"
            testId="dashboard-activity"
          >
            <ul className="divide-y divide-border">
              {recentActivity.map((a) => (
                <li
                  key={a.id}
                  className="flex items-center justify-between py-3 text-sm"
                  data-testid={`activity-${a.id}`}
                >
                  <span>
                    <span className="font-medium">{a.who}</span>{" "}
                    <span className="text-muted-foreground">{a.what}</span>
                  </span>
                  <span className="text-xs text-muted-foreground">{a.when}</span>
                </li>
              ))}
            </ul>
          </SectionCard>

          <div className="lg:col-span-3 space-y-6">
            <SectionCard
              eyebrow="Templates"
              title="Start from a strong shape"
              description="Featured starting points pulled from the gallery."
              testId="dashboard-templates"
            >
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {featured.map((t) => (
                  <TemplateCard key={t.id} template={t} />
                ))}
              </div>
            </SectionCard>
          </div>

          <SectionCard
            eyebrow="Integrations"
            title="Where they'll live"
            testId="dashboard-integrations"
          >
            <ul className="space-y-3">
              {integrations.slice(0, 4).map((i) => (
                <li
                  key={i.id}
                  className="flex items-center justify-between gap-3"
                  data-testid={`mini-int-${i.id}`}
                >
                  <span className="text-sm font-medium">{i.name}</span>
                  <Badge tone={i.status === "Internal" ? "sage" : "ochre"}>{i.status}</Badge>
                </li>
              ))}
            </ul>
            <Link
              to="/app/integrations"
              className="mt-4 inline-flex items-center gap-1 text-sm text-primary hover:underline underline-offset-4"
              data-testid="dashboard-all-integrations"
            >
              See all integrations <ArrowUpRight className="h-3.5 w-3.5" />
            </Link>
          </SectionCard>
        </div>
      </div>
    </AppShell>
  );
};

export default Dashboard;
