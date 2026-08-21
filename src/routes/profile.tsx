import { createFileRoute } from "@tanstack/react-router";
import { useState, useEffect, type FormEvent } from "react";
import { User as UserIcon, Mail, Phone, Globe, Shield, Save, Check } from "lucide-react";
import { DashboardLayout } from "@/components/site/DashboardLayout";
import { useAuth } from "@/lib/auth";
import { useProfile } from "@/lib/use-profile";
import { db, doc, setDoc, serverTimestamp } from "@/lib/firebase";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export const Route = createFileRoute("/profile")({
  ssr: false,
  head: () => ({
    meta: [
      { title: "Profile — AgriSmart" },
      { name: "description", content: "Manage your farm and profile information on AgriSmart." },
      { property: "og:title", content: "Profile — AgriSmart" },
      { property: "og:description", content: "Manage your farm and profile information." },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: ProfilePage,
});

function ProfilePage() {
  const { user } = useAuth();
  const { profile, fullName, email } = useProfile();
  const existingPhone = profile?.phone || "";

  const [name, setName] = useState(fullName || "");
  const [phone, setPhone] = useState(existingPhone || "");
  const [farmLocation, setFarmLocation] = useState("");
  const [farmSize, setFarmSize] = useState("medium");
  const [primaryCrops, setPrimaryCrops] = useState("Wheat, Rice, Cotton");
  const [language, setLanguage] = useState("english");
  const [saved, setSaved] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (profile) {
      setName(profile.full_name || user?.displayName || "");
      setPhone(profile.phone || "");
    }
  }, [profile, user]);

  const handleSave = async (e: FormEvent) => {
    e.preventDefault();
    if (!user) return;
    setSaving(true);
    setSaved(false);

    try {
      await setDoc(
        doc(db, "profiles", user.uid),
        {
          full_name: name.trim(),
          email: user.email || email,
          phone: phone.trim(),
          farm_location: farmLocation,
          farm_size: farmSize,
          primary_crops: primaryCrops,
          preferred_language: language,
          updated_at: serverTimestamp(),
        },
        { merge: true },
      );
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch (err) {
      console.error("Failed to update profile:", err);
    } finally {
      setSaving(false);
    }
  };

  return (
    <DashboardLayout>
      <div className="mx-auto max-w-3xl space-y-8">
        <div>
          <h1 className="text-2xl font-extrabold tracking-tight sm:text-3xl">
            Profile & Farm Info
          </h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Manage your personal profile and farm details to receive tailored agricultural insights.
          </p>
        </div>

        <form onSubmit={handleSave} className="space-y-6">
          {/* Personal Information */}
          <div className="rounded-2xl border border-border bg-card p-6 shadow-soft sm:p-8 space-y-5">
            <h2 className="text-lg font-semibold flex items-center gap-2">
              <UserIcon className="h-5 w-5 text-primary" /> Personal Information
            </h2>
            <div className="grid gap-5 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="name">Full Name</Label>
                <Input
                  id="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Your full name"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Email Address</Label>
                <div className="relative">
                  <Input
                    id="email"
                    type="email"
                    value={user?.email || email}
                    disabled
                    className="bg-muted text-muted-foreground"
                  />
                  <Mail className="absolute right-3 top-2.5 h-4 w-4 text-muted-foreground" />
                </div>
              </div>
            </div>

            <div className="grid gap-5 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="phone">Phone Number</Label>
                <div className="relative">
                  <Input
                    id="phone"
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+91 98765 43210"
                  />
                  <Phone className="absolute right-3 top-2.5 h-4 w-4 text-muted-foreground" />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="language">Preferred Language</Label>
                <Select value={language} onValueChange={setLanguage}>
                  <SelectTrigger id="language" className="w-full">
                    <SelectValue placeholder="Select language" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="english">English</SelectItem>
                    <SelectItem value="hindi">Hindi</SelectItem>
                    <SelectItem value="telugu">Telugu</SelectItem>
                    <SelectItem value="tamil">Tamil</SelectItem>
                    <SelectItem value="marathi">Marathi</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          {/* Farm Details */}
          <div className="rounded-2xl border border-border bg-card p-6 shadow-soft sm:p-8 space-y-5">
            <h2 className="text-lg font-semibold flex items-center gap-2">
              <Globe className="h-5 w-5 text-primary" /> Farm & Crop Details
            </h2>

            <div className="grid gap-5 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="farmLocation">Farm District / Region</Label>
                <Input
                  id="farmLocation"
                  value={farmLocation}
                  onChange={(e) => setFarmLocation(e.target.value)}
                  placeholder="e.g. Guntur, Andhra Pradesh"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="farmSize">Farm Size</Label>
                <Select value={farmSize} onValueChange={setFarmSize}>
                  <SelectTrigger id="farmSize" className="w-full">
                    <SelectValue placeholder="Select farm size" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="small">Small (Less than 2 acres)</SelectItem>
                    <SelectItem value="medium">Medium (2 - 10 acres)</SelectItem>
                    <SelectItem value="large">Large (More than 10 acres)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="primaryCrops">Primary Crops Grown</Label>
              <Input
                id="primaryCrops"
                value={primaryCrops}
                onChange={(e) => setPrimaryCrops(e.target.value)}
                placeholder="e.g. Paddy, Cotton, Chilli, Maize"
              />
            </div>
          </div>

          <div className="flex items-center gap-4">
            <Button type="submit" size="lg" disabled={saving} className="gap-2">
              {saved ? (
                <>
                  <Check className="h-4 w-4 text-primary-foreground" /> Saved!
                </>
              ) : (
                <>
                  <Save className="h-4 w-4" /> {saving ? "Saving..." : "Save Profile"}
                </>
              )}
            </Button>
            {saved && (
              <span className="text-sm font-medium text-primary">
                Your profile was updated in Firestore.
              </span>
            )}
          </div>
        </form>
      </div>
    </DashboardLayout>
  );
}
