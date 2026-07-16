/**
 * @module server/env
 * Environment variable validation utility.
 *
 * Validates that all required environment variables are present at startup.
 * Returns a type-safe record where each key is guaranteed to be a string.
 *
 * @example
 * ```ts
 * import { assertEnv } from "@kotsumo/in-it/server";
 *
 * const env = assertEnv([
 *   "SUPABASE_URL",
 *   "SUPABASE_ANON_KEY",
 *   "SESSION_SECRET",
 * ] as const);
 *
 * // env.SUPABASE_URL is typed as string (not string | undefined)
 * console.log(env.SUPABASE_URL);
 * ```
 */

/**
 * Reads an environment variable from the current runtime.
 * Supports both Deno and Node.js.
 */
function getEnvVar(key: string): string | undefined {
  // deno-lint-ignore no-explicit-any
  const g = globalThis as any;
  // Deno
  if (typeof g.Deno?.env?.get === "function") {
    return g.Deno.env.get(key);
  }
  // Node.js / Bun
  if (typeof g.process?.env === "object") {
    return g.process.env[key];
  }
  return undefined;
}

/**
 * Asserts that all required environment variables are present.
 *
 * If any variables are missing, throws a descriptive error listing
 * all missing variables (not just the first one found).
 *
 * @param keys Array of required environment variable names.
 * @returns A type-safe record mapping each key to its string value.
 *
 * @throws {Error} If one or more variables are missing.
 *
 * @example
 * ```ts
 * // Validates at startup — fails fast with a clear error
 * const env = assertEnv(["DATABASE_URL", "API_KEY"] as const);
 * // env.DATABASE_URL: string
 * // env.API_KEY: string
 * ```
 */
export function assertEnv<K extends string>(
  keys: readonly K[],
): Record<K, string> {
  const result = {} as Record<K, string>;
  const missing: string[] = [];

  for (const key of keys) {
    const value = getEnvVar(key);
    if (value === undefined || value === "") {
      missing.push(key);
    } else {
      result[key] = value;
    }
  }

  if (missing.length > 0) {
    const list = missing.map((k) => `  - ${k}`).join("\n");
    throw new Error(
      `Missing required environment variable${missing.length > 1 ? "s" : ""}:\n${list}\n\n` +
        `Set ${missing.length > 1 ? "these variables" : "this variable"} in your .env file or environment.`,
    );
  }

  return result;
}
