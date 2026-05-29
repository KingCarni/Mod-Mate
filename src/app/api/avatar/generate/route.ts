import { NextResponse } from "next/server";

const escapeXml = (value: string) =>
  value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");

const hashString = (value: string) => {
  let hash = 0;
  for (let index = 0; index < value.length; index += 1) {
    hash = (hash << 5) - hash + value.charCodeAt(index);
    hash |= 0;
  }
  return Math.abs(hash);
};

const getInitials = (value: string) =>
  value
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join("") || "MM";

const palettes = [
  { bg: "#E6ECDF", fg: "#1B3B36", accent: "#8A9A86" },
  { bg: "#F4E2C2", fg: "#1B3B36", accent: "#D69F4C" },
  { bg: "#F2D6CD", fg: "#1B3B36", accent: "#C65D47" },
  { bg: "#D7E0DE", fg: "#1B3B36", accent: "#8A9A86" },
];

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as {
      prompt?: unknown;
      companionName?: unknown;
      companionCategory?: unknown;
    };

    const prompt = typeof body.prompt === "string" ? body.prompt.trim() : "";
    const companionName = typeof body.companionName === "string" ? body.companionName.trim() : "Mod-Mate";
    const companionCategory = typeof body.companionCategory === "string" ? body.companionCategory.trim() : "Companion";

    if (!prompt) {
      return NextResponse.json({ error: "Avatar prompt is required." }, { status: 400 });
    }

    const hash = hashString(`${companionName}-${companionCategory}-${prompt}`);
    const palette = palettes[hash % palettes.length];
    const initials = escapeXml(getInitials(companionName));
    const safePrompt = escapeXml(prompt.slice(0, 96));

    // Mock/local generation for MOD-24 first pass. Real image-provider wiring should stay server-side later.
    const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
      <defs>
        <radialGradient id="g" cx="35%" cy="25%" r="75%">
          <stop offset="0%" stop-color="#ffffff" stop-opacity="0.72"/>
          <stop offset="42%" stop-color="${palette.bg}"/>
          <stop offset="100%" stop-color="${palette.accent}" stop-opacity="0.86"/>
        </radialGradient>
      </defs>
      <rect width="512" height="512" rx="128" fill="url(#g)"/>
      <circle cx="394" cy="126" r="64" fill="#ffffff" opacity="0.28"/>
      <circle cx="116" cy="402" r="88" fill="#ffffff" opacity="0.22"/>
      <rect x="116" y="132" width="280" height="248" rx="92" fill="#ffffff" opacity="0.44"/>
      <text x="256" y="292" text-anchor="middle" dominant-baseline="middle" font-family="Arial, sans-serif" font-size="116" font-weight="800" fill="${palette.fg}">${initials}</text>
      <text x="256" y="404" text-anchor="middle" font-family="Arial, sans-serif" font-size="20" font-weight="700" fill="${palette.fg}" opacity="0.62">${safePrompt}</text>
    </svg>`;

    const imageUrl = `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;

    return NextResponse.json({
      imageUrl,
      revisedPrompt: `${prompt} (mock local SVG avatar)`,
    });
  } catch {
    return NextResponse.json({ error: "Unable to generate avatar." }, { status: 500 });
  }
}
