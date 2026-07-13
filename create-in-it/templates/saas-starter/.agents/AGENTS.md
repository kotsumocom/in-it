# SaaS Starter Template Rules

## Imports
- Always import components from `~/components.ts`, NEVER directly from `@kotsumo/in-it/components`.
- Import icons from `@kotsumo/in-it/icons`.
- Import router from `@kotsumo/in-it/router`.

## Styling
- NEVER use inline styles (`style={{ ... }}`). Use in-it CSS classes exclusively.
- NEVER add external CSS libraries (Tailwind, Bootstrap, etc.).
- Follow BEM naming: `ii-block__element--modifier`.
- For custom styles, create a CSS file and use `--ii-*` CSS variables.

## Component Override
- To override a component, edit `client/components.ts` and swap the import.
- Create override files in `client/overrides/`.

## Architecture
- Client code lives in `client/`.
- Server code lives in `server/`.
- Pages go in `client/pages/`.
- Admin pages go in `client/pages/admin/`.
- Server middleware goes in `server/middleware/`.

## Auth
- Auth UI is provided by in-it's `<AuthForm>` component.
- Auth logic must be implemented by the user (Supabase Auth, Auth0, etc.).
- See `server/middleware/auth.ts` for the integration point.

## Database
- The template uses a Repository pattern (`server/db/types.ts`).
- Default implementation is in-memory (`server/db/memory.ts`).
- Replace with your preferred database by implementing the same interface.
