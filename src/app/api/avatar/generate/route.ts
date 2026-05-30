import { NextResponse } from "next/server";

const OPENAI_IMAGE_MODEL = process.env.OPENAI_IMAGE_MODEL || "gpt-image-1";

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

type AvatarRequest = {
  prompt: string;
  companionName?: string;
  companionCategory?: string;
};

const createMockSvg = ({ prompt, companionName = "Mod-Mate", companionCategory = "Companion" }: AvatarRequest) => {
  const hash = hashString(`${companionName}-${companionCategory}-${prompt}`);
  const palette = palettes[hash % palettes.length];
  const initials = escapeXml(getInitials(companionName));
  const safePrompt = escapeXml(prompt.slice(0, 96));
  const angle = 28 + (hash % 42);

  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
    <defs>
      <radialGradient id="g" cx="35%" cy="25%" r="78%">
        <stop offset="0%" stop-color="#ffffff" stop-opacity="0.72"/>
        <stop offset="44%" stop-color="${palette.bg}"/>
        <stop offset="100%" stop-color="${palette.accent}" stop-opacity="0.9"/>
      </radialGradient>
    </defs>
    <rect width="512" height="512" rx="128" fill="url(#g)"/>
    <circle cx="394" cy="126" r="64" fill="#ffffff" opacity="0.28"/>
    <circle cx="116" cy="402" r="88" fill="#ffffff" opacity="0.22"/>
    <g transform="rotate(${angle} 256 256)" opacity="0.72">
      <rect x="-40" y="232" width="592" height="46" rx="23" fill="${palette.fg}" opacity="0.22"/>
      <rect x="-40" y="284" width="592" height="18" rx="9" fill="${palette.accent}" opacity="0.55"/>
    </g>
    <rect x="116" y="132" width="280" height="248" rx="92" fill="#ffffff" opacity="0.44"/>
    <text x="256" y="292" text-anchor="middle" dominant-baseline="middle" font-family="Arial, sans-serif" font-size="116" font-weight="800" fill="${palette.fg}">${initials}</text>
    <text x="256" y="404" text-anchor="middle" font-family="Arial, sans-serif" font-size="20" font-weight="700" fill="${palette.fg}" opacity="0.62">${safePrompt}</text>
  </svg>`;
};

const createMockImageResponse = (avatarRequest: AvatarRequest) =>
  new Response(createMockSvg(avatarRequest), {
    headers: {
      "Content-Type": "image/svg+xml; charset=utf-8",
      "Cache-Control": "no-store",
      "X-Mod-Mate-Avatar-Provider": "mock",
    },
  });

const createPrompt = ({ prompt, companionName = "Mod-Mate", companionCategory = "Companion" }: AvatarRequest) =>
  [
    "Create a square companion avatar for a productivity app.",
    "Style: warm, friendly, lightly illustrated, polished app icon, earthy organic palette, rounded composition.",
    "Avoid text, logos, watermarks, signatures, photorealistic humans, and busy backgrounds.",
    `Companion name: ${companionName}.`,
    `Companion category: ${companionCategory}.`,
    `Avatar request: ${prompt}.`,
  ].join("\n");

const generateWithOpenAI = async (avatarRequest: AvatarRequest): Promise<Buffer | null> => {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) return null;

  const response = await fetch("https://api.openai.com/v1/images/generations", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: OPENAI_IMAGE_MODEL,
      prompt: createPrompt(avatarRequest),
      size: "1024x1024",
      n: 1,
    }),
  });

  const payload = (await response.json()) as {
    data?: Array<{ b64_json?: string; url?: string }>;
    error?: { message?: string };
  };

  if (!response.ok) {
    throw new Error(payload.error?.message ?? "OpenAI image generation failed.");
  }

  const first = payload.data?.[0];
  if (first?.b64_json) return Buffer.from(first.b64_json, "base64");

  if (first?.url) {
    const imageResponse = await fetch(first.url);
    if (!imageResponse.ok) throw new Error("OpenAI returned an image URL that could not be fetched.");
    return Buffer.from(await imageResponse.arrayBuffer());
  }

  throw new Error("OpenAI returned no image data.");
};

const normalizeRequest = (input: {
  prompt?: unknown;
  companionName?: unknown;
  companionCategory?: unknown;
}): AvatarRequest | { error: string } => {
  const prompt = typeof input.prompt === "string" ? input.prompt.trim() : "";
  const companionName = typeof input.companionName === "string" ? input.companionName.trim() : "Mod-Mate";
  const companionCategory = typeof input.companionCategory === "string" ? input.companionCategory.trim() : "Companion";

  if (!prompt) return { error: "Avatar prompt is required." };
  return { prompt, companionName, companionCategory };
};

export async function GET(request: Request) {
  const url = new URL(request.url);
  const normalized = normalizeRequest({
    prompt: url.searchParams.get("prompt") ?? "",
    companionName: url.searchParams.get("companionName") ?? undefined,
    companionCategory: url.searchParams.get("companionCategory") ?? undefined,
  });

  if ("error" in normalized) {
    return NextResponse.json({ error: normalized.error }, { status: 400 });
  }

  try {
    const image = await generateWithOpenAI(normalized);
    if (!image) return createMockImageResponse(normalized);

    return new Response(image, {
      headers: {
        "Content-Type": "image/png",
        "Cache-Control": "no-store",
        "X-Mod-Mate-Avatar-Provider": "openai",
      },
    });
  } catch (error) {
    console.error("Avatar generation failed; falling back to mock avatar.", error);
    return createMockImageResponse(normalized);
  }
}

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as {
      prompt?: unknown;
      companionName?: unknown;
      companionCategory?: unknown;
    };
    const normalized = normalizeRequest(body);
    if ("error" in normalized) return NextResponse.json({ error: normalized.error }, { status: 400 });

    const image = await generateWithOpenAI(normalized);
    if (!image) {
      const svg = createMockSvg(normalized);
      return NextResponse.json({
        imageUrl: `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`,
        provider: "mock",
        revisedPrompt: `${normalized.prompt} (mock local SVG avatar)`,
      });
    }

    return NextResponse.json({
      imageUrl: `data:image/png;base64,${image.toString("base64")}`,
      provider: "openai",
      revisedPrompt: createPrompt(normalized),
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unable to generate avatar.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
