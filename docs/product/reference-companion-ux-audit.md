# Reference Companion UX Audit

Status: Draft v0.1  
Owner: MOD-19  
Last updated: 2026-05-28

## Goal

Audit reference companion/chat products for reusable UX patterns that could strengthen Mod-Mate's template discovery, onboarding, first-chat experience, and companion browsing.

Reference set:

- Character.AI
- Nomi.ai
- SpicyChat.ai
- Provided visual reference screenshot

This audit does not recommend copying any product directly. The goal is to identify patterns that fit Mod-Mate's positioning as a modular companion platform for creators, products, projects, and workflows.

## Research Notes

### Character.AI

Observed/current public positioning:

- Public homepage positioning centers on AI chat and user-created worlds.
- Broader market understanding: users create and chat with characters, including original characters, fictional-style personas, helpers, and text adventure/game-like scenarios.
- Strongest reusable product pattern: make companion discovery feel immediate and personal.
- Major caution: companion platforms are under heavy scrutiny around minor safety, emotional dependency, and moderation. Mod-Mate should avoid unclear age boundaries, parasocial overpromising, and unrestricted public character discovery until safety systems are designed.

Patterns worth studying:

- Fast path from discovery to first chat.
- Character/persona cards that are understandable at a glance.
- Chat as the primary activation moment.
- User-created characters as a growth loop.
- Lightweight identity/personality definition.

Patterns to avoid or delay:

- Public open-ended character marketplace before moderation exists.
- Strong emotional dependency framing.
- Celebrity/fictional-character lookalike positioning.
- Teen/minor companion use without a serious safety model.
- Infinite feed mechanics that bury serious workflow use cases.

### Nomi.ai

Observed/current public positioning:

- Nomi positions around AI companions with memory, emotional intelligence, creativity, and long-term relationship continuity.
- Its homepage emphasizes memory, personality, customization, voice chats, proactive messages, group chat, links/images, privacy, and user stories.
- Strongest reusable product pattern: make memory and continuity feel emotionally obvious, not technical.

Patterns worth studying:

- Memory is sold as a lived experience, not a database feature.
- Companion customization is framed around backstory, preferences, and personality.
- Multiple companions and group chat create a sense of a living cast.
- User stories explain use cases more clearly than feature grids alone.
- Voice/image/media features are treated as immersion layers around chat.

Patterns to avoid or delay:

- Relationship/romantic positioning as the core Mod-Mate story.
- Proactive messaging before user controls, notification settings, and safety boundaries are defined.
- Unfiltered or adult-content framing.
- Claims that imply emotional care, therapy, or human-level companionship.

### SpicyChat.ai

Observed/current public access note:

- The public page rendered as a loading-only app shell during audit, so the practical observation is limited.
- The relevant pattern class is adult/roleplay companion discovery, which should not drive Mod-Mate's MVP positioning.

Patterns worth studying cautiously:

- Large persona browsing surfaces.
- Clear content/category segmentation.
- Strong visual card systems.
- Low-friction start-chat behavior.

Patterns to avoid or delay:

- Adult-first positioning.
- NSFW marketplace dynamics.
- Public persona feed before moderation and account systems exist.
- Anything that makes Mod-Mate feel like an adult roleplay clone instead of modular companion infrastructure.

### Provided Reference Screenshot

The screenshot concepts suggest a broad creative media discovery layer:

- characters acting out ideas
- stories becoming visual/comic-like experiences
- playable books
- full-cast audio stories
- living characters
- character-led podcasts
- users/characters in new worlds
- chats reimagined as stories
- fandom-style live discussion

Best takeaway:

Mod-Mate can borrow the sense of playful, visual discovery without becoming a media-generation platform too early.

## Cross-Product UX Patterns

## 1. Discovery should start with outcomes, not settings

Users should not land on a page that feels like they are configuring a model.

Good labels:

- Build a screenplay companion
- Triage bugs with a QA lead
- Turn docs into a support companion
- Create a character that remembers
- Tune a game economy

Avoid labels that lead with internals:

- Configure context packets
- Build memory categories
- Set action permissions
- Create a runtime profile

These internals matter in Builder, but not at discovery.

## 2. Companion cards need fast identity signals

Each template card should communicate:

- who/what the companion is
- what job it helps with
- what category it belongs to
- whether it is ready, template, concept, or coming soon
- what happens when the user clicks it

Recommended card fields:

```ts
type TemplateCard = {
  id: string;
  title: string;
  category: string;
  description: string;
  tag?: "Ready" | "Template" | "Concept" | "Coming Soon";
  maturity?: "usable" | "draft" | "concept";
  primaryAction: "Use template" | "Preview" | "Coming soon";
};
```

## 3. First chat is the activation moment

Builder matters, but Playground is where users feel whether the companion works.

Recommended flow:

```text
Template card → Preview rules/memory → Use template → Builder → Save & launch Playground → First useful answer
```

Near-term improvement:

Add a template preview drawer before loading Builder. The drawer should show:

- role/persona
- top rules
- memory categories
- allowed actions
- example prompt

## 4. Memory should be explained as continuity

The word `memory` is accurate but abstract. Users understand continuity better.

Recommended copy patterns:

- Remembers project facts.
- Protects canon.
- Tracks risks and decisions.
- Keeps character voice consistent.
- Carries context between sessions.

For Mod-Mate, memory should feel practical and controllable, not mystical.

## 5. Serious workflows and playful companions can coexist

Mod-Mate should not choose only one personality.

Good split:

- serious workflow companions: QA, docs, support, business workflows
- creative companions: story, characters, game design, worlds

The Templates page can support both by using clean category filters and a professional visual system.

## 6. Safety and boundaries need to be visible early

Reference companion platforms show that open-ended companion chat can create real safety, moderation, and expectation risks.

Mod-Mate should make guardrails part of the product identity:

- visible rules
- memory controls
- action permissions
- confirmation before writes
- no silent host-app mutations
- clear mock/live runtime mode
- no public marketplace until moderation exists

## Patterns That Fit Mod-Mate

### Template discovery grid

Fit: strong

Why:

Mod-Mate already has templates and categories. A better discovery grid can make the platform feel useful before a user understands the Builder.

Recommended next iteration:

- Featured templates at the top.
- Category chips below.
- Cards with maturity tags.
- Preview-before-use.

### Companion profile preview

Fit: strong

Why:

Users should understand what they are about to load before overwriting or replacing a Builder draft.

Recommended preview fields:

- name
- category
- role
- tone
- response style
- top 3 rules
- memory category count
- allowed action count

### First-message starter prompts

Fit: strong

Why:

First chat often determines whether a user trusts the companion.

Recommended examples:

- Master Draft: "Does this scene break canon or create a strong enough first-compromise moment?"
- QAtalyst: "What risks should I flag and what test coverage should I suggest?"
- Support: "How would this user solve their setup issue from our docs?"
- Game Design: "Where is this economy loop likely to break?"

### Multiple companions per workspace

Fit: medium now, strong later

Why:

Useful long-term, but needs auth, persistence, and workspace concepts.

### Group chat / cast chat

Fit: later

Why:

Useful for creative demos, but not required for the current modular integration engine.

### Media generation

Fit: later/demo only

Why:

Image/video/audio generation could be compelling, but it is not core infrastructure yet.

## Patterns That Do Not Fit Mod-Mate Yet

- adult/NSFW-first positioning
- public character marketplace
- emotional dependency framing
- proactive companion messaging
- celebrity/fictional-character imitation
- social feed mechanics
- generated video as a primary product promise
- claims of therapy, emotional care, or human replacement

## Recommended UX Changes For Mod-Mate

## MVP-friendly changes

1. Add template preview before use.
2. Use clearer category labels from MOD-21.
3. Add starter prompts to template profiles.
4. Add maturity labels: Ready, Template, Concept, Coming Soon.
5. Make guardrails visible in template previews.
6. Keep internal product templates available, but do not over-advertise them publicly.

## Later changes

1. Public/private template publishing.
2. User-created template gallery.
3. Workspace-level companion library.
4. Companion preview share links.
5. Multi-companion/cast chat.
6. Media export modules.

## Recommended Emergent Build Prompt Direction

Use this direction for a future UI pass:

```text
Improve the Mod-Mate Templates and Discovery experience without changing backend behavior.

Create a more consumer-grade but still professional discovery flow inspired by companion/chat products. Do not copy any reference product. Keep Mod-Mate positioned as a modular AI companion builder for workflows, creative projects, and embeddable product assistants.

Add:
- featured starter templates
- clearer category chips
- maturity badges: Ready, Template, Concept, Coming Soon
- template preview drawer/modal before Use Template
- starter prompt examples for each production-style template
- visible guardrail/memory/action summaries
- empty states for categories with no templates

Keep:
- current earthy/organic visual direction
- legible typography
- clean professional tone
- existing Builder and Playground flow
- existing mock/live runtime behavior

Do not add:
- backend persistence
- auth
- billing
- public marketplace
- adult/NSFW positioning
- generated image/video/audio features
```

## Acceptance Criteria Mapping

- **Capture useful UI/UX patterns without copying directly** — see cross-product UX patterns and recommended changes.
- **Identify patterns that fit Mod-Mate** — see `Patterns That Fit Mod-Mate`.
- **Identify patterns that do not fit Mod-Mate** — see `Patterns That Do Not Fit Mod-Mate Yet`.
- **Produce recommendations for the Emergent build prompt** — see `Recommended Emergent Build Prompt Direction`.
