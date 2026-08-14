import { createFileRoute, Link } from "@tanstack/react-router";
import {
  Bot,
  Coins,
  CloudSun,
  Bug,
  FlaskConical,
  Sprout,
  Gauge,
  HandHeart,
  LineChart,
  MousePointerClick,
} from "lucide-react";
import heroImage from "@/assets/hero-farm.jpg";
import { SiteLayout } from "@/components/site/SiteLayout";
import { PageContainer } from "@/components/site/PageContainer";
import { SectionHeading } from "@/components/site/SectionHeading";
import { FeatureCard } from "@/components/site/FeatureCard";
import { CTASection } from "@/components/site/CTASection";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "AgriSmart — Smart Farming, Better Future" },
      {
        name: "description",
        content:
          "AgriSmart is an AI-powered agriculture platform for crop, soil, weather, disease and market insights that help farmers decide with confidence.",
      },
      { property: "og:title", content: "AgriSmart — Smart Farming, Better Future" },
      {
        property: "og:description",
        content:
          "Intelligent technology that helps farmers make smarter decisions about crops, soil, weather, diseases and markets.",
      },
    ],
  }),
  component: Home,
});

const features = [
  {
    icon: Sprout,
    title: "Crop Insights",
    description: "Learn about crops, growing conditions, and farming practices.",
  },
  {
    icon: CloudSun,
    title: "Weather Intelligence",
    description: "Understand weather conditions and make better day-to-day farming decisions.",
  },
  {
    icon: FlaskConical,
    title: "Soil Insights",
    description: "Learn more about soil health and suitable crop conditions.",
  },
  {
    icon: Bug,
    title: "Disease Detection",
    description: "Identify potential crop health problems and understand possible next steps.",
  },
  {
    icon: Coins,
    title: "Market Information",
    description: "Access useful information about crop prices and market trends.",
  },
  {
    icon: Bot,
    title: "AI Farming Assistant",
    description: "Ask farming-related questions and receive personalized guidance.",
  },
];

const steps = [
  {
    number: "01",
    title: "Tell Us About Your Farm",
    description: "Add basic information about your farm, crops, and farming conditions.",
  },
  {
    number: "02",
    title: "Get Smart Insights",
    description:
      "AgriSmart combines agricultural information and intelligent technology to provide useful insights.",
  },
  {
    number: "03",
    title: "Make Better Decisions",
    description: "Use the information to make more informed farming decisions.",
  },
];

const benefits = [
  {
    icon: MousePointerClick,
    title: "Simple and easy to use",
    description: "A clear interface designed for everyday use, on the field or at home.",
  },
  {
    icon: HandHeart,
    title: "Personalized agricultural insights",
    description: "Guidance shaped around your farm details, crops and conditions.",
  },
  {
    icon: LineChart,
    title: "Data-driven decision support",
    description: "Information brought together so you can weigh your options clearly.",
  },
  {
    icon: Gauge,
    title: "Focus on sustainable farming",
    description: "Practices and insights that support long-term soil and crop health.",
  },
];

function Home() {
  return (
    <SiteLayout>
      {/* Hero */}
      <section className="gradient-hero">
        <PageContainer className="py-14 sm:py-20 lg:py-24">
          <div className="grid items-center gap-10 lg:grid-cols-2 lg:gap-14">
            <div className="min-w-0">
              <span className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-3 py-1 text-xs font-semibold text-primary">
                <Sprout className="h-3.5 w-3.5" aria-hidden="true" />
                AI-powered agriculture platform
              </span>
              <h1 className="mt-5 text-balance text-3xl font-extrabold leading-tight tracking-tight sm:text-5xl lg:text-6xl">
                Smart Farming, Better Future.
              </h1>
              <p className="mt-5 max-w-xl text-pretty text-base leading-relaxed text-muted-foreground sm:text-lg">
                AgriSmart uses intelligent technology to help farmers make smarter decisions about
                crops, soil, weather, diseases, and market opportunities.
              </p>
              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <Button asChild size="lg" className="w-full shadow-soft sm:w-auto">
                  <Link to="/sign-up">Get Started</Link>
                </Button>
                <Button asChild size="lg" variant="outline" className="w-full sm:w-auto">
                  <Link to="/about">Learn More</Link>
                </Button>
              </div>
            </div>

            <div className="relative min-w-0">
              <div className="overflow-hidden rounded-3xl border border-border shadow-lift">
                <img
                  src={heroImage}
                  alt="Farmer reviewing crop data on a tablet in a green field at sunrise"
                  width={1200}
                  height={1008}
                  className="h-full w-full object-cover"
                />
              </div>
              <div className="absolute -bottom-5 left-4 hidden rounded-2xl border border-border bg-card px-4 py-3 shadow-lift sm:block">
                <p className="text-xs font-medium text-muted-foreground">Built for farmers</p>
                <p className="text-sm font-semibold">Crops · Soil · Weather · Markets</p>
              </div>
            </div>
          </div>
        </PageContainer>
      </section>

      {/* Features */}
      <section className="py-16 sm:py-20">
        <PageContainer>
          <SectionHeading
            eyebrow="Platform"
            title="Everything You Need for Smarter Farming"
            description="AgriSmart brings essential agricultural information and intelligent insights together in one simple platform."
          />
          <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {features.map((f) => (
              <FeatureCard key={f.title} {...f} />
            ))}
          </div>
        </PageContainer>
      </section>

      {/* How it works */}
      <section className="bg-surface py-16 sm:py-20">
        <PageContainer>
          <SectionHeading eyebrow="Process" title="How AgriSmart Works" />
          <div className="relative mt-12 grid gap-6 md:grid-cols-3">
            <div
              className="absolute left-0 right-0 top-9 hidden border-t border-dashed border-border md:block"
              aria-hidden="true"
            />
            {steps.map((s) => (
              <div
                key={s.number}
                className="relative rounded-2xl border border-border bg-card p-6 shadow-soft"
              >
                <span className="grid h-12 w-12 place-items-center rounded-2xl bg-primary text-base font-bold text-primary-foreground">
                  {s.number}
                </span>
                <h3 className="mt-4 text-lg font-semibold">{s.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                  {s.description}
                </p>
              </div>
            ))}
          </div>
        </PageContainer>
      </section>

      {/* Why AgriSmart */}
      <section className="py-16 sm:py-20">
        <PageContainer>
          <SectionHeading
            eyebrow="Why AgriSmart"
            title="Technology That Works for Farmers"
            description="Practical support for everyday farming decisions — no jargon, no exaggerated promises."
          />
          <div className="mt-12 grid gap-5 sm:grid-cols-2">
            {benefits.map((b) => (
              <FeatureCard key={b.title} {...b} />
            ))}
          </div>
        </PageContainer>
      </section>

      <CTASection />
    </SiteLayout>
  );
}
