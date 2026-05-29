# QAtalyst ↔ Mod-Mate Integration Contract

Status: Draft v0.1  
Owner: MOD-17  
Last updated: 2026-05-28

## Goal

Define how QAtalyst can call a Mod-Mate companion without requiring Mod-Mate to directly read QAtalyst's database, Project Brain, uploaded files, Jira/TestRail connection state, or private workflow data.

QAtalyst remains the source of truth for QA workflows, source inputs, generated outputs, Project Brain, terminology, QA rules, and integration state. Mod-Mate owns companion profile execution, runtime prompting, response shaping, warnings, and suggested actions.

## Design Principles

1. **Host-owned context** — QAtalyst decides what context is relevant, safe, and allowed to send.
2. **No direct DB coupling** — Mod-Mate does not query QAtalyst storage directly.
3. **Workflow-first context** — the active workflow should be the strongest signal in the context packet.
4. **Evidence-aware answers** — the companion must distinguish facts, assumptions, missing evidence, risks, and next steps.
5. **Action suggestions, not silent mutations** — Mod-Mate can suggest Jira/TestRail/brain actions, but QAtalyst applies them only after user confirmation.
6. **Graceful failure** — if Mod-Mate is unavailable, QAtalyst should keep the workflow usable and preserve the user's work.
7. **Future widget-ready** — the same contract should support an embedded panel, a React widget, or a backend-to-backend API call.

## High-Level Flow

```text
QAtalyst workflow UI
  → builds QAtalyst context packet
  → calls Mod-Mate runtime API
  → receives answer + warnings + future action suggestions
  → renders response inside QAtalyst
  → user confirms any suggested action
  → QAtalyst applies local/Jira/TestRail/brain change
```

## Runtime Endpoint

Initial target:

```http
POST /api/runtime
Content-Type: application/json
```

Current Mod-Mate runtime request shape:

```ts
type CompanionRuntimeRequest = {
  profile: CompanionProfile;
  contextPacket: ContextPacket;
  message: string;
  history?: CompanionRuntimeMessage[];
  mode?: "mock" | "live";
  provider?: "mock" | "openai";
};
```

Current Mod-Mate runtime response shape:

```ts
type CompanionRuntimeResponse = {
  answer: string;
  mode: "mock" | "live";
  provider: "mock" | "openai";
  warnings: CompanionRuntimeWarning[];
  usage: CompanionRuntimeUsage;
  promptPreview: string;
};
```

## QAtalyst Context Packet

QAtalyst should send the standard Mod-Mate `ContextPacket`.

Recommended fields:

```ts
type ContextPacket = {
  schemaVersion: "1.0.0";
  sourceApp: {
    id: "qatalyst";
    name: "QAtalyst";
    version?: string;
    environment?: "local" | "preview" | "production" | "test";
  };
  projectId?: string;
  activeTool?: string;
  currentScreenContext: string;
  selectedText?: string;
  selectedEntity?: {
    id?: string;
    type: string;
    label: string;
    value?: string;
    metadata?: Record<string, unknown>;
  };
  memorySections: Array<{
    id: string;
    label: string;
    content: string;
    priority: "low" | "normal" | "high";
    source?: string;
    metadata?: Record<string, unknown>;
  }>;
  warnings: Array<{
    id: string;
    level: "info" | "warning" | "error";
    message: string;
  }>;
  metadata: Record<string, unknown>;
  actionHints: Array<{
    id: string;
    label: string;
    kind: "apply-to-field" | "export-to-memory" | "open-url" | "copy-to-clipboard" | "custom";
    description?: string;
    payload?: Record<string, unknown>;
  }>;
  createdAt: string;
};
```

## Recommended QAtalyst Packet Values

### `sourceApp`

```json
{
  "id": "qatalyst",
  "name": "QAtalyst",
  "version": "0.1.0",
  "environment": "local"
}
```

### `activeTool`

Use the visible workflow or tool area:

- `bug-triage`
- `feature-review`
- `test-coverage`
- `risk-review`
- `release-readiness`
- `acceptance-criteria-review`
- `jira-export`
- `testrail-export`
- `project-brain`
- `source-vault`

### `currentScreenContext`

A concise human-readable description of what the user is doing.

Example:

```text
User is reviewing a generated test coverage plan for a checkout discount-code bug. Jira is connected, TestRail is not connected.
```

### `selectedText`

Only include the source input, generated output, or selected excerpt the user is asking about.

Do not send full uploaded documents, credentials, API responses, or unrelated private project notes by default.

### `selectedEntity`

Examples:

```json
{
  "id": "bug-checkout-discount-intermittent",
  "type": "bug-report",
  "label": "Checkout fails intermittently after discount code",
  "value": "Checkout fails intermittently after applying a discount code. No repro steps were provided.",
  "metadata": {
    "workflow": "bug-triage",
    "severity": "unknown",
    "reproStepsProvided": false,
    "source": "user-input"
  }
}
```

```json
{
  "id": "coverage-checkout-discounts",
  "type": "test-coverage-plan",
  "label": "Checkout discount code coverage plan",
  "value": "Generated coverage plan for valid, expired, stacked, and edge-case discount codes.",
  "metadata": {
    "workflow": "test-coverage",
    "jiraConnected": true,
    "testrailConnected": false
  }
}
```

## Recommended Memory Sections

QAtalyst should build memory sections from the active project/workflow state.

| ID | Label | Priority | Purpose |
|---|---|---:|---|
| `workflow-context` | Workflow context | high | Active flow, user goal, generated artifact, screen state. |
| `source-input` | Source input | high | User-provided bug, feature, requirement, or acceptance criteria text. |
| `generated-output` | Generated output | high/normal | Current QAtalyst-generated plan, summary, matrix, or comment. |
| `project-brain` | Project Brain | high/normal | Relevant saved project context, rules, and decisions. |
| `source-vault` | Source Vault | normal | Relevant uploaded/linked source references, not full raw files by default. |
| `qa-rules` | QA rules | high | User-defined QA standards and risk heuristics. |
| `terminology` | Terminology | normal | Project-specific terms, product names, and domain language. |
| `risk-register` | Risk register | high/normal | Known risk areas and previous incidents. |
| `jira-state` | Jira state | normal | Whether Jira is connected and what target project/issue state is known. |
| `testrail-state` | TestRail state | normal | Whether TestRail is connected and what suite/case/run state is known. |
| `open-questions` | Open questions | normal | Missing information the user or project has not resolved yet. |

Example:

```json
{
  "id": "workflow-context",
  "label": "Workflow context",
  "content": "User is triaging a checkout bug. The report has no repro steps and no browser/device details.",
  "priority": "high",
  "source": "qatalyst-active-workflow"
}
```

```json
{
  "id": "jira-state",
  "label": "Jira state",
  "content": "Jira connected: true. Target project: WEB. Existing issue: not created yet.",
  "priority": "normal",
  "source": "qatalyst-integrations",
  "metadata": {
    "connected": true,
    "projectKey": "WEB",
    "issueCreated": false
  }
}
```

## Action Hints

QAtalyst can tell Mod-Mate which actions are possible. Mod-Mate can shape suggestions around them, but QAtalyst owns final execution.

Recommended action hints:

```json
[
  {
    "id": "apply-to-generated-output",
    "label": "Apply suggestion to generated output",
    "kind": "apply-to-field",
    "description": "Patch the current generated QAtalyst output after user confirmation.",
    "payload": {
      "target": "generatedOutput",
      "requiresConfirmation": true
    }
  },
  {
    "id": "export-to-project-brain",
    "label": "Save confirmed fact to Project Brain",
    "kind": "export-to-memory",
    "description": "Add confirmed project context to Project Brain after user confirmation.",
    "payload": {
      "targetMemorySection": "project-brain",
      "requiresConfirmation": true
    }
  },
  {
    "id": "draft-jira-comment",
    "label": "Draft Jira comment",
    "kind": "custom",
    "description": "Draft a Jira-safe comment for user review before posting.",
    "payload": {
      "target": "jira-comment-draft",
      "requiresConfirmation": true
    }
  },
  {
    "id": "create-jira-ticket",
    "label": "Create Jira ticket",
    "kind": "custom",
    "description": "Create a Jira ticket only after user confirmation and only if Jira is connected.",
    "payload": {
      "target": "jira-issue",
      "requiresConfirmation": true
    }
  },
  {
    "id": "create-testrail-cases",
    "label": "Create TestRail cases",
    "kind": "custom",
    "description": "Create TestRail cases only after user confirmation and only if TestRail is connected.",
    "payload": {
      "target": "testrail-cases",
      "requiresConfirmation": true
    }
  }
]
```

## Response Handling in QAtalyst

QAtalyst should render:

- `answer` as the assistant message or side-panel response.
- `warnings` as compact runtime metadata or a collapsible notice.
- `usage` only in debug/dev/admin mode.
- `promptPreview` only in debug/dev/admin mode.

Recommended answer structure for QAtalyst companions:

1. Confirmed facts.
2. Assumptions.
3. Risks.
4. Coverage gaps.
5. Recommended next steps.
6. Optional Jira/TestRail-safe draft, if asked.

For future action execution, Mod-Mate should return structured action suggestions. Until that response shape exists, actions remain text suggestions inside `answer`.

## Future Structured Action Shape

Recommended future extension:

```ts
type ModMateActionSuggestion = {
  id: string;
  label: string;
  kind: "apply-to-field" | "export-to-memory" | "open-url" | "copy-to-clipboard" | "custom";
  confidence: "low" | "medium" | "high";
  requiresConfirmation: true;
  target?: {
    app: "qatalyst";
    entityType:
      | "generated-output"
      | "project-brain"
      | "source-vault"
      | "jira-issue"
      | "jira-comment"
      | "testrail-case"
      | "testrail-run"
      | "risk-register";
    entityId?: string;
    field?: string;
  };
  payload: Record<string, unknown>;
  previewText?: string;
  riskNote?: string;
};
```

Rules:

- `requiresConfirmation` must be `true` for all QAtalyst write actions.
- QAtalyst owns final application of the action.
- Mod-Mate should not silently mutate QAtalyst state.
- Jira/TestRail actions must respect connection/setup state.
- Mod-Mate must not invent issue keys, case IDs, run IDs, or integration records.

## What QAtalyst Owns

QAtalyst owns:

- User workflow state.
- Source input and generated output.
- Project Brain storage.
- Source Vault storage.
- QA rules and terminology storage.
- Jira/TestRail connection state.
- Jira/TestRail write execution.
- Applying confirmed edits.
- Confirming or rejecting action suggestions.
- Deciding what context is safe to send.

## What Mod-Mate Owns

Mod-Mate owns:

- Companion profiles.
- Companion runtime API.
- Prompt assembly.
- Provider calls.
- Runtime warnings/usage metadata.
- Portable response/action contract.

## Error and Fallback Behavior

If Mod-Mate is unavailable, QAtalyst should:

1. Keep the active workflow usable.
2. Preserve the user's source input and generated output.
3. Show a compact error such as:

```text
Companion unavailable. Your QAtalyst workflow was not changed.
```

4. Offer retry when appropriate.
5. Never silently apply stale assistant suggestions.
6. Never trigger Jira/TestRail writes after a runtime error.

Common error cases:

| Case | QAtalyst behavior |
|---|---|
| Network failure | Show retryable error. |
| Runtime 400 validation error | Show developer/debug details in dev mode only. |
| Runtime 500/provider error | Show friendly error and preserve current workflow state. |
| Missing API key | Show setup message in dev/admin mode. |
| Timeout | Offer retry and preserve input/output. |
| Jira not connected | Hide or disable Jira write actions. |
| TestRail not connected | Hide or disable TestRail write actions. |

## Security and Privacy

QAtalyst should not send:

- API keys.
- OAuth tokens.
- Jira tokens.
- TestRail credentials.
- Connection strings.
- Billing data.
- User passwords.
- Raw uploaded files unless explicitly selected and size-limited.
- Private notes unrelated to the current request.

Context should be minimized to what the companion needs to answer the visible user request.

## Example Runtime Request

```json
{
  "profile": {
    "schemaVersion": "1.0.0",
    "id": "qatalyst-qa-lead-companion",
    "name": "QAtalyst QA Lead Companion",
    "description": "Senior QA companion for triage, risk review, test coverage strategy, release readiness, and workflow-specific product quality guidance.",
    "category": "QA & Product",
    "status": "Template",
    "persona": {
      "role": "Senior QA lead, risk reviewer, bug triage partner, and test coverage strategist",
      "tone": "Direct",
      "responseStyle": "Bullet-first"
    },
    "systemRules": [
      "Do not invent requirements, acceptance criteria, test evidence, integration state, Jira state, TestRail state, or release facts.",
      "Prioritize the current QAtalyst workflow context before using general QA advice.",
      "Clearly separate confirmed facts, assumptions, risks, and recommended next steps."
    ],
    "memoryCategories": [],
    "allowedActions": [],
    "contextRules": [],
    "createdAt": "2026-01-01T00:00:00.000Z",
    "updatedAt": "2026-01-01T00:00:00.000Z"
  },
  "contextPacket": {
    "schemaVersion": "1.0.0",
    "sourceApp": {
      "id": "qatalyst",
      "name": "QAtalyst",
      "version": "0.1.0",
      "environment": "local"
    },
    "projectId": "qat-project-123",
    "activeTool": "bug-triage",
    "currentScreenContext": "User is triaging a checkout discount-code bug. Jira is connected and TestRail is not connected.",
    "selectedText": "Checkout fails intermittently after applying a discount code. No repro steps were provided.",
    "selectedEntity": {
      "id": "bug-checkout-discount-intermittent",
      "type": "bug-report",
      "label": "Checkout fails intermittently after discount code",
      "value": "Checkout fails intermittently after applying a discount code. No repro steps were provided."
    },
    "memorySections": [
      {
        "id": "workflow-context",
        "label": "Workflow context",
        "content": "Bug triage workflow. Missing repro steps, browser/device details, user scope, logs, and expected/actual result.",
        "priority": "high",
        "source": "qatalyst-active-workflow"
      },
      {
        "id": "jira-state",
        "label": "Jira state",
        "content": "Jira connected: true. Target project: WEB. Existing issue: not created yet.",
        "priority": "normal",
        "source": "qatalyst-integrations"
      },
      {
        "id": "testrail-state",
        "label": "TestRail state",
        "content": "TestRail connected: false.",
        "priority": "normal",
        "source": "qatalyst-integrations"
      }
    ],
    "warnings": [],
    "metadata": {
      "hostApp": "qatalyst",
      "contractVersion": "0.1"
    },
    "actionHints": [],
    "createdAt": "2026-01-01T00:00:00.000Z"
  },
  "message": "What risks should I flag and what test coverage should I suggest?",
  "history": [],
  "mode": "live",
  "provider": "openai"
}
```

## Open Questions

- Should QAtalyst host a cached companion profile copy, or always request the active profile from Mod-Mate?
- Should action suggestions be added to `CompanionRuntimeResponse` in the next schema version?
- What max context size should QAtalyst enforce before sending to Mod-Mate?
- Should QAtalyst support offline mock mode for local-only QA workflows?
- Which QAtalyst workflows should receive embedded companion support first: bug triage, coverage planning, risk review, release readiness, or Jira/TestRail exports?

## Acceptance Criteria Mapping

- **Integration contract is documented** — this document.
- **QAtalyst context packet fields are listed** — see `QAtalyst Context Packet` and `Recommended QAtalyst Packet Values`.
- **Mod-Mate response/action shape is listed** — see runtime response and future structured action shape.
- **Contract avoids requiring Mod-Mate to directly read QAtalyst database/storage** — host-owned context principle.
- **Contract supports replacing or powering the existing QAt companion behavior later** — same packet/API flow can back the existing QAt companion, embedded widget, or custom API integration.
