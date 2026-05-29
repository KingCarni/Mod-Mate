"use client";

import React from "react";
import { useTheme } from "next-themes";
import { Moon, Sun } from "lucide-react";

const ThemeToggle = () => {
  const { resolvedTheme, setTheme } = useTheme();
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    setMounted(true);
  }, []);

  const isDark = mounted && resolvedTheme === "dark";

  const toggle = () => setTheme(isDark ? "light" : "dark");

  return (
    <button
      type="button"
      onClick={toggle}
      aria-label={isDark ? "Switch to light theme" : "Switch to dark theme"}
      data-testid="theme-toggle"
      className="inline-flex items-center justify-center h-9 w-9 rounded-full border border-border bg-white/70 dark:bg-white/5 text-foreground hover:bg-white dark:hover:bg-white/10 transition-colors"
    >
      {/* Render both icons but show one — avoids hydration flash before mount */}
      <Sun className={`h-4 w-4 ${mounted && isDark ? "hidden" : ""}`} />
      <Moon className={`h-4 w-4 ${mounted && isDark ? "" : "hidden"}`} />
    </button>
  );
};

export default ThemeToggle;
