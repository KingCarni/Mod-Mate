# Mod-Mate

Mod-Mate is a standalone platform for building, testing, and eventually embedding modular AI companions.

## Current status

The app now has a working local companion builder, portable companion profile templates, import/export support, a Playground, a runtime API, live OpenAI mode behind a server-side environment key, and Phase 1 embeddable integration foundation types/docs/sample adapters.

Still not implemented yet:

- user auth
- database-backed companion persistence
- billing
- production account/workspace model
- real external app embedding
- confirmed cross-app write actions

## Stack

- Next.js App Router
- TypeScript
- Tailwind CSS
- React

## Routes

- `/` — landing page
- `/dashboard` — companion dashboard
- `/builder` — companion builder UI
- `/playground` — chat playground with mock/live runtime mode
- `/templates` — template discovery and template-to-builder handoff
- `/integrations` — integration placeholders
- `/settings` — settings placeholders

## Runtime

The runtime endpoint is:

```http
POST /api/runtime
```

It accepts a companion profile, context packet, user message, optional history, runtime mode, and provider.

Supported modes:

- `mock / mock` — no API key required
- `live / openai` — requires `OPENAI_API_KEY` server-side

## Environment

Create `.env.local` for local live model testing:

```env
OPENAI_API_KEY=your_openai_api_key_here
OPENAI_MODEL=gpt-4o-mini
```

`OPENAI_MODEL` is optional. The runtime defaults to `gpt-4o-mini` if no model is provided.

Never expose the OpenAI key through a public/client-side environment variable.

## Companion templates

Production-style starter templates currently include:

- Master Draft Story Companion
- QAtalyst QA Lead Companion

Both can be loaded from `/templates`, edited in `/builder`, and tested in `/playground`.

## Integration foundation

MOD-4 Phase 1 adds shared integration types, helpers, and sample host adapters.

Key files:

```txt
src/types/integration.ts
src/lib/integrations.ts
src/lib/integrationSamples/masterDraftAdapter.ts
src/lib/integrationSamples/qatalystAdapter.ts
```

This foundation is not a production embed system yet. It does not add auth, billing, database persistence, token issuing, real host app connections, or silent host app writes.

## Product docs

Product planning docs live in:

```txt
docs/product/
```

Current product docs:

- `docs/product/template-discovery-categories.md` — companion template discovery categories and public-facing label guidance
- `docs/product/creative-media-concept-modules.md` — future creative media template/module concepts and capability mapping
- `docs/product/reference-companion-ux-audit.md` — reference companion product UX audit and recommendations

## Integration contracts

Integration planning docs live in:

```txt
docs/integrations/
```

Current contract docs:

- `docs/integrations/embeddable-integration-system.md` — shared embeddable integration system foundation
- `docs/integrations/master-draft-contract.md` — Master Draft ↔ Mod-Mate integration contract
- `docs/integrations/qatalyst-contract.md` — QAtalyst ↔ Mod-Mate integration contract

## Run locally

```bash
npm install
npm run dev
```

Then open `http://localhost:3000`.

## Notes

This project started from an Emergent-created UI shell and was migrated from CRA/JavaScript to Next.js/TypeScript so backend/API/auth work can be added cleanly.