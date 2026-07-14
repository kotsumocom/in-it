/**
 * Generate client/components.ts from in-it.config.ts.
 * Run: deno task gen
 */
import { generateComponents } from "@kotsumo/in-it/gen";
await generateComponents();
