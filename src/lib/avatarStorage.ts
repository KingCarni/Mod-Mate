// Local-only avatar persistence for the Builder.
// We store the user's prompt seed locally and resolve it through the server-side avatar route.
// The server route can use OpenAI when configured, with a local SVG fallback when no key exists.

const STORAGE_KEY = "mod-mate.builder.avatar.v1";

export type StoredAvatar = {
  seed: string;
};

export const buildAvatarUrl = (seed: string): string => {
  const params = new URLSearchParams({ prompt: seed, t: Date.now().toString() });
  return `/api/avatar/generate?${params.toString()}`;
};

export const loadAvatar = (): StoredAvatar | null => {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as Partial<StoredAvatar>;
    if (!parsed || typeof parsed.seed !== "string" || !parsed.seed.trim()) {
      return null;
    }
    return { seed: parsed.seed };
  } catch {
    return null;
  }
};

export const saveAvatar = (avatar: StoredAvatar | null): void => {
  if (typeof window === "undefined") return;
  try {
    if (avatar === null) {
      window.localStorage.removeItem(STORAGE_KEY);
      return;
    }
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(avatar));
  } catch {
    // localStorage may be unavailable (private mode, quota, etc.) — swallow.
  }
};
