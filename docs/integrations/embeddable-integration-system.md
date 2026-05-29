# Embeddable Integration System Foundation

Status: Draft v0.1  
Owner: MOD-4  
Last updated: 2026-05-28

## Purpose

MOD-4 defines the shared foundation for using Mod-Mate as an embeddable companion engine inside host apps.

This phase creates types, helper utilities, sample adapters, and documentation. It does not create a production widget, auth system, billing system, token system, workspace model, or live external app connection.

## Current State

Mod-Mate already supports:

- companion profiles
- context packets
- Playground testing
- `/api/runtime`
- mock runtime mode
- live OpenAI runtime mode
- Master Draft and QAtalyst profile templates
- Master Draft and QAtalyst contract docs

MOD-4 Phase 1 adds the shared integration language around those systems.

## Host App Identity

Every host app should identify itself when building context for Mod-Mate.

```ts
type HostAppIdentity = {
  id: "master-draft" | "qatalyst" | "custom" | "unknown";
  name: string;
  version?: string;
  environment?: "local" | "preview" | "production" | "test";
};
```

Examples:

```ts
const masterDraftHost = {
  id: "master-draft",
  name: "Master Draft",
  version: "0.1.0",
  environment: "local",
};
```

```ts
const qatalystHost = {
  id: "qatalyst",
  name: "QAtalyst",
  version: "0.1.0",
  environment: "local",
};
```

## Embed Surfaces

Supported planned embed surfaces:

- `floating-widget`
- `side-panel`
- `inline-panel`
- `full-page`
- `custom`

Phase 1 only defines the surface values. It does not render the widget or panel.

## Embed Config

Host apps can eventually use an embed config to decide how a Mod-Mate companion appears and behaves.

```ts
type EmbedConfig = {
  hostApp: HostAppIdentity;
  surface: EmbedSurface;
  companionProfileId?: string;
  defaultRuntimeMode: "mock" | "live";
  defaultProvider: "mock" | "openai";
  allowHostActions: boolean;
  allowedActionKinds: IntegrationActionKind[];
  theme?: EmbedThemeConfig;
  debug?: boolean;
};
```

Examples live in:

```txt
src/lib/integrationSamples/masterDraftAdapter.ts
src/lib/integrationSamples/qatalystAdapter.ts
```

## Context Adapter Pattern

Host apps should not ask Mod-Mate to read their databases directly.

Instead, each host app should build a context packet from its own state and send it to Mod-Mate.

```text
Host app state
  → host-owned context adapter
  → Mod-Mate ContextPacket
  → /api/runtime
  → response + warnings + future action suggestions
```

The adapter owns:

- selecting relevant context
- excluding secrets
- minimizing payload size
- identifying the active screen/workflow
- identifying the active entity or selection
- adding memory sections
- adding action hints
- adding warnings when context is partial

## Action Hint Contract

Action hints tell Mod-Mate which host actions are possible.

They do not execute actions.

```ts
type IntegrationActionHint = {
  id: string;
  label: string;
  kind: "apply-to-field" | "export-to-memory" | "open-url" | "copy-to-clipboard" | "custom";
  description?: string;
  payload?: Record<string, unknown>;
  requiresConfirmation: boolean;
};
```

## No Silent Writes Rule

Mod-Mate must not silently mutate host app state.

Write-like actions must require confirmation:

- `apply-to-field`
- `export-to-memory`
- `custom`

Examples:

- apply rewrite to selected text
- export confirmed fact to Story Bible
- save confirmed fact to Project Brain
- create Jira ticket
- create TestRail case

The helper `assertActionRequiresConfirmation()` enforces this for integration action hints.

## Future Action Suggestion Contract

In a later phase, Mod-Mate runtime responses may include structured action suggestions.

Recommended shape:

```ts
type IntegrationActionSuggestion = {
  id: string;
  label: string;
  kind: IntegrationActionKind;
  confidence: "low" | "medium" | "high";
  requiresConfirmation: true;
  target?: {
    app: string;
    entityType: string;
    entityId?: string;
    field?: string;
  };
  payload: Record<string, unknown>;
  previewText?: string;
  riskNote?: string;
};
```

This is defined as a type in Phase 1, but runtime responses do not emit it yet.

## Master Draft Sample Flow

```text
Master Draft script editor
  → reads current scene, selected text, Story Bible, characters, canon, Never Break rules
  → builds ContextPacket
  → sends profile + packet + user message to /api/runtime
  → renders companion answer
  → user confirms any suggested Story Bible/scene/character action
  → Master Draft applies the change
```

Sample adapter:

```txt
src/lib/integrationSamples/masterDraftAdapter.ts
```

Sample actions:

- apply rewrite to selected text
- export confirmed fact to Story Bible
- add character note

## QAtalyst Sample Flow

```text
QAtalyst workflow screen
  → reads active workflow, source input, generated output, Project Brain, QA rules, risk register, Jira/TestRail state
  → builds ContextPacket
  → sends profile + packet + user message to /api/runtime
  → renders companion answer
  → user confirms any suggested Project Brain/Jira/TestRail action
  → QAtalyst applies the change
```

Sample adapter:

```txt
src/lib/integrationSamples/qatalystAdapter.ts
```

Sample actions:

- apply suggestion to generated output
- export confirmed fact to Project Brain
- draft Jira comment
- create Jira ticket
- create TestRail cases

## Security And Privacy Rules

Host apps should not send:

- API keys
- OAuth tokens
- Jira tokens
- TestRail credentials
- connection strings
- billing data
- passwords
- unrelated private notes
- full raw files unless explicitly selected and size-limited

Mod-Mate should receive the smallest useful context packet for the visible user request.

## Ownership Boundaries

Host apps own:

- source data
- current UI state
- user selection state
- adapter logic
- deciding what is safe to send
- write execution
- confirmation UX

Mod-Mate owns:

- companion profiles
- context packet contract
- runtime API
- prompt assembly
- provider calls
- runtime warnings and usage metadata
- future action suggestion contract

## What Phase 1 Intentionally Does Not Build

- no production widget
- no iframe/embed script
- no auth
- no billing
- no database persistence
- no workspace model
- no integration token/key issuing
- no live Master Draft connection
- no live QAtalyst connection
- no Jira/TestRail writes
- no silent host app writes
- no public marketplace

## Handoff To Phase 2 UI Work

Phase 2 can upgrade the Integrations page and show the foundation visually.

Good Phase 2 UI scope:

- integration cards
- embed surface preview
- sample code snippet preview
- host app examples
- action safety explainer
- mock integration status badges

Bad Phase 2 UI scope:

- real auth
- real token generation
- real external app installation
- real app marketplace
- real host app write actions

## Acceptance Criteria Mapping

- **Shared host app identification** — `HostAppIdentity` in `src/types/integration.ts`.
- **Embed config shape** — `EmbedConfig` in `src/types/integration.ts`.
- **Action hint contract** — `IntegrationActionHint` and helpers.
- **No silent writes** — `assertActionRequiresConfirmation()`.
- **Master Draft sample adapter** — `src/lib/integrationSamples/masterDraftAdapter.ts`.
- **QAtalyst sample adapter** — `src/lib/integrationSamples/qatalystAdapter.ts`.
- **No real embedding/auth/billing added** — Phase 1 is types, helpers, samples, and docs only.
