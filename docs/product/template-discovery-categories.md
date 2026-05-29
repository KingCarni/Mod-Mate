# Companion Template Discovery Categories

Status: Draft v0.1  
Owner: MOD-21  
Last updated: 2026-05-28

## Goal

Define how users browse and choose Mod-Mate companion templates.

The Templates page should feel approachable to non-technical users while still supporting serious product/workflow use cases such as Master Draft, QAtalyst, support tools, game tools, and internal workflow companions.

## Category Principles

1. **User-language first** — category labels should describe what users are trying to build, not how the system works internally.
2. **Clear enough for first-time visitors** — a user should understand each category without knowing Mod-Mate terminology.
3. **Flexible enough for internal products** — internal-first templates can exist without turning the public UI into a company/product showcase.
4. **Template-first browsing** — categories should help users pick a starting point quickly.
5. **No artificial walls** — a template can inspire multiple use cases, but each card should have one primary category for filtering.

## Recommended Public Categories

### Writing & Story

For screenplay, fiction, story bible, pitch, continuity, visual development, and writing-support companions.

Example templates:

- Screenplay development companion
- Story Bible companion
- Character continuity checker
- Pitch clarity coach
- Visual development notes companion

Internal-first examples:

- Master Draft Story Companion

Public label recommendation:

```text
Writing & Story
```

Reason: clearer and broader than `Creative Writing`. It signals writing help, story structure, and long-form narrative support.

### QA & Product

For QA, bug triage, risk review, acceptance criteria, product feedback, release readiness, and test strategy companions.

Example templates:

- QA Lead Companion
- Bug triage partner
- Test coverage planner
- Release readiness reviewer
- Acceptance criteria reviewer

Internal-first examples:

- QAtalyst QA Lead Companion

Public label recommendation:

```text
QA & Product
```

Reason: this is already clear and should stay as-is.

### Game Design

For game systems, economy balancing, level design, progression loops, tuning, and production planning companions.

Example templates:

- Game economy tuner
- Idle game loop balancer
- Level design reviewer
- Progression systems companion
- Design pitch reviewer

Internal-first examples:

- Idle Game Creator companion, when ready

Public label recommendation:

```text
Game Design
```

Reason: clear, compact, and good for both hobbyist and product use.

### Support & Onboarding

For help-center, in-product help, onboarding, docs-to-chat, troubleshooting, and customer education companions.

Example templates:

- Documentation support companion
- In-product onboarding helper
- Troubleshooting assistant
- Customer support copilot
- FAQ companion

Public label recommendation:

```text
Support & Onboarding
```

Reason: strong plain-language category. Keep as-is.

### Business Workflow

For internal tools, SOPs, checklists, operations, admin tasks, project rituals, and team-process companions.

Example templates:

- Team workflow assistant
- SOP companion
- Meeting notes companion
- Project handoff assistant
- Internal ops guide

Public label recommendation:

```text
Business Workflow
```

Reason: practical and non-technical. Keep as-is.

### Characters & Worlds

For roleplay, character memory, worldbuilding, lore, tabletop RPG, fandom-style discussion, and immersive companion experiences.

Example templates:

- Character memory companion
- Tabletop GM assistant
- Lore keeper
- NPC voice companion
- Worldbuilding companion

Public label recommendation:

```text
Characters & Worlds
```

Reason: more natural than splitting `Character & Roleplay` and `Tabletop RPG` at the top level. It is broad enough for creative users and still understandable.

### Docs & Knowledge

For knowledge bases, manuals, internal documentation, policy docs, source vaults, and searchable project memory companions.

Example templates:

- Knowledge base companion
- Policy guide companion
- Source Vault companion
- Product docs companion
- Internal documentation assistant

Public label recommendation:

```text
Docs & Knowledge
```

Reason: users understand documents and knowledge. This also gives future Source Vault / Project Brain features a natural home.

## Recommended MVP Filter Set

For the next Templates page iteration, use:

```ts
export const templateCategories = [
  "All",
  "Writing & Story",
  "QA & Product",
  "Game Design",
  "Support & Onboarding",
  "Business Workflow",
  "Characters & Worlds",
  "Docs & Knowledge",
];
```

This keeps the filter list shorter and easier to scan than separating every niche into its own top-level tab.

## Category Migration From Current Labels

| Current | Recommended |
|---|---|
| Creative Writing | Writing & Story |
| QA & Product | QA & Product |
| Game Design | Game Design |
| Tabletop RPG | Characters & Worlds |
| Support & Onboarding | Support & Onboarding |
| Character & Roleplay | Characters & Worlds |
| Business Workflow | Business Workflow |
| Product Docs | Docs & Knowledge |
| Custom | Custom or hidden from template filters |

`Custom` should be available inside Builder, but it does not need to be a public Templates filter until users can save/publish their own templates.

## Example Cards By Category

### Writing & Story

- **Master Draft Story Companion** — production-style story, continuity, and pitch support.
- **Screenplay Companion** — tracks beats, tone, character arcs, and scene purpose.
- **Pitch Coach** — helps sharpen logline, summary, and deck language.

### QA & Product

- **QAtalyst QA Lead Companion** — triage, risk, coverage, and release readiness.
- **Bug Triage Partner** — turns thin bug reports into risk-aware next steps.
- **Acceptance Criteria Reviewer** — flags missing criteria, assumptions, and scope gaps.

### Game Design

- **Game Economy Tuner** — reviews loops, rewards, currencies, and progression pressure.
- **Level Design Reviewer** — checks difficulty ramps, friction, and clarity.
- **Idle Progression Companion** — evaluates pacing, prestige loops, and reward cadence.

### Support & Onboarding

- **Docs Support Companion** — answers from product docs and known support issues.
- **In-Product Help Companion** — guides users through active product screens.
- **Troubleshooting Companion** — helps users narrow down problems step by step.

### Business Workflow

- **Team Workflow Assistant** — remembers rituals, checklist language, and handoff needs.
- **SOP Companion** — answers from procedures and keeps staff aligned.
- **Project Handoff Companion** — summarizes status, risks, decisions, and next actions.

### Characters & Worlds

- **Character Memory Companion** — preserves character voice and long-running relationship details.
- **GM Assistant** — tracks NPCs, party state, lore, and session clocks.
- **Lore Keeper** — protects world rules and continuity across creative sessions.

### Docs & Knowledge

- **Knowledge Base Companion** — answers from selected internal documentation.
- **Source Vault Companion** — uses curated source material without exposing irrelevant files.
- **Policy Guide Companion** — helps users navigate policies safely.

## Internal-First vs Public-Facing Templates

Internal-first templates are valuable proof cases, but they should not dominate public positioning.

### Internal-first

- Master Draft Story Companion
- QAtalyst QA Lead Companion
- Campaign Brain companion, future
- Idle Game Creator companion, future

Use these for demos, integration tests, and product-specific validation.

### Public-facing

- Screenplay Companion
- QA Lead Companion
- Game Economy Tuner
- Docs Support Companion
- Team Workflow Assistant
- Character Memory Companion

Use these for the main Templates grid when positioning Mod-Mate to users who do not know the internal product ecosystem.

## Recommendations For Current App

### Change category labels

Update public template categories:

- `Creative Writing` → `Writing & Story`
- `Tabletop RPG` → `Characters & Worlds`
- `Character & Roleplay` → `Characters & Worlds`

Keep:

- `QA & Product`
- `Game Design`
- `Support & Onboarding`
- `Business Workflow`

Add:

- `Docs & Knowledge`

### Keep template IDs stable

Do not change template IDs such as:

- `master-draft-story`
- `qatalyst-qa-lead`
- `gm-assistant`
- `character-memory`

IDs are integration-friendly. Display labels can evolve without breaking storage/contracts.

### Preserve internal templates, but phrase them carefully

The current Master Draft and QAtalyst templates are useful, but they should be framed as production-style examples, not as the entire purpose of Mod-Mate.

Recommended display approach:

- Keep the template names for now.
- Keep `MOD-14` and `MOD-15` tags in dev/demo builds.
- In public marketing builds, consider using generic names with a smaller “powered by Mod-Mate” internal reference.

## Suggested UX Enhancements

1. **Featured row** — show 2–3 recommended starter templates above filters.
2. **Category chips** — keep filters as short, plain-language chips.
3. **Use-case badges** — add small labels such as `Integration-ready`, `Creative`, `Workflow`, or `Docs`.
4. **Template maturity** — distinguish `Ready`, `Template`, `Concept`, and `Coming Soon`.
5. **Preview before use** — later, allow users to inspect rules/memory/actions before loading a template into Builder.

## Acceptance Criteria Mapping

- **Define initial template categories** — see `Recommended Public Categories` and `Recommended MVP Filter Set`.
- **Define example companion cards for each category** — see `Example Cards By Category`.
- **Identify internal-first templates** — see `Internal-First vs Public-Facing Templates`.
- **Recommend category labels that are clear to non-technical users** — see `Category Principles`, `Recommended Public Categories`, and `Category Migration From Current Labels`.
