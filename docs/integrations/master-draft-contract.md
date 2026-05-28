# Master Draft ↔ Mod-Mate Integration Contract

Status: Draft v0.1  
Owner: MOD-16  
Last updated: 2026-05-28

## Goal

Define how Master Draft can call a Mod-Mate companion without requiring Mod-Mate to directly read Master Draft's database, local storage, files, or private app state.

Master Draft remains the source of truth for screenplay/project data. Mod-Mate owns companion profile execution, runtime prompting, response shaping, and suggested actions.

## Design Principles

1. **Host-owned context** — Master Draft decides what context is safe and relevant to send.
2. **No direct DB coupling** — Mod-Mate does not query Master Draft storage directly.
3. **Portable packet contract** — Master Draft sends a standard Mod-Mate context packet.
4. **Action suggestions, not silent mutations** — Mod-Mate may suggest actions, but Master Draft applies changes only after user confirmation.
5. **Graceful failure** — if Mod-Mate is unavailable, Master Draft should keep working and show a clear fallback state.
6. **Future widget-ready** — the same contract should work for a React widget, custom API call, or embedded panel.

## High-Level Flow

```text
Master Draft UI
  → builds Master Draft context packet
  → calls Mod-Mate runtime API
  → receives answer + action suggestions
  → renders response in Master Draft
  → user confirms any suggested action
  → Master Draft applies local change
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

## Master Draft Context Packet

Master Draft should send the standard Mod-Mate `ContextPacket`.

Recommended fields:

```ts
type ContextPacket = {
  schemaVersion: "1.0.0";
  sourceApp: {
    id: "master-draft";
    name: "Master Draft";
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

## Recommended Master Draft Packet Values

### `sourceApp`

```json
{
  "id": "master-draft",
  "name": "Master Draft",
  "version": "0.1.0",
  "environment": "local"
}
```

### `activeTool`

Use the visible area/tool in Master Draft:

- `script-editor`
- `story-bible`
- `character-profile`
- `scene-outline`
- `pitch-builder`
- `visual-development`
- `notes`

### `currentScreenContext`

A concise human-readable description of what the user is doing.

Example:

```text
User is editing Act 1 Scene 3 in the screenplay editor and has selected a dialogue exchange between Mara and Vale.
```

### `selectedText`

Only include the text the user is actively asking about or has selected.

Do not send full scripts by default. Prefer the smallest useful excerpt.

### `selectedEntity`

Examples:

```json
{
  "id": "scene-act1-003",
  "type": "scene",
  "label": "Act 1 Scene 3 — Courier Job Offer",
  "value": "A reluctant courier accepts a dangerous job from someone she does not trust.",
  "metadata": {
    "act": 1,
    "sceneNumber": 3,
    "status": "draft",
    "povCharacter": "Mara"
  }
}
```

```json
{
  "id": "character-mara",
  "type": "character",
  "label": "Mara",
  "value": "Courier protagonist with a strict rule against working for syndicates.",
  "metadata": {
    "role": "protagonist",
    "arcStage": "pre-compromise"
  }
}
```

## Recommended Memory Sections

Master Draft should build memory sections from its own current app state.

| ID | Label | Priority | Purpose |
|---|---|---:|---|
| `never-break` | Never Break rules | high | Non-negotiable canon/voice/project rules. |
| `story-bible` | Story Bible | high | Relevant story world, rules, themes, and canon. |
| `characters` | Characters | high/normal | Character facts relevant to the current scene. |
| `current-scene` | Current scene | high | Scene summary, selected excerpt, beat goal, tone target. |
| `canon-facts` | Canon facts | high | Confirmed facts that should not be contradicted. |
| `open-questions` | Open questions | normal | Known unresolved questions. |
| `visual-direction` | Visual direction | low/normal | Mood, references, style notes, shot language. |
| `recent-decisions` | Recent decisions | normal | User-approved direction changes. |

Example:

```json
{
  "id": "never-break",
  "label": "Never Break rules",
  "content": "Mara never willingly works for the syndicate before Act 2. Vale never lies directly; he omits key details instead.",
  "priority": "high",
  "source": "master-draft-story-bible"
}
```

## Action Hints

Master Draft can tell Mod-Mate which actions are possible. Mod-Mate can then shape suggestions around them.

Recommended action hints:

```json
[
  {
    "id": "apply-to-selected-text",
    "label": "Apply rewrite to selected text",
    "kind": "apply-to-field",
    "description": "Replace the currently selected script text after user confirmation.",
    "payload": {
      "target": "selectedText",
      "requiresConfirmation": true
    }
  },
  {
    "id": "export-to-story-bible",
    "label": "Export confirmed fact to Story Bible",
    "kind": "export-to-memory",
    "description": "Add confirmed story facts to the Story Bible after user confirmation.",
    "payload": {
      "targetMemorySection": "story-bible",
      "requiresConfirmation": true
    }
  },
  {
    "id": "add-character-note",
    "label": "Add character note",
    "kind": "export-to-memory",
    "description": "Attach a note to the active character profile after user confirmation.",
    "payload": {
      "target": "character-profile",
      "requiresConfirmation": true
    }
  }
]
```

## Response Handling in Master Draft

Master Draft should render:

- `answer` as the assistant message.
- `warnings` as compact metadata or a collapsible notice.
- `usage` only in debug/dev/admin mode.
- `promptPreview` only in debug/dev/admin mode.

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
    app: "master-draft";
    entityType: "scene" | "character" | "story-bible" | "selected-text" | "note";
    entityId?: string;
    field?: string;
  };
  payload: Record<string, unknown>;
  previewText?: string;
  riskNote?: string;
};
```

Rules:

- `requiresConfirmation` must be `true` for all Master Draft write actions.
- Master Draft owns final application of the action.
- Mod-Mate should not silently mutate Master Draft state.

## What Master Draft Owns

Master Draft owns:

- Project files/data.
- Story Bible storage.
- Scene/character/note storage.
- User selection state.
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

If Mod-Mate is unavailable, Master Draft should:

1. Keep the editor usable.
2. Show a compact error such as:

```text
Companion unavailable. Your draft was not changed.
```

3. Offer retry when appropriate.
4. Never discard user text.
5. Never silently apply stale assistant suggestions.

Common error cases:

| Case | Master Draft behavior |
|---|---|
| Network failure | Show retryable error. |
| Runtime 400 validation error | Show developer/debug details in dev mode only. |
| Runtime 500/provider error | Show friendly error and keep user content unchanged. |
| Missing API key | Show setup message in dev/admin mode. |
| Timeout | Offer retry and preserve input. |

## Security and Privacy

Master Draft should not send:

- API keys.
- OAuth tokens.
- Connection strings.
- Billing data.
- User passwords.
- Entire project files unless explicitly requested and size-limited.
- Private notes unrelated to the current request.

Context should be minimized to what the companion needs to answer the visible user request.

## Example Runtime Request

```json
{
  "profile": {
    "schemaVersion": "1.0.0",
    "id": "master-draft-story-companion",
    "name": "Master Draft Story Companion",
    "description": "Screenplay development companion for story analysis, continuity, pitch clarity, and visual development notes.",
    "category": "Creative Writing",
    "status": "Template",
    "persona": {
      "role": "Story analyst, continuity checker, pitch coach, and screenplay development partner",
      "tone": "Editorial",
      "responseStyle": "Bullet-first"
    },
    "systemRules": [
      "Do not invent canon facts, character history, plot events, visual references, or production details.",
      "Respect Never Break rules above all other suggestions.",
      "Prioritize current scene context before giving general story advice."
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
      "id": "master-draft",
      "name": "Master Draft",
      "version": "0.1.0",
      "environment": "local"
    },
    "projectId": "md-project-123",
    "activeTool": "script-editor",
    "currentScreenContext": "User is editing Act 1 Scene 3 in the screenplay editor.",
    "selectedText": "Mara takes the job even though she knows the syndicate is involved.",
    "selectedEntity": {
      "id": "scene-act1-003",
      "type": "scene",
      "label": "Act 1 Scene 3 — Courier Job Offer",
      "value": "A reluctant courier accepts a dangerous job from someone she does not trust."
    },
    "memorySections": [
      {
        "id": "never-break",
        "label": "Never Break rules",
        "content": "Mara never willingly works for the syndicate before Act 2.",
        "priority": "high",
        "source": "master-draft-story-bible"
      }
    ],
    "warnings": [],
    "metadata": {
      "hostApp": "master-draft",
      "contractVersion": "0.1"
    },
    "actionHints": [],
    "createdAt": "2026-01-01T00:00:00.000Z"
  },
  "message": "Does this break canon or create a strong enough first-compromise moment?",
  "history": [],
  "mode": "live",
  "provider": "openai"
}
```

## Open Questions

- Should Master Draft host its own companion profile copy, or always request the profile from Mod-Mate?
- Should action suggestions be added to `CompanionRuntimeResponse` in the next schema version?
- What max context size should Master Draft enforce before sending to Mod-Mate?
- Should Master Draft support offline mock mode for local-only writing sessions?

## Acceptance Criteria Mapping

- **Integration contract is documented** — this document.
- **Master Draft context packet fields are listed** — see `Master Draft Context Packet` and `Recommended Master Draft Packet Values`.
- **Mod-Mate response/action shape is listed** — see runtime response and future structured action shape.
- **Contract avoids requiring Mod-Mate to directly read Master Draft database/storage** — host-owned context principle.
- **Contract supports future embedded widget work** — same packet/API flow can back widget or custom API integration.
