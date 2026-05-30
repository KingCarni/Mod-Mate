// Local-only avatar persistence for the Builder.
// We store a seed (the user's prompt) and resolve it to a local SVG data URL.
// No backend, no auth, no remote image dependency — explicitly saved locally for now.

const STORAGE_KEY = "mod-mate.builder.avatar.v1";

export type StoredAvatar = {
  seed: string;
};

const palettes = [
  { bg: "#E6ECDF", fg: "#1B3B36", accent: "#8A9A86" },
  { bg: "#F4E2C2", fg: "#1B3B36", accent: "#D69F4C" },
  { bg: "#F2D6CD", fg: "#1B3B36", accent: "#C65D47" },
  { bg: "#D7E0DE", fg: "#1B3B36", accent: "#8A9A86" },
];

const hashString = (value: string) => {
  let hash = 0;
  for (let index = 0; index < value.length; index += 1) {
    hash = (hash << 5) - hash + value.charCodeAt(index);
    hash |= 0;
  }
  return Math.abs(hash);
};

const escapeXml = (value: string) =>
  value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/\"/g, "&quot;")
    .replace(/'/g, "&apos;");

const getLabel = (seed: string) => {
  const words = seed
    .trim()
    .split(/\s+/)
    .filter(Boolean)
    .filter((word) => word.length > 2)
    .slice(0, 2);

  return words.map((word) => word[0]?.toUpperCase()).join("") || "MM";
};

export const buildAvatarUrl = (seed: string): string => {
  const hash = hashString(seed);
  const palette = palettes[hash % palettes.length];
  const label = escapeXml(getLabel(seed));
  const safeSeed = escapeXml(seed.slice(0, 48));
  const angle = 28 + (hash % 42);

  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
    <defs>
      <radialGradient id="g" cx="35%" cy="25%" r="78%">
        <stop offset="0%" stop-color="#ffffff" stop-opacity="0.7"/>
        <stop offset="45%" stop-color="${palette.bg}"/>
        <stop offset="100%" stop-color="${palette.accent}" stop-opacity="0.9"/>
      </radialGradient>
      <filter id="shadow" x="-20%" y="-20%" width="140%" height="140%">
        <feDropShadow dx="0" dy="18" stdDeviation="18" flood-color="#1B3B36" flood-opacity="0.18"/>
      </filter>
    </defs>
    <rect width="512" height="512" rx="124" fill="url(#g)"/>
    <circle cx="392" cy="124" r="68" fill="#ffffff" opacity="0.25"/>
    <circle cx="112" cy="396" r="92" fill="#ffffff" opacity="0.2"/>
    <g transform="rotate(${angle} 256 256)" opacity="0.72">
      <rect x="-40" y="232" width="592" height="46" rx="23" fill="${palette.fg}" opacity="0.22"/>
      <rect x="-40" y="284" width="592" height="18" rx="9" fill="${palette.accent}" opacity="0.55"/>
    </g>
    <rect x="132" y="138" width="248" height="236" rx="88" fill="#ffffff" opacity="0.48" filter="url(#shadow)"/>
    <text x="256" y="266" text-anchor="middle" dominant-baseline="middle" font-family="Arial, sans-serif" font-size="110" font-weight="800" fill="${palette.fg}">${label}</text>
    <text x="256" y="404" text-anchor="middle" font-family="Arial, sans-serif" font-size="20" font-weight="700" fill="${palette.fg}" opacity="0.62">${safeSeed}</text>
  </svg>`;

  return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}#${Date.now()}`;
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
