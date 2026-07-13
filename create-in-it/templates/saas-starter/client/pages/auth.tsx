import { useState } from "hono/jsx";
import { AuthForm } from "~/components.ts";
import type { AuthMode, AuthFormData } from "@kotsumo/in-it/components";
import { Link } from "@kotsumo/in-it/router";

export function AuthPage({ mode: initialMode = "login" }: { mode?: AuthMode }) {
  const [mode, setMode] = useState<AuthMode>(initialMode);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (data: AuthFormData) => {
    setLoading(true);
    setError("");
    try {
      // TODO: Replace with your auth provider (e.g. Supabase Auth)
      console.log(`${mode}:`, data);
      await new Promise(r => setTimeout(r, 1000));
      window.location.href = "/admin";
    } catch (e) {
      setError(e instanceof Error ? e.message : "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  const handleProviderClick = (providerId: string) => {
    // TODO: Replace with your OAuth provider
    console.log("OAuth:", providerId);
  };

  return (
    <div class="ii-auth-page">
      <Link href="/" class="ii-auth-page__brand">My SaaS</Link>
      <AuthForm
        mode={mode}
        onSubmit={handleSubmit}
        onProviderClick={handleProviderClick}
        onModeSwitch={() => setMode(mode === "login" ? "signup" : "login")}
        providers={["google", "github"]}
        loading={loading}
        error={error}
      />
    </div>
  );
}
