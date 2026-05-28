import React, { useState } from "react";
import { Link } from "react-router-dom";
import {
  Save,
  FlaskConical,
  X,
  Plus,
  Sparkles,
  ChevronDown,
} from "lucide-react";
import AppShell from "@/components/layout/AppShell";
import SectionCard from "@/components/mate/SectionCard";
import Badge from "@/components/mate/Badge";
import { builderRules, memoryCategories, allowedActions } from "@/data/mockData";

const CATEGORIES = [
  "Creative Writing",
  "QA & Product",
  "Game Design",
  "Tabletop RPG",
  "Support & Onboarding",
  "Character & Roleplay",
  "Business Workflow",
];

const TONE_OPTIONS = ["Warm", "Direct", "Playful", "Editorial", "Cinematic"];
const STYLE_OPTIONS = ["Concise", "Detailed", "Bullet-first", "Conversational"];

const Builder = () => {
  const [name, setName] = useState("DraftMate");
  const [description, setDescription] = useState(
    "Screenplay & story companion. Tracks beats, characters, and tone across drafts.",
  );
  const [category, setCategory] = useState("Creative Writing");
  const [role, setRole] = useState("Co-writer and continuity guardian");
  const [tone, setTone] = useState("Editorial");
  const [style, setStyle] = useState("Concise");
  const [rules, setRules] = useState(builderRules);
  const [newRule, setNewRule] = useState("");
  const [memory, setMemory] = useState(memoryCategories);
  const [actions, setActions] = useState(allowedActions);

  const profile = {
    name,
    description,
    category,
    persona: { role, tone, response_style: style },
    rules,
    memory_categories: memory.map((m) => m.label),
    allowed_actions: actions.filter((a) => a.enabled).map((a) => a.id),
  };

  const addRule = () => {
    if (!newRule.trim()) return;
    setRules([...rules, newRule.trim()]);
    setNewRule("");
  };

  return (
    <AppShell>
      <div data-testid="builder-page" className="space-y-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4">
          <div>
            <p className="eyebrow">Companion builder</p>
            <h1 className="font-heading text-3xl md:text-4xl font-medium tracking-tight mt-2">
              Shape how your companion thinks, remembers, and acts.
            </h1>
            <p className="text-sm text-muted-foreground mt-2 max-w-2xl">
              Configure persona, guardrails, memory, and allowed actions. Nothing here saves yet —
              this is a UI preview.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              data-testid="builder-save"
              className="inline-flex items-center gap-1.5 rounded-full bg-white border border-border px-4 py-2 text-sm font-medium hover:bg-muted"
            >
              <Save className="h-4 w-4" /> Save draft
            </button>
            <Link
              to="/app/playground"
              data-testid="builder-test"
              className="inline-flex items-center gap-1.5 rounded-full bg-primary text-primary-foreground px-4 py-2 text-sm font-medium hover:-translate-y-0.5 hover:shadow-lift transition-all"
            >
              <FlaskConical className="h-4 w-4" /> Test Companion
            </Link>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            {/* Basics */}
            <SectionCard eyebrow="01" title="Companion basics" testId="builder-basics">
              <div className="grid grid-cols-1 md:grid-cols-[auto,1fr] gap-5 items-start">
                <div className="flex flex-col items-center gap-2">
                  <div className="h-24 w-24 rounded-3xl bg-accent-ochre/25 text-[#7B5A1F] flex items-center justify-center font-heading text-2xl font-medium">
                    {name.slice(0, 2).toUpperCase()}
                  </div>
                  <button
                    type="button"
                    data-testid="builder-change-avatar"
                    className="text-xs text-muted-foreground hover:text-foreground"
                  >
                    Change avatar
                  </button>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full">
                  <Field label="Name">
                    <input
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      data-testid="builder-name"
                      className="mt-2 w-full rounded-xl border border-border bg-white px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
                    />
                  </Field>
                  <Field label="Category">
                    <SelectInput
                      value={category}
                      onChange={setCategory}
                      options={CATEGORIES}
                      testId="builder-category"
                    />
                  </Field>
                  <div className="md:col-span-2">
                    <Field label="Description">
                      <textarea
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        rows={3}
                        data-testid="builder-description"
                        className="mt-2 w-full rounded-xl border border-border bg-white px-3.5 py-2.5 text-sm leading-relaxed focus:outline-none focus:ring-2 focus:ring-primary/30"
                      />
                    </Field>
                  </div>
                </div>
              </div>
            </SectionCard>

            {/* Persona */}
            <SectionCard eyebrow="02" title="Persona" description="How it speaks, what it does, and how it shows up." testId="builder-persona">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Field label="Role">
                  <input
                    value={role}
                    onChange={(e) => setRole(e.target.value)}
                    data-testid="builder-role"
                    className="mt-2 w-full rounded-xl border border-border bg-white px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
                  />
                </Field>
                <Field label="Tone">
                  <SelectInput value={tone} onChange={setTone} options={TONE_OPTIONS} testId="builder-tone" />
                </Field>
                <Field label="Response style">
                  <SelectInput value={style} onChange={setStyle} options={STYLE_OPTIONS} testId="builder-style" />
                </Field>
              </div>
            </SectionCard>

            {/* Rules */}
            <SectionCard eyebrow="03" title="Rules & guardrails" description="The companion must never break these." testId="builder-rules">
              <div className="flex flex-wrap gap-2 mb-4" data-testid="rules-list">
                {rules.map((r, idx) => (
                  <span
                    key={idx}
                    data-testid={`rule-${idx}`}
                    className="group inline-flex items-center gap-2 rounded-full bg-muted px-3 py-1.5 text-xs"
                  >
                    {r}
                    <button
                      type="button"
                      onClick={() => setRules(rules.filter((_, i) => i !== idx))}
                      data-testid={`rule-${idx}-remove`}
                      className="opacity-50 hover:opacity-100"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </span>
                ))}
              </div>
              <div className="flex gap-2">
                <input
                  value={newRule}
                  onChange={(e) => setNewRule(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && addRule()}
                  placeholder="Add a guardrail and press Enter"
                  data-testid="builder-new-rule"
                  className="flex-1 rounded-xl border border-border bg-white px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
                />
                <button
                  type="button"
                  onClick={addRule}
                  data-testid="builder-add-rule"
                  className="inline-flex items-center gap-1.5 rounded-xl bg-primary text-primary-foreground px-4 py-2 text-sm font-medium"
                >
                  <Plus className="h-4 w-4" /> Add
                </button>
              </div>
            </SectionCard>

            {/* Memory */}
            <SectionCard eyebrow="04" title="Memory categories" description="What the companion is allowed to remember across sessions." testId="builder-memory">
              <div className="flex flex-wrap gap-2">
                {memory.map((m) => (
                  <button
                    key={m.id}
                    type="button"
                    data-testid={`memory-${m.id}`}
                    className="inline-flex items-center gap-2 rounded-2xl border border-border bg-white px-4 py-2 text-sm hover:bg-muted"
                  >
                    <span
                      className={`h-2 w-2 rounded-full ${
                        m.color === "sage"
                          ? "bg-accent-sage"
                          : m.color === "ochre"
                            ? "bg-accent-ochre"
                            : m.color === "terracotta"
                              ? "bg-secondary"
                              : "bg-primary"
                      }`}
                    />
                    {m.label}
                  </button>
                ))}
                <button
                  type="button"
                  data-testid="memory-add"
                  className="inline-flex items-center gap-1 rounded-2xl border border-dashed border-border px-4 py-2 text-sm text-muted-foreground hover:bg-muted"
                >
                  <Plus className="h-3.5 w-3.5" /> Add category
                </button>
              </div>
            </SectionCard>

            {/* Allowed actions */}
            <SectionCard eyebrow="05" title="Allowed actions" description="Toggle the things this companion is permitted to do." testId="builder-actions">
              <ul className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {actions.map((a) => (
                  <li
                    key={a.id}
                    className="flex items-center justify-between rounded-xl border border-border bg-white px-4 py-3"
                    data-testid={`action-${a.id}`}
                  >
                    <span className="text-sm">{a.label}</span>
                    <button
                      type="button"
                      onClick={() =>
                        setActions(
                          actions.map((x) => (x.id === a.id ? { ...x, enabled: !x.enabled } : x)),
                        )
                      }
                      data-testid={`action-${a.id}-toggle`}
                      className={`relative h-6 w-11 rounded-full transition-colors ${
                        a.enabled ? "bg-primary" : "bg-border"
                      }`}
                    >
                      <span
                        className={`absolute top-0.5 h-5 w-5 rounded-full bg-white transition-transform ${
                          a.enabled ? "translate-x-5" : "translate-x-0.5"
                        }`}
                      />
                    </button>
                  </li>
                ))}
              </ul>
            </SectionCard>
          </div>

          {/* Preview */}
          <aside className="lg:sticky lg:top-24 self-start space-y-5" data-testid="builder-preview">
            <SectionCard eyebrow="Preview" title="Profile JSON" testId="builder-json">
              <div className="rounded-xl bg-primary text-primary-foreground p-4 max-h-[420px] overflow-auto">
                <pre className="text-xs leading-relaxed mono whitespace-pre-wrap" data-testid="builder-json-pre">
                  {JSON.stringify(profile, null, 2)}
                </pre>
              </div>
            </SectionCard>
            <div className="surface-card p-5 flex items-center gap-3" data-testid="builder-meta">
              <Sparkles className="h-5 w-5 text-secondary" />
              <p className="text-xs text-muted-foreground">
                Tip: each change is mock-state only. Wiring (save / version / publish) comes in the
                next pass.
              </p>
            </div>
            <Link
              to="/app/playground"
              data-testid="builder-launch-playground"
              className="block text-center rounded-full bg-primary text-primary-foreground px-5 py-3 text-sm font-medium hover:-translate-y-0.5 hover:shadow-lift transition-all"
            >
              Launch in Playground →
            </Link>
          </aside>
        </div>
      </div>
    </AppShell>
  );
};

const Field = ({ label, children }) => (
  <label className="block">
    <span className="eyebrow">{label}</span>
    {children}
  </label>
);

const SelectInput = ({ value, onChange, options, testId }) => (
  <div className="relative mt-2">
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      data-testid={testId}
      className="appearance-none w-full rounded-xl border border-border bg-white px-3.5 py-2.5 pr-9 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
    >
      {options.map((o) => (
        <option key={o} value={o}>
          {o}
        </option>
      ))}
    </select>
    <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
  </div>
);

export default Builder;
