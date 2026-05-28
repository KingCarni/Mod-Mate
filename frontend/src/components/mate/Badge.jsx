import React from "react";

const TONES = {
  sage: "bg-accent-sage/15 text-[#3F5A40] border-accent-sage/30",
  ochre: "bg-accent-ochre/15 text-[#7B5A1F] border-accent-ochre/30",
  terracotta: "bg-secondary/12 text-secondary border-secondary/30",
  primary: "bg-primary/10 text-primary border-primary/20",
  neutral: "bg-muted text-muted-foreground border-border",
};

const Badge = ({ children, tone = "neutral", className = "", ...rest }) => (
  <span
    className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-[10px] uppercase tracking-[0.16em] font-semibold ${TONES[tone] || TONES.neutral} ${className}`}
    {...rest}
  >
    {children}
  </span>
);

export default Badge;
