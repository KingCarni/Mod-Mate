"use client";

import React, { useState, useMemo } from "react";
import { Search } from "lucide-react";
import { useRouter } from "next/navigation";
import AppShell from "@/components/layout/AppShell";
import SectionCard from "@/components/mate/SectionCard";
import TemplateCard from "@/components/mate/TemplateCard";
import Badge from "@/components/mate/Badge";
import { templates, templateCategories, futureConcepts } from "@/data/mockData";
import { getCompanionProfileTemplate } from "@/lib/companionProfileTemplates";
import {
  saveCompanionProfileDraft,
  saveCompanionProfileTemplate,
} from "@/lib/companionProfileStorage";

const Templates = () => {
  const router = useRouter();
  const [active, setActive] = useState("All");
  const [query, setQuery] = useState("");
  const [templateNotice, setTemplateNotice] = useState<string | null>(null);

  const filtered = useMemo(() => {
    return templates.filter((t) => {
      const matchCat = active === "All" || t.category === active;
      const matchQ =
        !query ||
        t.title.toLowerCase().includes(query.toLowerCase()) ||
        t.description.toLowerCase().includes(query.toLowerCase());
      return matchCat && matchQ;
    });
  }, [active, query]);

  const useTemplate = (templateId: string) => {
    const profileTemplate = getCompanionProfileTemplate(templateId);

    if (!profileTemplate) {
      setTemplateNotice("This template is still a visual placeholder. A full profile has not been added yet.");
      return;
    }

    saveCompanionProfileTemplate(profileTemplate);
    saveCompanionProfileDraft(profileTemplate);
    router.push(`/builder?template=${templateId}`);
  };

  return (
    <AppShell>
      <div data-testid="templates-page" className="space-y-8">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4">
          <div>
            <p className="eyebrow">Templates · Explore</p>
            <h1 className="font-heading text-3xl md:text-4xl font-medium tracking-tight mt-2 max-w-3xl">
              Find a companion shape that already understands your work.
            </h1>
            {templateNotice && (
              <p className="mt-3 text-sm text-muted-foreground" data-testid="template-notice">
                {templateNotice}
              </p>
            )}
          </div>
          <div className="relative">
            <Search className="h-4 w-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search templates"
              data-testid="templates-search"
              className="rounded-full border border-border bg-white pl-9 pr-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 w-64"
            />
          </div>
        </div>

        <div className="flex flex-wrap gap-2" data-testid="templates-filters">
          {templateCategories.map((c) => (
            <button
              key={c}
              type="button"
              onClick={() => setActive(c)}
              data-testid={`filter-${c.toLowerCase().replace(/[^a-z]+/g, "-")}`}
              className={`rounded-full px-4 py-1.5 text-xs font-medium border transition-colors ${
                active === c
                  ? "bg-primary text-primary-foreground border-primary"
                  : "bg-white text-foreground border-border hover:bg-muted"
              }`}
            >
              {c}
            </button>
          ))}
        </div>

        <div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 auto-rows-[minmax(240px,_auto)]"
          data-testid="templates-grid"
        >
          {filtered.map((t, i) => (
            <TemplateCard
              key={t.id}
              template={t}
              featured={i === 0 && filtered.length > 3}
              onUseTemplate={useTemplate}
            />
          ))}
          {filtered.length === 0 && (
            <div className="md:col-span-2 lg:col-span-3 border border-dashed border-border rounded-2xl p-12 text-center text-muted-foreground" data-testid="templates-empty">
              No templates match your search yet.
            </div>
          )}
        </div>

        <SectionCard
          eyebrow="Future concepts"
          title="What companions could become next"
          description="Demo concepts — not features yet. Use these to imagine where Mod-Mate could go."
          testId="future-concepts"
        >
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {futureConcepts.map((c) => (
              <div
                key={c.id}
                className="rounded-2xl border border-dashed border-border bg-muted/40 p-5 flex flex-col gap-3"
                data-testid={`concept-${c.id}`}
              >
                <Badge tone="ochre">{c.note}</Badge>
                <p className="font-heading text-lg font-medium leading-snug">{c.title}</p>
                <p className="text-xs text-muted-foreground">
                  Concept card · not a working feature.
                </p>
              </div>
            ))}
          </div>
        </SectionCard>
      </div>
    </AppShell>
  );
};

export default Templates;
