"use client";

import React from "react";
import { Link } from "@/components/compat/Router";
import { Pencil, FlaskConical, Code2 } from "lucide-react";
import Badge from "@/components/mate/Badge";

const ACCENTS = {
  sage: "bg-accent-sage/15 text-[#3F5A40]",
  ochre: "bg-accent-ochre/20 text-[#7B5A1F]",
  terracotta: "bg-secondary/15 text-secondary",
  primary: "bg-primary/10 text-primary",
};

const STATUS_TONE = {
  Ready: "sage",
  Draft: "ochre",
  Template: "primary",
};

const CompanionCard = ({ companion }) => {
  const accent = ACCENTS[companion.accent] || ACCENTS.primary;
  return (
    <article
      className="surface-card p-6 lift-on-hover flex flex-col gap-4"
      data-testid={`companion-card-${companion.id}`}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-3">
          <div
            className={`h-12 w-12 rounded-2xl flex items-center justify-center font-heading font-semibold ${accent}`}
            aria-hidden="true"
          >
            {companion.initials}
          </div>
          <div>
            <h3 className="font-heading text-lg font-medium leading-tight">{companion.name}</h3>
            <p className="text-xs text-muted-foreground mt-0.5">{companion.category}</p>
          </div>
        </div>
        <Badge tone={STATUS_TONE[companion.status] || "neutral"}>{companion.status}</Badge>
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
