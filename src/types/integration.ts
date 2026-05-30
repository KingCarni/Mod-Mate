import type { CompanionProfile } from "@/types/companionProfile";
import type { CompanionRuntimeMode, CompanionRuntimeProvider } from "@/types/companionRuntime";
import type {
  ContextPacket,
  ContextPacketWarning,
  ContextPacketWarningLevel,
} from "@/types/contextPacket";

export const hostAppIds = ["master-draft", "qatalyst", "custom", "unknown"] as const;
export const hostAppEnvironments = ["local", "preview", "production", "test"] as const;
export const embedSurfaces = ["floating-widget", "side-panel", "inline-panel", "full-page", "custom"] as const;
export const integrationActionKinds = [
  "apply-to-field",
  "export-to-memory",
  "open-url",
  "copy-to-clipboard",
  "custom",
] as const;
export const integrationActionConfidences = ["low", "medium", "high"] as const;

export type HostAppId = (typeof hostAppIds)[number];
export type HostAppEnvironment = (typeof hostAppEnvironments)[number];
export type EmbedSurface = (typeof embedSurfaces)[number];
export type IntegrationActionKind = (typeof integrationActionKinds)[number];
export type IntegrationActionConfidence = (typeof integrationActionConfidences)[number];

export type HostAppIdentity = {
  id: HostAppId;
  name: string;
  version?: string;
  environment?: HostAppEnvironment;
};

export type IntegrationActionHint = {
  id: string;
  label: string;
  kind: IntegrationActionKind;
  description?: string;
  payload?: Record<string, unknown>;
  requiresConfirmation: boolean;
};

export type IntegrationActionTarget = {
  app: HostAppId | string;
  entityType: string;
  entityId?: string;
  field?: string;
};

export type IntegrationActionSuggestion = {
  id: string;
  label: string;
  kind: IntegrationActionKind;
  confidence: IntegrationActionConfidence;
  requiresConfirmation: true;
  target?: IntegrationActionTarget;
  payload: Record<string, unknown>;
  previewText?: string;
  riskNote?: string;
};

export type EmbedThemeConfig = {
  mode?: "light" | "dark" | "system";
  accent?: string;
  radius?: "none" | "sm" | "md" | "lg" | "xl";
  density?: "compact" | "comfortable";
};

export type EmbedConfig = {
  hostApp: HostAppIdentity;
  surface: EmbedSurface;
  companionProfileId?: string;
  defaultRuntimeMode: CompanionRuntimeMode;
  defaultProvider: CompanionRuntimeProvider;
  allowHostActions: boolean;
  allowedActionKinds: IntegrationActionKind[];
  theme?: EmbedThemeConfig;
  debug?: boolean;
};

export type HostContextAdapterResult = {
  contextPacket: ContextPacket;
  actionHints: IntegrationActionHint[];
  warnings: ContextPacketWarning[];
};

export type HostAdapterRuntimeDefaults = {
  mode: CompanionRuntimeMode;
  provider: CompanionRuntimeProvider;
};

export type HostAdapterSurfaceConfig = {
  preferredSurface: EmbedSurface;
  supportedSurfaces: EmbedSurface[];
  allowHostActions: boolean;
  allowedActionKinds: IntegrationActionKind[];
  theme?: EmbedThemeConfig;
};

export type HostAdapterSampleMessage = {
  id: string;
  label: string;
  message: string;
};

export type HostAdapterBuildInput<THostState = unknown> = {
  hostState: THostState;
  message?: string;
  now?: string;
  runtime?: Partial<HostAdapterRuntimeDefaults>;
};

export type HostAdapterBuildResult = HostContextAdapterResult & {
  embedConfig: EmbedConfig;
  companionProfile: CompanionProfile;
  companionProfileId: string;
  runtimeDefaults: HostAdapterRuntimeDefaults;
  sampleMessage: string;
};

export type HostAppAdapter<THostState = unknown> = {
  id: HostAppId | string;
  name: string;
  description: string;
  hostApp: HostAppIdentity;
  companionProfileId: string;
  surface: HostAdapterSurfaceConfig;
  runtimeDefaults: HostAdapterRuntimeDefaults;
  sampleMessages: HostAdapterSampleMessage[];
  build: (input: HostAdapterBuildInput<THostState>) => HostAdapterBuildResult;
};

export type SidePanelAdapterPreview = {
  companion: {
    name: string;
    category: string;
    status?: string;
    avatar?: CompanionProfile["avatar"];
  };
  hostApp: {
    name: string;
    surface: string;
    activeView: string;
  };
  contextSections: Array<{
    id: string;
    label: string;
    detail: string;
  }>;
  messages: Array<{
    id: string;
    role: "user" | "assistant";
    content: string;
  }>;
  actionHints: Array<{
    id: string;
    label: string;
    description: string;
    requiresConfirmation?: boolean;
  }>;
};

export type IntegrationWarningInput = {
  id: string;
  message: string;
  level?: ContextPacketWarningLevel;
};
