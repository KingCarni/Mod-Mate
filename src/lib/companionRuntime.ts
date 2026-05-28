import { validateCompanionProfile } from "@/lib/companionProfiles";
import { stringifyContextPacket, validateContextPacket } from "@/lib/contextPackets";
import type {
  CompanionRuntimeRequest,
  CompanionRuntimeResponse,
  CompanionRuntimeValidationResult,
  CompanionRuntimeWarning,
} from "@/types/companionRuntime";

const DEFAULT_OPENAI_MODEL = "gpt-4o-mini";
const OPENAI_RESPONSES_URL = "https://api.openai.com/v1/responses";

const estimateTokens = (value: string) => Math.ceil(value.length / 4);

const trimForPrompt = (value: string, maxChars: number) => {
  if (value.length <= maxChars) return value;
  return `${value.slice(0, maxChars)}\n...[trimmed for preview]`;
};

const isRecord = (value: unknown): value is Record<string, unknown> =>
  !!value && typeof value === "object" && !Array.isArray(value);

const readOutputText = (payload: unknown): string | null => {
  if (!isRecord(payload)) return null;

  if (typeof payload.output_text === "string" && payload.output_text.trim()) {
    return payload.output_text.trim();
  }

  const output = payload.output;
  if (!Array.isArray(output)) return null;

  const parts: string[] = [];
  for (const item of output) {
    if (!isRecord(item) || !Array.isArray(item.content)) continue;

    for (const contentItem of item.content) {
      if (!isRecord(contentItem)) continue;
      if (typeof contentItem.text === "string") parts.push(contentItem.text);
    }
  }

  const text = parts.join("\n").trim();
  return text || null;
};

const readUsage = (payload: unknown) => {
  if (!isRecord(payload) || !isRecord(payload.usage)) return null;
  return payload.usage;
};

export const validateCompanionRuntimeRequest = (value: unknown): CompanionRuntimeValidationResult => {
  const errors: string[] = [];

  if (!value || typeof value !== "object") {
    return { ok: false, errors: ["Runtime request must be an object."] };
  }

  const candidate = value as Partial<CompanionRuntimeRequest>;
  const profileResult = validateCompanionProfile(candidate.profile);
  const contextResult = validateContextPacket(candidate.contextPacket);

  if (!profileResult.ok) {
    errors.push(...profileResult.errors.map((error) => `profile: ${error}`));
  }

  if (!contextResult.ok) {
    errors.push(...contextResult.errors.map((error) => `contextPacket: ${error}`));
  }

  if (typeof candidate.message !== "string" || candidate.message.trim().length === 0) {
    errors.push("message is required.");
  }

  if (candidate.history !== undefined) {
    if (!Array.isArray(candidate.history)) {
      errors.push("history must be an array.");
    } else {
      candidate.history.forEach((message, index) => {
        if (!message || typeof message !== "object") {
          errors.push(`history[${index}] must be an object.`);
          return;
        }
        if (!["user", "assistant", "system"].includes(message.role)) {
          errors.push(`history[${index}].role is invalid.`);
        }
        if (typeof message.content !== "string") {
          errors.push(`history[${index}].content must be a string.`);
        }
      });
    }
  }

  if (candidate.mode !== undefined && !["mock", "live"].includes(candidate.mode)) {
    errors.push("mode is invalid.");
  }

  if (candidate.provider !== undefined && !["mock", "openai"].includes(candidate.provider)) {
    errors.push("provider is invalid.");
  }

  if (errors.length > 0) return { ok: false, errors };

  return {
    ok: true,
    request: {
      profile: profileResult.ok ? profileResult.profile : candidate.profile!,
      contextPacket: contextResult.ok ? contextResult.packet : candidate.contextPacket!,
      message: candidate.message!.trim(),
      history: candidate.history ?? [],
      mode: candidate.mode ?? "mock",
      provider: candidate.provider ?? "mock",
    },
  };
};

export const buildCompanionPrompt = (request: CompanionRuntimeRequest): string => {
  const enabledMemory = request.profile.memoryCategories
    .filter((category) => category.enabled)
    .map((category) => category.label)
    .join(", ");

  const allowedActions = request.profile.allowedActions
    .filter((action) => action.enabled)
    .map((action) => action.label)
    .join(", ");

  const historyText = (request.history ?? [])
    .slice(-8)
    .map((message) => `${message.role.toUpperCase()}: ${message.content}`)
    .join("\n");

  return trimForPrompt(
    [
      `You are ${request.profile.name}, a modular AI companion.`,
      `Description: ${request.profile.description}`,
      `Role: ${request.profile.persona.role}`,
      `Tone: ${request.profile.persona.tone}`,
      `Response style: ${request.profile.persona.responseStyle}`,
      "",
      "System rules:",
      ...request.profile.systemRules.map((rule) => `- ${rule}`),
      "",
      `Enabled memory categories: ${enabledMemory || "none"}`,
      `Allowed actions: ${allowedActions || "none"}`,
      "",
      "Context packet:",
      stringifyContextPacket(request.contextPacket),
      "",
      historyText ? `Recent conversation:\n${historyText}\n` : "",
      `User message: ${request.message}`,
    ]
      .filter(Boolean)
      .join("\n"),
    12000,
  );
};

const createMockAnswer = (request: CompanionRuntimeRequest): string => {
  const memoryCount = request.contextPacket.memorySections.length;
  const enabledRules = request.profile.systemRules.length;
  const style = request.profile.persona.responseStyle.toLowerCase();

  return [
    `Using ${request.profile.name}'s ${request.profile.persona.tone.toLowerCase()} ${style} profile, I reviewed your message against the current context packet.`,
    `I have ${memoryCount} context memory sections and ${enabledRules} guardrails available.`,
    "Mock runtime response: live mode can now call the OpenAI provider when OPENAI_API_KEY is configured.",
  ].join("\n\n");
};

export const runMockCompanionRuntime = (request: CompanionRuntimeRequest): CompanionRuntimeResponse => {
  const promptPreview = buildCompanionPrompt(request);
  const answer = createMockAnswer(request);
  const warnings: CompanionRuntimeWarning[] = [
    {
      id: "mock-runtime",
      level: "info",
      message: "Runtime is using mock mode. No model provider was called.",
    },
  ];

  return {
    answer,
    mode: "mock",
    provider: "mock",
    warnings,
    usage: {
      promptChars: promptPreview.length,
      responseChars: answer.length,
      estimatedPromptTokens: estimateTokens(promptPreview),
      estimatedResponseTokens: estimateTokens(answer),
    },
    promptPreview,
  };
};

export const runOpenAICompanionRuntime = async (
  request: CompanionRuntimeRequest,
): Promise<CompanionRuntimeResponse> => {
  const apiKey = process.env.OPENAI_API_KEY;
  const model = process.env.OPENAI_MODEL || DEFAULT_OPENAI_MODEL;
  const promptPreview = buildCompanionPrompt(request);

  if (!apiKey) {
    throw new Error("OPENAI_API_KEY is not configured on the server. Add it to .env.local and restart the dev server.");
  }

  const response = await fetch(OPENAI_RESPONSES_URL, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model,
      input: promptPreview,
      temperature: 0.7,
      max_output_tokens: 700,
    }),
  });

  const payload: unknown = await response.json().catch(() => null);

  if (!response.ok) {
    const errorMessage =
      isRecord(payload) && isRecord(payload.error) && typeof payload.error.message === "string"
        ? payload.error.message
        : `OpenAI request failed with status ${response.status}.`;
    throw new Error(errorMessage);
  }

  const answer = readOutputText(payload);
  if (!answer) {
    throw new Error("OpenAI returned no readable text output.");
  }

  const usage = readUsage(payload);
  const inputTokens = typeof usage?.input_tokens === "number" ? usage.input_tokens : estimateTokens(promptPreview);
  const outputTokens = typeof usage?.output_tokens === "number" ? usage.output_tokens : estimateTokens(answer);

  return {
    answer,
    mode: "live",
    provider: "openai",
    warnings: [
      {
        id: "live-openai",
        level: "info",
        message: `Runtime used OpenAI live mode with ${model}.`,
      },
    ],
    usage: {
      promptChars: promptPreview.length,
      responseChars: answer.length,
      estimatedPromptTokens: inputTokens,
      estimatedResponseTokens: outputTokens,
      model,
    },
    promptPreview,
  };
};

export const runCompanionRuntime = async (
  request: CompanionRuntimeRequest,
): Promise<CompanionRuntimeResponse> => {
  if (request.mode === "live" && request.provider === "openai") {
    return runOpenAICompanionRuntime(request);
  }

  return runMockCompanionRuntime(request);
};
