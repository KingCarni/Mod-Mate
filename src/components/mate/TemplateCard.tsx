"use client";

import React from "react";
import { ArrowUpRight, Eye } from "lucide-react";
import Badge from "@/components/mate/Badge";

const BGS = {
  sage: "bg-[#E6ECDF]",
  ochre: "bg-[#F4E2C2]",
  terracotta: "bg-[#F2D6CD]",
  primary: "bg-[#D7E0DE]",
};

const MATURITY_TONES = {
  Ready: "sage",
  Template: "primary",
  Concept: "ochre",
  "Coming Soon": "neutral",
};

type TemplateCardProps = {
  template: {
    id: string;
    title: string;
    category: string;
    description: string;
    bg: string;
    image?: string;
    tag?: string;
    maturity?: keyof typeof MATURITY_TONES;
    starterPrompt?: string;
    memoryPreview?: string[];
    guardrailPreview?: string[];
    actionPreview?: string[];
  };
  featured?: boolean;
  onUseTemplate?: (templateId: string) => void;
  onPreviewTemplate?: (templateId: string) => void;
};

const TemplateCard = ({ template, featured = false, onUseTemplate, onPreviewTemplate }: TemplateCardProps) => {
  const bg = BGS[template.bg as keyof typeof BGS] || BGS.sage;
  const maturityTone = template.maturity ? MATURITY_TONES[template.maturity] : "neutral";
  const promptPillWidth = template.image
    ? "w-fit max-w-[10.5rem] sm:max-w-[11.75rem] lg:max-w-[11.25rem]"
    : "w-fit max-w-[min(100%,18rem)]";

  return (
    <article
      className={`group relative grain rounded-3xl border border-border ${bg} ${
        featured ? "md:col-span-2 md:row-span-2" : ""
      } overflow-hidden lift-on-hover`}
      data-testid={`template-card-${template.id}`}
    >
      <div className="relative z-10 p-7 flex flex-col h-full min-h-[260px]">
        <div className="flex items-start justify-between gap-2">
          <div className="flex flex-wrap gap-2">
            <Badge tone="primary" className="bg-white/60 backdrop-blur">
              {template.category}
            </Badge>
            {template.maturity && (
              <Badge tone={maturityTone} className="bg-white/70 backdrop-blur">
                {template.maturity}
              </Badge>
            )}
          </div>
          {template.tag && (
            <Badge tone="terracotta" className="bg-white/60 backdrop-blur">
              {template.tag}
            </Badge>
          )}
        </div>

        <div className="mt-auto pt-10">
          <h3 className="font-heading text-2xl md:text-3xl font-medium leading-tight text-primary">
            {template.title}
          </h3>
          <p className="text-sm text-primary/70 mt-2 max-w-md">{template.description}</p>
          {template.starterPrompt && (
            <p
              className={`mt-4 inline-block ${promptPillWidth} text-xs leading-snug text-primary/70 bg-white/55 border border-white/60 rounded-2xl px-3 py-2 break-words whitespace-normal`}
            >
              “{template.starterPrompt}”
            </p>
          )}
          <div className="mt-5 flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => onPreviewTemplate?.(template.id)}
              data-testid={`template-${template.id}-preview`}
              className="inline-flex items-center gap-1.5 text-sm font-medium text-primary bg-white/70 backdrop-blur rounded-full px-4 py-2 hover:bg-white transition-colors"
            >
              Preview <Eye className="h-3.5 w-3.5" />
            </button>
            <button
              type="button"
              onClick={() => onUseTemplate?.(template.id)}
              data-testid={`template-${template.id}-cta`}
              className="inline-flex items-center gap-1.5 text-sm font-medium text-primary bg-white/70 backdrop-blur rounded-full px-4 py-2 hover:bg-white transition-colors"
            >
              Use template <ArrowUpRight className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>
      </div>

      {template.image && (
        <img
          src={template.image}
          alt=""
          aria-hidden="true"
          className="absolute right-4 bottom-4 w-40 md:w-52 opacity-90 pointer-events-none select-none rounded-3xl shadow-sm translate-x-4 translate-y-4 group-hover:translate-x-2 group-hover:translate-y-2 transition-transform duration-500"
        />
      )}
    </article>
  );
};

export default TemplateCard;
