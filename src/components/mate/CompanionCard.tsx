"use client";

import React from "react";
import { Link } from "@/components/compat/Router";
import { Pencil, FlaskConical, Code2 } from "lucide-react";
import Badge from "@/components/mate/Badge";
import CompanionAvatar from "@/components/mate/CompanionAvatar";
import type { CompanionAvatar as CompanionAvatarMetadata } from "@/types/companionProfile";

const STATUS_TONE = {
  Ready: "sage",
  Draft: "ochre",
  Template: "primary",
};

type CompanionCardProps = {
  companion: {
    id: string;
    name: string;
    category: string;
    description: string;
    status: keyof typeof STATUS_TONE | string;
    initials: string;
    lastEdited: string;
    avatar?: CompanionAvatarMetadata;
  };
};

const CompanionCard = ({ companion }: CompanionCardProps) => {
  return (
    <article
      className="surface-card p-6 lift-on-hover flex flex-col gap-4"
      data-testid={`companion-card-${companion.id}`}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-3">
          <CompanionAvatar
            name={companion.name}
            initials={companion.initials}
            avatar={companion.avatar}
            size="lg"
            className="!h-12 !w-12 !rounded-2xl !text-base"
          />
          <div>
            <h3 className="font-heading text-lg font-medium leading-tight">{companion.name}</h3>
            <p className="text-xs text-muted-foreground mt-0.5">{companion.category}</p>
          </div>
        </div>
        <Badge tone={STATUS_TONE[companion.status as keyof typeof STATUS_TONE] || "neutral"}>{companion.status}</Badge>
      </div>

      <p className="text-sm text-muted-foreground leading-relaxed">{companion.description}</p>

      <div className="flex items-center justify-between pt-3 mt-auto border-t border-border">
        <span className="text-xs text-muted-foreground">Edited {companion.lastEdited}</span>
        <div className="flex items-center gap-1">
          <Link
            to="/builder"
            data-testid={`companion-${companion.id}-edit`}
            className="inline-flex items-center gap-1 rounded-full px-3 py-1.5 text-xs text-foreground hover:bg-muted"
          >
            <Pencil className="h-3.5 w-3.5" /> Edit
          </Link>
          <Link
            to="/playground"
            data-testid={`companion-${companion.id}-test`}
            className="inline-flex items-center gap-1 rounded-full px-3 py-1.5 text-xs text-foreground hover:bg-muted"
          >
            <FlaskConical className="h-3.5 w-3.5" /> Test
          </Link>
          <Link
            to="/integrations"
            data-testid={`companion-${companion.id}-embed`}
            className="inline-flex items-center gap-1 rounded-full px-3 py-1.5 text-xs text-foreground hover:bg-muted"
          >
            <Code2 className="h-3.5 w-3.5" /> Embed
          </Link>
        </div>
      </div>
    </article>
  );
};

export default CompanionCard;
