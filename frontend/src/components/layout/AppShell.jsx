import React from "react";
import { NavLink, Link, useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  Sparkles,
  MessageSquare,
  LayoutGrid,
  Plug,
  Settings as SettingsIcon,
  Home,
  PlusCircle,
} from "lucide-react";
import Logo from "@/components/mate/Logo";

const NAV = [
  { to: "/app/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { to: "/app/builder", label: "Builder", icon: Sparkles },
  { to: "/app/playground", label: "Playground", icon: MessageSquare },
  { to: "/app/templates", label: "Templates", icon: LayoutGrid },
  { to: "/app/integrations", label: "Integrations", icon: Plug },
  { to: "/app/settings", label: "Settings", icon: SettingsIcon },
];

const AppShell = ({ children }) => {
  const location = useLocation();
  const active = NAV.find((n) => location.pathname.startsWith(n.to));

  return (
    <div className="min-h-screen flex bg-background" data-testid="app-shell">
      {/* Sidebar */}
      <aside
        className="hidden lg:flex w-64 shrink-0 border-r border-border bg-white/60 backdrop-blur-sm flex-col"
        data-testid="app-sidebar"
      >
        <div className="px-6 py-7">
          <Link to="/" className="flex items-center gap-2" data-testid="sidebar-logo">
            <Logo />
          </Link>
        </div>

        <div className="px-4 pb-4">
          <Link
            to="/app/builder"
            data-testid="sidebar-create-companion"
            className="flex items-center justify-center gap-2 w-full rounded-full bg-primary text-primary-foreground px-4 py-2.5 text-sm font-medium hover:-translate-y-0.5 hover:shadow-lift transition-all"
          >
            <PlusCircle className="h-4 w-4" />
            Create Companion
          </Link>
        </div>

        <nav className="flex-1 px-3 py-2 space-y-1">
          {NAV.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.to}
                to={item.to}
                data-testid={`nav-${item.label.toLowerCase()}`}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm transition-colors ${
                    isActive
                      ? "bg-primary/8 text-primary font-medium"
                      : "text-muted-foreground hover:bg-muted hover:text-foreground"
                  }`
                }
              >
                <Icon className="h-4 w-4" />
                <span>{item.label}</span>
              </NavLink>
            );
          })}
        </nav>

        <div className="m-4 p-4 rounded-2xl border border-border bg-muted/50">
          <p className="eyebrow mb-1">Plan</p>
          <p className="text-sm font-medium text-foreground">Studio · Trial</p>
          <p className="text-xs text-muted-foreground mt-1">
            UI preview — billing coming later.
          </p>
        </div>
      </aside>

      {/* Main column */}
      <div className="flex-1 min-w-0 flex flex-col">
        {/* Topbar */}
        <header className="sticky top-0 z-30 bg-background/80 backdrop-blur border-b border-border">
          <div className="flex items-center justify-between px-5 lg:px-10 h-16">
            <div className="flex items-center gap-3">
              <Link to="/" className="lg:hidden flex items-center gap-2" data-testid="topbar-logo">
                <Logo compact />
              </Link>
              <div className="hidden lg:block">
                <p className="eyebrow">Workspace</p>
                <p className="text-sm font-medium text-foreground -mt-0.5">
                  Your Workspace · {active?.label || "Home"}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Link
                to="/"
                data-testid="topbar-home"
                className="hidden sm:inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground"
              >
                <Home className="h-4 w-4" /> Home
              </Link>
              <div
                className="h-9 w-9 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm font-medium"
                data-testid="topbar-avatar"
              >
                MM
              </div>
            </div>
          </div>
          {/* Mobile nav */}
          <nav className="lg:hidden flex gap-1 px-3 pb-2 overflow-x-auto" data-testid="mobile-nav">
            {NAV.map((item) => {
              const Icon = item.icon;
              return (
                <NavLink
                  key={item.to}
                  to={item.to}
                  data-testid={`mobile-nav-${item.label.toLowerCase()}`}
                  className={({ isActive }) =>
                    `flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs whitespace-nowrap ${
                      isActive
                        ? "bg-primary text-primary-foreground"
                        : "bg-muted text-muted-foreground"
                    }`
                  }
                >
                  <Icon className="h-3.5 w-3.5" />
                  {item.label}
                </NavLink>
              );
            })}
          </nav>
        </header>

        <main className="flex-1 px-5 lg:px-10 py-8 lg:py-12 max-w-[1400px] w-full mx-auto">
          {children}
        </main>
      </div>
    </div>
  );
};

export default AppShell;
