import {
  createMasterDraftSampleActionHints,
  createMasterDraftSampleContextPacket,
  createMasterDraftSampleEmbedConfig,
  MASTER_DRAFT_SAMPLE_COMPANION_ID,
  MASTER_DRAFT_SAMPLE_USER_MESSAGE,
} from "@/lib/integrationSamples/masterDraftAdapter";
import {
  createQatalystSampleActionHints,
  createQatalystSampleContextPacket,
  createQatalystSampleEmbedConfig,
  QATALYST_SAMPLE_COMPANION_ID,
  QATALYST_SAMPLE_USER_MESSAGE,
} from "@/lib/integrationSamples/qatalystAdapter";
import { masterDraftCompanionProfile, qatalystCompanionProfile } from "@/lib/companionProfileTemplates";
import { createHostAdapter, toSidePanelAdapterPreview } from "@/lib/integrations";
import type { HostAppAdapter, HostAdapterBuildResult, HostAppId, SidePanelAdapterPreview } from "@/types/integration";

const DEFAULT_RUNTIME = {
  mode: "mock" as const,
  provider: "mock" as const,
};

export const masterDraftHostAdapter: HostAppAdapter = createHostAdapter({
  id: "master-draft",
  name: "Master Draft adapter",
  description: "Turns story-editor state into a Mod-Mate context packet and confirm-first action hints.",
  hostApp: {
    id: "master-draft",
    name: "Master Draft",
    version: "0.1.0",
    environment: "local",
  },
  companionProfileId: MASTER_DRAFT_SAMPLE_COMPANION_ID,
  surface: {
    preferredSurface: "side-panel",
    supportedSurfaces: ["side-panel", "floating-widget", "inline-panel"],
    allowHostActions: true,
    allowedActionKinds: ["apply-to-field", "export-to-memory", "copy-to-clipboard"],
    theme: {
      mode: "system",
      accent: "ochre",
      radius: "xl",
      density: "comfortable",
    },
  },
  runtimeDefaults: DEFAULT_RUNTIME,
  sampleMessages: [
    {
      id: "canon-check",
      label: "Canon check",
      message: MASTER_DRAFT_SAMPLE_USER_MESSAGE,
    },
  ],
  build: (input): HostAdapterBuildResult => ({
    contextPacket: createMasterDraftSampleContextPacket(),
    actionHints: createMasterDraftSampleActionHints(),
    warnings: createMasterDraftSampleContextPacket().warnings,
    embedConfig: createMasterDraftSampleEmbedConfig(),
    companionProfile: masterDraftCompanionProfile,
    companionProfileId: MASTER_DRAFT_SAMPLE_COMPANION_ID,
    runtimeDefaults: {
      mode: input.runtime?.mode ?? DEFAULT_RUNTIME.mode,
      provider: input.runtime?.provider ?? DEFAULT_RUNTIME.provider,
    },
    sampleMessage: input.message ?? MASTER_DRAFT_SAMPLE_USER_MESSAGE,
  }),
});

export const qatalystHostAdapter: HostAppAdapter = createHostAdapter({
  id: "qatalyst",
  name: "QAtalyst adapter",
  description: "Turns QA workflow state into a Mod-Mate context packet and confirm-first action hints.",
  hostApp: {
    id: "qatalyst",
    name: "QAtalyst",
    version: "0.1.0",
    environment: "local",
  },
  companionProfileId: QATALYST_SAMPLE_COMPANION_ID,
  surface: {
    preferredSurface: "side-panel",
    supportedSurfaces: ["side-panel", "inline-panel", "full-page"],
    allowHostActions: true,
    allowedActionKinds: ["apply-to-field", "export-to-memory", "copy-to-clipboard", "custom"],
    theme: {
      mode: "system",
      accent: "sage",
      radius: "xl",
      density: "comfortable",
    },
  },
  runtimeDefaults: DEFAULT_RUNTIME,
  sampleMessages: [
    {
      id: "bug-triage",
      label: "Bug triage",
      message: QATALYST_SAMPLE_USER_MESSAGE,
    },
  ],
  build: (input): HostAdapterBuildResult => ({
    contextPacket: createQatalystSampleContextPacket(),
    actionHints: createQatalystSampleActionHints(),
    warnings: createQatalystSampleContextPacket().warnings,
    embedConfig: createQatalystSampleEmbedConfig(),
    companionProfile: qatalystCompanionProfile,
    companionProfileId: QATALYST_SAMPLE_COMPANION_ID,
    runtimeDefaults: {
      mode: input.runtime?.mode ?? DEFAULT_RUNTIME.mode,
      provider: input.runtime?.provider ?? DEFAULT_RUNTIME.provider,
    },
    sampleMessage: input.message ?? QATALYST_SAMPLE_USER_MESSAGE,
  }),
});

export const hostAppAdapters = [masterDraftHostAdapter, qatalystHostAdapter] as const;

export const getHostAppAdapter = (id: HostAppId | string): HostAppAdapter | null =>
  hostAppAdapters.find((adapter) => adapter.id === id) ?? null;

export const createHostAdapterPreview = (id: HostAppId | string): SidePanelAdapterPreview | null => {
  const adapter = getHostAppAdapter(id);
  if (!adapter) return null;
  return toSidePanelAdapterPreview(adapter.build({ hostState: {}, now: "2026-01-01T00:00:00.000Z" }));
};
