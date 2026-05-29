import { createContextPacket } from "@/lib/contextPackets";
import {
  createEmbedConfig,
  createHostAppIdentity,
  createIntegrationActionHint,
  toContextActionHint,
} from "@/lib/integrations";
import type { ContextPacket } from "@/types/contextPacket";
import type { EmbedConfig, IntegrationActionHint } from "@/types/integration";

const SAMPLE_CREATED_AT = "2026-01-01T00:00:00.000Z";

export const createMasterDraftSampleActionHints = (): IntegrationActionHint[] => [
  createIntegrationActionHint({
    id: "apply-to-selected-text",
    label: "Apply rewrite to selected text",
    kind: "apply-to-field",
    description: "Replace the currently selected script text after user confirmation.",
    requiresConfirmation: true,
    payload: {
      target: "selectedText",
    },
  }),
  createIntegrationActionHint({
    id: "export-to-story-bible",
    label: "Export confirmed fact to Story Bible",
    kind: "export-to-memory",
    description: "Add confirmed story facts to the Story Bible after user confirmation.",
    requiresConfirmation: true,
    payload: {
      targetMemorySection: "story-bible",
    },
  }),
  createIntegrationActionHint({
    id: "add-character-note",
    label: "Add character note",
    kind: "export-to-memory",
    description: "Attach a note to the active character profile after user confirmation.",
    requiresConfirmation: true,
    payload: {
      target: "character-profile",
    },
  }),
];

export const createMasterDraftSampleContextPacket = (): ContextPacket => {
  const actionHints = createMasterDraftSampleActionHints();

  return createContextPacket({
    sourceApp: createHostAppIdentity({
      id: "master-draft",
      name: "Master Draft",
      version: "0.1.0",
      environment: "local",
    }),
    projectId: "md-project-sample",
    activeTool: "script-editor",
    currentScreenContext:
      "User is editing Act 1 Scene 3 in the screenplay editor and has selected a line where Mara accepts a dangerous courier job.",
    selectedText: "Mara takes the job even though she knows the syndicate is involved.",
    selectedEntity: {
      id: "scene-act1-003",
      type: "scene",
      label: "Act 1 Scene 3 — Courier Job Offer",
      value: "A reluctant courier accepts a dangerous job from someone she does not trust.",
      metadata: {
        act: 1,
        sceneNumber: 3,
        status: "draft",
        povCharacter: "Mara",
      },
    },
    memorySections: [
      {
        id: "never-break",
        label: "Never Break rules",
        content:
          "Mara never willingly works for the syndicate before Act 2. Vale never lies directly; he omits key details instead.",
        priority: "high",
        source: "master-draft-story-bible",
      },
      {
        id: "story-bible",
        label: "Story Bible",
        content:
          "The story is a grounded sci-fi noir about compromise, debt, and trust. Syndicate involvement should feel dangerous and morally costly.",
        priority: "high",
        source: "master-draft-story-bible",
      },
      {
        id: "characters",
        label: "Characters",
        content:
          "Mara is a courier protagonist with a strict rule against syndicate jobs. Vale is a fixer who avoids direct lies but withholds important context.",
        priority: "high",
        source: "master-draft-character-notes",
      },
      {
        id: "current-scene",
        label: "Current scene",
        content:
          "Scene goal: make Mara's first compromise feel believable without violating her pre-Act 2 boundary. Tone target: tense, restrained, transactional.",
        priority: "high",
        source: "master-draft-scene-editor",
      },
      {
        id: "canon-facts",
        label: "Canon facts",
        content:
          "Mara needs money, distrusts Vale, and has not knowingly accepted a syndicate job before this point.",
        priority: "high",
        source: "master-draft-canon",
      },
      {
        id: "open-questions",
        label: "Open questions",
        content:
          "Does Mara know the syndicate connection in this scene, or does she discover it later? What exact pressure forces her to accept?",
        priority: "normal",
        source: "master-draft-notes",
      },
    ],
    warnings: [
      {
        id: "sample-adapter",
        level: "info",
        message: "This is a static Master Draft sample adapter, not a live host app connection.",
      },
    ],
    metadata: {
      hostApp: "master-draft",
      contractVersion: "0.1",
      sample: true,
    },
    actionHints: actionHints.map(toContextActionHint),
    createdAt: SAMPLE_CREATED_AT,
  });
};

export const createMasterDraftSampleEmbedConfig = (): EmbedConfig =>
  createEmbedConfig({
    hostApp: createHostAppIdentity({
      id: "master-draft",
      name: "Master Draft",
      version: "0.1.0",
      environment: "local",
    }),
    surface: "side-panel",
    companionProfileId: "master-draft-story-companion",
    defaultRuntimeMode: "live",
    defaultProvider: "openai",
    allowHostActions: true,
    allowedActionKinds: ["apply-to-field", "export-to-memory", "copy-to-clipboard"],
    theme: {
      mode: "system",
      accent: "ochre",
      radius: "xl",
      density: "comfortable",
    },
    debug: true,
  });
