import { render } from "hono/jsx/dom";
import { Route, Switch, useLocation } from "@kotsumo/in-it/router";
import { ToastContainer } from "~/components.ts";
import { injectStyles } from "@kotsumo/in-it/styles";

// Inject all in-it CSS at startup
injectStyles();

// Pages
import { LandingPage } from "./pages/landing.tsx";
import { AuthPage } from "./pages/auth.tsx";
import { TermsPage } from "./pages/terms.tsx";
import { PrivacyPage } from "./pages/privacy.tsx";
import { NotFoundPage } from "./pages/not-found.tsx";
import { AdminApp } from "./pages/admin/dashboard.tsx";
import { BlogIndexPage } from "./pages/blog/index.tsx";
import { BlogPostPage } from "./pages/blog/post.tsx";
import { DocsPage } from "./pages/docs.tsx";

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

  // Docs routes use their own shell
  if (path.startsWith("/docs")) {
    return (
      <>
        <DocsPage />
        <ToastContainer />
      </>
    );
  }

  // Extract blog slug
  const blogMatch = path.match(/^\/blog\/(.+)/);

  return (
    <>
      <Switch>
        <Route path="/" component={LandingPage} />
        <Route path="/login" component={() => <AuthPage mode="login" />} />
        <Route path="/signup" component={() => <AuthPage mode="signup" />} />
        <Route path="/terms" component={TermsPage} />
        <Route path="/privacy" component={PrivacyPage} />
        <Route path="/blog" component={BlogIndexPage} />
        <Route path="/blog/*" component={() => <BlogPostPage slug={blogMatch?.[1] ?? ""} />} />
        <Route path="*" component={NotFoundPage} />
      </Switch>
      <ToastContainer />
    </>
  );
}

render(<App />, document.getElementById("app")!);
