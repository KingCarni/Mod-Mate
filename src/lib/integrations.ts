import type { ContextActionHint, ContextPacketWarning } from "@/types/contextPacket";
import type {
  EmbedConfig,
  HostAppIdentity,
  IntegrationActionHint,
  IntegrationActionKind,
  IntegrationWarningInput,
} from "@/types/integration";

const writeLikeActionKinds: IntegrationActionKind[] = ["apply-to-field", "export-to-memory", "custom"];

export const createHostAppIdentity = (input: HostAppIdentity): HostAppIdentity => ({
  id: input.id,
  name: input.name,
  version: input.version,
  environment: input.environment,
});

export const createEmbedConfig = (input: EmbedConfig): EmbedConfig => ({
  hostApp: createHostAppIdentity(input.hostApp),
  surface: input.surface,
  companionProfileId: input.companionProfileId,
  defaultRuntimeMode: input.defaultRuntimeMode,
  defaultProvider: input.defaultProvider,
  allowHostActions: input.allowHostActions,
  allowedActionKinds: input.allowedActionKinds,
  theme: input.theme,
  debug: input.debug,
});

export const createIntegrationActionHint = (input: IntegrationActionHint): IntegrationActionHint => {
  assertActionRequiresConfirmation(input);

  return {
    id: input.id,
    label: input.label,
    kind: input.kind,
    description: input.description,
    payload: input.payload,
    requiresConfirmation: input.requiresConfirmation,
  };
};

export const createIntegrationWarning = (
  idOrInput: string | IntegrationWarningInput,
  message?: string,
  level: ContextPacketWarning["level"] = "warning",
): ContextPacketWarning => {
  if (typeof idOrInput === "string") {
    return {
      id: idOrInput,
      level,
      message: message ?? "Integration warning.",
    };
  }

  return {
    id: idOrInput.id,
    level: idOrInput.level ?? "warning",
    message: idOrInput.message,
  };
};

export const assertActionRequiresConfirmation = (action: IntegrationActionHint): void => {
  if (writeLikeActionKinds.includes(action.kind) && !action.requiresConfirmation) {
    throw new Error(`${action.kind} actions must require confirmation.`);
  }
};

export const toContextActionHint = (action: IntegrationActionHint): ContextActionHint => ({
  id: action.id,
  label: action.label,
  kind: action.kind,
  description: action.description,
  payload: {
    ...(action.payload ?? {}),
    requiresConfirmation: action.requiresConfirmation,
  },
});
