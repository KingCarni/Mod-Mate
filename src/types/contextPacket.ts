export const CONTEXT_PACKET_SCHEMA_VERSION = "1.0.0" as const;

export const contextPacketPriorities = ["low", "normal", "high"] as const;
export const contextPacketWarningLevels = ["info", "warning", "error"] as const;
export const contextPacketActionKinds = ["apply-to-field", "export-to-memory", "open-url", "copy-to-clipboard", "custom"] as const;

export type ContextPacketSchemaVersion = typeof CONTEXT_PACKET_SCHEMA_VERSION;
export type ContextPacketPriority = (typeof contextPacketPriorities)[number];
export type ContextPacketWarningLevel = (typeof contextPacketWarningLevels)[number];
export type ContextPacketActionKind = (typeof contextPacketActionKinds)[number];

export type ContextPacketSourceApp = {
  id: string;
  name: string;
  version?: string;
  environment?: "local" | "preview" | "production" | "test";
};

export type ContextPacketEntity = {
  id?: string;
  type: string;
  label: string;
  value?: string;
  metadata?: Record<string, unknown>;
};

export type ContextMemorySection = {
  id: string;
  label: string;
  content: string;
  priority: ContextPacketPriority;
  source?: string;
  metadata?: Record<string, unknown>;
};

export type ContextPacketWarning = {
  id: string;
  level: ContextPacketWarningLevel;
  message: string;
};

export type ContextActionHint = {
  id: string;
  label: string;
  kind: ContextPacketActionKind;
  description?: string;
  payload?: Record<string, unknown>;
};

export type ContextPacket = {
  schemaVersion: ContextPacketSchemaVersion;
  sourceApp: ContextPacketSourceApp;
  projectId?: string;
  activeTool?: string;
  currentScreenContext: string;
  selectedText?: string;
  selectedEntity?: ContextPacketEntity;
  memorySections: ContextMemorySection[];
  warnings: ContextPacketWarning[];
  metadata: Record<string, unknown>;
  actionHints: ContextActionHint[];
  createdAt: string;
};

export type ContextPacketValidationResult =
  | { ok: true; packet: ContextPacket }
  | { ok: false; errors: string[] };
