/**
 * Component barrel — re-exports all in-it components.
 *
 * To override a component, comment out the wildcard re-export
 * and add a specific import from your overrides directory:
 *
 * @example
 * ```ts
 * // Override AdminShell with your custom version:
 * export { AdminShell } from "./overrides/AdminShell.tsx";
 *
 * // Keep everything else from in-it:
 * export {
 *   Button, Card, Badge, // ... list other components you need
 * } from "@kotsumo/in-it/components";
 * ```
 */
export * from "@kotsumo/in-it/components";
export * from "@kotsumo/in-it/charts";
