// Local-only avatar persistence for the Builder.
// We store a seed (the user's prompt) and resolve it to an avatar URL on the fly.
// No backend, no auth — explicitly "saved locally for now".

const STORAGE_KEY = "mod-mate.builder.avatar.v1";

const AVATAR_API = "https://api.dicebear.com/9.x/shapes/svg";
const AVATAR_BG_PALETTE = "ECE4D1,F4E2C2,F2D6CD,D7E0DE";

export type StoredAvatar = {
  seed: string;
};

export const buildAvatarUrl = (seed: string): string =>
  `${AVATAR_API}?seed=${encodeURIComponent(seed)}&backgroundColor=${AVATAR_BG_PALETTE}`;

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
