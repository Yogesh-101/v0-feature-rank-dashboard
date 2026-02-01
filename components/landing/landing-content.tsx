"use client";

import dynamic from "next/dynamic";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { 
  BarChart3, 
  Zap, 
  Users, 
  TrendingUp, 
  CheckCircle2, 
  ArrowRight,
  Layers,
  Target,
  Sparkles
} from "lucide-react";

const HeroScene = dynamic(
  () => import("@/components/landing/hero-scene").then((mod) => mod.HeroScene),
  { ssr: false }
);

const features = [
  {
    icon: Target,
    title: "RICE Scoring",
    description: "Automatically calculate and rank features using the proven RICE prioritization framework.",
  },
  {
    icon: Zap,
    title: "Instant Insights",
    description: "Get real-time analytics and visualizations to make data-driven product decisions.",
  },
  {
    icon: Users,
    title: "Team Collaboration",
    description: "Work together with your team to align on priorities and ship the right features.",
  },
  {
    icon: TrendingUp,
    title: "Track Progress",
    description: "Monitor feature development from backlog to completion with status tracking.",
  },
];

const benefits = [
  "Prioritize features objectively with RICE scores",
  "Visualize your product roadmap at a glance",
  "Export and import data seamlessly",
  "Dark mode optimized interface",
  "Local storage persistence",
  "Responsive design for all devices",
];

export function LandingContent() {
  return (
    <div className="relative min-h-screen overflow-hidden bg-background">
      {/* Hero Section */}
      <section className="relative flex min-h-screen flex-col items-center justify-center px-4">
        <HeroScene />
        
        {/* Gradient overlays */}
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-background/80 via-background/40 to-background" />
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_0%,hsl(var(--background))_70%)]" />
        
        {/* Navigation */}
        <nav className="absolute left-0 right-0 top-0 z-50 flex items-center justify-between px-6 py-4 md:px-12">
          <div className="flex items-center gap-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary">
              <BarChart3 className="h-5 w-5 text-primary-foreground" />
            </div>
            <span className="text-xl font-bold text-foreground">FeatureRank</span>
          </div>
          <div className="flex items-center gap-3">
            <Button variant="ghost" asChild className="hidden sm:inline-flex">
              <Link href="#features">Features</Link>
            </Button>
            <Button asChild>
              <Link href="/dashboard">
                Open Dashboard
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
        </nav>
        
        {/* Hero Content */}
        <div className="relative z-10 mx-auto max-w-4xl text-center">
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-border bg-card/50 px-4 py-1.5 backdrop-blur-sm">
            <Sparkles className="h-4 w-4 text-primary" />
            <span className="text-sm text-muted-foreground">
              Product Prioritization Made Simple
            </span>
          </div>
          
          <h1 className="text-balance text-4xl font-bold tracking-tight text-foreground sm:text-5xl md:text-6xl lg:text-7xl">
            Prioritize Features{" "}
            <span className="bg-gradient-to-r from-primary via-teal-400 to-cyan-400 bg-clip-text text-transparent">
              Like a Pro
            </span>
          </h1>
          
          <p className="mx-auto mt-6 max-w-2xl text-pretty text-lg text-muted-foreground sm:text-xl">
            FeatureRank helps product teams make data-driven decisions using the RICE scoring framework. 
            Rank, track, and ship the features that matter most.
          </p>
          
          <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Button size="lg" asChild className="h-12 px-8 text-base">
              <Link href="/dashboard">
                Get Started Free
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
            <Button size="lg" variant="outline" asChild className="h-12 bg-transparent px-8 text-base">
              <Link href="#features">
                Learn More
              </Link>
            </Button>
          </div>
        </div>
        
        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
          <div className="flex h-10 w-6 items-start justify-center rounded-full border-2 border-muted-foreground/30 p-1">
            <div className="h-2 w-1 rounded-full bg-muted-foreground/50" />
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="relative bg-card/30 py-24">
        <div className="mx-auto max-w-6xl px-4">
          <div className="text-center">
            <h2 className="text-3xl font-bold text-foreground sm:text-4xl">
              Everything You Need to Prioritize
            </h2>
            <p className="mx-auto mt-4 max-w-2xl text-muted-foreground">
              Powerful features designed to help product teams make better decisions faster.
            </p>
          </div>
          
          <div className="mt-16 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {features.map((feature, index) => (
              <Card 
                key={index} 
                className="group border-border bg-card/50 backdrop-blur-sm transition-all hover:border-primary/50 hover:shadow-lg hover:shadow-primary/5"
              >
                <CardContent className="p-6">
                  <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 text-primary transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
                    <feature.icon className="h-6 w-6" />
                  </div>
                  <h3 className="mb-2 text-lg font-semibold text-card-foreground">
                    {feature.title}
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    {feature.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-24">
        <div className="mx-auto max-w-6xl px-4">
          <div className="grid items-center gap-12 lg:grid-cols-2">
            <div>
              <h2 className="text-3xl font-bold text-foreground sm:text-4xl">
                Why Product Teams{" "}
                <span className="text-primary">Love FeatureRank</span>
              </h2>
              <p className="mt-4 text-muted-foreground">
                Join hundreds of product managers who use FeatureRank to streamline their prioritization process and deliver impactful features.
              </p>
              
              <ul className="mt-8 space-y-4">
                {benefits.map((benefit, index) => (
                  <li key={index} className="flex items-center gap-3">
                    <CheckCircle2 className="h-5 w-5 flex-shrink-0 text-primary" />
                    <span className="text-foreground">{benefit}</span>
                  </li>
                ))}
              </ul>
              
              <Button size="lg" asChild className="mt-8">
                <Link href="/dashboard">
                  Try It Now
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </div>
            
            {/* Formula Card */}
            <div className="relative">
              <div className="absolute -inset-4 rounded-2xl bg-gradient-to-r from-primary/20 via-transparent to-primary/20 blur-2xl" />
              <Card className="relative border-border bg-card">
                <CardContent className="p-8">
                  <div className="mb-6 flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary">
                      <Layers className="h-5 w-5 text-primary-foreground" />
                    </div>
                    <h3 className="text-xl font-semibold text-card-foreground">
                      RICE Framework
                    </h3>
                  </div>
                  
                  <div className="rounded-lg bg-secondary/50 p-4">
                    <p className="text-center font-mono text-lg text-foreground">
                      Score = (R × I × C) ÷ E
                    </p>
                  </div>
                  
                  <div className="mt-6 grid gap-4 sm:grid-cols-2">
                    <div className="rounded-lg border border-border p-3">
                      <p className="font-semibold text-primary">R = Reach</p>
                      <p className="text-sm text-muted-foreground">Users per quarter</p>
                    </div>
                    <div className="rounded-lg border border-border p-3">
                      <p className="font-semibold text-primary">I = Impact</p>
                      <p className="text-sm text-muted-foreground">0.5 to 3 multiplier</p>
                    </div>
                    <div className="rounded-lg border border-border p-3">
                      <p className="font-semibold text-primary">C = Confidence</p>
                      <p className="text-sm text-muted-foreground">0-100% certainty</p>
                    </div>
                    <div className="rounded-lg border border-border p-3">
                      <p className="font-semibold text-primary">E = Effort</p>
                      <p className="text-sm text-muted-foreground">Person-months</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="border-t border-border bg-card/30 py-24">
        <div className="mx-auto max-w-4xl px-4 text-center">
          <h2 className="text-3xl font-bold text-foreground sm:text-4xl">
            Ready to Prioritize Smarter?
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-muted-foreground">
            Start using FeatureRank today and transform how your team makes product decisions.
          </p>
          <Button size="lg" asChild className="mt-8 h-12 px-8 text-base">
            <Link href="/dashboard">
              Open Dashboard
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border py-8">
        <div className="mx-auto max-w-6xl px-4">
          <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
                <BarChart3 className="h-4 w-4 text-primary-foreground" />
              </div>
              <span className="font-semibold text-foreground">FeatureRank</span>
            </div>
            <p className="text-sm text-muted-foreground">
              Built for product teams who ship.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
