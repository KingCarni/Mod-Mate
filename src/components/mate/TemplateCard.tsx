"use client";

import React from "react";
import {
  ArrowUpRight,
  Eye,
  Feather,
  Bug,
  Sliders,
  BookOpen,
  UserRound,
  Dice5,
  Compass,
  Workflow,
  Sparkles,
} from "lucide-react";
import Badge from "@/components/mate/Badge";

const BGS = {
  sage: "bg-[#E6ECDF] dark:bg-[#26332a]",
  ochre: "bg-[#F4E2C2] dark:bg-[#3a2f1d]",
  terracotta: "bg-[#F2D6CD] dark:bg-[#3a2622]",
  primary: "bg-[#D7E0DE] dark:bg-[#1e2a29]",
};

const ICON_FRAMES = {
  sage: "bg-white/55 dark:bg-white/10 text-[#1B3B36] dark:text-[#cfe1d7]",
  ochre: "bg-white/55 dark:bg-white/10 text-[#1B3B36] dark:text-[#e9d6a8]",
  terracotta: "bg-white/55 dark:bg-white/10 text-[#1B3B36] dark:text-[#f0c7b9]",
  primary: "bg-white/55 dark:bg-white/10 text-[#1B3B36] dark:text-[#cfe1d7]",
};

const MATURITY_TONES = {
  Ready: "sage",
  Template: "primary",
  Concept: "ochre",
  "Coming Soon": "neutral",
};

const ICONS: Record<string, React.ComponentType<{ className?: string }>> = {
  feather: Feather,
  bug: Bug,
  sliders: Sliders,
  "book-open": BookOpen,
  "user-round": UserRound,
  dice: Dice5,
  compass: Compass,
  workflow: Workflow,
};

type TemplateCardProps = {
  template: {
    id: string;
    title: string;
    category: string;
    description: string;
    bg: string;
    image?: string;
    imageStyle?: "logo" | "photo";
    icon?: string;
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
  const iconFrame = ICON_FRAMES[template.bg as keyof typeof ICON_FRAMES] || ICON_FRAMES.sage;
  const maturityTone = template.maturity ? MATURITY_TONES[template.maturity] : "neutral";
  const isLogo = template.image && template.imageStyle === "logo";
  const isPhoto = template.image && !isLogo;
  const IconComp = template.icon ? ICONS[template.icon] ?? Sparkles : Sparkles;

  return (
    <article
      className={`group relative grain rounded-3xl border border-border ${bg} overflow-hidden lift-on-hover h-full`}
      data-testid={`template-card-${template.id}`}
    >
      <div className="relative z-10 flex flex-row h-full min-h-[300px]">
        {/* Text column */}
        <div className="flex-1 min-w-0 p-6 md:p-7 flex flex-col gap-4">
          <div className="flex items-start justify-between gap-2 flex-wrap">
            <div className="flex flex-wrap gap-2">
              <Badge tone="primary" className="bg-white/65 dark:bg-white/10 backdrop-blur">
                {template.category}
              </Badge>
              {template.maturity && (
                <Badge tone={maturityTone} className="bg-white/70 dark:bg-white/10 backdrop-blur">
                  {template.maturity}
                </Badge>
              )}
            </div>
            {template.tag && (
              <Badge tone="terracotta" className="bg-white/65 dark:bg-white/10 backdrop-blur">
                {template.tag}
              </Badge>
            )}
          </div>

          <div className="mt-auto">
            <h3 className="font-heading text-xl md:text-2xl font-medium leading-tight text-[#1B3B36] dark:text-foreground break-words">
              {template.title}
            </h3>
            <p className="text-sm text-[#1B3B36]/70 dark:text-foreground/70 mt-2 leading-relaxed">
              {template.description}
            </p>
            {template.starterPrompt && (
              <p className="mt-4 text-xs leading-snug text-[#1B3B36]/75 dark:text-foreground/75 bg-white/60 dark:bg-white/10 border border-white/70 dark:border-white/10 rounded-2xl px-3 py-2 break-words shadow-sm">
                “{template.starterPrompt}”
              </p>
            )}
            <div className="mt-5 flex flex-wrap gap-2">
              <button
                type="button"
                onClick={() => onPreviewTemplate?.(template.id)}
                data-testid={`template-${template.id}-preview`}
                className="inline-flex items-center gap-1.5 text-sm font-medium text-[#1B3B36] dark:text-foreground bg-white/75 dark:bg-white/10 backdrop-blur rounded-full px-4 py-2 hover:bg-white dark:hover:bg-white/20 transition-colors"
              >
                Preview <Eye className="h-3.5 w-3.5" />
              </button>
              <button
                type="button"
                onClick={() => onUseTemplate?.(template.id)}
                data-testid={`template-${template.id}-cta`}
                className="inline-flex items-center gap-1.5 text-sm font-medium text-[#1B3B36] dark:text-foreground bg-white/75 dark:bg-white/10 backdrop-blur rounded-full px-4 py-2 hover:bg-white dark:hover:bg-white/20 transition-colors"
              >
                Use template <ArrowUpRight className="h-3.5 w-3.5" />
              </button>
            </div>
          </div>
        </div>

        {/* Visual column — dedicated cell, can never overlap text/buttons */}
        <div
          aria-hidden="true"
          className="hidden sm:flex shrink-0 w-[120px] md:w-[140px] lg:w-[150px] items-center justify-center p-3 md:p-4"
        >
          {isLogo ? (
            <div className="w-full aspect-square rounded-2xl overflow-hidden bg-black flex items-center justify-center shadow-sm ring-1 ring-black/5">
              <img
                src={template.image}
                alt=""
                className="w-full h-full object-contain p-2 select-none pointer-events-none"
              />
            </div>
          ) : isPhoto ? (
            <div className="w-full aspect-square rounded-2xl overflow-hidden shadow-sm ring-1 ring-black/5">
              <img
                src={template.image}
                alt=""
                className="w-full h-full object-cover select-none pointer-events-none"
              />
            </div>
          ) : (
            <div
              className={`w-full aspect-square rounded-2xl flex items-center justify-center ${iconFrame} ring-1 ring-white/40 dark:ring-white/10 shadow-sm`}
            >
              <IconComp className="h-12 w-12 md:h-14 md:w-14" />
            </div>
          )}
        </div>
      </div>
    </article>
  );
};

export default TemplateCard;
