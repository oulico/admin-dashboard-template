## [2026-04-07] T1: Scaffold
- TanStack Start `react-start-basic` could not resolve without a template registry, so the SPA-safe manual Vite path was the reliable fallback.
- `@tanstack/router-plugin/vite` now exports `tanstackRouter`; the older `TanStackRouterVite` alias is deprecated and triggers diagnostics.
- Adding `@types/node` plus `"types": ["node"]` was necessary for Vite config files that import `node:path` and `node:url`.

## [2026-04-07] T2: OpenAPI + Type Generation
- `openapi-typescript` generated `src/shared/api/generated/api.d.ts` cleanly from the root `openapi.yaml`.
- Keeping the spec DTO-only avoided leaking internal DB fields into the generated client types.
## [2026-04-07] T3: httpClient + errorHandler
- Added native-fetch ApiError/httpClient barrel with private cookie helper and 401 redirect behavior.
- Fixed a pre-existing TanStack Router typing issue in src/routes/index.tsx so npx tsc --noEmit passes.
- Verified no axios remains under src/shared/api and getCookieValue stays unexported.

## [2026-04-07] T4: auth + queryClient
- Added shared auth helpers for cookie lookup, JWT expiry checks, and login redirect on missing/expired tokens.
- Added a singleton React Query client with light retry defaults and shared barrels/placeholders for future exports.
- Kept the shared lib focused: no auth state context, refresh flow, localStorage, or global query error handlers.
