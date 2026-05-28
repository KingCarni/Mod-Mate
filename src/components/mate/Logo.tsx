"use client";

import React from "react";

const Logo = ({ compact = false }) => {
  return (
    <span className="flex items-center gap-2" data-testid="brand-logo">
      <span
        className="relative h-8 w-8 rounded-xl bg-primary text-primary-foreground flex items-center justify-center shadow-soft"
        aria-hidden="true"
      >
        <span className="absolute -right-1 -bottom-1 h-3 w-3 rounded-full bg-secondary border-2 border-background" />
        <span className="font-heading font-semibold text-sm">M</span>
      </span>
      {!compact && (
        <span className="font-heading text-lg font-semibold tracking-tight">
          Mod<span className="text-secondary">·</span>Mate
        </span>
      )}
    </span>
  );
};

export default Logo;
