"use client";

import React, {
  type ChangeEvent,
  type ReactNode,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import {
  AlertCircle,
  CheckCircle2,
  ChevronDown,
  Download,
  FlaskConical,
  Plus,
  RotateCcw,
  Save,
  Sparkles,
  Trash2,
  Upload,
  X,
} from "lucide-react";
import AppShell from "@/components/layout/AppShell";
import SectionCard from "@/components/mate/SectionCard";
import { allowedActions, builderRules, memoryCategories } from "@/data/mockData";
import {
  createCompanionProfile,
  getCompanionProfileFileName,
  parseCompanionProfileJson,
  stringifyCompanionProfile,
  validateCompanionProfile,
} from "@/lib/companionProfiles";
import {
  clearCompanionProfileDraft,
  loadCompanionProfileDraft,
  saveCompanionProfileDraft,
  saveCompanionProfileLaunch,
} from "@/lib/companionProfileStorage";
import {
  companionCategories,
  companionResponseStyles,
  companionTones,
  type CompanionAction,
  type CompanionCategory,
  type CompanionMemoryCategory,
  type CompanionProfile,
  type CompanionResponseStyle,
  type CompanionTone,
} from "@/types/companionProfile";

const DEFAULT_CONTEXT_RULES = [
  { id: "current-screen", label: "Use current screen context first", required: true },
  { id: "memory-sections", label: "Use enabled memory categories only", required: true },
  { id: "missing-context", label: "Ask before guessing when context is missing", required: true },
];

const DEFAULT_NAME = "DraftMate";
const DEFAULT_DESCRIPTION =
  "Screenplay & story companion. Tracks beats, characters, and tone across drafts.";
const DEFAULT_CATEGORY: CompanionCategory = "Creative Writing";
const DEFAULT_ROLE = "Co-writer and continuity guardian";
const DEFAULT_TONE: CompanionTone = "Editorial";
const DEFAULT_STYLE: CompanionResponseStyle = "Concise";

const toMemoryCategories = (): CompanionMemoryCategory[] =>
  memoryCategories.map((category) => ({
    id: category.id,
    label: category.label,
    color: category.color as CompanionMemoryCategory["color"],
    enabled: true,
  }));

const toAllowedActions = (): CompanionAction[] =>
  allowedActions.map((action) => ({
    id: action.id,
    label: action.label,
    enabled: action.enabled,
  }));

type ImportState =
  | { type: "idle"; message: string }
  | { type: "success"; message: string }
  | { type: "error"; message: string };

type BuilderSnapshotInput = {
  name: string;
  description: string;
  category: CompanionCategory;
  role: string;
  tone: CompanionTone;
  style: CompanionResponseStyle;
  rules: string[];
  memory: CompanionMemoryCategory[];
  actions: CompanionAction[];
};

const idleMessage: ImportState = {
  type: "idle",
  message: "Export or import portable companion profiles as JSON.",
};

const createBuilderSnapshot = (input: BuilderSnapshotInput) =>
  JSON.stringify({
    name: input.name,
    description: input.description,
    category: input.category,
    role: input.role,
    tone: input.tone,
    style: input.style,
    rules: input.rules,
    memory: input.memory,
    actions: input.actions,
  });

const createBuilderSnapshotFromProfile = (profile: CompanionProfile) =>
  createBuilderSnapshot({
    name: profile.name,
    description: profile.description,
    category: profile.category,
    role: profile.persona.role,
    tone: profile.persona.tone,
    style: profile.persona.responseStyle,
    rules: profile.systemRules,
    memory: profile.memoryCategories,
    actions: profile.allowedActions,
  });

const Builder = () => {
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [name, setName] = useState(DEFAULT_NAME);
  const [description, setDescription] = useState(DEFAULT_DESCRIPTION);
  const [category, setCategory] = useState<CompanionCategory>(DEFAULT_CATEGORY);
  const [role, setRole] = useState(DEFAULT_ROLE);
  const [tone, setTone] = useState<CompanionTone>(DEFAULT_TONE);
  const [style, setStyle] = useState<CompanionResponseStyle>(DEFAULT_STYLE);
  const [rules, setRules] = useState<string[]>(builderRules);
  const [newRule, setNewRule] = useState("");
  const [memory, setMemory] = useState<CompanionMemoryCategory[]>(toMemoryCategories);
  const [actions, setActions] = useState<CompanionAction[]>(toAllowedActions);
  const [importState, setImportState] = useState<ImportState>(idleMessage);
  const [savedSnapshot, setSavedSnapshot] = useState<string | null>(null);
  const [lastSavedAt, setLastSavedAt] = useState<string | null>(null);
  const [hydrated, setHydrated] = useState(false);

  const profile = useMemo(
    () =>
      createCompanionProfile({
        name,
        description,
        category,
        role,
        tone,
        responseStyle: style,
        systemRules: rules,
        memoryCategories: memory,
        allowedActions: actions,
        contextRules: DEFAULT_CONTEXT_RULES,
        now: "2026-01-01T00:00:00.000Z",
      }),
    [actions, category, description, memory, name, role, rules, style, tone],
  );

  const profileJson = stringifyCompanionProfile(profile);
  const validation = validateCompanionProfile(profile);
  const currentSnapshot = useMemo(
    () =>
      createBuilderSnapshot({
        name,
        description,
        category,
        role,
        tone,
        style,
        rules,
        memory,
        actions,
      }),
    [actions, category, description, memory, name, role, rules, style, tone],
  );
  const hasUnsavedChanges = hydrated && savedSnapshot !== currentSnapshot;

  const applyProfileToBuilder = (nextProfile: CompanionProfile) => {
    setName(nextProfile.name);
    setDescription(nextProfile.description);
    setCategory(nextProfile.category);
    setRole(nextProfile.persona.role);
    setTone(nextProfile.persona.tone);
    setStyle(nextProfile.persona.responseStyle);
    setRules(nextProfile.systemRules);
    setMemory(nextProfile.memoryCategories);
    setActions(nextProfile.allowedActions);
  };

  useEffect(() => {
    const stored = loadCompanionProfileDraft();

    if (stored.ok === true) {
      applyProfileToBuilder(stored.profile);
      setSavedSnapshot(createBuilderSnapshotFromProfile(stored.profile));
      setLastSavedAt(stored.profile.updatedAt);
      setImportState({
        type: "success",
        message: `Loaded local draft for ${stored.profile.name}.`,
      });
    } else if (stored.ok === false) {
      setImportState({
        type: "error",
        message: `Local draft could not load: ${stored.errors.slice(0, 2).join(" ")}`,
      });
      setSavedSnapshot(currentSnapshot);
    } else {
      setSavedSnapshot(currentSnapshot);
    }

    setHydrated(true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const addRule = () => {
    if (!newRule.trim()) return;
    setRules([...rules, newRule.trim()]);
    setNewRule("");
  };

  const persistDraft = (messageMode: "save" | "test" = "save"): CompanionProfile | null => {
    if (!validation.ok) {
      setImportState({
        type: "error",
        message: `Draft cannot save yet: ${validation.errors[0]}`,
      });
      return null;
    }

    const now = new Date().toISOString();
    const profileToSave = createCompanionProfile({
      name,
      description,
      category,
      role,
      tone,
      responseStyle: style,
      systemRules: rules,
      memoryCategories: memory,
      allowedActions: actions,
      contextRules: DEFAULT_CONTEXT_RULES,
      id: profile.id,
      createdAt: profile.createdAt,
      updatedAt: now,
      now,
    });

    saveCompanionProfileDraft(profileToSave);
    if (messageMode === "test") {
      saveCompanionProfileLaunch(profileToSave);
    }
    setSavedSnapshot(currentSnapshot);
    setLastSavedAt(now);
    setImportState({
      type: "success",
      message:
        messageMode === "test"
          ? `Saved ${profileToSave.name}. Opening Playground...`
          : `Saved local draft for ${profileToSave.name}.`,
    });

    return profileToSave;
  };

  const saveDraft = () => {
    persistDraft("save");
  };

  const testCompanion = () => {
    const savedProfile = persistDraft("test");
    if (!savedProfile) return;
    window.location.assign("/playground");
  };

  const resetToDefault = () => {
    setName(DEFAULT_NAME);
    setDescription(DEFAULT_DESCRIPTION);
    setCategory(DEFAULT_CATEGORY);
    setRole(DEFAULT_ROLE);
    setTone(DEFAULT_TONE);
    setStyle(DEFAULT_STYLE);
    setRules(builderRules);
    setMemory(toMemoryCategories());
    setActions(toAllowedActions());
    setImportState({
      type: "success",
      message: "Builder reset to the default starter companion. Save draft to keep it.",
    });
  };

  const clearLocalDraft = () => {
    clearCompanionProfileDraft();
    setSavedSnapshot(currentSnapshot);
    setLastSavedAt(null);
    setImportState({
      type: "success",
      message: "Local draft cleared. The current on-screen profile was not changed.",
    });
  };

  const exportProfile = () => {
    if (!validation.ok) {
      setImportState({
        type: "error",
        message: `Profile cannot export yet: ${validation.errors[0]}`,
      });
      return;
    }

    const blob = new Blob([profileJson], {
      type: "application/json;charset=utf-8",
    });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = getCompanionProfileFileName(profile);
    document.body.appendChild(link);
    link.click();
    link.remove();
    URL.revokeObjectURL(url);

    setImportState({
      type: "success",
      message: `Exported ${getCompanionProfileFileName(profile)}.`,
    });
  };

  const importProfile = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    event.target.value = "";

    if (!file) return;

    try {
      const json = await file.text();
      const result = parseCompanionProfileJson(json);

      if (!result.ok) {
        setImportState({
          type: "error",
          message: `Import failed: ${result.errors.slice(0, 3).join(" ")}`,
        });
        return;
      }

      applyProfileToBuilder(result.profile);
      setImportState({
        type: "success",
        message: `Imported ${result.profile.name} from ${file.name}. Save draft to keep it locally.`,
      });
    } catch {
      setImportState({
        type: "error",
        message: "Import failed: unable to read the selected file.",
      });
    }
  };

  return (
    <AppShell>
      <div data-testid="builder-page" className="space-y-8">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4">
          <div>
            <p className="eyebrow">Companion builder</p>
            <h1 className="font-heading text-3xl md:text-4xl font-medium tracking-tight mt-2">
              Shape how your companion thinks, remembers, and acts.
            </h1>
            <p className="text-sm text-muted-foreground mt-2 max-w-2xl">
              Configure persona, guardrails, memory, and allowed actions. Drafts save locally for now —
              no backend, auth, or database yet.
            </p>
            <div className="mt-3 flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
              <span
                data-testid="builder-save-status"
                className={`rounded-full border px-3 py-1 ${
                  hasUnsavedChanges
                    ? "border-secondary/40 bg-secondary/10 text-foreground"
                    : "border-accent-sage/40 bg-accent-sage/10 text-foreground"
                }`}
              >
                {hasUnsavedChanges ? "Unsaved local changes" : "Local draft up to date"}
              </span>
              {lastSavedAt && <span>Last saved {new Date(lastSavedAt).toLocaleString()}</span>}
            </div>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <input
              ref={fileInputRef}
              type="file"
              accept="application/json,.json"
              onChange={importProfile}
              className="hidden"
              data-testid="builder-import-input"
            />
            <button
              type="button"
              data-testid="builder-import"
              onClick={() => fileInputRef.current?.click()}
              className="inline-flex items-center gap-1.5 rounded-full bg-white border border-border px-4 py-2 text-sm font-medium hover:bg-muted"
            >
              <Upload className="h-4 w-4" /> Import JSON
            </button>
            <button
              type="button"
              data-testid="builder-export"
              onClick={exportProfile}
              className="inline-flex items-center gap-1.5 rounded-full bg-white border border-border px-4 py-2 text-sm font-medium hover:bg-muted"
            >
              <Download className="h-4 w-4" /> Export JSON
            </button>
            <button
              type="button"
              data-testid="builder-reset-default"
              onClick={resetToDefault}
              className="inline-flex items-center gap-1.5 rounded-full bg-white border border-border px-4 py-2 text-sm font-medium hover:bg-muted"
            >
              <RotateCcw className="h-4 w-4" /> Reset
            </button>
            <button
              type="button"
              data-testid="builder-clear-local"
              onClick={clearLocalDraft}
              className="inline-flex items-center gap-1.5 rounded-full bg-white border border-border px-4 py-2 text-sm font-medium hover:bg-muted"
            >
              <Trash2 className="h-4 w-4" /> Clear local
            </button>
            <button
              type="button"
              data-testid="builder-save"
              onClick={saveDraft}
              className="inline-flex items-center gap-1.5 rounded-full bg-white border border-border px-4 py-2 text-sm font-medium hover:bg-muted"
            >
              <Save className="h-4 w-4" /> Save draft
            </button>
            <button
              type="button"
              data-testid="builder-test"
              onClick={testCompanion}
              className="inline-flex items-center gap-1.5 rounded-full bg-primary text-primary-foreground px-4 py-2 text-sm font-medium hover:-translate-y-0.5 hover:shadow-lift transition-all"
            >
              <FlaskConical className="h-4 w-4" /> Test Companion
            </button>
          </div>
        </div>

        {importState.type !== "idle" && (
          <div
            role="status"
            aria-live="polite"
            data-testid="builder-action-alert"
            className={`rounded-2xl border px-5 py-4 shadow-sm flex items-start gap-3 ${
              importState.type === "error"
                ? "border-secondary/40 bg-secondary/10 text-foreground"
                : "border-accent-sage/50 bg-accent-sage/15 text-foreground"
            }`}
          >
            {importState.type === "error" ? (
              <AlertCircle className="h-5 w-5 text-secondary shrink-0 mt-0.5" />
            ) : (
              <CheckCircle2 className="h-5 w-5 text-accent-sage shrink-0 mt-0.5" />
            )}
            <div className="space-y-1">
              <p className="text-sm font-semibold">
                {importState.type === "error" ? "Builder needs attention" : "Builder action complete"}
              </p>
              <p className="text-sm text-muted-foreground">{importState.message}</p>
            </div>
            <button
              type="button"
              onClick={() => setImportState(idleMessage)}
              className="ml-auto rounded-full p-1 text-muted-foreground hover:bg-white/70 hover:text-foreground"
              aria-label="Dismiss message"
              data-testid="builder-action-alert-dismiss"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
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
                      onChange={(event) => setName(event.target.value)}
                      data-testid="builder-name"
                      className="mt-2 w-full rounded-xl border border-border bg-white px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
                    />
                  </Field>
                  <Field label="Category">
                    <SelectInput
                      value={category}
                      onChange={(value) => setCategory(value as CompanionCategory)}
                      options={[...companionCategories]}
                      testId="builder-category"
                    />
                  </Field>
                  <div className="md:col-span-2">
                    <Field label="Description">
                      <textarea
                        value={description}
                        onChange={(event) => setDescription(event.target.value)}
                        rows={3}
                        data-testid="builder-description"
                        className="mt-2 w-full rounded-xl border border-border bg-white px-3.5 py-2.5 text-sm leading-relaxed focus:outline-none focus:ring-2 focus:ring-primary/30"
                      />
                    </Field>
                  </div>
                </div>
              </div>
            </SectionCard>

            <SectionCard eyebrow="02" title="Persona" description="How it speaks, what it does, and how it shows up." testId="builder-persona">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Field label="Role">
                  <input
                    value={role}
                    onChange={(event) => setRole(event.target.value)}
                    data-testid="builder-role"
                    className="mt-2 w-full rounded-xl border border-border bg-white px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
                  />
                </Field>
                <Field label="Tone">
                  <SelectInput
                    value={tone}
                    onChange={(value) => setTone(value as CompanionTone)}
                    options={[...companionTones]}
                    testId="builder-tone"
                  />
                </Field>
                <Field label="Response style">
                  <SelectInput
                    value={style}
                    onChange={(value) => setStyle(value as CompanionResponseStyle)}
                    options={[...companionResponseStyles]}
                    testId="builder-style"
                  />
                </Field>
              </div>
            </SectionCard>

            <SectionCard eyebrow="03" title="Rules & guardrails" description="The companion must never break these." testId="builder-rules">
              <div className="flex flex-wrap gap-2 mb-4" data-testid="rules-list">
                {rules.map((rule, index) => (
                  <span
                    key={`${rule}-${index}`}
                    data-testid={`rule-${index}`}
                    className="group inline-flex items-center gap-2 rounded-full bg-muted px-3 py-1.5 text-xs"
                  >
                    {rule}
                    <button
                      type="button"
                      onClick={() => setRules(rules.filter((_, ruleIndex) => ruleIndex !== index))}
                      data-testid={`rule-${index}-remove`}
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
                  onChange={(event) => setNewRule(event.target.value)}
                  onKeyDown={(event) => event.key === "Enter" && addRule()}
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

            <SectionCard eyebrow="04" title="Memory categories" description="What the companion is allowed to remember across sessions." testId="builder-memory">
              <div className="flex flex-wrap gap-2">
                {memory.map((categoryItem) => (
                  <button
                    key={categoryItem.id}
                    type="button"
                    onClick={() =>
                      setMemory(
                        memory.map((item) =>
                          item.id === categoryItem.id ? { ...item, enabled: !item.enabled } : item,
                        ),
                      )
                    }
                    data-testid={`memory-${categoryItem.id}`}
                    className={`inline-flex items-center gap-2 rounded-2xl border px-4 py-2 text-sm hover:bg-muted ${
                      categoryItem.enabled ? "border-border bg-white" : "border-dashed border-border bg-muted/30 text-muted-foreground"
                    }`}
                  >
                    <span className={`h-2 w-2 rounded-full ${getAccentClass(categoryItem.color)}`} />
                    {categoryItem.label}
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

            <SectionCard eyebrow="05" title="Allowed actions" description="Toggle the things this companion is permitted to do." testId="builder-actions">
              <ul className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {actions.map((action) => (
                  <li
                    key={action.id}
                    className="flex items-center justify-between rounded-xl border border-border bg-white px-4 py-3"
                    data-testid={`action-${action.id}`}
                  >
                    <span className="text-sm">{action.label}</span>
                    <button
                      type="button"
                      onClick={() =>
                        setActions(
                          actions.map((item) =>
                            item.id === action.id ? { ...item, enabled: !item.enabled } : item,
                          ),
                        )
                      }
                      data-testid={`action-${action.id}-toggle`}
                      className={`relative h-6 w-11 rounded-full transition-colors ${
                        action.enabled ? "bg-primary" : "bg-border"
                      }`}
                    >
                      <span
                        className={`absolute top-0.5 h-5 w-5 rounded-full bg-white transition-transform ${
                          action.enabled ? "translate-x-5" : "translate-x-0.5"
                        }`}
                      />
                    </button>
                  </li>
                ))}
              </ul>
            </SectionCard>
          </div>

          <aside className="lg:sticky lg:top-24 self-start space-y-5" data-testid="builder-preview">
            <SectionCard eyebrow="Preview" title="Profile JSON" testId="builder-json">
              <div className="rounded-xl bg-primary text-primary-foreground p-4 max-h-[420px] overflow-auto">
                <pre className="text-xs leading-relaxed mono whitespace-pre-wrap" data-testid="builder-json-pre">
                  {profileJson}
                </pre>
              </div>
            </SectionCard>
            <div className="surface-card p-5 flex items-start gap-3" data-testid="builder-meta">
              <Sparkles className="h-5 w-5 text-secondary shrink-0 mt-0.5" />
              <div className="space-y-1">
                <p className="text-xs font-medium">
                  {validation.ok ? "Profile matches schema v1.0.0" : "Profile needs attention"}
                </p>
                <p className="text-xs text-muted-foreground">
                  Drafts save to this browser only. Export JSON to move a companion between devices or projects.
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={testCompanion}
              data-testid="builder-launch-playground"
              className="block w-full text-center rounded-full bg-primary text-primary-foreground px-5 py-3 text-sm font-medium hover:-translate-y-0.5 hover:shadow-lift transition-all"
            >
              Save & launch Playground →
            </button>
          </aside>
        </div>
      </div>
    </AppShell>
  );
};

const getAccentClass = (accent: CompanionMemoryCategory["color"]) => {
  if (accent === "sage") return "bg-accent-sage";
  if (accent === "ochre") return "bg-accent-ochre";
  if (accent === "terracotta") return "bg-secondary";
  return "bg-primary";
};

type FieldProps = {
  label: string;
  children: ReactNode;
};

const Field = ({ label, children }: FieldProps) => (
  <label className="block">
    <span className="eyebrow">{label}</span>
    {children}
  </label>
);

type SelectInputProps = {
  value: string;
  onChange: (value: string) => void;
  options: string[];
  testId: string;
};

const SelectInput = ({ value, onChange, options, testId }: SelectInputProps) => (
  <div className="relative mt-2">
    <select
      value={value}
      onChange={(event) => onChange(event.target.value)}
      data-testid={testId}
      className="appearance-none w-full rounded-xl border border-border bg-white px-3.5 py-2.5 pr-9 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
    >
      {options.map((option) => (
        <option key={option} value={option}>
          {option}
        </option>
      ))}
    </select>
    <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
  </div>
);

export default Builder;
