import { Handlers } from "$fresh/server.ts";

export const handler: Handlers = {
  async POST(req) {
    // Cookieを削除してホームへリダイレクト
    const headers = new Headers();
    headers.set("Location", "/");

    // Cookie削除（Max-Age=0で即時期限切れ）
    const cookieOptions = "Path=/; HttpOnly; SameSite=Lax; Max-Age=0";
    headers.append("Set-Cookie", `access_token=; ${cookieOptions}`);
    headers.append("Set-Cookie", `refresh_token=; ${cookieOptions}`);

    return new Response(null, {
      status: 302,
      headers,
    });
  },

  // GETでアクセスされた場合もログアウト処理
  GET(_req) {
    const headers = new Headers();
    headers.set("Location", "/");

    const cookieOptions = "Path=/; HttpOnly; SameSite=Lax; Max-Age=0";
    headers.append("Set-Cookie", `access_token=; ${cookieOptions}`);
    headers.append("Set-Cookie", `refresh_token=; ${cookieOptions}`);

    return new Response(null, {
      status: 302,
      headers,
    });
  },
};
