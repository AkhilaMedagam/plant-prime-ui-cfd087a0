import { createFileRoute } from "@tanstack/react-router";
import { Bot, Bug, Coins, CloudSun, FlaskConical, Sprout, Target, Telescope } from "lucide-react";
import aboutImage from "@/assets/about-fields.jpg";
import { SiteLayout } from "@/components/site/SiteLayout";
import { PageContainer } from "@/components/site/PageContainer";
import { SectionHeading } from "@/components/site/SectionHeading";
import { FeatureCard } from "@/components/site/FeatureCard";
import { CTASection } from "@/components/site/CTASection";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: "About AgriSmart — Smarter, Sustainable Farming" },
      {
        name: "description",
        content:
          "Learn why AgriSmart exists: bringing agricultural knowledge, data and AI-powered assistance together in one simple platform for farmers.",
      },
      { property: "og:title", content: "About AgriSmart" },
      {
        property: "og:description",
        content:
          "Technology designed to support smarter and more sustainable farming decisions.",
      },
    ],
  }),
  component: About,
});

const provides = [
  { icon: Sprout, title: "Crop Information", description: "Details on crops and growing practices." },
  { icon: FlaskConical, title: "Soil Insights", description: "Understand soil health and suitability." },
  { icon: CloudSun, title: "Weather Information", description: "Conditions that shape daily farm work." },
  { icon: Bug, title: "Disease Awareness", description: "Spot possible crop health problems early." },
  { icon: Coins, title: "Market Information", description: "Price and market trend context." },
  { icon: Bot, title: "AI Farming Assistance", description: "Ask questions, get guided answers." },
];

function About() {
  return (
    <SiteLayout>
      <section className="gradient-hero">
        <PageContainer className="py-14 text-center sm:py-20">
          <h1 className="text-balance text-3xl font-extrabold tracking-tight sm:text-5xl">
            About AgriSmart
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-pretty text-base leading-relaxed text-muted-foreground sm:text-lg">
            Technology designed to support smarter and more sustainable farming.
          </p>
        </PageContainer>
      </section>

      <section className="py-16 sm:py-20">
        <PageContainer>
          <div className="mx-auto max-w-3xl text-center">
            <p className="text-pretty text-base leading-relaxed text-muted-foreground sm:text-lg">
              Agriculture is changing rapidly, and farmers need access to useful information at the
              right time. AgriSmart aims to bring agricultural knowledge, data, and AI-powered
              assistance together in one simple platform.
            </p>
          </div>

          <div className="mt-12 grid gap-5 md:grid-cols-2">
            <div className="rounded-2xl border border-border bg-card p-7 shadow-soft">
              <span className="grid h-11 w-11 place-items-center rounded-xl bg-accent text-accent-foreground">
                <Target className="h-5 w-5" aria-hidden="true" />
              </span>
              <h2 className="mt-4 text-xl font-bold">Our Mission</h2>
              <p className="mt-2 leading-relaxed text-muted-foreground">
                To make useful agricultural information and intelligent decision support more
                accessible to farmers.
              </p>
            </div>
            <div className="rounded-2xl border border-border bg-card p-7 shadow-soft">
              <span className="grid h-11 w-11 place-items-center rounded-xl bg-accent text-accent-foreground">
                <Telescope className="h-5 w-5" aria-hidden="true" />
              </span>
              <h2 className="mt-4 text-xl font-bold">Our Vision</h2>
              <p className="mt-2 leading-relaxed text-muted-foreground">
                A future where technology helps every farmer make better-informed and more
                sustainable farming decisions.
              </p>
            </div>
          </div>
        </PageContainer>
      </section>

      <section className="bg-surface py-16 sm:py-20">
        <PageContainer>
          <SectionHeading title="What AgriSmart Provides" />
          <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {provides.map((p) => (
              <FeatureCard key={p.title} {...p} />
            ))}
          </div>
        </PageContainer>
      </section>

      <section className="py-16 sm:py-20">
        <PageContainer>
          <div className="grid items-center gap-10 lg:grid-cols-2">
            <div className="min-w-0">
              <SectionHeading align="left" title="Why We Built AgriSmart" />
              <p className="mt-4 leading-relaxed text-muted-foreground">
                Finding trustworthy farming information often means searching across many scattered
                sources. AgriSmart is designed to reduce that difficulty by bringing important
                agricultural resources together in one place — crops, soil, weather, crop health and
                market context, alongside an assistant that can answer questions in plain language.
              </p>
              <p className="mt-4 leading-relaxed text-muted-foreground">
                The goal is simple: less time hunting for answers, more time farming.
              </p>
              <p className="mt-6 text-lg font-bold text-primary">Smart Farming, Better Future.</p>
            </div>
            <div className="overflow-hidden rounded-3xl border border-border shadow-lift">
              <img
                src={aboutImage}
                alt="Aerial view of green terraced farmland"
                width={1400}
                height={900}
                loading="lazy"
                className="h-full w-full object-cover"
              />
            </div>
          </div>
        </PageContainer>
      </section>

      <CTASection
        title="Explore AgriSmart"
        description="Take the first step toward simpler access to useful agricultural insights."
      />
    </SiteLayout>
  );
}
