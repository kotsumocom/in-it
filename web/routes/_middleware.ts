import { FreshContext } from "$fresh/server.ts";
import { getUser, UserProfile } from "@in-it/backend/services/auth.ts";

export interface State {
  user: UserProfile | null;
}

export async function handler(req: Request, ctx: FreshContext<State>) {
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
