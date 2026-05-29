# QAtalyst Integration Preview

Status: Draft v0.1  
Owner: MOD-6  
Last updated: 2026-05-28

## Goal

Create the second proof path for Mod-Mate as a modular companion runtime by showing how QAtalyst can use the same companion/profile/context system as Master Draft.

This preview does not connect to the real QAtalyst app yet. It demonstrates the host-owned context packet, embed config, action hints, and runtime request shape that the real integration should use later.

## Files

```txt
src/lib/integrationSamples/qatalystAdapter.ts
src/app/integrations/qatalyst/page.tsx
src/pages/QatalystIntegrationPreview.tsx
```

## What The Preview Shows

The preview route shows:

- QAtalyst host app identity
- sample side-panel embed config
- sample QAtalyst context packet
- sample runtime request using the QAtalyst QA Lead Companion profile
- workflow context, source input, generated output, Project Brain, Source Vault, QA rules, terminology, risk register, Jira state, TestRail state, and open question memory sections
- confirm-before-write action hints

Preview route:

```txt
/integrations/qatalyst
```

## Action Hints

The sample adapter defines these actions:

- `apply-to-generated-output`
- `export-to-project-brain`
- `draft-jira-comment`
- `create-jira-ticket`
- `create-testrail-cases`

All write-like actions require confirmation.

Mod-Mate does not execute these actions. The future QAtalyst host app would render confirmation UI and apply changes itself.

## Runtime Request

The sample runtime request is created by:

```ts
createQatalystSampleRuntimeRequest()
```

Default mode is mock/mock so the preview can be rendered without an API key.

The same request shape can later use live/openai when wired from a real host app.

## Boundaries

This preview intentionally does not build:

- a real embedded widget package
- a live QAtalyst app connection
- direct QAtalyst database access
- direct Project Brain or Source Vault access
- Jira writes
- TestRail writes
- credential handling
- auth
- billing
- production write actions

## Success Criteria Mapping

- **QAt companion profile hosted/configured by Mod-Mate** — sample runtime request imports the QAtalyst companion profile from Mod-Mate.
- **QAtalyst context adapter sends active workflow, source input, generated output, Source Vault, QA rules, terminology, risks, Jira/TestRail setup state, and project context** — sample adapter includes those memory sections.
- **Widget/panel direction** — sample embed config uses `side-panel` and preview page demonstrates the intended panel contract.
- **Support QA workflow actions with confirmation** — action hints require confirmation and remain host-owned.
