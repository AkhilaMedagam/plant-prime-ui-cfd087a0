import { createFileRoute } from "@tanstack/react-router";
import { DashboardLayout } from "@/components/site/DashboardLayout";

export const Route = createFileRoute("/ai-coach")({
  ssr: false,
  head: () => ({
    meta: [
      { title: "AI Coach — AgriSmart" },
      { name: "description", content: "Your personal AI farming coach is coming soon." },
      { property: "og:title", content: "AI Coach — AgriSmart" },
      { property: "og:description", content: "Your personal AI farming coach is coming soon." },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: Page,
});

function Page() {
  return (
    <DashboardLayout>
      <div className="mx-auto max-w-3xl">
        <h1 className="text-2xl font-extrabold tracking-tight sm:text-3xl">AI Coach</h1>
        <p className="mt-2 text-sm text-muted-foreground">Your personal AI farming coach is coming soon.</p>
        <div className="mt-8 rounded-2xl border border-dashed border-border bg-card p-10 text-center">
          <p className="text-sm text-muted-foreground">This section is not available yet.</p>
        </div>
      </div>
    </DashboardLayout>
  );
}
