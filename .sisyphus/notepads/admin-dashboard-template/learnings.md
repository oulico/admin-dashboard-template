## [2026-04-07] T1: Scaffold
- TanStack Start `react-start-basic` could not resolve without a template registry, so the SPA-safe manual Vite path was the reliable fallback.
- `@tanstack/router-plugin/vite` now exports `tanstackRouter`; the older `TanStackRouterVite` alias is deprecated and triggers diagnostics.
- Adding `@types/node` plus `"types": ["node"]` was necessary for Vite config files that import `node:path` and `node:url`.
