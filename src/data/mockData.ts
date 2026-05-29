// Mock data for Mod-Mate UI shell. No backend wiring.

export const companions = [
  {
    id: "draftmate",
    name: "DraftMate",
    category: "Writing & Story",
    description:
      "Screenplay & story companion. Tracks beats, characters, and tone across drafts.",
    status: "Ready",
    accent: "ochre",
    initials: "DM",
    lastEdited: "2h ago",
  },
  {
    id: "qat",
    name: "QAt",
    category: "QA & Product",
    description:
      "Triage companion for bug reports. Groups, prioritises, and explains regressions.",
    status: "Draft",
    accent: "sage",
    initials: "QA",
    lastEdited: "yesterday",
  },
  {
    id: "gm-mate",
    name: "GM-Mate",
    category: "Characters & Worlds",
    description:
      "Game-master assistant. Remembers party, NPCs, lore, and campaign clocks.",
    status: "Ready",
    accent: "terracotta",
    initials: "GM",
    lastEdited: "3d ago",
  },
  {
    id: "balancemate",
    name: "BalanceMate",
    category: "Game Design",
    description:
      "Idle-game economy tuner. Reads your loops and suggests safe rebalances.",
    status: "Template",
    accent: "primary",
    initials: "BM",
    lastEdited: "1w ago",
  },
  {
    id: "supportmate",
    name: "SupportMate",
    category: "Support & Onboarding",
    description:
      "Customer support companion grounded in your help-centre and product docs.",
    status: "Draft",
    accent: "ochre",
    initials: "SM",
    lastEdited: "5h ago",
  },
  {
    id: "lore-keeper",
    name: "Lore Keeper",
    category: "Characters & Worlds",
    description:
      "Character companion that holds world facts, voice, and continuity over time.",
    status: "Template",
    accent: "sage",
    initials: "LK",
    lastEdited: "—",
  },
];

export const stats = [
  { id: "active", label: "Active companions", value: "6", delta: "+2 this week", tone: "sage" },
  { id: "tests", label: "Test conversations", value: "184", delta: "+38", tone: "ochre" },
  { id: "templates", label: "Templates saved", value: "12", delta: "+1", tone: "terracotta" },
  { id: "integrations", label: "Connected apps", value: "3", delta: "of 6 planned", tone: "primary" },
];

export const recentActivity = [
  { id: 1, who: "You", what: "edited DraftMate", when: "2h ago" },
  { id: 2, who: "You", what: "tested GM-Mate in Playground", when: "yesterday" },
  { id: 3, who: "Template", what: "QA triage partner imported", when: "2d ago" },
  { id: 4, who: "You", what: "drafted SupportMate persona", when: "3d ago" },
];

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

export const templates = [
  {
    id: "screenplay",
    title: "Build a screenplay companion",
    category: "Writing & Story",
    description: "A companion that tracks beats, characters, and tone across long drafts.",
    bg: "ochre",
    image: "https://static.prod-images.emergentagent.com/jobs/738a68c8-fd47-4930-8d69-a5af3486fa84/images/0f561b7fe1866a018de387befa3662371e7489c32e0ff8c676fbdca81be0e7d2.png",
    tag: "Featured",
    maturity: "Concept",
    starterPrompt: "Does this scene match the tone, character voice, and story promise?",
    memoryPreview: ["Characters", "Story beats", "Tone notes"],
    guardrailPreview: ["Do not invent canon", "Ask for missing context", "Flag continuity risks"],
    actionPreview: ["Analyze scene", "Suggest revision", "Rewrite on request"],
  },
  {
    id: "qatalyst-qa-lead",
    title: "QAtalyst QA Lead Companion",
    category: "QA & Product",
    description:
      "Production-style QA companion for triage, risk review, coverage gaps, release readiness, and workflow-specific quality guidance.",
    bg: "sage",
    tag: "Proof integration",
    maturity: "Ready",
    starterPrompt: "What risks should I flag and what coverage should I suggest?",
    memoryPreview: ["Project Brain", "QA rules", "Risk register", "Jira/TestRail state"],
    guardrailPreview: ["Do not invent test evidence", "Separate facts from assumptions", "Respect integration state"],
    actionPreview: ["Triage bug", "Plan coverage", "Draft Jira comment"],
  },
  {
    id: "master-draft-story",
    title: "Master Draft story companion",
    category: "Writing & Story",
    description:
      "Production-style screenplay companion for story analysis, continuity, pitch clarity, and visual development notes.",
    bg: "ochre",
    image: "https://static.prod-images.emergentagent.com/jobs/738a68c8-fd47-4930-8d69-a5af3486fa84/images/0f561b7fe1866a018de387befa3662371e7489c32e0ff8c676fbdca81be0e7d2.png",
    tag: "Proof integration",
    maturity: "Ready",
    starterPrompt: "Does this selected line break canon, or does it create a strong enough first-compromise moment?",
    memoryPreview: ["Story Bible", "Characters", "Canon facts", "Never Break rules"],
    guardrailPreview: ["Respect Never Break rules", "Do not invent story facts", "Mark uncertainty clearly"],
    actionPreview: ["Analyze scene", "Check continuity", "Suggest revision"],
  },
  {
    id: "qa-triage",
    title: "Create a QA triage partner",
    category: "QA & Product",
    description: "Cluster bugs by root cause, propose repro steps, and explain regressions.",
    bg: "sage",
    tag: "Popular",
    maturity: "Template",
    starterPrompt: "What is missing from this bug report before it is ready for development?",
    memoryPreview: ["Bug history", "QA rules", "Risk areas"],
    guardrailPreview: ["Call out unknowns", "Do not invent repro steps", "Prioritize user impact"],
    actionPreview: ["Suggest repro steps", "Group risks", "Draft triage notes"],
  },
  {
    id: "game-economy",
    title: "Tune a game economy",
    category: "Game Design",
    description: "Read your gameplay loops and suggest balance tweaks with clear reasoning.",
    bg: "primary",
    tag: "Featured",
    maturity: "Concept",
    starterPrompt: "Where is this economy loop likely to break after day three?",
    memoryPreview: ["Currencies", "Loops", "Progression gates"],
    guardrailPreview: ["Explain assumptions", "Avoid unsafe nerfs", "Protect player motivation"],
    actionPreview: ["Find bottlenecks", "Suggest rebalances", "Flag exploit loops"],
  },
  {
    id: "docs-to-support",
    title: "Turn docs into a support companion",
    category: "Docs & Knowledge",
    description: "Point a companion at your documentation and let it answer real user questions.",
    bg: "sage",
    tag: "New",
    maturity: "Template",
    starterPrompt: "How would this user solve their setup issue from our docs?",
    memoryPreview: ["Product docs", "Known issues", "Support tone"],
    guardrailPreview: ["Answer from sources", "Ask for missing context", "Do not expose private notes"],
    actionPreview: ["Summarize answer", "Draft support reply", "Flag doc gaps"],
  },
  {
    id: "character-memory",
    title: "Create characters that remember",
    category: "Characters & Worlds",
    description: "Long-running character companions with memory categories you control.",
    bg: "ochre",
    tag: "Featured",
    maturity: "Concept",
    starterPrompt: "What should this character remember about our last scene together?",
    memoryPreview: ["Backstory", "Voice", "Relationship notes", "World rules"],
    guardrailPreview: ["Stay in character", "Respect world rules", "Keep boundaries clear"],
    actionPreview: ["Continue scene", "Summarize memory", "Suggest relationship beats"],
  },
  {
    id: "gm-assistant",
    title: "Design a tabletop GM assistant",
    category: "Characters & Worlds",
    description: "Remember party state, NPC voices, and campaign clocks between sessions.",
    bg: "terracotta",
    image: "https://static.prod-images.emergentagent.com/jobs/738a68c8-fd47-4930-8d69-a5af3486fa84/images/2d35c4f2a5070a4a8e5b2e6d12f2e0f1b0aed32187cf92ac948b142571b0b0f2.png",
    tag: "New",
    maturity: "Concept",
    starterPrompt: "What did the party leave unresolved last session?",
    memoryPreview: ["Party state", "NPCs", "Locations", "Session clocks"],
    guardrailPreview: ["Do not retcon canon", "Ask before major reveals", "Track open threads"],
    actionPreview: ["Prep next scene", "Recall NPC voice", "Summarize session"],
  },
  {
    id: "in-product-help",
    title: "Help users inside your product",
    category: "Support & Onboarding",
    description: "Drop-in companion that answers in-product questions with your docs.",
    bg: "terracotta",
    image: "https://static.prod-images.emergentagent.com/jobs/738a68c8-fd47-4930-8d69-a5af3486fa84/images/62258c8504fc1c6292f4fc093b2d8f1a4f03230a0109cf36cd3da556b61a47f3.png",
    tag: "Popular",
    maturity: "Coming Soon",
    starterPrompt: "What should I do next on this screen?",
    memoryPreview: ["Screen context", "Docs", "User goal"],
    guardrailPreview: ["Avoid hidden actions", "Use current screen first", "Escalate unclear cases"],
    actionPreview: ["Explain screen", "Suggest next step", "Open docs"],
  },
  {
    id: "team-workflow-assistant",
    title: "Build a workflow assistant for your team",
    category: "Business Workflow",
    description: "A shared assistant that learns your team's vocabulary, rituals, and checklists.",
    bg: "primary",
    tag: "Concept",
    maturity: "Concept",
    starterPrompt: "What is the next best handoff note for this project?",
    memoryPreview: ["SOPs", "Decisions", "Team vocabulary"],
    guardrailPreview: ["Keep private data out", "Confirm before writes", "Separate tasks from context"],
    actionPreview: ["Draft handoff", "Summarize decisions", "Create checklist"],
  },
];

export const featuredTemplateIds = ["screenplay", "qatalyst-qa-lead", "game-economy"];

export const futureConcepts = [
  { id: "act-out", title: "Scene Studio Companion", note: "Demo concept" },
  { id: "story-continues", title: "Interactive Storyworld Companion", note: "Later" },
  { id: "playable-books", title: "Playable Reading Companion", note: "Later" },
  { id: "full-cast", title: "Audio Drama Companion", note: "Demo concept" },
  { id: "story-chat", title: "Chat-to-Story Companion", note: "MVP/Demo" },
  { id: "fandom-live", title: "Fandom Guide Companion", note: "Later" },
];

export const integrations = [
  {
    id: "react-widget",
    name: "React Widget",
    description: "Drop a companion into any React app with a themeable chat surface.",
    status: "Coming Soon",
  },
  {
    id: "custom-web-app",
    name: "Custom Web App",
    description: "Embed a companion inside your own web app with a small JavaScript snippet.",
    status: "Coming Soon",
  },
  {
    id: "product-dashboard",
    name: "Product Dashboard",
    description: "Add an in-product companion to dashboards, settings, or onboarding flows.",
    status: "Planned",
  },
  {
    id: "documentation-site",
    name: "Documentation Site",
    description: "Plug a support companion into your docs that answers from your own pages.",
    status: "Planned",
  },
  {
    id: "internal-tool",
    name: "Internal Tool",
    description: "Bring a companion into a private team tool — back-office, admin, ops.",
    status: "Planned",
  },
  {
    id: "api-integration",
    name: "API Integration",
    description: "REST contract for talking to any Mod-Mate companion from any backend.",
    status: "Planned",
  },
  {
    id: "sdk",
    name: "SDK",
    description: "A first-class SDK for embedding and orchestrating companions in code.",
    status: "Coming Soon",
  },
];

export const builderRules = [
  "Never invent missing project facts.",
  "Ask for missing context before guessing.",
  "Stay in character voice unless explicitly broken.",
  "Cite the source document when quoting.",
  "Refuse out-of-scope tasks politely.",
];

export const memoryCategories = [
  { id: "facts", label: "Project facts", color: "sage" },
  { id: "characters", label: "Characters", color: "ochre" },
  { id: "decisions", label: "Decisions log", color: "terracotta" },
  { id: "lore", label: "World lore", color: "primary" },
  { id: "open-questions", label: "Open questions", color: "sage" },
];

export const allowedActions = [
  { id: "summarise", label: "Summarise documents", enabled: true },
  { id: "rewrite", label: "Rewrite passages", enabled: true },
  { id: "ask", label: "Ask clarifying questions", enabled: true },
  { id: "draft", label: "Draft new content", enabled: false },
  { id: "search", label: "Search project memory", enabled: true },
  { id: "external", label: "Call external tools", enabled: false },
];

export const sampleChat = [
  {
    id: 1,
    role: "system",
    content: "Companion: DraftMate · Memory loaded: 3 categories · Rules: 5",
  },
  {
    id: 2,
    role: "user",
    content:
      "Here's the cold open for act one. Does the tone match the rest of the script and the character bible?",
  },
  {
    id: 3,
    role: "assistant",
    content:
      "Based on the companion profile and the context provided, I'd focus this companion on concise, context-aware guidance. The current rule set is clear, but you may want to add one guardrail about not inventing missing project facts.",
  },
  {
    id: 4,
    role: "user",
    content: "Good call. Add that to the rules and re-summarise this scene in two lines.",
  },
  {
    id: 5,
    role: "assistant",
    content:
      "Added the guardrail. Scene summary: a reluctant courier accepts a job she shouldn't, signalling the story's first compromise. Tone aligns with your noir reference; one line of action could be tightened.",
  },
];

export const useCases = [
  {
    id: "screenplay",
    title: "Screenplay & story",
    body: "Drafts that remember characters, beats, and your style.",
    icon: "feather",
  },
  {
    id: "qa",
    title: "QA & product triage",
    body: "Group bugs, explain regressions, propose repro steps.",
    icon: "bug",
  },
  {
    id: "tabletop",
    title: "Tabletop game mastering",
    body: "A co-GM that holds party state, NPCs, and clocks.",
    icon: "dice",
  },
  {
    id: "idle",
    title: "Idle game balance",
    body: "Reads your loops and suggests safe rebalances.",
    icon: "sliders",
  },
  {
    id: "support",
    title: "Onboarding & workflow",
    body: "Walk users through your product with context-aware help.",
    icon: "compass",
  },
  {
    id: "world",
    title: "Worldbuilding memory",
    body: "Keep lore, rules, and relationships consistent.",
    icon: "globe",
  },
];

export const workflowSteps = [
  { id: 1, title: "Describe the companion", body: "Name, role, tone, and where it lives. Pick a starting template or begin blank." },
  { id: 2, title: "Set rules & memory", body: "Add guardrails, decide what it remembers, and choose which actions it can take." },
  { id: 3, title: "Test in the playground", body: "Talk to it, switch context packets, and refine the persona live." },
  { id: 4, title: "Plug into your app", body: "Embed into your workflow via React, API, or custom host when ready." },
];
