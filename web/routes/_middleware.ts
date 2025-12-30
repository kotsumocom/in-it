import { FreshContext } from "$fresh/server.ts";
import { getUser, UserProfile } from "@in-it/backend/services/auth.ts";

export interface State {
  user: UserProfile | null;
}

// ベーシック認証（環境変数で設定されている場合のみ有効）
function checkBasicAuth(req: Request): Response | null {
  const basicAuthUser = Deno.env.get("BASIC_AUTH_USER");
  const basicAuthPass = Deno.env.get("BASIC_AUTH_PASS");

  // 環境変数が設定されていない場合はスキップ
  if (!basicAuthUser || !basicAuthPass) {
    return null;
  }

  const authHeader = req.headers.get("authorization");
  if (!authHeader || !authHeader.startsWith("Basic ")) {
    return new Response("Unauthorized", {
      status: 401,
      headers: { "WWW-Authenticate": 'Basic realm="in-it"' },
    });
  }

  const base64Credentials = authHeader.slice(6);
  const credentials = atob(base64Credentials);
  const [user, pass] = credentials.split(":");

  if (user !== basicAuthUser || pass !== basicAuthPass) {
    return new Response("Unauthorized", {
      status: 401,
      headers: { "WWW-Authenticate": 'Basic realm="in-it"' },
    });
  }

  return null;
}

export async function handler(req: Request, ctx: FreshContext<State>) {
  // ベーシック認証チェック
  const authResponse = checkBasicAuth(req);
  if (authResponse) {
    return authResponse;
  }

  // Cookieからアクセストークンを取得
  const cookies = req.headers.get("cookie") || "";
  const accessToken = getCookie(cookies, "access_token");

  if (accessToken) {
    const { user } = await getUser(accessToken);
    ctx.state.user = user;
  } else {
    ctx.state.user = null;
  }

  return ctx.next();
}

function getCookie(cookies: string, name: string): string | null {
  const match = cookies.match(new RegExp(`(^| )${name}=([^;]+)`));
  return match ? match[2] : null;
}
