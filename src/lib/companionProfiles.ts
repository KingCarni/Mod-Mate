import {
  COMPANION_PROFILE_SCHEMA_VERSION,
  companionCategories,
  companionResponseStyles,
  companionStatuses,
  companionTones,
  type CompanionAction,
  type CompanionCategory,
  type CompanionContextRule,
  type CompanionMemoryCategory,
  type CompanionProfile,
  type CompanionResponseStyle,
  type CompanionStatus,
  type CompanionTone,
  type CompanionProfileValidationResult,
} from "@/types/companionProfile";

const isString = (value: unknown): value is string =>
  typeof value === "string" && value.trim().length > 0;

const isStringArray = (value: unknown): value is string[] =>
  Array.isArray(value) && value.every(isString);

const includesValue = <T extends readonly string[]>(values: T, value: unknown): value is T[number] =>
  typeof value === "string" && values.includes(value);

const isIsoDateLike = (value: unknown): value is string =>
  typeof value === "string" && !Number.isNaN(Date.parse(value));

const validateMemoryCategory = (value: unknown, index: number, errors: string[]): value is CompanionMemoryCategory => {
  if (!value || typeof value !== "object") {
    errors.push(`memoryCategories[${index}] must be an object.`);
    return false;
  }

  const candidate = value as Partial<CompanionMemoryCategory>;
  if (!isString(candidate.id)) errors.push(`memoryCategories[${index}].id is required.`);
  if (!isString(candidate.label)) errors.push(`memoryCategories[${index}].label is required.`);
  if (!includesValue(["primary", "sage", "ochre", "terracotta"] as const, candidate.color)) {
    errors.push(`memoryCategories[${index}].color must be a known accent.`);
  }
  if (typeof candidate.enabled !== "boolean") {
    errors.push(`memoryCategories[${index}].enabled must be boolean.`);
  }

  return errors.length === 0;
};

const validateAction = (value: unknown, index: number, errors: string[]): value is CompanionAction => {
  if (!value || typeof value !== "object") {
    errors.push(`allowedActions[${index}] must be an object.`);
    return false;
  }

  const candidate = value as Partial<CompanionAction>;
  if (!isString(candidate.id)) errors.push(`allowedActions[${index}].id is required.`);
  if (!isString(candidate.label)) errors.push(`allowedActions[${index}].label is required.`);
  if (typeof candidate.enabled !== "boolean") {
    errors.push(`allowedActions[${index}].enabled must be boolean.`);
  }

  return errors.length === 0;
};

const validateContextRule = (value: unknown, index: number, errors: string[]): value is CompanionContextRule => {
  if (!value || typeof value !== "object") {
    errors.push(`contextRules[${index}] must be an object.`);
    return false;
  }

  const candidate = value as Partial<CompanionContextRule>;
  if (!isString(candidate.id)) errors.push(`contextRules[${index}].id is required.`);
  if (!isString(candidate.label)) errors.push(`contextRules[${index}].label is required.`);
  if (typeof candidate.required !== "boolean") {
    errors.push(`contextRules[${index}].required must be boolean.`);
  }

  return errors.length === 0;
};

export const createSlugId = (value: string): string =>
  value
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "") || "companion";

export const createCompanionProfile = (input: {
  name: string;
  description: string;
  category: CompanionCategory;
  role: string;
  tone: CompanionTone;
  responseStyle: CompanionResponseStyle;
  systemRules: string[];
  memoryCategories: CompanionMemoryCategory[];
  allowedActions: CompanionAction[];
  contextRules?: CompanionContextRule[];
  status?: CompanionStatus;
  id?: string;
  now?: string;
}): CompanionProfile => {
  const now = input.now ?? new Date().toISOString();

  return {
    schemaVersion: COMPANION_PROFILE_SCHEMA_VERSION,
    id: input.id ?? createSlugId(input.name),
    name: input.name,
    description: input.description,
    category: input.category,
    status: input.status ?? "Draft",
    persona: {
      role: input.role,
      tone: input.tone,
      responseStyle: input.responseStyle,
    },
    systemRules: input.systemRules,
    memoryCategories: input.memoryCategories,
    allowedActions: input.allowedActions,
    contextRules: input.contextRules ?? [],
    createdAt: now,
    updatedAt: now,
  };
};

export const validateCompanionProfile = (value: unknown): CompanionProfileValidationResult => {
  const errors: string[] = [];

  if (!value || typeof value !== "object") {
    return { ok: false, errors: ["Profile must be an object."] };
  }

  const candidate = value as Partial<CompanionProfile>;

  if (candidate.schemaVersion !== COMPANION_PROFILE_SCHEMA_VERSION) {
    errors.push(`schemaVersion must be ${COMPANION_PROFILE_SCHEMA_VERSION}.`);
  }
  if (!isString(candidate.id)) errors.push("id is required.");
  if (!isString(candidate.name)) errors.push("name is required.");
  if (!isString(candidate.description)) errors.push("description is required.");
  if (!includesValue(companionCategories, candidate.category)) errors.push("category is invalid.");
  if (!includesValue(companionStatuses, candidate.status)) errors.push("status is invalid.");

  if (!candidate.persona || typeof candidate.persona !== "object") {
    errors.push("persona is required.");
  } else {
    if (!isString(candidate.persona.role)) errors.push("persona.role is required.");
    if (!includesValue(companionTones, candidate.persona.tone)) errors.push("persona.tone is invalid.");
    if (!includesValue(companionResponseStyles, candidate.persona.responseStyle)) {
      errors.push("persona.responseStyle is invalid.");
    }
  }

  if (!isStringArray(candidate.systemRules)) errors.push("systemRules must be an array of strings.");

  if (!Array.isArray(candidate.memoryCategories)) {
    errors.push("memoryCategories must be an array.");
  } else {
    candidate.memoryCategories.forEach((item, index) => validateMemoryCategory(item, index, errors));
  }

  if (!Array.isArray(candidate.allowedActions)) {
    errors.push("allowedActions must be an array.");
  } else {
    candidate.allowedActions.forEach((item, index) => validateAction(item, index, errors));
  }

  if (!Array.isArray(candidate.contextRules)) {
    errors.push("contextRules must be an array.");
  } else {
    candidate.contextRules.forEach((item, index) => validateContextRule(item, index, errors));
  }

  if (!isIsoDateLike(candidate.createdAt)) errors.push("createdAt must be an ISO date string.");
  if (!isIsoDateLike(candidate.updatedAt)) errors.push("updatedAt must be an ISO date string.");

  if (errors.length > 0) {
    return { ok: false, errors };
  }

  return { ok: true, profile: candidate as CompanionProfile };
};

export const stringifyCompanionProfile = (profile: CompanionProfile): string =>
  JSON.stringify(profile, null, 2);
