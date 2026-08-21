import { useEffect, useState } from "react";
import { useAuth } from "@/lib/auth";
import { db, doc, onSnapshot, setDoc, serverTimestamp } from "@/lib/firebase";

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

    // Subscribe to user profile document in Firestore
    const profileRef = doc(db, "profiles", user.uid);
    const unsubProfile = onSnapshot(
      profileRef,
      (docSnap) => {
        if (docSnap.exists()) {
          const data = docSnap.data();
          setProfile({
            full_name: data.full_name || user.displayName || "",
            email: data.email || user.email || "",
            phone: data.phone || "",
            avatar_url: data.avatar_url || user.photoURL || null,
          });
        } else {
          // Initialize profile doc if it doesn't exist yet
          const initialData = {
            full_name: user.displayName || "",
            email: user.email || "",
            phone: "",
            avatar_url: user.photoURL || null,
            created_at: serverTimestamp(),
            updated_at: serverTimestamp(),
          };
          setProfile(initialData);
          setDoc(profileRef, initialData, { merge: true }).catch(() => {});
        }
      },
      (err) => {
        console.warn("Firestore profile snapshot error:", err);
        // Fallback to auth object info
        setProfile({
          full_name: user.displayName || "",
          email: user.email || "",
          phone: "",
          avatar_url: user.photoURL || null,
        });
      },
    );

    // Subscribe to onboarding / app profile document
    const appProfileRef = doc(db, "user_app_profiles", user.uid);
    const unsubAppProfile = onSnapshot(
      appProfileRef,
      (docSnap) => {
        if (docSnap.exists()) {
          setOnboardingCompleted(docSnap.data()?.onboarding_completed ?? false);
        } else {
          setOnboardingCompleted(false);
        }
      },
      () => {
        setOnboardingCompleted(false);
      },
    );

    return () => {
      unsubProfile();
      unsubAppProfile();
    };
  }, [user]);

  const fullName = profile?.full_name || user?.displayName || "";
  const email = profile?.email || user?.email || "";
  const avatarUrl = profile?.avatar_url || user?.photoURL || null;

  return { profile, fullName, email, avatarUrl, onboardingCompleted };
}
