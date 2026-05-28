import {
  parseCompanionProfileJson,
  stringifyCompanionProfile,
} from "@/lib/companionProfiles";
import type {
  CompanionProfile,
  CompanionProfileValidationResult,
} from "@/types/companionProfile";

export const COMPANION_PROFILE_STORAGE_KEY = "mod-mate.builder.profile.v1";

export type StoredCompanionProfileResult =
  | { ok: true; profile: CompanionProfile }
  | { ok: false; errors: string[] }
  | { ok: null; errors: [] };

const hasBrowserStorage = () =>
  typeof window !== "undefined" && typeof window.localStorage !== "undefined";

export const saveCompanionProfileDraft = (profile: CompanionProfile): void => {
  if (!hasBrowserStorage()) return;
  window.localStorage.setItem(COMPANION_PROFILE_STORAGE_KEY, stringifyCompanionProfile(profile));
};

export const loadCompanionProfileDraft = (): StoredCompanionProfileResult => {
  if (!hasBrowserStorage()) return { ok: null, errors: [] };

  const rawProfile = window.localStorage.getItem(COMPANION_PROFILE_STORAGE_KEY);
  if (!rawProfile) return { ok: null, errors: [] };

  const result: CompanionProfileValidationResult = parseCompanionProfileJson(rawProfile);
  if (!result.ok) {
    return { ok: false, errors: result.errors };
  }

  return { ok: true, profile: result.profile };
};

export const clearCompanionProfileDraft = (): void => {
  if (!hasBrowserStorage()) return;
  window.localStorage.removeItem(COMPANION_PROFILE_STORAGE_KEY);
};
