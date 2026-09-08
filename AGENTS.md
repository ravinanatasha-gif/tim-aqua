# AquaGuard AI Agent Guide

## Architecture

The project is a Vite-powered React single-page application deployed on Netlify. The browser UI calls friendly `/api/*` routes provided by Netlify Functions. Persistent HaaS subscription, invoice, and chat records use Netlify Database through the Drizzle adapter.

## Key Directories

- `src/`: React application and global design system.
- `public/`: Official brand assets served without transformation.
- `netlify/functions/`: Server-side API endpoints using modern Netlify Function syntax.
- `db/`: Drizzle database client and schema definitions.
- `netlify/database/migrations/`: Generated database migrations. Generate these with Drizzle Kit; do not hand-edit snapshots.

## Conventions

- Use Indonesian for all customer-facing operational copy.
- Keep the official AquaGuard logo at `public/aquaguard-logo.png` unchanged.
- Preserve the mobile-first 8px spacing rhythm, rounded 16–20px cards, and calm ocean/aqua palette.
- Use modern `Request`/`Response` Netlify Functions with in-code route configuration.
- Store persistent records in Netlify Database, never local JSON or in-memory server state.
- Install both `drizzle-orm` and `drizzle-kit` from the `@beta` release line while the Netlify adapter requires it.
- After changing `db/schema.ts`, run `pnpm exec drizzle-kit generate --name <description>` and commit the generated migration.

## Non-obvious Decisions

The current product is a competition-ready interactive demo, so login and payment collection are simulated while subscription state is genuinely persisted. AquaBot uses a fixed demo telemetry context for Kolam B and stores conversation records. A successful demo payment immediately restores access, matching the intended automated HaaS cut-off flow.
