import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import type { Session, User } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";

type AuthState = {
  session: Session | null;
  user: User | null;
  loading: boolean;
  signOut: () => Promise<void>;
};

const AuthContext = createContext<AuthState>({
  session: null,
  user: null,
  loading: true,
  signOut: async () => {},
});

export function AuthProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const { data: sub } = supabase.auth.onAuthStateChange((_event, nextSession) => {
      setSession(nextSession);
      setLoading(false);
    });

    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session);
      setLoading(false);
    });

    return () => sub.subscription.unsubscribe();
  }, []);

  const value = useMemo<AuthState>(
    () => ({
      session,
      user: session?.user ?? null,
      loading,
      signOut: async () => {
        await supabase.auth.signOut();
        setSession(null);
      },
    }),
    [session, loading],
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
  if (m.includes("invalid login credentials"))
    return "Incorrect email or password. Please try again.";
  if (m.includes("user not found") || m.includes("no user"))
    return "We couldn't find an account with that email.";
  if (m.includes("already registered") || m.includes("already exists") || m.includes("user already"))
    return "Email already registered. Try signing in instead.";
  if (m.includes("password") && (m.includes("weak") || m.includes("at least") || m.includes("short")))
    return "Password is too weak. Use at least 8 characters.";
  if (m.includes("email not confirmed"))
    return "Please confirm your email address before signing in.";
  if (m.includes("rate limit") || m.includes("too many"))
    return "Too many attempts. Please wait a moment and try again.";
  if (m.includes("fetch") || m.includes("network") || m.includes("failed to fetch"))
    return "Network problem. Check your connection and try again.";
  return "Something went wrong. Please try again.";
}
