import React from "react";

const TONES = {
  sage: "from-accent-sage/25 to-accent-sage/0",
  ochre: "from-accent-ochre/25 to-accent-ochre/0",
  terracotta: "from-secondary/20 to-secondary/0",
  primary: "from-primary/15 to-primary/0",
};

const StatCard = ({ stat }) => (
  <div
    className="surface-card p-5 relative overflow-hidden"
    data-testid={`stat-${stat.id}`}
  >
    <div
      className={`absolute -right-10 -top-10 h-32 w-32 rounded-full bg-gradient-to-br ${TONES[stat.tone] || TONES.primary} blur-2xl`}
      aria-hidden="true"
    />
    <p className="eyebrow">{stat.label}</p>
    <p className="font-heading text-3xl font-medium mt-2">{stat.value}</p>
    <p className="text-xs text-muted-foreground mt-1">{stat.delta}</p>
  </div>
);

export default StatCard;
