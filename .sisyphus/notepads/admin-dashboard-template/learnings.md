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

## [2026-04-07] T5: UserEntity TDD
- RED failed as expected until `UserEntity` existed; GREEN passed with a minimal schema-only domain model.
- Zod deprecation hints from `.uuid()`/`.email()` were avoided by using explicit regex validation so diagnostics stay clean.
- `UserEntity.ts` stays dependency-light with a single `zod` import and no extra domain behavior.

## [2026-04-07] T6: TokenEntity TDD
- RED correctly failed on the missing `TokenEntity` module before the schema was added.
- `TokenEntity` stayed minimal: only `token` and `expiresAt`, with a single `zod` import and no auth decoding or user linkage.
- `z.string().datetime()` was sufficient for ISO expiry validation and kept the domain model simple.

## [2026-04-07] T7: ESLint + dep-cruiser
- ESLint 10.2.0 requires `jiti` devDep to load `eslint.config.ts` (TS config files).
- `typescript-eslint` v8.58.0 (unified package) works with ESLint 10; no need for separate `@typescript-eslint/eslint-plugin` + `@typescript-eslint/parser`.
- `eslint-plugin-boundaries` v6.0.2 flat config: use `pattern: ['shared']` in folder mode (default) for FSD element matching.
- dependency-cruiser v17 backreferences use `$1` syntax (not `\\1`) in `pathNot` to reference `from.path` capture groups.
- dependency-cruiser v17 removed `--validate` flag; use `--config <file>` only.

## [2026-04-07] T8: GitHub Actions
- GitHub Actions workflows can stay credential-free by using only `${{ secrets.* }}` for AWS/S3 deployment inputs.
- The OpenAPI sync workflow needs an explicit step id/output for breaking-change text if the PR body references it.

## [2026-04-07] T9: Users ExternalResources
- Generated users types live under `paths['/users']` and `paths['/users/{id}']`, with DTO payloads nested at `requestBody.content['application/json']` and response payloads at `responses[200|201].content['application/json']`.
- `UserDTO` can be derived from the GET /users/{id} or POST/PUT response shapes; the feature boundary keeps shared/generated imports isolated to `UsersApi.types.ts`.

## [2026-04-07] T10: Auth ExternalResources
- Generated auth types live under `paths['/auth/login']`; `LoginRequest` comes from `post.requestBody.content['application/json']` and `TokenResponse` comes from `post.responses[200].content['application/json']`.

## [2026-04-07] T11: RemoteUsersGateway TDD
- `vi.mock('../../../../externalResources/UsersApi/UsersApi')` matched the gateway-to-externalResources relative path; importing the mocked `UsersApi` after the mock kept the spyable methods stable.

## [2026-04-07] T12: InMemoryUsersGateway TDD
- `crypto.randomUUID()` works out of the box in vitest's jsdom environment — no polyfill needed.
- InMemory gateway skips zod schema validation entirely; seed UUIDs don't need to match the strict UUID regex from `UserEntitySchema`.
- 7 tests cover all 5 CRUD operations including error paths; no mocking required since everything is pure in-memory Map operations.

## [2026-04-07] T13: RemoteAuthGateway
- Remote auth now validates the login response with `TokenEntitySchema.parse()` before returning it, keeping the feature boundary strict.
- Client-side cookie writes can only set `Secure` and `SameSite`; `httpOnly` still has to come from the server `Set-Cookie` header.

## [2026-04-07] T14: usersRepository
- TanStack Query v5 uses object-form `useQuery({ queryKey, queryFn })` — no positional args.
- `invalidateQueries({ queryKey })` takes an object with `queryKey` (not a bare array).
- Gateway instances are module-level singletons, not React state — avoids re-instantiation on every render.

## [2026-04-07] T15: authRepository
- Added centralized `AUTH_KEYS` plus `useLoginMutation` as a thin gateway-backed mutation hook.
- Kept auth repository scope narrow: no session query, logout, refresh, or cache invalidation.

## [2026-04-07] T16: Users Selectors TDD
- `vi.mock('../../repositories/usersRepository/usersRepository')` matched the selector-to-repository relative path from `useUsersSelector.spec.ts`.
- `renderHook(() => useUsersSelector())` worked without a wrapper because the repository hook was fully mocked, so no React Query provider was needed.

## [2026-04-07] T17: Users Use Cases TDD
- `vi.mock('../../repositories/usersRepository/usersRepository', () => ({ useCreateUserMutation: vi.fn() }))` kept the use case spec isolated from React Query.
- `mutateAsync` was the only mutation method needed in the use case wrapper; `isPending` passed straight through as the loading flag.

## [2026-04-07] T18: Auth useLoginUseCase
- Wrapped `useLoginMutation` in a thin use case that redirects to `/users` after a successful login and keeps errors bubbling to the view.
- Kept the auth feature boundary clean: no logout flow, no users-feature imports, and only the new use-case barrels were added.
