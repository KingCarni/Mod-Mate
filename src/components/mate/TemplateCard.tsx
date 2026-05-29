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

const TemplateCard = ({ template, onUseTemplate, onPreviewTemplate }: TemplateCardProps) => {
  const bg = BGS[template.bg as keyof typeof BGS] || BGS.sage;
  const maturityTone = template.maturity ? MATURITY_TONES[template.maturity] : "neutral";
  const hasImage = Boolean(template.image);

  // Reserve a decorative lower-right zone for the image so prompt + buttons never overlap it.
  const contentPadding = hasImage ? "p-7 pr-7 pb-44 md:pb-7 md:pr-44" : "p-7";
  const textColumn = hasImage ? "max-w-full md:max-w-[60%]" : "max-w-full";
  const descriptionWidth = hasImage ? "max-w-[18rem]" : "max-w-md";
  const promptPillWidth = hasImage
    ? "max-w-[14rem] md:max-w-[15rem]"
    : "max-w-[min(100%,18rem)]";

  return (
    <article
      className={`group relative grain rounded-3xl border border-border ${bg} overflow-hidden lift-on-hover h-full`}
      data-testid={`template-card-${template.id}`}
    >
      <div className={`relative z-10 ${contentPadding} flex flex-col h-full min-h-[300px]`}>
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

        <div className={`mt-auto pt-10 ${textColumn}`}>
          <h3 className="font-heading text-2xl md:text-[1.6rem] font-medium leading-tight text-primary">
            {template.title}
          </h3>
          <p className={`text-sm text-primary/70 mt-2 ${descriptionWidth}`}>{template.description}</p>
          {template.starterPrompt && (
            <p
              className={`mt-4 inline-block w-fit ${promptPillWidth} text-xs leading-snug text-primary/75 bg-white/60 border border-white/70 rounded-2xl px-3 py-2 break-words whitespace-normal shadow-sm`}
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

      {hasImage && (
        <div
          aria-hidden="true"
          className="pointer-events-none absolute right-3 bottom-3 w-32 md:w-40 lg:w-44"
        >
          <img
            src={template.image}
            alt=""
            aria-hidden="true"
            className="w-full h-auto rounded-2xl shadow-sm opacity-90 select-none transition-transform duration-500 group-hover:-translate-y-1"
          />
        </div>
      )}
    </article>
  );
};

export default TemplateCard;
