import { createFileRoute } from "@tanstack/react-router";
import { DashboardLayout } from "@/components/site/DashboardLayout";

export const Route = createFileRoute("/settings")({
  ssr: false,
  head: () => ({
    meta: [
      { title: "Settings — AgriSmart" },
      { name: "description", content: "Account settings are coming soon." },
      { property: "og:title", content: "Settings — AgriSmart" },
      { property: "og:description", content: "Account settings are coming soon." },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: Page,
});

function Page() {
  return (
    <DashboardLayout>
      <div className="mx-auto max-w-3xl">
        <h1 className="text-2xl font-extrabold tracking-tight sm:text-3xl">Settings</h1>
        <p className="mt-2 text-sm text-muted-foreground">Account settings are coming soon.</p>
        <div className="mt-8 rounded-2xl border border-dashed border-border bg-card p-10 text-center">
          <p className="text-sm text-muted-foreground">This section is not available yet.</p>
        </div>
      </div>
    </DashboardLayout>
  );
}
