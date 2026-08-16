import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/lib/auth";

export type Profile = {
  full_name: string;
  email: string;
  phone: string;
  avatar_url: string | null;
};

export function useProfile() {
  const { user } = useAuth();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [onboardingCompleted, setOnboardingCompleted] = useState<boolean | null>(null);

  useEffect(() => {
    if (!user) {
      setProfile(null);
      setOnboardingCompleted(null);
      return;
    }
    let active = true;

    supabase
      .from("profiles")
      .select("full_name, email, phone, avatar_url")
      .eq("id", user.id)
      .maybeSingle()
      .then(({ data }) => {
        if (active && data) setProfile(data as Profile);
      });

    supabase
      .from("user_app_profiles")
      .select("onboarding_completed")
      .eq("user_id", user.id)
      .maybeSingle()
      .then(({ data }) => {
        if (active) setOnboardingCompleted(data?.onboarding_completed ?? false);
      });

    return () => {
      active = false;
    };
  }, [user]);

  const fullName =
    profile?.full_name ||
    (user?.user_metadata?.["full_name"] as string | undefined) ||
    "";
  const email = profile?.email || user?.email || "";
  const avatarUrl =
    profile?.avatar_url || (user?.user_metadata?.["avatar_url"] as string | undefined) || null;

  return { profile, fullName, email, avatarUrl, onboardingCompleted };
}
