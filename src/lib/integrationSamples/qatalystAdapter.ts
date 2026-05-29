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

export const createQatalystSampleActionHints = (): IntegrationActionHint[] => [
  createIntegrationActionHint({
    id: "apply-to-generated-output",
    label: "Apply suggestion to generated output",
    kind: "apply-to-field",
    description: "Patch the current generated QAtalyst output after user confirmation.",
    requiresConfirmation: true,
    payload: {
      target: "generatedOutput",
    },
  }),
  createIntegrationActionHint({
    id: "export-to-project-brain",
    label: "Save confirmed fact to Project Brain",
    kind: "export-to-memory",
    description: "Add confirmed project context to Project Brain after user confirmation.",
    requiresConfirmation: true,
    payload: {
      targetMemorySection: "project-brain",
    },
  }),
  createIntegrationActionHint({
    id: "draft-jira-comment",
    label: "Draft Jira comment",
    kind: "custom",
    description: "Draft a Jira-safe comment for user review before posting.",
    requiresConfirmation: true,
    payload: {
      target: "jira-comment-draft",
    },
  }),
  createIntegrationActionHint({
    id: "create-jira-ticket",
    label: "Create Jira ticket",
    kind: "custom",
    description: "Create a Jira ticket only after user confirmation and only if Jira is connected.",
    requiresConfirmation: true,
    payload: {
      target: "jira-issue",
    },
  }),
  createIntegrationActionHint({
    id: "create-testrail-cases",
    label: "Create TestRail cases",
    kind: "custom",
    description: "Create TestRail cases only after user confirmation and only if TestRail is connected.",
    requiresConfirmation: true,
    payload: {
      target: "testrail-cases",
    },
  }),
];

export const createQatalystSampleContextPacket = (): ContextPacket => {
  const actionHints = createQatalystSampleActionHints();

  return createContextPacket({
    sourceApp: createHostAppIdentity({
      id: "qatalyst",
      name: "QAtalyst",
      version: "0.1.0",
      environment: "local",
    }),
    projectId: "qat-project-sample",
    activeTool: "bug-triage",
    currentScreenContext:
      "User is triaging a checkout discount-code bug. Jira is connected and TestRail is not connected.",
    selectedText: "Checkout fails intermittently after applying a discount code. No repro steps were provided.",
    selectedEntity: {
      id: "bug-checkout-discount-intermittent",
      type: "bug-report",
      label: "Checkout fails intermittently after discount code",
      value: "Checkout fails intermittently after applying a discount code. No repro steps were provided.",
      metadata: {
        workflow: "bug-triage",
        severity: "unknown",
        reproStepsProvided: false,
        source: "user-input",
      },
    },
    memorySections: [
      {
        id: "workflow-context",
        label: "Workflow context",
        content:
          "Bug triage workflow. Missing repro steps, browser/device details, user scope, logs, and expected/actual result.",
        priority: "high",
        source: "qatalyst-active-workflow",
      },
      {
        id: "source-input",
        label: "Source input",
        content: "Checkout fails intermittently after applying a discount code. No repro steps were provided.",
        priority: "high",
        source: "qatalyst-source-input",
      },
      {
        id: "generated-output",
        label: "Generated output",
        content:
          "Initial triage output is incomplete because the report lacks reproduction steps, frequency, expected result, actual result, environment, and logs.",
        priority: "normal",
        source: "qatalyst-generated-output",
      },
      {
        id: "project-brain",
        label: "Project Brain",
        content:
          "Checkout and discount logic are high-risk release areas. Previous incidents have involved promo stacking, expired codes, and payment provider handoff issues.",
        priority: "high",
        source: "qatalyst-project-brain",
      },
      {
        id: "qa-rules",
        label: "QA rules",
        content:
          "Do not mark a bug ready for development without repro steps or clear expected/actual behavior. Separate confirmed facts from assumptions.",
        priority: "high",
        source: "qatalyst-qa-rules",
      },
      {
        id: "risk-register",
        label: "Risk register",
        content:
          "Checkout failures are high business risk because they can block revenue and reduce trust. Discount code failures can impact campaigns and support volume.",
        priority: "high",
        source: "qatalyst-risk-register",
      },
      {
        id: "jira-state",
        label: "Jira state",
        content: "Jira connected: true. Target project: WEB. Existing issue: not created yet.",
        priority: "normal",
        source: "qatalyst-integrations",
        metadata: {
          connected: true,
          projectKey: "WEB",
          issueCreated: false,
        },
      },
      {
        id: "testrail-state",
        label: "TestRail state",
        content: "TestRail connected: false.",
        priority: "normal",
        source: "qatalyst-integrations",
        metadata: {
          connected: false,
        },
      },
      {
        id: "open-questions",
        label: "Open questions",
        content:
          "Which discount code was used? Which browser/device? What payment method? How often does it fail? Is the failure before or after payment authorization?",
        priority: "normal",
        source: "qatalyst-open-questions",
      },
    ],
    warnings: [
      {
        id: "sample-adapter",
        level: "info",
        message: "This is a static QAtalyst sample adapter, not a live host app connection.",
      },
      {
        id: "testrail-disconnected",
        level: "warning",
        message: "TestRail write actions should be disabled because TestRail is not connected in this sample.",
      },
    ],
    metadata: {
      hostApp: "qatalyst",
      contractVersion: "0.1",
      sample: true,
    },
    actionHints: actionHints.map(toContextActionHint),
    createdAt: SAMPLE_CREATED_AT,
  });
};

export const createQatalystSampleEmbedConfig = (): EmbedConfig =>
  createEmbedConfig({
    hostApp: createHostAppIdentity({
      id: "qatalyst",
      name: "QAtalyst",
      version: "0.1.0",
      environment: "local",
    }),
    surface: "side-panel",
    companionProfileId: "qatalyst-qa-lead-companion",
    defaultRuntimeMode: "live",
    defaultProvider: "openai",
    allowHostActions: true,
    allowedActionKinds: ["apply-to-field", "export-to-memory", "copy-to-clipboard", "custom"],
    theme: {
      mode: "system",
      accent: "sage",
      radius: "xl",
      density: "comfortable",
    },
    debug: true,
  });
