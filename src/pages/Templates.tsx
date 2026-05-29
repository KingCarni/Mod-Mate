"use client";

import React, { useState, useMemo } from "react";
import { ArrowUpRight, CheckCircle2, Search, Sparkles, X } from "lucide-react";
import { useRouter } from "next/navigation";
import AppShell from "@/components/layout/AppShell";
import SectionCard from "@/components/mate/SectionCard";
import TemplateCard from "@/components/mate/TemplateCard";
import Badge from "@/components/mate/Badge";
import { templates, templateCategories, futureConcepts, featuredTemplateIds } from "@/data/mockData";
import { getCompanionProfileTemplate } from "@/lib/companionProfileTemplates";
import {
  saveCompanionProfileDraft,
  saveCompanionProfileTemplate,
} from "@/lib/companionProfileStorage";

type Template = (typeof templates)[number];

const showInternalTemplates = process.env.NODE_ENV !== "production";

const visibleTemplates = templates.filter((template) => {
  return showInternalTemplates || template.visibility !== "internal";
});

const maturityCopy = [
  { label: "Ready", body: "Has a full companion profile wired into Builder and Playground.", tone: "sage" },
  { label: "Template", body: "Good starter shape; may still need project-specific tuning.", tone: "primary" },
  { label: "Concept", body: "Discovery idea only; useful for planning future companions.", tone: "ochre" },
  { label: "Coming Soon", body: "Planned surface that should not pretend to be live yet.", tone: "neutral" },
];

const Templates = () => {
  const router = useRouter();
  const [active, setActive] = useState("All");
  const [query, setQuery] = useState("");
  const [templateNotice, setTemplateNotice] = useState<string | null>(null);
  const [previewTemplateId, setPreviewTemplateId] = useState<string | null>(featuredTemplateIds[0] ?? null);

  const featuredTemplates = useMemo(
    () => featuredTemplateIds
      .map((id) => visibleTemplates.find((template) => template.id === id))
      .filter(Boolean) as Template[],
    [],
  );

  const filtered = useMemo(() => {
    return visibleTemplates.filter((t) => {
      const matchCat = active === "All" || t.category === active;
      const haystack = [
        t.title,
        t.description,
        t.category,
        t.tag,
        t.maturity,
        t.starterPrompt,
        ...(t.memoryPreview ?? []),
        ...(t.guardrailPreview ?? []),
        ...(t.actionPreview ?? []),
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();
      const matchQ = !query || haystack.includes(query.toLowerCase());
      return matchCat && matchQ;
    });
  }, [active, query]);

  const selectedPreview = useMemo(() => {
    return visibleTemplates.find((template) => template.id === previewTemplateId) ?? featuredTemplates[0] ?? visibleTemplates[0];
  }, [featuredTemplates, previewTemplateId]);

  const useTemplate = (templateId: string) => {
    const selectedTemplate = visibleTemplates.find((t) => t.id === templateId);

    if (!selectedTemplate) {
      setTemplateNotice("This template is not available in the current workspace.");
      return;
    }

    const profileTemplate = getCompanionProfileTemplate(templateId);

    if (!profileTemplate) {
      setTemplateNotice(
        `${selectedTemplate.title} is a discovery preview. A full Builder profile has not been added yet.`,
      );
      setPreviewTemplateId(templateId);
      return;
    }

    saveCompanionProfileTemplate(profileTemplate);
    saveCompanionProfileDraft(profileTemplate);
    router.push(`/builder?template=${templateId}`);
  };

  const previewTemplate = (templateId: string) => {
    setPreviewTemplateId(templateId);
    setTemplateNotice(null);
  };

  return (
    <AppShell>
      <div data-testid="templates-page" className="space-y-8">
        <section className="surface-card grain p-7 md:p-9 overflow-hidden relative" data-testid="templates-hero">
          <div className="absolute -right-16 -top-20 h-64 w-64 rounded-full bg-accent-ochre/20 blur-3xl" />
          <div className="relative z-10 flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6">
            <div>
              <p className="eyebrow">Templates · Discovery</p>
              <h1 className="font-heading text-3xl md:text-5xl font-medium tracking-tight mt-3 max-w-4xl">
                Start from a companion that already understands the shape of your work.
              </h1>
              <p className="text-sm md:text-base text-muted-foreground mt-4 max-w-2xl leading-relaxed">
                Browse practical starter companions, preview their memory/rules/actions, then load the right one into Builder when you are ready.
              </p>
              {templateNotice && (
                <div className="mt-4 rounded-2xl border border-accent-ochre/30 bg-accent-ochre/10 px-4 py-3 text-sm text-muted-foreground" data-testid="template-notice">
                  {templateNotice}
                </div>
              )}
            </div>
            <div className="relative w-full lg:w-80">
              <Search className="h-4 w-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search templates, memory, rules..."
                data-testid="templates-search"
                className="rounded-full border border-border bg-white pl-9 pr-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 w-full"
              />
            </div>
          </div>
        </section>

        <SectionCard
          eyebrow="Featured starters"
          title="Good places to begin"
          description="These show the range of Mod-Mate: creative workflows, QA/product work, and game-system design."
          testId="featured-templates"
        >
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
            {featuredTemplates.map((template) => (
              <TemplateCard
                key={template.id}
                template={template}
                onUseTemplate={useTemplate}
                onPreviewTemplate={previewTemplate}
              />
            ))}
          </div>
        </SectionCard>

        {selectedPreview && (
          <SectionCard
            eyebrow="Template preview"
            title={selectedPreview.title}
            description={selectedPreview.description}
            testId="template-preview-panel"
            action={
              <button
                type="button"
                onClick={() => setPreviewTemplateId(null)}
                className="rounded-full border border-border bg-white p-2 text-muted-foreground hover:text-foreground hover:bg-muted"
                aria-label="Close template preview"
              >
                <X className="h-4 w-4" />
              </button>
            }
          >
            <div className="grid grid-cols-1 xl:grid-cols-[0.95fr,1.05fr] gap-6">
              <div className="rounded-3xl border border-border bg-muted/35 p-5">
                <div className="flex flex-wrap gap-2">
                  <Badge tone="primary">{selectedPreview.category}</Badge>
                  {selectedPreview.maturity && <Badge tone="sage">{selectedPreview.maturity}</Badge>}
                  {selectedPreview.tag && <Badge tone="ochre">{selectedPreview.tag}</Badge>}
                </div>
                <div className="mt-5 rounded-2xl bg-primary text-primary-foreground p-5">
                  <p className="eyebrow text-primary-foreground/70">Starter prompt</p>
                  <p className="font-heading text-xl leading-snug mt-2">
                    {selectedPreview.starterPrompt ?? "What should this companion help with first?"}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => useTemplate(selectedPreview.id)}
                  data-testid="template-preview-use"
                  className="mt-5 inline-flex items-center justify-center gap-2 rounded-full bg-primary text-primary-foreground px-5 py-2.5 text-sm font-medium hover:-translate-y-0.5 hover:shadow-lift transition-all"
                >
                  Use this template <ArrowUpRight className="h-4 w-4" />
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <PreviewList title="Memory" items={selectedPreview.memoryPreview ?? []} />
                <PreviewList title="Guardrails" items={selectedPreview.guardrailPreview ?? []} />
                <PreviewList title="Actions" items={selectedPreview.actionPreview ?? []} />
              </div>
            </div>
          </SectionCard>
        )}

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
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 auto-rows-[minmax(300px,_auto)]"
          data-testid="templates-grid"
        >
          {filtered.map((t) => (
            <TemplateCard
              key={t.id}
              template={t}
              onUseTemplate={useTemplate}
              onPreviewTemplate={previewTemplate}
            />
          ))}
          {filtered.length === 0 && (
            <div className="md:col-span-2 lg:col-span-3 border border-dashed border-border rounded-2xl p-12 text-center" data-testid="templates-empty">
              <Sparkles className="h-8 w-8 mx-auto text-muted-foreground" />
              <p className="font-heading text-xl font-medium mt-4">No templates match yet.</p>
              <p className="text-sm text-muted-foreground mt-2">Try a broader category, or search for memory, support, QA, story, docs, or game design.</p>
            </div>
          )}
        </div>

        <SectionCard
          eyebrow="Maturity labels"
          title="Know what you are starting from"
          description="Templates can be usable today, good starter shapes, future concepts, or planned surfaces."
          testId="template-maturity-labels"
        >
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {maturityCopy.map((item) => (
              <div key={item.label} className="rounded-2xl border border-border bg-white p-4">
                <Badge tone={item.tone}>{item.label}</Badge>
                <p className="text-sm text-muted-foreground mt-3 leading-relaxed">{item.body}</p>
              </div>
            ))}
          </div>
        </SectionCard>

        <SectionCard
          eyebrow="Future concepts"
          title="What companions could become next"
          description="Demo concepts — not features yet. Use these to imagine where Mod-Mate could go without turning the MVP into a media platform too early."
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

const PreviewList = ({ title, items }: { title: string; items: string[] }) => (
  <div className="rounded-2xl border border-border bg-white p-4">
    <p className="eyebrow">{title}</p>
    <div className="mt-3 space-y-2">
      {items.length > 0 ? (
        items.map((item) => (
          <div key={item} className="flex items-start gap-2 text-sm text-muted-foreground">
            <CheckCircle2 className="h-3.5 w-3.5 text-accent-sage mt-0.5 shrink-0" />
            <span>{item}</span>
          </div>
        ))
      ) : (
        <p className="text-sm text-muted-foreground">No preview details yet.</p>
      )}
    </div>
  </div>
);

export default Templates;
