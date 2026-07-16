/**
 * @module auth/adapters/jwt
 * Generic JWT adapter for in-it.
 *
 * Verifies JWTs using the Web Crypto API — zero external dependencies.
 * Supports HMAC (HS256/384/512) and RSA (RS256/384/512) algorithms.
 *
 * Tokens can be read from:
 * - `Authorization: Bearer <token>` header (default)
 * - A named cookie
 * - Both (header takes precedence)
 *
 * @example
 * ```ts
 * import { createAuth } from "@kotsumo/in-it/auth";
 * import { jwtAdapter } from "@kotsumo/in-it/auth/jwt";
 *
 * // HMAC symmetric secret
 * const auth = createAuth({
 *   adapter: jwtAdapter({
 *     secret: Deno.env.get("JWT_SECRET")!,
 *     mapUser: (payload) => ({
 *       id: payload.sub as string,
 *       email: payload.email as string,
 *       name: payload.name as string,
 *     }),
 *   }),
 * });
 *
 * // RSA public key (PEM)
 * const auth = createAuth({
 *   adapter: jwtAdapter({
 *     publicKey: Deno.env.get("JWT_PUBLIC_KEY")!,
 *     algorithm: "RS256",
 *     mapUser: (payload) => ({
 *       id: payload.sub as string,
 *       email: payload.email as string,
 *     }),
 *   }),
 * });
 * ```
 */
import type { AuthAdapter, AuthSession, AuthUser } from "../types.ts";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

/** Supported JWT algorithms. */
export type JwtAlgorithm = "HS256" | "HS384" | "HS512" | "RS256" | "RS384" | "RS512";

/** Decoded JWT payload. */
export type JwtPayload = Record<string, unknown> & {
  /** Subject (user ID). */
  sub?: string;
  /** Expiration time (Unix seconds). */
  exp?: number;
  /** Issued-at time (Unix seconds). */
  iat?: number;
  /** Issuer. */
  iss?: string;
  /** Audience. */
  aud?: string | string[];
};

/** Where to read the JWT from. */
export type JwtTokenSource = "header" | "cookie" | "both";

/** JWT adapter configuration. */
export interface JwtAdapterOptions {
  /**
   * HMAC secret string or raw bytes.
   * Provide either `secret` (for HS*) or `publicKey` (for RS*).
   */
  secret?: string | ArrayBuffer;

  /**
   * RSA/ECDSA public key in PEM or JWK format.
   * Provide either `secret` (for HS*) or `publicKey` (for RS*).
   */
  publicKey?: string | JsonWebKey;

  /**
   * JWT algorithm.
   * @default "HS256"
   */
  algorithm?: JwtAlgorithm;

  /**
   * Map the JWT payload to an `AuthUser`.
   * If not provided, a default mapping using `sub`, `email`, `name` is used.
   */
  mapUser?: (payload: JwtPayload) => AuthUser;

  /**
   * Where to read the JWT from.
   * - `"header"`: `Authorization: Bearer <token>` only
   * - `"cookie"`: Named cookie only
   * - `"both"`: Header first, then cookie as fallback
   * @default "header"
   */
  tokenSource?: JwtTokenSource;

  /**
   * Cookie name for reading the access token.
   * Required when `tokenSource` is `"cookie"` or `"both"`.
   * @default "access-token"
   */
  cookieName?: string;

  /**
   * Cookie name for the refresh token (if applicable).
   * @default "refresh-token"
   */
  refreshCookieName?: string;

  /**
   * Expected issuer (`iss` claim). Rejects tokens with a different issuer.
   */
  issuer?: string;

  /**
   * Expected audience (`aud` claim). Rejects tokens without this audience.
   */
  audience?: string;

  /**
   * Clock tolerance in seconds for expiration checks.
   * @default 30
   */
  clockTolerance?: number;

  /**
   * Logout redirect URL.
   * @default "/"
   */
  logoutRedirect?: string;
}

// ---------------------------------------------------------------------------
// Base64url helpers
// ---------------------------------------------------------------------------

function base64urlDecode(input: string): Uint8Array {
  const padded = input.replace(/-/g, "+").replace(/_/g, "/");
  const binary = atob(padded);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) {
    bytes[i] = binary.charCodeAt(i);
  }
  return bytes;
}

// ---------------------------------------------------------------------------
// PEM parsing
// ---------------------------------------------------------------------------

function pemToArrayBuffer(pem: string): ArrayBuffer {
  const lines = pem
    .replace(/-----BEGIN [A-Z ]+-----/, "")
    .replace(/-----END [A-Z ]+-----/, "")
    .replace(/\s/g, "");
  const binary = atob(lines);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) {
    bytes[i] = binary.charCodeAt(i);
  }
  return bytes.buffer;
}

// ---------------------------------------------------------------------------
// Algorithm mapping
// ---------------------------------------------------------------------------

interface AlgoInfo {
  name: string;
  hash: string;
}

function getAlgoInfo(alg: JwtAlgorithm): AlgoInfo {
  switch (alg) {
    case "HS256": return { name: "HMAC", hash: "SHA-256" };
    case "HS384": return { name: "HMAC", hash: "SHA-384" };
    case "HS512": return { name: "HMAC", hash: "SHA-512" };
    case "RS256": return { name: "RSASSA-PKCS1-v1_5", hash: "SHA-256" };
    case "RS384": return { name: "RSASSA-PKCS1-v1_5", hash: "SHA-384" };
    case "RS512": return { name: "RSASSA-PKCS1-v1_5", hash: "SHA-512" };
  }
}

// ---------------------------------------------------------------------------
// Key import
// ---------------------------------------------------------------------------

async function importKey(
  options: JwtAdapterOptions,
  alg: JwtAlgorithm,
): Promise<CryptoKey> {
  const info = getAlgoInfo(alg);

  if (alg.startsWith("HS")) {
    // HMAC — symmetric secret
    if (!options.secret) {
      throw new Error(`jwtAdapter: "secret" is required for ${alg}`);
    }
    const keyData = typeof options.secret === "string"
      ? new TextEncoder().encode(options.secret)
      : options.secret;
    return crypto.subtle.importKey(
      "raw",
      keyData,
      { name: info.name, hash: info.hash },
      false,
      ["verify"],
    );
  }

  // RSA — asymmetric public key
  if (!options.publicKey) {
    throw new Error(`jwtAdapter: "publicKey" is required for ${alg}`);
  }

  if (typeof options.publicKey === "string") {
    // PEM string
    return crypto.subtle.importKey(
      "spki",
      pemToArrayBuffer(options.publicKey),
      { name: info.name, hash: info.hash },
      false,
      ["verify"],
    );
  }

  // JWK object
  return crypto.subtle.importKey(
    "jwk",
    options.publicKey,
    { name: info.name, hash: info.hash },
    false,
    ["verify"],
  );
}

// ---------------------------------------------------------------------------
// JWT verification
// ---------------------------------------------------------------------------

async function verifyJwt(
  token: string,
  key: CryptoKey,
  alg: JwtAlgorithm,
  options: { issuer?: string; audience?: string; clockTolerance?: number },
): Promise<JwtPayload | null> {
  const parts = token.split(".");
  if (parts.length !== 3) return null;

  try {
    // Decode header and verify algorithm
    const header = JSON.parse(new TextDecoder().decode(base64urlDecode(parts[0])));
    if (header.alg !== alg) return null;

    // Verify signature
    const info = getAlgoInfo(alg);
    const data = new TextEncoder().encode(`${parts[0]}.${parts[1]}`);
    const signatureBytes = base64urlDecode(parts[2]);

    const valid = await crypto.subtle.verify(
      info.name,
      key,
      signatureBytes.buffer as ArrayBuffer,
      data,
    );
    if (!valid) return null;

    // Decode payload
    const payload = JSON.parse(
      new TextDecoder().decode(base64urlDecode(parts[1])),
    ) as JwtPayload;

    const now = Math.floor(Date.now() / 1000);
    const tolerance = options.clockTolerance ?? 30;

    // Check expiration
    if (payload.exp !== undefined && payload.exp + tolerance < now) {
      return null;
    }

    // Check not-before
    if (
      typeof payload.nbf === "number" &&
      payload.nbf - tolerance > now
    ) {
      return null;
    }

    // Check issuer
    if (options.issuer && payload.iss !== options.issuer) {
      return null;
    }

    // Check audience
    if (options.audience) {
      const aud = Array.isArray(payload.aud) ? payload.aud : [payload.aud];
      if (!aud.includes(options.audience)) {
        return null;
      }
    }

    return payload;
  } catch {
    return null;
  }
}

// ---------------------------------------------------------------------------
// Cookie helper
// ---------------------------------------------------------------------------

function getCookie(req: Request, name: string): string | undefined {
  const header = req.headers.get("cookie");
  if (!header) return undefined;
  const match = header.match(new RegExp(`(?:^|;\\s*)${name}=([^;]*)`));
  return match ? decodeURIComponent(match[1]) : undefined;
}

// ---------------------------------------------------------------------------
// Token extraction
// ---------------------------------------------------------------------------

function extractToken(
  req: Request,
  source: JwtTokenSource,
  cookieName: string,
): string | undefined {
  if (source === "header" || source === "both") {
    const auth = req.headers.get("authorization");
    if (auth?.startsWith("Bearer ")) {
      return auth.slice(7);
    }
    if (source === "header") return undefined;
  }
  // Cookie fallback (or cookie-only)
  return getCookie(req, cookieName);
}

// ---------------------------------------------------------------------------
// Default user mapper
// ---------------------------------------------------------------------------

function defaultMapUser(payload: JwtPayload): AuthUser {
  return {
    id: (payload.sub ?? payload.id ?? "") as string,
    email: payload.email as string | undefined,
    name: (payload.name ?? payload.display_name ?? payload.preferred_username) as
      | string
      | undefined,
    avatarUrl: (payload.avatar_url ?? payload.picture) as string | undefined,
    metadata: payload,
  };
}

// ---------------------------------------------------------------------------
// Adapter factory
// ---------------------------------------------------------------------------

/**
 * Create a generic JWT auth adapter.
 *
 * Uses the Web Crypto API for verification — zero external dependencies.
 * Supports HMAC (HS256/384/512) and RSA (RS256/384/512).
 */
export function jwtAdapter(options: JwtAdapterOptions): AuthAdapter {
  const {
    algorithm = "HS256",
    mapUser = defaultMapUser,
    tokenSource = "header",
    cookieName = "access-token",
    refreshCookieName = "refresh-token",
    issuer,
    audience,
    clockTolerance = 30,
    logoutRedirect = "/",
  } = options;

  // Lazily initialise the crypto key (once).
  let keyPromise: Promise<CryptoKey> | undefined;
  function getKey(): Promise<CryptoKey> {
    if (!keyPromise) {
      keyPromise = importKey(options, algorithm);
    }
    return keyPromise;
  }

  return {
    async getSession(req: Request): Promise<AuthSession | null> {
      const token = extractToken(req, tokenSource, cookieName);
      if (!token) return null;

      const key = await getKey();
      const payload = await verifyJwt(token, key, algorithm, {
        issuer,
        audience,
        clockTolerance,
      });
      if (!payload) return null;

      return {
        user: mapUser(payload),
        accessToken: token,
        expiresAt: payload.exp,
        refreshToken: getCookie(req, refreshCookieName),
      };
    },

    async signOut(_req: Request): Promise<Response> {
      const headers = new Headers();
      if (tokenSource !== "header") {
        headers.append(
          "Set-Cookie",
          `${cookieName}=; Path=/; Max-Age=0; HttpOnly; SameSite=Lax`,
        );
        headers.append(
          "Set-Cookie",
          `${refreshCookieName}=; Path=/; Max-Age=0; HttpOnly; SameSite=Lax`,
        );
      }
      headers.set("Location", logoutRedirect);
      return new Response(null, { status: 302, headers });
    },
  };
}
