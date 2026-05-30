export const COMPANION_PROFILE_SCHEMA_VERSION = "1.0.0" as const;

export const companionCategories = [
  "Creative Writing",
  "QA & Product",
  "Game Design",
  "Tabletop RPG",
  "Support & Onboarding",
  "Character & Roleplay",
  "Business Workflow",
  "Product Docs",
  "Custom",
] as const;

export const companionTones = [
  "Warm",
  "Direct",
  "Playful",
  "Editorial",
  "Cinematic",
] as const;

export const companionResponseStyles = [
  "Concise",
  "Detailed",
  "Bullet-first",
  "Conversational",
] as const;

export const companionStatuses = ["Draft", "Ready", "Template", "Published"] as const;
export const companionAccents = ["primary", "sage", "ochre", "terracotta"] as const;
export const companionAvatarSources = ["default", "uploaded", "generated"] as const;

export type CompanionProfileSchemaVersion = typeof COMPANION_PROFILE_SCHEMA_VERSION;
export type CompanionCategory = (typeof companionCategories)[number];
export type CompanionTone = (typeof companionTones)[number];
export type CompanionResponseStyle = (typeof companionResponseStyles)[number];
export type CompanionStatus = (typeof companionStatuses)[number];
export type CompanionAccent = (typeof companionAccents)[number];
export type CompanionAvatarSource = (typeof companionAvatarSources)[number];

export type CompanionAvatar = {
  imageUrl?: string;
  prompt?: string;
  source?: CompanionAvatarSource;
  generatedAt?: string;
};

export type CompanionPersona = {
  role: string;
  tone: CompanionTone;
  responseStyle: CompanionResponseStyle;
};

export type CompanionMemoryCategory = {
  id: string;
  label: string;
  description?: string;
  color: CompanionAccent;
  enabled: boolean;
};

export type CompanionAction = {
  id: string;
  label: string;
  description?: string;
  enabled: boolean;
};

export type CompanionContextRule = {
  id: string;
  label: string;
  required: boolean;
};

export type CompanionProfile = {
  schemaVersion: CompanionProfileSchemaVersion;
  id: string;
  name: string;
  description: string;
  category: CompanionCategory;
  status: CompanionStatus;
  avatar?: CompanionAvatar;
  persona: CompanionPersona;
  systemRules: string[];
  memoryCategories: CompanionMemoryCategory[];
  allowedActions: CompanionAction[];
  contextRules: CompanionContextRule[];
  createdAt: string;
  updatedAt: string;
};

export type CompanionCardSummary = {
  id: string;
  name: string;
  category: CompanionCategory;
  description: string;
  status: CompanionStatus;
  accent: CompanionAccent;
  initials: string;
  lastEdited: string;
  avatar?: CompanionAvatar;
};

export type CompanionProfileValidationResult =
  | { ok: true; profile: CompanionProfile }
  | { ok: false; errors: string[] };
