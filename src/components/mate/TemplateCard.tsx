"use client";

import React from "react";
import { ArrowUpRight } from "lucide-react";
import Badge from "@/components/mate/Badge";

const BGS = {
  sage: "bg-[#E6ECDF]",
  ochre: "bg-[#F4E2C2]",
  terracotta: "bg-[#F2D6CD]",
  primary: "bg-[#D7E0DE]",
};

const TemplateCard = ({ template, featured = false }) => {
  const bg = BGS[template.bg] || BGS.sage;
  return (
    <article
      className={`group relative grain rounded-3xl border border-border ${bg} ${
        featured ? "md:col-span-2 md:row-span-2" : ""
      } overflow-hidden lift-on-hover`}
      data-testid={`template-card-${template.id}`}
    >
      <div className="relative z-10 p-7 flex flex-col h-full min-h-[260px]">
        <div className="flex items-center justify-between">
          <Badge tone="primary" className="bg-white/60 backdrop-blur">
            {template.category}
          </Badge>
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
          <button
            type="button"
            data-testid={`template-${template.id}-cta`}
            className="mt-5 inline-flex items-center gap-1.5 text-sm font-medium text-primary bg-white/70 backdrop-blur rounded-full px-4 py-2 hover:bg-white transition-colors"
          >
            Use template <ArrowUpRight className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>

      {template.image && (
        <img
          src={template.image}
          alt=""
          aria-hidden="true"
          className="absolute right-0 bottom-0 w-44 md:w-56 opacity-90 pointer-events-none select-none translate-x-4 translate-y-4 group-hover:translate-x-2 group-hover:translate-y-2 transition-transform duration-500"
        />
      )}
    </article>
  );
};

export default TemplateCard;
