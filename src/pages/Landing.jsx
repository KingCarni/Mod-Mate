import React from "react";
import { Link } from "react-router-dom";
import {
  Sparkles,
  Feather,
  Bug,
  Dices,
  SlidersHorizontal,
  LifeBuoy,
  Compass,
  ArrowRight,
  Shield,
  Layers,
  Cpu,
  Plug,
} from "lucide-react";
import MarketingHeader from "@/components/layout/MarketingHeader";
import Badge from "@/components/mate/Badge";
import TemplateCard from "@/components/mate/TemplateCard";
import { templates, useCases, howItWorks, integrations } from "@/data/mockData";

const ICONS = {
  feather: Feather,
  bug: Bug,
  dice: Dices,
  sliders: SlidersHorizontal,
  lifebuoy: LifeBuoy,
  compass: Compass,
};

const HERO_BG =
  "https://static.prod-images.emergentagent.com/jobs/738a68c8-fd47-4930-8d69-a5af3486fa84/images/ee237e47b114b5ea14b7d1b83100a6e554d1d8f79aac2278a3442198faafc3d8.png";

const Landing = () => {
  const featuredTemplates = templates.slice(0, 4);

  return (
    <div className="min-h-screen bg-background" data-testid="landing-page">
      <MarketingHeader />

      {/* HERO */}
      <section className="relative overflow-hidden">
        <img
          src={HERO_BG}
          alt=""
          aria-hidden="true"
          className="absolute inset-0 w-full h-full object-cover opacity-50 pointer-events-none select-none"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-background/40 via-background/60 to-background pointer-events-none" />
        <div className="relative max-w-7xl mx-auto px-5 lg:px-8 pt-20 pb-24 lg:pt-28 lg:pb-32 grid lg:grid-cols-12 gap-10 items-center">
          <div className="lg:col-span-7 fade-up">
            <Badge tone="ochre" className="mb-5" data-testid="hero-badge">
              Mod-Mate · Modular AI companions
            </Badge>
            <h1 className="font-heading text-5xl sm:text-6xl lg:text-7xl font-medium tracking-tight leading-[1.02]">
              Build custom AI <br />
              <span className="italic font-light text-primary/90">companions</span> for any project.
            </h1>
            <p className="mt-6 text-lg text-muted-foreground max-w-xl leading-relaxed">
              Create modular companions with their own personality, rules, memory categories, and
              use-case templates — then plug them into the apps and workflows that need them.
            </p>
            <div className="mt-9 flex flex-wrap items-center gap-3">
              <Link
                to="/app/builder"
                data-testid="hero-primary-cta"
                className="inline-flex items-center gap-2 rounded-full bg-primary text-primary-foreground px-6 py-3 text-sm font-medium hover:-translate-y-0.5 hover:shadow-lift transition-all"
              >
                <Sparkles className="h-4 w-4" />
                Create a Companion
              </Link>
              <Link
                to="/app/templates"
                data-testid="hero-secondary-cta"
                className="inline-flex items-center gap-2 rounded-full bg-white border border-border text-foreground px-6 py-3 text-sm font-medium hover:bg-muted transition-colors"
              >
                Explore Templates <ArrowRight className="h-4 w-4" />
              </Link>
            </div>

            <div className="mt-10 flex items-center gap-6 text-xs text-muted-foreground">
              <span className="flex items-center gap-1.5">
                <Shield className="h-3.5 w-3.5" /> Your data, your rules
              </span>
              <span className="flex items-center gap-1.5">
                <Layers className="h-3.5 w-3.5" /> Memory categories
              </span>
              <span className="flex items-center gap-1.5">
                <Cpu className="h-3.5 w-3.5" /> Bring your own model
              </span>
            </div>
          </div>

          {/* Product preview card */}
          <div className="lg:col-span-5 fade-up" style={{ animationDelay: "120ms" }}>
            <div className="relative">
              <div className="surface-card shadow-soft p-5 rotate-[-1deg]">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <span className="h-8 w-8 rounded-xl bg-accent-ochre/30 flex items-center justify-center font-heading text-sm">DM</span>
                    <div>
                      <p className="text-sm font-medium">DraftMate</p>
                      <p className="text-[11px] text-muted-foreground">Screenplay companion</p>
                    </div>
                  </div>
                  <Badge tone="sage">Ready</Badge>
                </div>
                <div className="rounded-xl bg-muted/60 p-3 text-sm text-foreground">
                  <p className="text-muted-foreground text-xs mb-1">You</p>
                  Does the cold open match the rest of the script's tone?
                </div>
                <div className="rounded-xl bg-primary text-primary-foreground p-3 text-sm mt-2">
                  <p className="text-primary-foreground/60 text-xs mb-1">DraftMate</p>
                  Tone aligns with your noir reference. One line of action could be tightened, and we
                  should add a guardrail about not inventing missing project facts.
                </div>
              </div>
              <div className="absolute -bottom-6 -right-2 surface-card p-3 rotate-[3deg] shadow-soft hidden sm:flex items-center gap-2">
                <span className="h-7 w-7 rounded-lg bg-accent-sage/30 flex items-center justify-center text-xs font-medium">QA</span>
                <span className="text-xs">QAt triaged 12 reports</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* MARQUEE */}
      <section className="border-y border-border bg-white/50">
        <div className="overflow-hidden py-5">
          <div className="marquee flex gap-12 whitespace-nowrap text-sm text-muted-foreground">
            {[...Array(2)].flatMap((_, i) =>
              [
                "Master Draft",
                "QAtalyst",
                "Campaign Brain",
                "Idle Game Creator",
                "React Widget",
                "Custom API",
              ].map((name, j) => (
                <span key={`${i}-${j}`} className="flex items-center gap-3">
                  <span className="h-1.5 w-1.5 rounded-full bg-secondary" />
                  <span className="font-heading text-base">{name}</span>
                </span>
              )),
            )}
          </div>
        </div>
      </section>

      {/* USE CASES */}
      <section className="max-w-7xl mx-auto px-5 lg:px-8 py-20 lg:py-28" data-testid="use-cases">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-12">
          <div>
            <p className="eyebrow">Use cases</p>
            <h2 className="font-heading text-3xl sm:text-4xl font-medium tracking-tight mt-2 max-w-2xl">
              One platform. Every kind of companion you'll need to build.
            </h2>
          </div>
          <Link
            to="/app/templates"
            className="text-sm text-primary hover:underline underline-offset-4"
            data-testid="usecases-view-all"
          >
            View all templates →
          </Link>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {useCases.map((uc) => {
            const Icon = ICONS[uc.icon] || Sparkles;
            return (
              <div
                key={uc.id}
                className="surface-card p-6 lift-on-hover"
                data-testid={`usecase-${uc.id}`}
              >
                <div className="h-11 w-11 rounded-2xl bg-muted flex items-center justify-center mb-4">
                  <Icon className="h-5 w-5 text-primary" />
                </div>
                <h3 className="font-heading text-lg font-medium">{uc.title}</h3>
                <p className="text-sm text-muted-foreground mt-1.5 leading-relaxed">{uc.body}</p>
              </div>
            );
          })}
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section
        id="how"
        className="bg-primary text-primary-foreground py-20 lg:py-28 relative overflow-hidden"
        data-testid="how-it-works"
      >
        <div className="absolute inset-0 opacity-30 grain" aria-hidden="true" />
        <div className="relative max-w-7xl mx-auto px-5 lg:px-8">
          <div className="max-w-2xl mb-12">
            <p className="eyebrow text-primary-foreground/70">How it works</p>
            <h2 className="font-heading text-3xl sm:text-4xl font-medium tracking-tight mt-2">
              From idea to embedded companion in four steps.
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {howItWorks.map((s, idx) => (
              <div
                key={s.step}
                className="rounded-2xl bg-primary-foreground/5 border border-primary-foreground/10 p-6"
                data-testid={`how-step-${idx + 1}`}
              >
                <p className="font-mono text-xs text-primary-foreground/60">{s.step}</p>
                <h3 className="font-heading text-xl font-medium mt-2">{s.title}</h3>
                <p className="text-sm text-primary-foreground/70 mt-2 leading-relaxed">{s.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* TEMPLATES PREVIEW */}
      <section id="templates" className="max-w-7xl mx-auto px-5 lg:px-8 py-20 lg:py-28" data-testid="templates-preview">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-10">
          <div>
            <p className="eyebrow">Templates</p>
            <h2 className="font-heading text-3xl sm:text-4xl font-medium tracking-tight mt-2 max-w-2xl">
              Start from a companion that already understands the shape of your work.
            </h2>
          </div>
          <Link
            to="/app/templates"
            data-testid="templates-cta"
            className="text-sm text-primary hover:underline underline-offset-4"
          >
            Browse the gallery →
          </Link>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 auto-rows-[minmax(220px,_auto)]">
          {featuredTemplates.map((t, i) => (
            <TemplateCard key={t.id} template={t} featured={i === 0} />
          ))}
        </div>
      </section>

      {/* INTEGRATIONS */}
      <section id="integrations" className="bg-muted/40 py-20 lg:py-28 border-y border-border" data-testid="integrations-preview">
        <div className="max-w-7xl mx-auto px-5 lg:px-8">
          <div className="flex items-end justify-between gap-4 mb-10 flex-wrap">
            <div>
              <p className="eyebrow">Integrations</p>
              <h2 className="font-heading text-3xl sm:text-4xl font-medium tracking-tight mt-2 max-w-2xl">
                Companions that live where your work already happens.
              </h2>
            </div>
            <Link
              to="/app/integrations"
              className="text-sm text-primary hover:underline underline-offset-4"
              data-testid="integrations-cta"
            >
              See full roadmap →
            </Link>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
            {integrations.map((i) => (
              <div
                key={i.id}
                className="rounded-xl bg-white border border-border p-4 flex flex-col items-start gap-2"
                data-testid={`int-pill-${i.id}`}
              >
                <div className="h-9 w-9 rounded-lg bg-muted flex items-center justify-center">
                  <Plug className="h-4 w-4 text-primary" />
                </div>
                <p className="text-sm font-medium leading-tight">{i.name}</p>
                <p className="text-[10px] uppercase tracking-widest text-muted-foreground">{i.status}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FINAL CTA */}
      <section className="max-w-7xl mx-auto px-5 lg:px-8 py-20 lg:py-28" data-testid="final-cta">
        <div className="rounded-3xl bg-secondary text-secondary-foreground p-10 lg:p-16 relative overflow-hidden grain">
          <div className="max-w-2xl relative">
            <h2 className="font-heading text-3xl sm:text-5xl font-medium tracking-tight leading-tight">
              Make a companion that actually understands your product.
            </h2>
            <p className="mt-5 text-secondary-foreground/85 text-lg leading-relaxed">
              Start with a template, write a persona, set the rules — and test it in the playground
              before anyone else sees it.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                to="/app/builder"
                data-testid="final-cta-create"
                className="inline-flex items-center gap-2 rounded-full bg-primary text-primary-foreground px-6 py-3 text-sm font-medium hover:-translate-y-0.5 hover:shadow-lift transition-all"
              >
                <Sparkles className="h-4 w-4" /> Create a Companion
              </Link>
              <Link
                to="/app/templates"
                data-testid="final-cta-templates"
                className="inline-flex items-center gap-2 rounded-full bg-white/15 hover:bg-white/25 text-secondary-foreground px-6 py-3 text-sm font-medium transition-colors backdrop-blur"
              >
                Explore Templates
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="border-t border-border" data-testid="marketing-footer">
        <div className="max-w-7xl mx-auto px-5 lg:px-8 py-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <p className="text-sm text-muted-foreground">
            © {new Date().getFullYear()} Mod-Mate · Modular AI companions for apps, teams, and creative workflows.
          </p>
          <div className="flex items-center gap-5 text-sm text-muted-foreground">
            <a href="#templates" className="hover:text-foreground">Templates</a>
            <a href="#how" className="hover:text-foreground">How it works</a>
            <a href="#integrations" className="hover:text-foreground">Integrations</a>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Landing;
