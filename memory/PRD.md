# Mod-Mate — Product Requirements Document

## Original problem statement
Build the initial frontend UI shell for **Mod-Mate**, a modular AI companion platform.

Scope of this pass: **UI only.** No backend, no database, no auth, no real AI, no
billing, no real integrations. Use mock data and placeholder states.

Product concept: Mod-Mate lets users create, configure, test, and eventually embed
custom AI companions across products and workflows — screenplay/story companions,
QA triage companions, tabletop GM assistants, idle-game balance tuners, customer
support companions, onboarding helpers, character/roleplay companions, etc.

## Architecture (current pass)
- React 19 + JavaScript + Tailwind CSS (CRA + craco scaffold).
- React Router v7 with these routes:
  - `/` — Landing
  - `/app` → redirects to `/app/dashboard`
  - `/app/dashboard`, `/app/builder`, `/app/playground`, `/app/templates`,
    `/app/integrations`, `/app/settings`
  - `*` → redirect to `/`
- No backend wiring. All data is static and lives in
  `/app/frontend/src/data/mockData.js`.
- Design system: earthy / organic palette (forest green primary, terracotta
  secondary, sage + ochre accents). Fonts: Outfit (headings) + Figtree (body) +
  JetBrains Mono (code).
- Reusable components under `/app/frontend/src/components/mate/` and layout shells
  under `/app/frontend/src/components/layout/`.

## User personas
- **Creator** — solo writer / game designer wanting a companion that understands
  their project.
- **Product / QA lead** — wants a companion to triage bugs and explain regressions.
- **Builder / dev** — embeds companions inside their own product (Master Draft,
  QAtalyst, etc.).
- **Operator / studio owner** — wants templates and integrations available out of
  the box.

## Core requirements (static)
- Polished, modern, clickable SaaS-quality UI shell.
- Seven routes / pages with consistent navigation.
- Reusable components: app shell, marketing header, companion card, template card,
  integration card, stat card, section card, badge, logo, empty state.
- Mock-data interactions: builder JSON preview updates live; rules add/remove;
  action toggles; playground send / reset / companion switch; template filter +
  search.
- Responsive layout (sidebar collapses on small screens; mobile nav strip).
- `data-testid` attributes on every interactive / key element.

## What's been implemented
**2026-01 (pass 1 — UI shell)**
- Landing page with hero (claymation background), use-cases grid, dark "How it
  works" section, templates preview (bento grid), integrations strip, final CTA,
  footer, sticky marketing header with mobile menu.
- Dashboard with stat cards, 6 mock companion cards (DraftMate, QAt, GM-Mate,
  BalanceMate, SupportMate, Lore Keeper), recent activity feed, templates preview,
  integrations sidebar.
- Companion Builder with 5 sections (Basics, Persona, Rules & guardrails, Memory
  categories, Allowed actions) and a sticky live Profile JSON preview.
- Chat Playground with sample messages, anchored companion picker dropdown,
  context-packet sidebar, send / reset / export controls, and stubbed assistant
  replies.
- Templates / Explore page with category pill filters, search, large colorful
  cards (claymation hero images), and a future-concepts section.
- Integrations page with 6 cards and a mock embed snippet.
- Settings page with 6 placeholder cards and a danger zone.
- Custom design tokens, Outfit + Figtree + JetBrains Mono via Google Fonts,
  earthy palette, grain texture and marquee utilities.

**2026-01 (pass 2 — content / positioning cleanup)**
- Removed all references to internal projects (Master Draft, QAtalyst, Campaign
  Brain, Idle Game Creator) from public-facing UI.
- Hero now reads "Build your own modular AI companion for any world." with the
  subheading "Build your own modular AI companion for any project, product,
  workflow, or creative world…".
- Marquee replaced with generic companion categories (Writing companions, QA &
  product companions, Game design companions, Tabletop GM companions, Support
  companions, Onboarding companions, Workflow assistants, Character companions).
- Templates renamed / reshaped: "Tune a game economy", "Turn docs into a support
  companion", "Build a workflow assistant for your team" (and the existing
  generic ones kept).
- Integrations replaced with neutral placeholders: React Widget, Custom Web App,
  Product Dashboard, Documentation Site, Internal Tool, API Integration,
  SDK (Coming Soon).
- Workspace label switched from "Acme Studio" → "Your Workspace".

## Testing
- Frontend tested via `testing_agent_v3` — all 7 routes, navigation, builder JSON
  update, rule add/remove, action toggles, playground send/reset/companion switch,
  templates filter + search, settings cards, and mobile responsive behaviour all
  verified working (55/55 functional checks).

## Backlog
**P0 — next pass**
- Wire builder state to a real persistence layer (per-companion drafts).
- Wire playground to a real model (Claude / GPT / Gemini via Emergent LLM key).
- Add auth so companions belong to a user.

**P1**
- Save / version / publish flow for companions.
- Real embed snippet generation per companion.
- Real integration wiring (Master Draft first).

**P2**
- Billing / plan management.
- Workspace member management.
- Analytics on companion usage.

## Mocked
- **Everything** in this pass is mocked. No network calls. All data is static in
  `/app/frontend/src/data/mockData.js`. Save / export / reset / integration CTAs
  are visual placeholders by design.
