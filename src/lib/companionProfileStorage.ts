import {
  parseCompanionProfileJson,
  stringifyCompanionProfile,
} from "@/lib/companionProfiles";
import type {
  CompanionProfile,
  CompanionProfileValidationResult,
} from "@/types/companionProfile";

export const COMPANION_PROFILE_STORAGE_KEY = "mod-mate.builder.profile.v1";
export const COMPANION_PROFILE_LAUNCH_KEY = "mod-mate.playground.launchProfile.v1";
export const COMPANION_PROFILE_TEMPLATE_KEY = "mod-mate.builder.templateProfile.v1";

export type StoredCompanionProfileResult =
  | { ok: true; profile: CompanionProfile }
  | { ok: false; errors: string[] }
  | { ok: null; errors: [] };

const hasLocalStorage = () =>
  typeof window !== "undefined" && typeof window.localStorage !== "undefined";

const hasSessionStorage = () =>
  typeof window !== "undefined" && typeof window.sessionStorage !== "undefined";

const parseStoredProfile = (rawProfile: string | null): StoredCompanionProfileResult => {
  if (!rawProfile) return { ok: null, errors: [] };

  const result: CompanionProfileValidationResult = parseCompanionProfileJson(rawProfile);
  if (!result.ok) {
    return { ok: false, errors: result.errors };
  }

  return { ok: true, profile: result.profile };
};

export const saveCompanionProfileDraft = (profile: CompanionProfile): void => {
  if (!hasLocalStorage()) return;
  window.localStorage.setItem(COMPANION_PROFILE_STORAGE_KEY, stringifyCompanionProfile(profile));
};

export const loadCompanionProfileDraft = (): StoredCompanionProfileResult => {
  if (!hasLocalStorage()) return { ok: null, errors: [] };
  return parseStoredProfile(window.localStorage.getItem(COMPANION_PROFILE_STORAGE_KEY));
};

export const clearCompanionProfileDraft = (): void => {
  if (!hasLocalStorage()) return;
  window.localStorage.removeItem(COMPANION_PROFILE_STORAGE_KEY);
};

export const saveCompanionProfileLaunch = (profile: CompanionProfile): void => {
  if (!hasSessionStorage()) return;
  window.sessionStorage.setItem(COMPANION_PROFILE_LAUNCH_KEY, stringifyCompanionProfile(profile));
};

export const loadCompanionProfileLaunch = (): StoredCompanionProfileResult => {
  if (!hasSessionStorage()) return { ok: null, errors: [] };
  return parseStoredProfile(window.sessionStorage.getItem(COMPANION_PROFILE_LAUNCH_KEY));
};

export const clearCompanionProfileLaunch = (): void => {
  if (!hasSessionStorage()) return;
  window.sessionStorage.removeItem(COMPANION_PROFILE_LAUNCH_KEY);
};

export const saveCompanionProfileTemplate = (profile: CompanionProfile): void => {
  if (!hasSessionStorage()) return;
  window.sessionStorage.setItem(COMPANION_PROFILE_TEMPLATE_KEY, stringifyCompanionProfile(profile));
};

export const loadCompanionProfileTemplate = (): StoredCompanionProfileResult => {
  if (!hasSessionStorage()) return { ok: null, errors: [] };
  return parseStoredProfile(window.sessionStorage.getItem(COMPANION_PROFILE_TEMPLATE_KEY));
};

export const clearCompanionProfileTemplate = (): void => {
  if (!hasSessionStorage()) return;
  window.sessionStorage.removeItem(COMPANION_PROFILE_TEMPLATE_KEY);
};
