import { useState } from "hono/jsx";
import { AuthForm } from "@kotsumo/in-it/components";
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
      // const { error } = await supabase.auth.signInWithPassword(data);
      console.log(`${mode}:`, data);

      // Simulate API call
      await new Promise(r => setTimeout(r, 1000));

      // Redirect to admin on success
      window.location.href = "/admin";
    } catch (e) {
      setError(e instanceof Error ? e.message : "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  const handleProviderClick = (providerId: string) => {
    // TODO: Replace with your OAuth provider
    // await supabase.auth.signInWithOAuth({ provider: providerId });
    console.log("OAuth:", providerId);
  };

  return (
    <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "24px" }}>
      <Link href="/" style={{ marginBottom: "24px", fontSize: "1.5rem", fontWeight: 700, textDecoration: "none", color: "var(--ii-primary)" }}>
        My SaaS
      </Link>
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
