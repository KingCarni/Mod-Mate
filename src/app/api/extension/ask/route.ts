import { NextResponse } from "next/server";

const OPENAI_TEXT_MODEL = process.env.OPENAI_TEXT_MODEL || "gpt-4o-mini";

type ExtensionAskRequest = {
  selectedText?: unknown;
  prompt?: unknown;
  companionTemplate?: {
    id?: unknown;
    label?: unknown;
    description?: unknown;
  };
  page?: {
    title?: unknown;
    url?: unknown;
    host?: unknown;
    frameUrl?: unknown;
  };
};

type ExtensionAskResponse = {
  answer: string;
  provider: "openai" | "mock";
  warnings: Array<{ id: string; level: "info" | "warning" | "error"; message: string }>;
  actionHints: Array<{ id: string; label: string; description: string; requiresConfirmation: boolean }>;
};

const asString = (value: unknown, fallback = "") =>
  typeof value === "string" ? value.trim() : fallback;

const templateInstructions: Record<string, string> = {
  "general-review": "Act as a practical review companion. Focus on risks, missing context, assumptions, and next steps.",
  "writing-story": "Act as a writing and story companion. Focus on tone, continuity, character motivation, scene clarity, and useful revision notes. Do not invent canon.",
  "qa-triage": "Act as a senior QA triage companion. Separate confirmed facts, assumptions, risks, repro gaps, coverage gaps, and next steps.",
  "docs-support": "Act as a docs and support companion. Focus on unclear steps, missing prerequisites, likely user confusion, and clearer support-ready answers.",
  "product-feedback": "Act as a product feedback companion. Focus on user pain, likely root causes, product risk, impact, and next experiments.",
};

const buildPrompt = (input: {
  selectedText: string;
  prompt: string;
  templateId: string;
  templateLabel: string;
  pageTitle: string;
  pageUrl: string;
}) => {
  const instruction = templateInstructions[input.templateId] ?? templateInstructions["general-review"];

  return [
    "You are Mod-Mate, a compact companion that helps inside another app through a browser extension.",
    instruction,
    "Use only the selected text and page context provided. Do not claim access to the full page, database, private files, or hidden app state.",
    "Return concise, useful output with headings when helpful. Keep it practical.",
    "Clearly separate confirmed facts from assumptions when the selected text is incomplete.",
    "Do not provide write-back claims. Any edits or saves are only suggestions until the user confirms in the host app.",
    "",
    `Companion template: ${input.templateLabel} (${input.templateId})`,
    `Page title: ${input.pageTitle}`,
    `Page URL: ${input.pageUrl}`,
    "",
    "User prompt:",
    input.prompt,
    "",
    "Selected text:",
    input.selectedText,
  ].join("\n");
};

const createMockAnswer = (input: {
  selectedText: string;
  prompt: string;
  templateId: string;
  templateLabel: string;
}): string => {
  const trimmed = input.selectedText.length > 280 ? `${input.selectedText.slice(0, 277)}...` : input.selectedText;

  if (input.templateId === "writing-story") {
    return [
      "## Quick story read",
      "**Confirmed from selection:** The scene is set in an interior loft apartment at night, with Mara reading a letter for the first time while rain hits glass.",
      "**Useful flags:** The emotional context is not clear yet, the letter content is unknown, and Mara's reaction/motivation may need grounding.",
      "**Next move:** Add one concrete reaction beat before expanding the scene, so the companion can judge tone and continuity more accurately.",
      "",
      `> ${trimmed}`,
    ].join("\n");
  }

  if (input.templateId === "qa-triage") {
    return [
      "## QA triage read",
      "**Confirmed facts:** Selected text was provided, but the report may still be missing expected result, actual result, environment, frequency, and logs.",
      "**Risks:** Ambiguous repro steps and unclear scope can block development or create weak test coverage.",
      "**Next steps:** Ask for exact steps, environment, actual/expected behavior, and affected users before marking it ready.",
      "",
      `> ${trimmed}`,
    ].join("\n");
  }

  return [
    `## ${input.templateLabel} response`,
    "**Confirmed from selection:** I can review the selected text only.",
    "**Likely gaps:** Context, intent, success criteria, and desired output may need clarification depending on the host workflow.",
    "**Recommended next step:** Ask one focused follow-up or generate a small suggested edit before making any host-app changes.",
    "",
    `> ${trimmed}`,
  ].join("\n");
};

const askOpenAI = async (prompt: string): Promise<string | null> => {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) return null;

  const response = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: OPENAI_TEXT_MODEL,
      messages: [
        {
          role: "system",
          content:
            "You are Mod-Mate. Give concise, practical companion responses for selected text from a browser extension.",
        },
        { role: "user", content: prompt },
      ],
      temperature: 0.4,
    }),
  });

  const payload = (await response.json()) as {
    choices?: Array<{ message?: { content?: string } }>;
    error?: { message?: string };
  };

  if (!response.ok) {
    throw new Error(payload.error?.message ?? "OpenAI request failed.");
  }

  return payload.choices?.[0]?.message?.content?.trim() || null;
};

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as ExtensionAskRequest;
    const selectedText = asString(body.selectedText);
    const prompt = asString(body.prompt, "Review the selected text and suggest next steps.");
    const templateId = asString(body.companionTemplate?.id, "general-review");
    const templateLabel = asString(body.companionTemplate?.label, "General Review Companion");
    const pageTitle = asString(body.page?.title, "Untitled page");
    const pageUrl = asString(body.page?.url);

    if (!selectedText) {
      return NextResponse.json({ error: "Selected text is required." }, { status: 400 });
    }

    const modelPrompt = buildPrompt({ selectedText, prompt, templateId, templateLabel, pageTitle, pageUrl });

    let provider: ExtensionAskResponse["provider"] = "mock";
    let answer = createMockAnswer({ selectedText, prompt, templateId, templateLabel });

    try {
      const openAiAnswer = await askOpenAI(modelPrompt);
      if (openAiAnswer) {
        answer = openAiAnswer;
        provider = "openai";
      }
    } catch (error) {
      console.error("Extension ask OpenAI call failed; falling back to mock response.", error);
    }

    const response: ExtensionAskResponse = {
      answer,
      provider,
      warnings: [
        {
          id: "selection-only",
          level: "info",
          message: "Response is based only on the selected text and visible page metadata sent by the extension.",
        },
      ],
      actionHints: [
        {
          id: "copy-response",
          label: "Copy response",
          description: "Copy the answer and paste it into the host app manually.",
          requiresConfirmation: true,
        },
      ],
    };

    return NextResponse.json(response);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Extension ask failed.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
