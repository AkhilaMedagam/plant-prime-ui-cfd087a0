import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import type { User } from "firebase/auth";
import {
  auth,
  googleProvider,
  signInWithPopup,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  fbSignOut,
  updateProfile,
} from "./firebase";

type AuthState = {
  user: User | null;
  loading: boolean;
  signOut: () => Promise<void>;
  signInWithGoogle: () => Promise<void>;
  signInWithEmail: (email: string, pass: string) => Promise<void>;
  signUpWithEmail: (email: string, pass: string, displayName?: string) => Promise<User>;
};

const AuthContext = createContext<AuthState>({
  user: null,
  loading: true,
  signOut: async () => {},
  signInWithGoogle: async () => {},
  signInWithEmail: async () => {},
  signUpWithEmail: async () => {
    throw new Error("AuthProvider not initialized");
  },
});

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((currentUser) => {
      setUser(currentUser);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const value = useMemo<AuthState>(
    () => ({
      user,
      loading,
      signOut: async () => {
        await fbSignOut(auth);
        setUser(null);
      },
      signInWithGoogle: async () => {
        await signInWithPopup(auth, googleProvider);
      },
      signInWithEmail: async (email: string, pass: string) => {
        await signInWithEmailAndPassword(auth, email, pass);
      },
      signUpWithEmail: async (email: string, pass: string, displayName?: string) => {
        const cred = await createUserWithEmailAndPassword(auth, email, pass);
        if (displayName && cred.user) {
          await updateProfile(cred.user, { displayName });
        }
        return cred.user;
      },
    }),
    [user, loading],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  return useContext(AuthContext);
}

/** Converts backend auth errors into simple, user-friendly messages. */
export function friendlyAuthError(message?: string | null): string {
  const m = (message ?? "").toLowerCase();
  if (!m) return "Something went wrong. Please try again.";
  if (
    m.includes("user-not-found") ||
    m.includes("wrong-password") ||
    m.includes("invalid-credential") ||
    m.includes("invalid login credentials")
  )
    return "Incorrect email or password. Please try again.";
  if (
    m.includes("email-already-in-use") ||
    m.includes("already registered") ||
    m.includes("already exists")
  )
    return "Email already registered. Try signing in instead.";
  if (
    m.includes("weak-password") ||
    (m.includes("password") &&
      (m.includes("weak") || m.includes("at least") || m.includes("short")))
  )
    return "Password is too weak. Use at least 6 characters.";
  if (m.includes("invalid-email")) return "Please enter a valid email address.";
  if (m.includes("too-many-requests") || m.includes("rate limit"))
    return "Too many attempts. Please wait a moment and try again.";
  if (m.includes("popup-closed-by-user")) return "Google sign-in was cancelled.";
  if (
    m.includes("network") ||
    m.includes("network-request-failed") ||
    m.includes("failed to fetch")
  )
    return "Network problem. Check your connection and try again.";
  return "Something went wrong. Please try again.";
}
