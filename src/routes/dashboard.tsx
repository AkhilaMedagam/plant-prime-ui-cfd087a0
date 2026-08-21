import { createFileRoute, Link } from "@tanstack/react-router";
import { Bot, CheckCircle2, Circle, CloudSun, Inbox, Leaf, Sprout } from "lucide-react";
import { DashboardLayout } from "@/components/site/DashboardLayout";
import { useProfile } from "@/lib/use-profile";

export const Route = createFileRoute("/dashboard")({
  ssr: false,
  head: () => ({
    meta: [
      { title: "Dashboard — AgriSmart" },
      {
        name: "description",
        content: "Your AgriSmart dashboard with crop, soil, weather and AI coaching shortcuts.",
      },
      { property: "og:title", content: "Dashboard — AgriSmart" },
      { property: "og:description", content: "Your personal AgriSmart dashboard." },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: Dashboard,
});

const quickActions = [
  {
    to: "/crops",
    label: "Crop Information",
    description: "Varieties, planting windows and crop care guidance.",
    icon: Sprout,
  },
  {
    to: "/soil",
    label: "Soil Insights",
    description: "Understand soil health and nutrient needs.",
    icon: Leaf,
  },
  {
    to: "/weather",
    label: "Weather",
    description: "Plan field work around local conditions.",
    icon: CloudSun,
  },
  {
    to: "/ai-coach",
    label: "AI Coach",
    description: "Ask farming questions and get guidance.",
    icon: Bot,
  },
] as const;

function Dashboard() {
  const { profile, fullName, onboardingCompleted } = useProfile();

  const profileComplete = Boolean(profile?.full_name && profile?.email && profile?.phone);
  const steps = [
    { label: "Complete your profile", done: profileComplete },
    { label: "Explore the dashboard", done: true },
    { label: "Use a main AgriSmart feature", done: onboardingCompleted === true },
    { label: "Try the AI Coach", done: false },
  ];
  const doneCount = steps.filter((s) => s.done).length;

  return (
    <DashboardLayout>
      <div className="mx-auto max-w-5xl">
        <section>
          <h1 className="text-2xl font-extrabold tracking-tight sm:text-3xl">
            Welcome back{fullName ? `, ${fullName}` : ""}
          </h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Make smarter farming decisions with AgriSmart.
          </p>
        </section>

        <section className="mt-8">
          <h2 className="text-lg font-semibold">Quick actions</h2>
          <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {quickActions.map((action) => (
              <Link
                key={action.to}
                to={action.to}
                className="group rounded-2xl border border-border bg-card p-5 shadow-soft transition-all duration-200 hover:-translate-y-1 hover:shadow-lift"
              >
                <span className="grid h-11 w-11 place-items-center rounded-xl bg-accent text-accent-foreground transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
                  <action.icon className="h-5 w-5" aria-hidden="true" />
                </span>
                <h3 className="mt-4 font-semibold">{action.label}</h3>
                <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
                  {action.description}
                </p>
              </Link>
            ))}
          </div>
        </section>

        <div className="mt-8 grid gap-4 lg:grid-cols-2">
          <section className="rounded-2xl border border-border bg-card p-6 shadow-soft">
            <div className="flex items-baseline justify-between gap-3">
              <h2 className="text-lg font-semibold">Getting started</h2>
              <span className="text-sm text-muted-foreground">
                {doneCount} of {steps.length}
              </span>
            </div>
            <div className="mt-4 h-2 w-full overflow-hidden rounded-full bg-muted">
              <div
                className="h-full rounded-full bg-primary transition-all"
                style={{ width: `${(doneCount / steps.length) * 100}%` }}
              />
            </div>
            <ul className="mt-5 space-y-3">
              {steps.map((step) => (
                <li key={step.label} className="flex items-center gap-3 text-sm">
                  {step.done ? (
                    <CheckCircle2 className="h-5 w-5 shrink-0 text-primary" aria-hidden="true" />
                  ) : (
                    <Circle className="h-5 w-5 shrink-0 text-muted-foreground" aria-hidden="true" />
                  )}
                  <span className={step.done ? "text-foreground" : "text-muted-foreground"}>
                    {step.label}
                  </span>
                </li>
              ))}
            </ul>
          </section>

          <section className="rounded-2xl border border-border bg-card p-6 shadow-soft">
            <h2 className="text-lg font-semibold">Recent activity</h2>
            <div className="mt-6 flex flex-col items-center rounded-xl border border-dashed border-border px-6 py-10 text-center">
              <span className="grid h-11 w-11 place-items-center rounded-xl bg-accent text-accent-foreground">
                <Inbox className="h-5 w-5" aria-hidden="true" />
              </span>
              <p className="mt-4 text-sm text-muted-foreground">
                No activity yet. Start using AgriSmart to see your recent activity here.
              </p>
            </div>
          </section>
        </div>
      </div>
    </DashboardLayout>
  );
}
