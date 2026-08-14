import { useState } from "react";
import { Button } from "@/components/ui/button";
import { lovable } from "@/integrations/lovable/index";

function GoogleIcon() {
  return (
    <svg className="h-4 w-4" viewBox="0 0 48 48" aria-hidden="true">
      <path
        fill="#EA4335"
        d="M24 9.5c3.5 0 6.6 1.2 9 3.6l6.7-6.7C35.5 2.6 30.1 0 24 0 14.6 0 6.5 5.4 2.6 13.2l7.8 6.1C12.3 13.2 17.6 9.5 24 9.5z"
      />
      <path
        fill="#4285F4"
        d="M46.5 24.5c0-1.6-.1-3.1-.4-4.5H24v9h12.7c-.6 3-2.3 5.5-4.9 7.2l7.6 5.9c4.4-4.1 7.1-10.2 7.1-17.6z"
      />
      <path
        fill="#FBBC05"
        d="M10.4 28.7a14.5 14.5 0 0 1 0-9.4l-7.8-6.1a24 24 0 0 0 0 21.6l7.8-6.1z"
      />
      <path
        fill="#34A853"
        d="M24 48c6.5 0 11.9-2.1 15.9-5.8l-7.6-5.9c-2.1 1.4-4.8 2.3-8.3 2.3-6.4 0-11.7-3.7-13.6-9l-7.8 6.1C6.5 42.6 14.6 48 24 48z"
      />
    </svg>
  );
}

export function GoogleAuthButton({
  label,
  onError,
}: {
  label: string;
  onError: (message: string | null) => void;
}) {
  const [loading, setLoading] = useState(false);

  const handleClick = async () => {
    if (loading) return;
    setLoading(true);
    onError(null);
    try {
      const result = await lovable.auth.signInWithOAuth("google", {
        redirect_uri: window.location.origin,
      });

      if (result.error) {
        onError("Google sign-in didn't work. Please try again.");
        setLoading(false);
        return;
      }

      if (result.redirected) return;

      window.location.href = "/dashboard";
    } catch {
      onError("Couldn't reach Google right now. Check your connection and try again.");
      setLoading(false);
    }
  };

  return (
    <Button
      type="button"
      variant="outline"
      size="lg"
      className="w-full gap-2"
      disabled={loading}
      onClick={handleClick}
    >
      {loading ? null : <GoogleIcon />}
      {loading ? "Connecting to Google…" : label}
    </Button>
  );
}
