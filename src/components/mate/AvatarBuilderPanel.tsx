"use client";

import { type RefObject, useState } from "react";
import { Loader2, Sparkles, Trash2 } from "lucide-react";
import CompanionAvatar from "@/components/mate/CompanionAvatar";
import type { CompanionAvatar as CompanionAvatarMetadata, CompanionCategory } from "@/types/companionProfile";

type AvatarBuilderPanelProps = {
  name: string;
  category: CompanionCategory;
  avatar?: CompanionAvatarMetadata;
  prompt: string;
  promptRef?: RefObject<HTMLTextAreaElement | null>;
  onPromptChange: (prompt: string) => void;
  onAvatarChange: (avatar?: CompanionAvatarMetadata) => void;
};

const AvatarBuilderPanel = ({ name, category, avatar, prompt, promptRef, onPromptChange, onAvatarChange }: AvatarBuilderPanelProps) => {
  const [status, setStatus] = useState({ type: "idle", message: "Avatar metadata saves with this local browser draft for now." });

  const createAvatar = async () => {
    const cleanPrompt = prompt.trim();
    if (!cleanPrompt) {
      setStatus({ type: "error", message: "Add a prompt first." });
      return;
    }

    setStatus({ type: "loading", message: "Creating avatar preview..." });

    try {
      const response = await fetch("/api/avatar/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt: cleanPrompt, companionName: name, companionCategory: category }),
      });
      const payload = (await response.json()) as { imageUrl?: string; error?: string };
      if (!response.ok || !payload.imageUrl) throw new Error(payload.error ?? "Avatar request failed.");

      onAvatarChange({ imageUrl: payload.imageUrl, prompt: cleanPrompt, source: "generated", generatedAt: new Date().toISOString() });
      setStatus({ type: "success", message: "Avatar preview created. Save draft to keep it." });
    } catch (error) {
      setStatus({ type: "error", message: error instanceof Error ? error.message : "Avatar request failed." });
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-[auto,1fr] gap-5 items-start">
      <CompanionAvatar name={name} avatar={avatar} size="lg" />
      <div className="space-y-3">
        <textarea
          ref={promptRef}
          value={prompt}
          onChange={(event) => onPromptChange(event.target.value)}
          rows={3}
          placeholder="Friendly companion avatar, warm illustrated app icon style"
          data-testid="builder-avatar-prompt"
          className="w-full rounded-xl border border-border bg-white px-3.5 py-2.5 text-sm leading-relaxed focus:outline-none focus:ring-2 focus:ring-primary/30"
        />
        <div className="flex flex-wrap gap-2">
          <button type="button" onClick={createAvatar} disabled={status.type === "loading"} data-testid="builder-generate-avatar" className="inline-flex items-center gap-1.5 rounded-full bg-primary text-primary-foreground px-4 py-2 text-sm font-medium disabled:opacity-60">
            {status.type === "loading" ? <Loader2 className="h-4 w-4 animate-spin" /> : <Sparkles className="h-4 w-4" />}
            Generate avatar
          </button>
          {avatar?.imageUrl && (
            <button type="button" onClick={() => onAvatarChange(undefined)} data-testid="builder-clear-avatar" className="inline-flex items-center gap-1.5 rounded-full border border-border bg-white px-4 py-2 text-sm font-medium hover:bg-muted">
              <Trash2 className="h-4 w-4" /> Clear avatar
            </button>
          )}
        </div>
        <p className={`text-xs ${status.type === "error" ? "text-secondary" : "text-muted-foreground"}`} data-testid="builder-avatar-status">{status.message}</p>
      </div>
    </div>
  );
};

export default AvatarBuilderPanel;
