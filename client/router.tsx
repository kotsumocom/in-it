/**
 * 軽量 SPA ルーター（hono/jsx/dom 用）
 * History API ベース、約 60 行。
 */
import { useState, useEffect, useCallback } from "hono/jsx";

// グローバルなナビゲーションイベント
const listeners = new Set<() => void>();

function notify() {
  for (const fn of listeners) fn();
}

/** 現在のパスを取得・ナビゲーションする Hook */
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
    window.history.pushState(null, "", to);
    notify();
  }, []);

  return [path, navigate];
}

/** パスマッチング（簡易パターン対応） */
function matchPath(pattern: string, path: string): Record<string, string> | null {
  // 完全一致
  if (pattern === path) return {};

  // パラメータ付きパターン（:param）
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

/** Route コンポーネント */
export function Route({
  path,
  component: Component,
}: {
  path: string;
  component: (props: { params: Record<string, string> }) => any;
}) {
  const [current] = useLocation();
  const match = matchPath(path, current);
  if (!match) return null;
  return <Component params={match} />;
}

/** Switch — 最初にマッチした Route だけを表示 */
export function Switch({ children }: { children: any }) {
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

/** Link コンポーネント（SPA ナビゲーション） */
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
}) {
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
