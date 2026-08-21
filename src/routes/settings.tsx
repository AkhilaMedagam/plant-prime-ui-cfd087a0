import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { LogOut, Bell, Moon, Sun, Smartphone, Key, Check } from "lucide-react";
import { DashboardLayout } from "@/components/site/DashboardLayout";
import { useAuth } from "@/lib/auth";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";

export const Route = createFileRoute("/settings")({
  ssr: false,
  head: () => ({
    meta: [
      { title: "Settings — AgriSmart" },
      { name: "description", content: "AgriSmart account preferences and notification settings." },
      { property: "og:title", content: "Settings — AgriSmart" },
      { property: "og:description", content: "AgriSmart account preferences and settings." },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: SettingsPage,
});

function SettingsPage() {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();

  const [weatherAlerts, setWeatherAlerts] = useState(true);
  const [marketUpdates, setMarketUpdates] = useState(true);
  const [pestWarnings, setPestWarnings] = useState(true);
  const [savedNotice, setSavedNotice] = useState(false);

  const handleToggle = (setter: (v: boolean) => void, val: boolean) => {
    setter(val);
    setSavedNotice(true);
    setTimeout(() => setSavedNotice(false), 2500);
  };

  const handleSignOut = async () => {
    await signOut();
    navigate({ to: "/sign-in", replace: true });
  };

  return (
    <DashboardLayout>
      <div className="mx-auto max-w-3xl space-y-8">
        <div>
          <h1 className="text-2xl font-extrabold tracking-tight sm:text-3xl">Account & Settings</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Manage your advisory preferences, notifications, and security.
          </p>
        </div>

        {savedNotice && (
          <div className="flex items-center gap-2 rounded-xl bg-accent px-4 py-3 text-sm text-accent-foreground">
            <Check className="h-4 w-4 text-primary" /> Settings preference updated.
          </div>
        )}

        {/* Notifications & Alerts */}
        <div className="rounded-2xl border border-border bg-card p-6 shadow-soft sm:p-8 space-y-6">
          <h2 className="text-lg font-semibold flex items-center gap-2">
            <Bell className="h-5 w-5 text-primary" /> Notification Preferences
          </h2>

          <div className="space-y-4 divide-y divide-border">
            <div className="flex items-center justify-between pt-2">
              <div>
                <p className="font-medium text-sm">Severe Weather Alerts</p>
                <p className="text-xs text-muted-foreground">
                  Get high-priority forecasts for storms, excessive rain, or heatwaves.
                </p>
              </div>
              <Switch
                checked={weatherAlerts}
                onCheckedChange={(v) => handleToggle(setWeatherAlerts, v)}
              />
            </div>

            <div className="flex items-center justify-between pt-4">
              <div>
                <p className="font-medium text-sm">Market Price Fluctuations</p>
                <p className="text-xs text-muted-foreground">
                  Receive notifications when Mandi prices change significantly for your crops.
                </p>
              </div>
              <Switch
                checked={marketUpdates}
                onCheckedChange={(v) => handleToggle(setMarketUpdates, v)}
              />
            </div>

            <div className="flex items-center justify-between pt-4">
              <div>
                <p className="font-medium text-sm">Pest & Disease Advisories</p>
                <p className="text-xs text-muted-foreground">
                  Get regional pest alerts based on current temperature and humidity.
                </p>
              </div>
              <Switch
                checked={pestWarnings}
                onCheckedChange={(v) => handleToggle(setPestWarnings, v)}
              />
            </div>
          </div>
        </div>

        {/* Account & Security */}
        <div className="rounded-2xl border border-border bg-card p-6 shadow-soft sm:p-8 space-y-6">
          <h2 className="text-lg font-semibold flex items-center gap-2">
            <Key className="h-5 w-5 text-primary" /> Account & Session
          </h2>

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <p className="font-medium text-sm">Signed In As</p>
              <p className="text-xs text-muted-foreground">{user?.email || "Authenticated User"}</p>
            </div>

            <Button
              variant="destructive"
              size="sm"
              onClick={handleSignOut}
              className="gap-2 self-start sm:self-auto"
            >
              <LogOut className="h-4 w-4" /> Sign Out
            </Button>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
