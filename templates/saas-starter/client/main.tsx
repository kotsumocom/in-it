import { render } from "hono/jsx/dom";
import { Route, Switch, useLocation } from "@kotsumo/in-it/router";
import { ToastContainer } from "@kotsumo/in-it/components";
import "@kotsumo/in-it/css/main.css";

// Pages
import { LandingPage } from "./pages/landing.tsx";
import { AuthPage } from "./pages/auth.tsx";
import { TermsPage } from "./pages/terms.tsx";
import { PrivacyPage } from "./pages/privacy.tsx";
import { NotFoundPage } from "./pages/not-found.tsx";
import { AdminApp } from "./pages/admin/dashboard.tsx";

function App() {
  const [path] = useLocation();

  // Admin routes use their own shell
  if (path.startsWith("/admin")) {
    return (
      <>
        <AdminApp />
        <ToastContainer />
      </>
    );
  }

  return (
    <>
      <Switch>
        <Route path="/" component={LandingPage} />
        <Route path="/login" component={() => <AuthPage mode="login" />} />
        <Route path="/signup" component={() => <AuthPage mode="signup" />} />
        <Route path="/terms" component={TermsPage} />
        <Route path="/privacy" component={PrivacyPage} />
        <Route path="*" component={NotFoundPage} />
      </Switch>
      <ToastContainer />
    </>
  );
}

render(<App />, document.getElementById("app")!);
