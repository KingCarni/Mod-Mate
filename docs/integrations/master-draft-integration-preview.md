# Master Draft Integration Preview

Status: Draft v0.1  
Owner: MOD-5  
Last updated: 2026-05-28

## Goal

Create the first real proof path for Master Draft consuming a Mod-Mate companion without Master Draft owning the companion engine directly.

This preview does not connect to the real Master Draft app yet. It demonstrates the host-owned context packet, embed config, action hints, and runtime request shape that the real integration should use later.

## Files

```txt
src/lib/integrationSamples/masterDraftAdapter.ts
src/app/integrations/master-draft/page.tsx
src/pages/MasterDraftIntegrationPreview.tsx
```

## What The Preview Shows

The preview route shows:

- Master Draft host app identity
- sample side-panel embed config
- sample Master Draft context packet
- sample runtime request using the Master Draft Story Companion profile
- Story Bible, current scene, character, canon, visual direction, and open question memory sections
- confirm-before-write action hints

Preview route:

```txt
/integrations/master-draft
```

## Action Hints

The sample adapter defines these actions:

- `apply-to-selected-text`
- `export-to-story-bible`
- `add-character-note`

All write-like actions require confirmation.

Mod-Mate does not execute these actions. The future Master Draft host app would render confirmation UI and apply changes itself.

## Runtime Request

The sample runtime request is created by:

```ts
createMasterDraftSampleRuntimeRequest()
```

Default mode is mock/mock so the preview can be rendered without an API key.

The same request shape can later use live/openai when wired from a real host app.

## Boundaries

This preview intentionally does not build:

- a real embedded widget package
- a live Master Draft app connection
- direct Master Draft database access
- file access
- token issuing
- auth
- billing
- production write actions

## Success Criteria Mapping

- **Master Draft companion profile hosted/configured by Mod-Mate** — sample runtime request imports the Master Draft companion profile from Mod-Mate.
- **Master Draft context adapter sends active project, scene, Story Bible, characters, canon, never-break rules, and visual context** — sample adapter includes those memory sections.
- **Widget/panel direction** — sample embed config uses `side-panel` and preview page demonstrates the intended panel contract.
- **Support export/apply actions with confirmation** — action hints require confirmation and remain host-owned.
