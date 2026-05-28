# Mod-Mate

Mod-Mate is a standalone UI shell for building modular AI companions.

## Current status

This project is currently a UI-only / fully mocked frontend. No backend, auth, database, billing, model calls, or real integrations are wired yet.

## Stack

- Next.js App Router
- TypeScript
- Tailwind CSS
- React

## Routes

- `/` — landing page
- `/dashboard` — companion dashboard
- `/builder` — companion builder UI
- `/playground` — mock chat playground
- `/templates` — template discovery
- `/integrations` — integration placeholders
- `/settings` — settings placeholders

## Run locally

```bash
npm install
npm run dev
```

Then open `http://localhost:3000`.

## Notes

This migration preserves the Emergent-created UI while moving the app from CRA/JavaScript to Next.js/TypeScript so backend/API/auth work can be added cleanly later.
