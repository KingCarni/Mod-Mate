import type { CompanionProfile } from "@/types/companionProfile";
import type { ContextPacket } from "@/types/contextPacket";

export const companionRuntimeModes = ["mock", "live"] as const;
export const companionRuntimeProviders = ["mock", "openai"] as const;
export const companionRuntimeWarningLevels = ["info", "warning", "error"] as const;

export type CompanionRuntimeMode = (typeof companionRuntimeModes)[number];
export type CompanionRuntimeProvider = (typeof companionRuntimeProviders)[number];
export type CompanionRuntimeWarningLevel = (typeof companionRuntimeWarningLevels)[number];

export type CompanionRuntimeMessage = {
  role: "user" | "assistant" | "system";
  content: string;
};

export type CompanionRuntimeWarning = {
  id: string;
  level: CompanionRuntimeWarningLevel;
  message: string;
};

export type CompanionRuntimeUsage = {
  promptChars: number;
  responseChars: number;
  estimatedPromptTokens: number;
  estimatedResponseTokens: number;
  model?: string;
};

export type CompanionRuntimeRequest = {
  profile: CompanionProfile;
  contextPacket: ContextPacket;
  message: string;
  history?: CompanionRuntimeMessage[];
  mode?: CompanionRuntimeMode;
  provider?: CompanionRuntimeProvider;
};

export type CompanionRuntimeResponse = {
  answer: string;
  mode: CompanionRuntimeMode;
  provider: CompanionRuntimeProvider;
  warnings: CompanionRuntimeWarning[];
  usage: CompanionRuntimeUsage;
  promptPreview: string;
};

export type CompanionRuntimeValidationResult =
  | { ok: true; request: CompanionRuntimeRequest }
  | { ok: false; errors: string[] };
