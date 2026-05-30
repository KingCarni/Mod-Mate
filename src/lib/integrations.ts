import type { ContextActionHint, ContextMemorySection, ContextPacketWarning } from "@/types/contextPacket";
import type {
  EmbedConfig,
  HostAdapterBuildResult,
  HostAppAdapter,
  HostAppIdentity,
  IntegrationActionHint,
  IntegrationActionKind,
  IntegrationWarningInput,
  SidePanelAdapterPreview,
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

export const createHostAdapter = <THostState>(adapter: HostAppAdapter<THostState>): HostAppAdapter<THostState> => {
  adapter.surface.allowedActionKinds.forEach((kind) => {
    if (!adapter.surface.supportedSurfaces.includes(adapter.surface.preferredSurface)) {
      throw new Error(`${adapter.name} preferred surface must be included in supported surfaces.`);
    }
    if (!adapter.surface.allowedActionKinds.includes(kind)) {
      throw new Error(`${adapter.name} action kind ${kind} is not listed as allowed.`);
    }
  });

  return adapter;
};

const summarizeMemorySection = (section: ContextMemorySection): string => {
  const clean = section.content.replace(/\s+/g, " ").trim();
  if (clean.length <= 112) return clean;
  return `${clean.slice(0, 109)}...`;
};

export const toSidePanelAdapterPreview = (result: HostAdapterBuildResult): SidePanelAdapterPreview => ({
  companion: {
    name: result.companionProfile.name,
    category: result.companionProfile.category,
    status: result.companionProfile.status,
    avatar: result.companionProfile.avatar,
  },
  hostApp: {
    name: result.embedConfig.hostApp.name,
    surface: result.embedConfig.surface,
    activeView: result.contextPacket.activeTool ?? result.contextPacket.currentScreenContext,
  },
  contextSections: [
    {
      id: "screen",
      label: "Current screen",
      detail: result.contextPacket.currentScreenContext,
    },
    ...result.contextPacket.memorySections.slice(0, 4).map((section) => ({
      id: section.id,
      label: section.label,
      detail: summarizeMemorySection(section),
    })),
    ...result.warnings.slice(0, 2).map((warning) => ({
      id: warning.id,
      label: `${warning.level.toUpperCase()} warning`,
      detail: warning.message,
    })),
  ],
  messages: [
    {
      id: "sample-user-message",
      role: "user",
      content: result.sampleMessage,
    },
    {
      id: "sample-assistant-message",
      role: "assistant",
      content:
        "I have the host-provided context packet and can answer inside this side panel. Any write-like changes will stay as confirm-first action hints for the host app to approve.",
    },
  ],
  actionHints: result.actionHints.map((action) => ({
    id: action.id,
    label: action.label,
    description: action.description ?? "Host app action hint.",
    requiresConfirmation: action.requiresConfirmation,
  })),
});
