import { validateCompanionProfile } from "@/lib/companionProfiles";
import { stringifyContextPacket, validateContextPacket } from "@/lib/contextPackets";
import type {
  CompanionRuntimeRequest,
  CompanionRuntimeResponse,
  CompanionRuntimeValidationResult,
  CompanionRuntimeWarning,
} from "@/types/companionRuntime";

const estimateTokens = (value: string) => Math.ceil(value.length / 4);

const trimForPrompt = (value: string, maxChars: number) => {
  if (value.length <= maxChars) return value;
  return `${value.slice(0, maxChars)}\n...[trimmed for preview]`;
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
    "Mock runtime response: the next pass can replace this with a live provider call while keeping the same request/response contract.",
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

  if (request.provider === "openai" || request.mode === "live") {
    warnings.push({
      id: "live-disabled",
      level: "warning",
      message:
        "Live provider calls are not enabled in this pass. Add OPENAI_API_KEY after the live provider adapter is implemented.",
    });
  }

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
