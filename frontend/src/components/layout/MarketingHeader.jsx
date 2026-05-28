import React, { useState } from "react";
import { Link, NavLink } from "react-router-dom";
import { Menu, X } from "lucide-react";
import Logo from "@/components/mate/Logo";

const NAV_LINKS = [
  { to: "/#templates", label: "Templates" },
  { to: "/#how", label: "How it works" },
  { to: "/#integrations", label: "Integrations" },
];

const MarketingHeader = () => {
  const [open, setOpen] = useState(false);
  return (
    <header
      className="sticky top-0 z-40 border-b border-border/60 bg-background/70 backdrop-blur-md"
      data-testid="marketing-header"
    >
      <div className="max-w-7xl mx-auto px-5 lg:px-8 h-16 flex items-center justify-between">
        <Link to="/" data-testid="marketing-logo">
          <Logo />
        </Link>
        <nav className="hidden md:flex items-center gap-8">
          {NAV_LINKS.map((l) => (
            <a
              key={l.to}
              href={l.to}
              className="text-sm text-muted-foreground hover:text-foreground transition-colors"
              data-testid={`marketing-nav-${l.label.toLowerCase().replace(/\s+/g, "-")}`}
            >
              {l.label}
            </a>
          ))}
          <NavLink
            to="/app/dashboard"
            className="text-sm text-muted-foreground hover:text-foreground transition-colors"
            data-testid="marketing-nav-dashboard"
          >
            Dashboard
          </NavLink>
        </nav>
        <div className="flex items-center gap-3">
          <Link
            to="/app/dashboard"
            className="hidden md:inline-flex text-sm text-foreground hover:text-primary"
            data-testid="marketing-signin"
          >
            Sign in
          </Link>
          <Link
            to="/app/builder"
            data-testid="marketing-create-companion"
            className="inline-flex items-center rounded-full bg-primary text-primary-foreground px-4 py-2 text-sm font-medium hover:-translate-y-0.5 hover:shadow-lift transition-all"
          >
            Create a Companion
          </Link>
          <button
            type="button"
            className="md:hidden p-2 rounded-full hover:bg-muted"
            onClick={() => setOpen((v) => !v)}
            data-testid="marketing-menu-toggle"
            aria-label="Toggle navigation"
          >
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>
      {open && (
        <div className="md:hidden border-t border-border bg-background" data-testid="marketing-mobile-menu">
          <div className="px-5 py-4 flex flex-col gap-3">
            {NAV_LINKS.map((l) => (
              <a
                key={l.to}
                href={l.to}
                onClick={() => setOpen(false)}
                className="text-sm text-muted-foreground"
              >
                {l.label}
              </a>
            ))}
            <Link to="/app/dashboard" onClick={() => setOpen(false)} className="text-sm">
              Dashboard
            </Link>
          </div>
        </div>
      )}
    </header>
  );
};

export default MarketingHeader;
