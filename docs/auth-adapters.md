# Auth Adapters

in-it の認証レイヤーはアダプターパターンを採用しています。
アダプターは `AuthAdapter` インターフェースを実装するオブジェクトで、任意の認証プロバイダーを in-it に接続できます。

## 組み込みアダプター

| アダプター | パス | 概要 |
| --- | --- | --- |
| Supabase | `@kotsumo/in-it/auth/supabase` | Supabase Auth REST API 直接呼び出し。Cookie からトークン読み取り。 |
| JWT | `@kotsumo/in-it/auth/jwt` | 汎用 JWT 検証。HS256/RS256 等。Web Crypto API ベース。 |
| Session | `@kotsumo/in-it/auth/session` | サーバーサイドセッション。Cookie からセッション ID を取得し、`findSession` コールバックで解決。 |
| Session API | `@kotsumo/in-it/auth/session-api` | HTTP セッションエンドポイント経由。Better Auth / NextAuth / Lucia 等と連携。 |

## 使い方

### 基本パターン

```ts
import { createAuth } from "@kotsumo/in-it/auth";
import { jwtAdapter } from "@kotsumo/in-it/auth/jwt";

const auth = createAuth({
  adapter: jwtAdapter({
    secret: Deno.env.get("JWT_SECRET")!,
  }),
  loginPath: "/login",
  publicPaths: ["/", "/about"],
});

// Hono ミドルウェアとして使用
app.use("/admin/*", auth.middleware());

// ハンドラーでユーザー情報を取得
app.get("/admin/profile", (c) => {
  const user = auth.getUser(c);
  return c.json(user);
});
```

### JWT アダプター

```ts
import { jwtAdapter } from "@kotsumo/in-it/auth/jwt";

// HMAC (対称鍵)
const adapter = jwtAdapter({
  secret: "your-secret-key",
  algorithm: "HS256",       // デフォルト
  tokenSource: "header",    // "header" | "cookie" | "both"
  issuer: "my-app",         // オプション: iss クレーム検証
  audience: "my-audience",  // オプション: aud クレーム検証
  clockTolerance: 30,       // デフォルト: 30秒
  mapUser: (payload) => ({
    id: payload.sub as string,
    email: payload.email as string,
    name: payload.name as string,
  }),
});

// RSA (非対称鍵)
const adapter = jwtAdapter({
  publicKey: Deno.env.get("JWT_PUBLIC_KEY")!,  // PEM 文字列
  algorithm: "RS256",
  tokenSource: "both",   // Header → Cookie の順でフォールバック
  cookieName: "jwt",
});
```

### Session アダプター

```ts
import { sessionAdapter } from "@kotsumo/in-it/auth/session";

const adapter = sessionAdapter({
  findSession: async (sessionId) => {
    const row = await db.query(
      "SELECT * FROM sessions JOIN users ON sessions.user_id = users.id WHERE sessions.id = ?",
      [sessionId],
    );
    if (!row) return null;
    return {
      user: { id: row.user_id, email: row.email, name: row.name },
      accessToken: sessionId,
      expiresAt: Math.floor(row.expires_at.getTime() / 1000),
    };
  },
  destroySession: async (sessionId) => {
    await db.query("DELETE FROM sessions WHERE id = ?", [sessionId]);
  },
  cookieName: "session-id",  // デフォルト
});
```

### Session API アダプター（Better Auth 連携）

```ts
import { sessionApiAdapter } from "@kotsumo/in-it/auth/session-api";

const adapter = sessionApiAdapter({
  sessionUrl: "http://localhost:3000/api/auth/get-session",
  signOutUrl: "http://localhost:3000/api/auth/sign-out",
  cookieNames: ["better-auth.session_token"],
  mapSession: (data) => {
    const d = data as {
      user: { id: string; email: string; name: string; image?: string };
      session: { token: string; expiresAt: string };
    };
    return {
      user: {
        id: d.user.id,
        email: d.user.email,
        name: d.user.name,
        avatarUrl: d.user.image,
      },
      accessToken: d.session.token,
      expiresAt: Math.floor(new Date(d.session.expiresAt).getTime() / 1000),
    };
  },
});
```

## カスタムアダプターの実装

`AuthAdapter` インターフェースを実装するだけで、任意の認証サービスを接続できます。

### インターフェース

```ts
interface AuthAdapter {
  /** リクエストからセッションを取得。認証されていなければ null。 */
  getSession(req: Request): Promise<AuthSession | null>;

  /** オプション: ユーザーだけを取得。デフォルトは getSession().user。 */
  getUser?(req: Request): Promise<AuthUser | null>;

  /** サインアウト処理。Cookie クリアとリダイレクトの Response を返す。 */
  signOut(req: Request): Promise<Response>;

  /** オプション: 期限切れセッションのリフレッシュ。 */
  refreshSession?(req: Request): Promise<AuthSession | null>;
}
```

### 最小実装例

```ts
import type { AuthAdapter, AuthSession } from "@kotsumo/in-it/auth";

export function myCustomAdapter(options: MyOptions): AuthAdapter {
  return {
    async getSession(req: Request): Promise<AuthSession | null> {
      // 1. リクエストから認証情報を取得（Cookie, Header 等）
      const token = req.headers.get("x-auth-token");
      if (!token) return null;

      // 2. トークンを検証しユーザー情報を取得
      const user = await validateToken(token);
      if (!user) return null;

      // 3. AuthSession を返す
      return {
        user: {
          id: user.id,
          email: user.email,
          name: user.name,
        },
        accessToken: token,
      };
    },

    async signOut(_req: Request): Promise<Response> {
      // Cookie をクリアしてリダイレクト
      return new Response(null, {
        status: 302,
        headers: {
          "Set-Cookie": "auth-token=; Path=/; Max-Age=0; HttpOnly; SameSite=Lax",
          "Location": "/",
        },
      });
    },
  };
}
```

### 実装のポイント

1. **必須メソッド**: `getSession` と `signOut` の2つだけ
2. **`getUser` は省略可能**: `createAuth` が `getSession().user` で代替する
3. **`refreshSession` は省略可能**: リフレッシュ不要なら実装しない
4. **外部依存は最小限に**: REST API を直接呼ぶパターンを推奨（Supabase アダプターもこの方式）
5. **Cookie ヘルパー**: `req.headers.get("cookie")` からパースする共通パターンを使う
