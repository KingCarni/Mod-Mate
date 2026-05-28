"use client";

import React from "react";

const SectionCard = ({ eyebrow, title, description, children, action, testId }) => (
  <section
    className="surface-card p-7 md:p-8"
    data-testid={testId}
  >
    <div className="flex items-start justify-between gap-4 mb-5">
      <div>
        {eyebrow && <p className="eyebrow mb-1.5">{eyebrow}</p>}
        <h2 className="font-heading text-xl md:text-2xl font-medium tracking-tight">{title}</h2>
        {description && (
          <p className="text-sm text-muted-foreground mt-1.5 max-w-xl">{description}</p>
        )}
      </div>
      {action && <div className="shrink-0">{action}</div>}
    </div>
    <div>{children}</div>
  </section>
);

export default SectionCard;
