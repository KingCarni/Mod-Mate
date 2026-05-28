"use client";

import React from "react";
import Badge from "@/components/mate/Badge";

const STATUS_TONE = {
  Planned: "neutral",
  "Coming Soon": "ochre",
  Internal: "sage",
};

const IntegrationCard = ({ integration }) => (
  <article
    className="surface-card p-6 lift-on-hover flex flex-col gap-4"
    data-testid={`integration-${integration.id}`}
  >
    <div className="flex items-start justify-between">
      <div className="flex items-center gap-3">
        <div className="h-11 w-11 rounded-xl bg-muted flex items-center justify-center font-heading font-semibold text-primary">
          {integration.name.slice(0, 2).toUpperCase()}
        </div>
        <h3 className="font-heading text-lg font-medium">{integration.name}</h3>
      </div>
      <Badge tone={STATUS_TONE[integration.status] || "neutral"}>{integration.status}</Badge>
    </div>
    <p className="text-sm text-muted-foreground leading-relaxed">{integration.description}</p>
    <div className="mt-auto pt-3 border-t border-border flex items-center justify-end">
      <button
        type="button"
        data-testid={`integration-${integration.id}-cta`}
        className="text-sm font-medium text-primary hover:underline underline-offset-4"
      >
        {integration.status === "Internal" ? "View Contract" : "Coming Soon"} →
      </button>
    </div>
  </article>
);

export default IntegrationCard;
