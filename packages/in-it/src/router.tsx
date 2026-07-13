/**
 * @module router
 * Lightweight SPA router for hono/jsx/dom.
 * History API based, minimal footprint.
 *
 * @example
 * ```tsx
 * import { Route, Switch, Link, useLocation } from "@kotsumo/in-it/router";
 *
 * function App() {
 *   return (
 *     <div>
 *       <Link href="/about">About</Link>
 *       <Switch>
 *         <Route path="/" component={Home} />
 *         <Route path="/about" component={About} />
 *       </Switch>
 *     </div>
 *   );
 * }
 * ```
 */
import { useState, useEffect, useCallback } from "hono/jsx";

// Global navigation event
const listeners = new Set<() => void>();

function notify() {
  for (const fn of listeners) fn();
}

/** Scroll to a hash target with smooth behavior */
function scrollToHash(hash: string): void {
  if (!hash) {
    window.scrollTo({ top: 0, behavior: "smooth" });
    return;
  }
  const id = hash.replace(/^#/, "");
  const el = document.getElementById(id);
  if (el) {
    el.scrollIntoView({ behavior: "smooth", block: "start" });
  }
}

/** Parse href into pathname and hash */
function parseHref(href: string): { pathname: string; hash: string } {
  const hashIndex = href.indexOf("#");
  if (hashIndex === -1) return { pathname: href, hash: "" };
  return {
    pathname: href.slice(0, hashIndex) || window.location.pathname,
    hash: href.slice(hashIndex),
  };
}

/** Hook to get current path and navigate */
export function useLocation(): [string, (to: string) => void] {
  const [path, setPath] = useState(
    typeof window !== "undefined" ? window.location.pathname : "/",
  );

  useEffect(() => {
    const handler = () => setPath(window.location.pathname);
    window.addEventListener("popstate", handler);
    listeners.add(handler);
    return () => {
      window.removeEventListener("popstate", handler);
      listeners.delete(handler);
    };
  }, []);

  const navigate = useCallback((to: string) => {
    const { pathname, hash } = parseHref(to);
    const currentPath = window.location.pathname;

    if (pathname === currentPath && hash) {
      // Same page, just scroll to hash
      window.history.pushState(null, "", to);
      scrollToHash(hash);
    } else {
      // Different page
      window.history.pushState(null, "", to);
      notify();
      if (hash) {
        // Wait for render, then scroll to hash
        requestAnimationFrame(() => {
          requestAnimationFrame(() => scrollToHash(hash));
        });
      } else {
        // Scroll to top on page change
        window.scrollTo({ top: 0, behavior: "smooth" });
      }
    }
  }, []);

  return [path, navigate];
}


/** Path matching (simple pattern support) */
function matchPath(pattern: string, path: string): Record<string, string> | null {
  // Exact match
  if (pattern === path) return {};

  // Pattern with parameters (:param)
  const patternParts = pattern.split("/");
  const pathParts = path.split("/");
  if (patternParts.length !== pathParts.length) return null;

  const params: Record<string, string> = {};
  for (let i = 0; i < patternParts.length; i++) {
    if (patternParts[i].startsWith(":")) {
      params[patternParts[i].slice(1)] = pathParts[i];
    } else if (patternParts[i] !== pathParts[i]) {
      return null;
    }
  }
  return params;
}

/** Route component */
export function Route({
  path,
  component: Component,
}: {
  path: string;
  component: (props: { params: Record<string, string> }) => any;
}): any {
  const [current] = useLocation();
  const match = matchPath(path, current);
  if (!match) return null;
  return <Component params={match} />;
}

/** Switch - render only the first matching Route */
export function Switch({ children }: { children: any }): any {
  const [current] = useLocation();
  const routes = Array.isArray(children) ? children : [children];

  for (const child of routes) {
    if (child?.props?.path) {
      const match = matchPath(child.props.path, current);
      if (match) {
        const Component = child.props.component;
        return <Component params={match} />;
      }
    }
  }
  return null;
}

/** Link component (SPA navigation) */
export function Link({
  href,
  children,
  class: cls,
  ...rest
}: {
  href: string;
  children: any;
  class?: string;
  [key: string]: any;
}): any {
  const [, navigate] = useLocation();

  const handleClick = (e: Event) => {
    e.preventDefault();
    navigate(href);
  };

  return (
    <a href={href} class={cls} onClick={handleClick} {...rest}>
      {children}
    </a>
  );
}
