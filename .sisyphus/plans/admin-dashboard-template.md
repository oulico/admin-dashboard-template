# Admin Dashboard Template — Full Build Plan

## TL;DR

> **Quick Summary**: Build an admin dashboard template from scratch using TanStack Start (SPA mode) + TanStack Router, Feature-Sliced Design, and Clean Architecture. Two features: users (full CRUD) and auth (login). Optimized for AI-assisted development — each feature slice is fully self-contained.
>
> **Deliverables**:
> - Complete project scaffold with TanStack Start (SPA), Vite, TypeScript strict
> - `shared/` layer: httpClient (native fetch), auth utilities, queryClient
> - `features/users/` — full Clean Architecture stack (Entity → ExternalResources → Gateway → Repository → Selectors → UseCases → Views) with CRUD
> - `features/auth/` — login flow with JWT
> - TanStack Router file-based routes
> - OpenAPI schema + openapi-typescript code generation pipeline
> - ESLint boundaries + dependency-cruiser for architecture enforcement
> - GitHub Actions (OpenAPI sync + S3 deploy)
> - README with AI agent usage guide
>
> **Estimated Effort**: Large
> **Parallel Execution**: YES — 9 waves
> **Critical Path**: T1 → T3 → T9 → T11 → T14 → T16 → T19 → T22 → F1-F4

---

## Context

### Original Request
Build an admin dashboard template from scratch in an empty directory. TanStack Start + TanStack Router (SPA, no SSR), Feature-Sliced Design, Clean Architecture units inside each feature slice. Two features: users (full CRUD) and auth (login). Deployment target: S3 static. Reference implementation available at `../frontend-clean-architecture-react-tanstack-react-query/`.

### Interview Summary
**Key Discussions**:
- **Test Strategy**: TDD (Red-Green-Refactor) — write failing tests first, then implement
- **UserForm**: Create + Edit form — single component that handles both modes. Edit mode uses `useUserByIdSelector` to populate fields. Requires `useUpdateUserUseCase` (not in original phases but necessary)
- **Architecture**: FSD layers (shared → features → routes), Clean Architecture within features. Strict boundaries enforced by ESLint + dep-cruiser

**Research Findings**:
- Working directory is empty (confirmed)
- Reference repo present at expected path with Gateway, Repository, Selector, UseCase, Controller/Presenter patterns

### Metis Review
**Identified Gaps** (all addressed):

| Gap | Classification | Resolution |
|---|---|---|
| TanStack Start SPA mode complexity | Default Applied | Use TanStack Start. If SPA mode proves problematic, fall back to Vite + TanStack Router plugin. Pin versions. |
| Resource switching (runtime vs build-time) | Auto-Resolved | User spec says `VITE_USE_MOCK=true` env var. No Zustand needed. Build-time toggle. |
| Auth httpOnly cookie mechanism | Auto-Resolved | Client reads non-httpOnly cookie via `document.cookie`. Server (Spring Boot) sets actual httpOnly cookie via response header. Client check is UX-only. |
| 401 handling | Auto-Resolved | Already in httpClient.ts: redirect to `/login` on 401. |
| OpenAPI types integration flow | Auto-Resolved | `XxxApi.types.ts` re-exports from `shared/api/generated/api.d.ts`. Only place that touches generated types. |
| Test infrastructure scope | Default Applied | Use vitest + @testing-library/react only. No factory-t, no custom matchers. Simpler fits a template. |
| CRUD completeness | Auto-Resolved | Create + Read (list/single) + Update + Delete. No pagination, bulk ops, search, or filter. |
| Reference uses Nominal ID types | Default Applied | Follow user spec: plain `z.string().uuid()`. No nominal types. |
| Reference uses Zustand for presentation state | Default Applied | Excluded. VITE_USE_MOCK env var replaces Zustand resource switching. |
| Auth feature has no reference pattern | Guardrail Added | Auth tasks include extra-detailed references and explicit flow diagrams. |

---

## Work Objectives

### Core Objective
Create a production-quality admin dashboard template that demonstrates TanStack Start + FSD + Clean Architecture integration, optimized so AI agents need only read `src/features/[name]/` per task.

### Concrete Deliverables
- Runnable project: `npm run dev` with `VITE_USE_MOCK=true` works without backend
- `npm run build` produces static `/dist` for S3 deployment
- `npm run generate:api` regenerates API types from OpenAPI schema
- `npm run test` runs vitest with all tests passing
- 2 features (users + auth) following identical architecture patterns
- ESLint + dep-cruiser configs enforcing FSD boundaries

### Definition of Done
- [ ] `npx tsc --noEmit` → 0 errors
- [ ] `npx vitest run` → all tests pass, 0 failures
- [ ] `npm run build` → exit 0, `dist/` contains HTML entry
- [ ] `VITE_USE_MOCK=true npm run dev` → app starts, users list renders with mock data
- [ ] `npx depcruise --config ./dependency-cruiser.config.cjs ./src` → 0 violations
- [ ] No cross-feature imports in `src/features/`
- [ ] `shared/api/generated/` imported ONLY from `features/*/externalResources/*/XxxApi.types.ts`

### Must Have
- Both Remote and InMemory Gateway implementations for users feature
- InMemory mode works end-to-end without any backend
- TDD test coverage for: Entities, Gateways (both), Selectors, Use Cases
- All query keys in `*RepositoryKeys.ts` files
- zod validation at RemoteGateway boundary only
- TypeScript strict mode, zero `any`

### Must NOT Have (Guardrails)
- No axios — native fetch only (wrapped in httpClient)
- No orval, Zodios, openapi-zod-client, or openapi-fetch
- No SSR, no server functions, no server-side rendering
- No Zustand or any additional state management library
- No CSS framework, CSS modules, styled-components, or Tailwind — bare inline styles or minimal CSS only
- No shared UI component library (no Button, Input, Table, Modal components)
- No error boundaries, global error toast, or notification system
- No pagination, search, filter, or sort on users list
- No middleware pattern
- No React Context for auth state
- No additional npm packages beyond what's strictly needed
- No `as any`, `@ts-ignore`, or `// @ts-expect-error` workarounds
- No excessive JSDoc/comments — code should be self-documenting
- No example/demo data beyond what InMemoryGateway seeds require (3 users)

---

## Verification Strategy

> **ZERO HUMAN INTERVENTION** — ALL verification is agent-executed. No exceptions.

### Test Decision
- **Infrastructure exists**: NO (greenfield — vitest will be set up in T1)
- **Automated tests**: TDD (Red-Green-Refactor)
- **Framework**: vitest + @testing-library/react + @testing-library/jest-dom
- **TDD applies to**: Entity, Gateway (Remote + InMemory), Selectors, Use Cases
- **NOT TDD**: Config/infra tasks (T1-T4, T7-T10, T13, T15, T22-T23), Views (T19-T21), Repository (T14 — TanStack Query wrapper)

### QA Policy
Every task MUST include agent-executed QA scenarios.
Evidence saved to `.sisyphus/evidence/task-{N}-{scenario-slug}.{ext}`.

- **Config/Build tasks**: Use Bash — verify file exists, command succeeds, output matches
- **TDD tasks**: Use Bash — `npx vitest run [file]` with exact pass/fail counts
- **React components**: Use Bash — `npx tsc --noEmit` + vitest for hook tests
- **Integration**: Use Bash — `VITE_USE_MOCK=true npm run dev &` then curl or Playwright for smoke tests

---

## Execution Strategy

### Parallel Execution Waves

> Maximize throughput by grouping independent tasks into parallel waves.
> Each wave completes before the next begins.
> Clean Architecture layers create a sequential dependency chain within each feature,
> but users and auth features run in parallel at each layer.

```
Wave 1 (Foundation — sequential):
└── T1: Project scaffolding + dependency installation [quick]

Wave 2 (Infrastructure — 7 parallel):
├── T2: OpenAPI schema + type generation [quick]
├── T3: Shared API layer (httpClient + errorHandler) [quick]
├── T4: Shared lib (auth + queryClient) [quick]
├── T5: Users Entity + zod schema [TDD] [quick]
├── T6: Auth Entity + zod schema [TDD] [quick]
├── T7: ESLint boundaries + dep-cruiser config [unspecified-high]
└── T8: GitHub Actions + .env.example [quick]

Wave 3 (External resources + Gateway interfaces — 2 parallel):
├── T9: Users externalResources + UsersGateway interface [quick] (deps: T2, T3, T5)
└── T10: Auth externalResources + AuthGateway interface [quick] (deps: T2, T3, T6)

Wave 4 (Gateway implementations — 3 parallel):
├── T11: Users RemoteUsersGateway [TDD] [deep] (deps: T9)
├── T12: Users InMemoryUsersGateway [TDD] [unspecified-high] (deps: T9)
└── T13: Auth RemoteAuthGateway + useAuthGateway hook [quick] (deps: T10)

Wave 5 (Repository layer — 2 parallel):
├── T14: Users useUsersGateway hook + Repository [unspecified-high] (deps: T11, T12)
└── T15: Auth Repository [quick] (deps: T13)

Wave 6 (Selectors + Use Cases — 3 parallel):
├── T16: Users Selectors [TDD] [quick] (deps: T14)
├── T17: Users Use Cases [TDD] [quick] (deps: T14)
└── T18: Auth Use Cases [quick] (deps: T15)

Wave 7 (Views — 3 parallel):
├── T19: Users container [visual-engineering] (deps: T16, T17)
├── T20: UserForm container [visual-engineering] (deps: T16, T17)
└── T21: LoginForm container [visual-engineering] (deps: T18)

Wave 8 (Integration — 2 parallel):
├── T22: Feature barrels + TanStack Router routes [quick] (deps: T19, T20, T21)
└── T23: README [writing] (deps: all prior tasks)

Wave FINAL (Verification — 4 parallel, then user approval):
├── F1: Plan compliance audit [oracle]
├── F2: Code quality review [unspecified-high]
├── F3: Real QA testing [unspecified-high]
└── F4: Scope fidelity check [deep]
→ Present results → Get explicit user okay
```

### Dependency Matrix

| Task | Depends On | Blocks | Wave |
|---|---|---|---|
| T1 | — | T2-T8 | 1 |
| T2 | T1 | T9, T10 | 2 |
| T3 | T1 | T9, T10 | 2 |
| T4 | T1 | — | 2 |
| T5 | T1 | T9, T11, T12 | 2 |
| T6 | T1 | T10, T13 | 2 |
| T7 | T1 | — | 2 |
| T8 | T1 | — | 2 |
| T9 | T2, T3, T5 | T11, T12 | 3 |
| T10 | T2, T3, T6 | T13 | 3 |
| T11 | T9 | T14 | 4 |
| T12 | T9 | T14 | 4 |
| T13 | T10 | T15 | 4 |
| T14 | T11, T12 | T16, T17 | 5 |
| T15 | T13 | T18 | 5 |
| T16 | T14 | T19, T20 | 6 |
| T17 | T14 | T19, T20 | 6 |
| T18 | T15 | T21 | 6 |
| T19 | T16, T17 | T22 | 7 |
| T20 | T16, T17 | T22 | 7 |
| T21 | T18 | T22 | 7 |
| T22 | T19, T20, T21 | F1-F4 | 8 |
| T23 | all | F1-F4 | 8 |

> Critical Path: T1 → T3 → T9 → T11 → T14 → T16 → T19 → T22 → F1-F4
> Parallel Speedup: ~62% faster than sequential (9 waves vs 23 sequential tasks)
> Max Concurrent: 7 (Wave 2)

### Agent Dispatch Summary

| Wave | Tasks | Dispatch |
|---|---|---|
| **1** | 1 | T1 → `quick` |
| **2** | 7 | T2-T6, T8 → `quick`; T7 → `unspecified-high` |
| **3** | 2 | T9, T10 → `quick` |
| **4** | 3 | T11 → `deep`; T12 → `unspecified-high`; T13 → `quick` |
| **5** | 2 | T14 → `unspecified-high`; T15 → `quick` |
| **6** | 3 | T16, T17, T18 → `quick` |
| **7** | 3 | T19, T20, T21 → `visual-engineering` |
| **8** | 2 | T22 → `quick`; T23 → `writing` |
| **FINAL** | 4 | F1 → `oracle`; F2, F3 → `unspecified-high`; F4 → `deep` |

---

## TODOs

> Implementation + Test = ONE Task. Never separate.
> EVERY task MUST have: Recommended Agent Profile + Parallelization info + QA Scenarios.
> **A task WITHOUT QA Scenarios is INCOMPLETE. No exceptions.**
>
> **TDD Convention**: Tasks marked [TDD] follow RED → GREEN → REFACTOR.
> Tasks NOT marked [TDD] are config/infrastructure — no test-first workflow.

- [ ] 1. Project Scaffolding + Dependency Installation

  **What to do**:
  - Initialize a new project in the working directory (which is already empty)
  - Try `npm create tanstack@latest . -- --template react-start-basic` first. If this fails or produces SSR-oriented output, fall back to manual Vite + TanStack Router scaffold
  - Install production dependencies: `@tanstack/react-router`, `@tanstack/react-query`, `zod`, `react`, `react-dom`. Include `@tanstack/react-start` only if the template scaffold uses it; otherwise use `@tanstack/router-plugin` for file-based routing
  - Install dev dependencies: `openapi-typescript`, `@tanstack/router-devtools`, `@tanstack/react-query-devtools`, `vite`, `@vitejs/plugin-react`, `typescript`, `vitest`, `@testing-library/react`, `@testing-library/jest-dom`, `eslint`, `eslint-plugin-boundaries`, `dependency-cruiser`
  - Configure `vite.config.ts`: SPA static output to `/dist`, no SSR adapter. Include TanStack Router Vite plugin for file-based route generation
  - Configure `tsconfig.json`: strict mode, path alias `"@/*": ["./src/*"]`, target ES2020+, jsx react-jsx
  - Add to `package.json` scripts: `"generate:api"`, `"dev"`, `"build"`, `"test"`, `"dep-graph"` (as specified in Phase 1)
  - Create `src/` directory structure stub: `src/shared/`, `src/features/`, `src/routes/`
  - Create `vitest.config.ts` (or vitest section in vite.config.ts) with: `globals: true`, `environment: 'jsdom'`, path alias support

  **Must NOT do**:
  - Do NOT install axios, orval, Zodios, openapi-zod-client, or openapi-fetch
  - Do NOT configure SSR or server functions
  - Do NOT install Zustand or any state management library
  - Do NOT install Tailwind, styled-components, or any CSS framework
  - Do NOT create feature files (only directory stubs)
  - Do NOT add excessive boilerplate or example code

  **Recommended Agent Profile**:
  - **Category**: `quick`
    - Reason: Config file creation and npm commands — well-defined, no complex logic
  - **Skills**: []
    - No special skills needed — standard npm/vite setup
  - **Skills Evaluated but Omitted**:
    - `frontend-ui-ux`: No UI work in this task

  **Parallelization**:
  - **Can Run In Parallel**: NO
  - **Parallel Group**: Wave 1 (solo)
  - **Blocks**: T2, T3, T4, T5, T6, T7, T8 (all Wave 2 tasks)
  - **Blocked By**: None (first task)

  **References**:

  **Pattern References**:
  - None — greenfield project

  **API/Type References**:
  - None

  **External References**:
  - TanStack Start docs: `https://tanstack.com/start/latest` — SPA mode configuration
  - TanStack Router docs: `https://tanstack.com/router/latest` — file-based routing setup
  - Vite docs: `https://vite.dev/config/` — build output configuration
  - Vitest docs: `https://vitest.dev/config/` — test configuration with path aliases

  **WHY Each Reference Matters**:
  - TanStack Start docs: Needed to understand SPA-only mode. If `react-start-basic` template includes SSR, you need to know how to strip it
  - TanStack Router docs: File-based routing plugin setup in vite.config.ts
  - Vite docs: Ensure `build.outDir` is `dist` and no SSR adapter is present
  - Vitest docs: Ensure path alias `@/` works in test files too

  **Acceptance Criteria**:

  **QA Scenarios (MANDATORY)**:

  ```
  Scenario: Project initializes and dependencies install
    Tool: Bash
    Preconditions: Empty working directory
    Steps:
      1. Run `ls package.json` → file exists
      2. Run `node -e "const p = require('./package.json'); console.log(p.scripts.dev)"` → outputs a dev command
      3. Run `node -e "const p = require('./package.json'); console.log(p.scripts['generate:api'])"` → outputs generate:api command
      4. Run `ls node_modules/@tanstack/react-router/package.json` → file exists
      5. Run `ls node_modules/zod/package.json` → file exists
    Expected Result: All 5 checks pass — project scaffold is complete with all dependencies
    Failure Indicators: Any file not found, any script missing
    Evidence: .sisyphus/evidence/task-1-project-init.txt

  Scenario: TypeScript strict mode compiles
    Tool: Bash
    Preconditions: package.json and tsconfig.json exist
    Steps:
      1. Run `npx tsc --noEmit --showConfig | grep '"strict"'` → outputs `"strict": true`
      2. Run `node -e "const t = require('./tsconfig.json'); console.log(JSON.stringify(t.compilerOptions.paths))"` → includes `@/*`
    Expected Result: Strict mode enabled and path alias configured
    Failure Indicators: strict is false or paths missing
    Evidence: .sisyphus/evidence/task-1-tsconfig-check.txt

  Scenario: Vite builds to /dist without SSR
    Tool: Bash
    Preconditions: vite.config.ts exists
    Steps:
      1. Run `grep -c "ssr" vite.config.ts` → 0 (no SSR references) OR any SSR config is explicitly disabled
      2. Run `grep "outDir" vite.config.ts` → contains "dist"
    Expected Result: Vite configured for SPA static output
    Failure Indicators: SSR adapter present, outDir not set to dist
    Evidence: .sisyphus/evidence/task-1-vite-config.txt

  Scenario: No forbidden dependencies installed
    Tool: Bash
    Preconditions: node_modules exists
    Steps:
      1. Run `ls node_modules/axios 2>/dev/null && echo "FAIL" || echo "PASS"` → PASS
      2. Run `ls node_modules/zustand 2>/dev/null && echo "FAIL" || echo "PASS"` → PASS
      3. Run `ls node_modules/orval 2>/dev/null && echo "FAIL" || echo "PASS"` → PASS
    Expected Result: All 3 output PASS — no forbidden packages
    Failure Indicators: Any outputs FAIL
    Evidence: .sisyphus/evidence/task-1-no-forbidden-deps.txt
  ```

  **Commit**: YES
  - Message: `chore: scaffold project with TanStack Start + deps`
  - Files: `package.json`, `tsconfig.json`, `vite.config.ts`, `vitest.config.ts` (or equivalent), `src/` stubs
  - Pre-commit: `npx tsc --noEmit` (may produce warnings about empty project — acceptable)

---

- [ ] 2. OpenAPI Schema + Type Generation

  **What to do**:
  - Create `openapi.yaml` at project root with the full schema as specified in Phase 2:
    - `openapi: 3.0.3`, `info: { title: Admin API, version: 1.0.0 }`
    - Tags: users, auth
    - Paths: `/users` (GET list, POST create), `/users/{id}` (GET, PUT, DELETE), `/auth/login` (POST)
    - Schemas: `UserDTO` (id, name, email), `CreateUserDTO` (name, email), `UpdateUserDTO` (name?, email?), `TokenResponse` (token, expiresAt), `LoginRequest` (email, password)
    - All fields properly typed with `format` where applicable (email format, uuid for id)
    - NEVER include password_hash or internal DB fields
  - Run `npm run generate:api` to produce `src/shared/api/generated/api.d.ts`
  - Create `src/shared/api/generated/README.md` with instructions: "Auto-generated. Do NOT edit. Run `npm run generate:api` to regenerate."
  - Verify the generated types include paths and components as expected

  **Must NOT do**:
  - Do NOT manually edit `api.d.ts` after generation
  - Do NOT add endpoints beyond what's specified (no `/users/search`, no `/auth/refresh`)
  - Do NOT include `password` field in UserDTO
  - Do NOT add `operationId` — keep the schema minimal

  **Recommended Agent Profile**:
  - **Category**: `quick`
    - Reason: Create YAML file + run npm script — straightforward, code provided in spec
  - **Skills**: []
  - **Skills Evaluated but Omitted**:
    - None relevant

  **Parallelization**:
  - **Can Run In Parallel**: YES
  - **Parallel Group**: Wave 2 (with T3, T4, T5, T6, T7, T8)
  - **Blocks**: T9, T10
  - **Blocked By**: T1

  **References**:

  **Pattern References**:
  - Phase 2 in the user's spec provides the exact OpenAPI schema structure

  **External References**:
  - openapi-typescript docs: `https://openapi-ts.dev/` — CLI usage and output format
  - OpenAPI 3.0 spec: `https://spec.openapis.org/oas/v3.0.3` — schema syntax reference

  **WHY Each Reference Matters**:
  - openapi-typescript generates `.d.ts` with a `paths` object keyed by URL path. Each path has methods → responses → content. The generated types will be consumed by `XxxApi.types.ts` files using this exact access pattern: `paths['/users']['get']['responses']['200']['content']['application/json']`

  **Acceptance Criteria**:

  **QA Scenarios (MANDATORY)**:

  ```
  Scenario: OpenAPI schema is valid and types generate
    Tool: Bash
    Preconditions: T1 complete, npm scripts available
    Steps:
      1. Run `ls openapi.yaml` → file exists
      2. Run `npm run generate:api` → exit code 0
      3. Run `ls src/shared/api/generated/api.d.ts` → file exists
      4. Run `grep "UserDTO" src/shared/api/generated/api.d.ts` → at least 1 match
      5. Run `grep "TokenResponse" src/shared/api/generated/api.d.ts` → at least 1 match
    Expected Result: Schema generates types with UserDTO and TokenResponse present
    Failure Indicators: generate:api fails, types file missing, schemas not in output
    Evidence: .sisyphus/evidence/task-2-openapi-generate.txt

  Scenario: No password fields in generated types
    Tool: Bash
    Preconditions: api.d.ts generated
    Steps:
      1. Run `grep -i "password_hash" openapi.yaml` → 0 matches
      2. Run `grep -i "password_hash" src/shared/api/generated/api.d.ts` → 0 matches
    Expected Result: No internal DB fields leak into API schema
    Failure Indicators: Any match found
    Evidence: .sisyphus/evidence/task-2-no-password-hash.txt

  Scenario: README warning exists
    Tool: Bash
    Preconditions: Generation complete
    Steps:
      1. Run `cat src/shared/api/generated/README.md` → contains "Do NOT edit"
    Expected Result: Warning file present
    Failure Indicators: File missing or no warning text
    Evidence: .sisyphus/evidence/task-2-readme-warning.txt
  ```

  **Commit**: YES
  - Message: `chore: add OpenAPI schema and generate types`
  - Files: `openapi.yaml`, `src/shared/api/generated/api.d.ts`, `src/shared/api/generated/README.md`
  - Pre-commit: `npm run generate:api`

---

- [ ] 3. Shared API Layer (httpClient + errorHandler)

  **What to do**:
  - Create `src/shared/api/errorHandler.ts`:
    - `ApiError` class extending `Error` with `status: number` property
    - `isApiError` type guard function
    - Keep it minimal — no error categorization, no retry logic
  - Create `src/shared/api/httpClient.ts`:
    - Export `HttpMethod`, `HttpClientOptions`, `HttpClient` types
    - Export `createHttpClient(baseUrl: string): HttpClient` factory function
    - Implementation uses native `fetch` — NO axios
    - Automatically attaches JWT from cookie (`document.cookie` parsed for `token`)
    - Sets `Content-Type: application/json` by default
    - Handles query params via `URL.searchParams`
    - On 401: redirect to `/login` via `window.location.href`
    - On non-ok: throw `ApiError` with status and message from response body
    - On 204: return `undefined` (no body)
    - Private `getCookieValue` helper function (not exported)
  - Create `src/shared/api/index.ts` barrel export

  **Must NOT do**:
  - Do NOT install or import axios
  - Do NOT add retry logic, request interceptors, or middleware pattern
  - Do NOT add request/response logging
  - Do NOT add abort controller / cancellation support
  - Do NOT export `getCookieValue` — it's an internal helper

  **Recommended Agent Profile**:
  - **Category**: `quick`
    - Reason: 2 implementation files + 1 barrel, code provided in spec
  - **Skills**: []
  - **Skills Evaluated but Omitted**:
    - None relevant

  **Parallelization**:
  - **Can Run In Parallel**: YES
  - **Parallel Group**: Wave 2 (with T2, T4, T5, T6, T7, T8)
  - **Blocks**: T9, T10
  - **Blocked By**: T1

  **References**:

  **Pattern References**:
  - Phase 3 (items 1-2) in user's spec provides exact implementation code

  **API/Type References**:
  - `src/shared/api/errorHandler.ts` → used by httpClient.ts (import ApiError)

  **External References**:
  - MDN Fetch API: `https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API` — native fetch reference
  - MDN URL API: `https://developer.mozilla.org/en-US/docs/Web/API/URL` — URL constructor for base URL + path joining

  **WHY Each Reference Matters**:
  - The httpClient is the foundation all API calls go through. Every Gateway's RemoteXxxGateway will use a httpClient instance created by `createHttpClient`. The 401 redirect and ApiError patterns propagate to every feature.

  **Acceptance Criteria**:

  **QA Scenarios (MANDATORY)**:

  ```
  Scenario: httpClient module compiles and exports correctly
    Tool: Bash
    Preconditions: T1 complete
    Steps:
      1. Run `npx tsc --noEmit` → exit 0 (or only pre-existing warnings)
      2. Run `grep "export.*createHttpClient" src/shared/api/httpClient.ts` → 1 match
      3. Run `grep "export.*ApiError" src/shared/api/errorHandler.ts` → 1 match
      4. Run `grep "export.*isApiError" src/shared/api/errorHandler.ts` → 1 match
    Expected Result: Both files compile and export expected symbols
    Failure Indicators: Type errors or missing exports
    Evidence: .sisyphus/evidence/task-3-shared-api-compile.txt

  Scenario: No axios imports anywhere
    Tool: Bash
    Preconditions: Files created
    Steps:
      1. Run `grep -r "axios" src/shared/` → 0 matches
      2. Run `grep -r "import.*from.*axios" src/` → 0 matches
    Expected Result: Zero axios references
    Failure Indicators: Any match
    Evidence: .sisyphus/evidence/task-3-no-axios.txt

  Scenario: getCookieValue is NOT exported
    Tool: Bash
    Preconditions: httpClient.ts exists
    Steps:
      1. Run `grep "export.*getCookieValue" src/shared/api/httpClient.ts` → 0 matches
      2. Run `grep "getCookieValue" src/shared/api/httpClient.ts` → matches exist (it's used internally)
    Expected Result: Function exists but is not exported
    Failure Indicators: getCookieValue is exported
    Evidence: .sisyphus/evidence/task-3-private-helper.txt
  ```

  **Commit**: YES
  - Message: `feat(shared): add httpClient and errorHandler`
  - Files: `src/shared/api/httpClient.ts`, `src/shared/api/errorHandler.ts`, `src/shared/api/index.ts`
  - Pre-commit: `npx tsc --noEmit`

---

- [ ] 4. Shared Lib (Auth Utilities + QueryClient)

  **What to do**:
  - Create `src/shared/lib/auth.ts`:
    - `getCookie(name: string): string | null` — parse `document.cookie`, handle SSR-safe check (`typeof document === 'undefined'`)
    - `isTokenExpired(token: string): boolean` — decode JWT payload via `atob(token.split('.')[1])`, compare `exp * 1000 < Date.now()`. Return `true` on any parse error
    - `checkAuthAndRedirect(): void` — get token cookie, check expired, redirect to `/login` if invalid. Add comment: "NOTE: UX only — Spring validates JWT on every API call (real security)"
  - Create `src/shared/lib/queryClient.ts`:
    - Export singleton `queryClient` instance of `QueryClient`
    - Default options: `queries: { retry: 1, staleTime: 60_000 }`, `mutations: { retry: 0 }`
  - Create `src/shared/lib/index.ts` barrel export
  - Create `src/shared/types/index.ts` (empty for now, placeholder for shared types)
  - Create `src/shared/ui/index.ts` (empty for now, placeholder for shared UI)

  **Must NOT do**:
  - Do NOT add React Context for auth state
  - Do NOT add token refresh logic
  - Do NOT store tokens in localStorage
  - Do NOT add custom QueryClient error handlers or global callbacks
  - Do NOT create UI components in shared/ui/ (just the barrel file)

  **Recommended Agent Profile**:
  - **Category**: `quick`
    - Reason: Small utility files with code provided in spec
  - **Skills**: []
  - **Skills Evaluated but Omitted**:
    - None relevant

  **Parallelization**:
  - **Can Run In Parallel**: YES
  - **Parallel Group**: Wave 2 (with T2, T3, T5, T6, T7, T8)
  - **Blocks**: None directly (auth utilities used later by Views)
  - **Blocked By**: T1

  **References**:

  **Pattern References**:
  - Phase 3 (items 3-4) in user's spec provides exact implementation code

  **External References**:
  - TanStack Query docs: `https://tanstack.com/query/latest/docs/reference/QueryClient` — QueryClient configuration

  **WHY Each Reference Matters**:
  - queryClient is a singleton shared across the entire app. It's provided via `QueryClientProvider` in the root route. Every Repository hook uses this client.

  **Acceptance Criteria**:

  **QA Scenarios (MANDATORY)**:

  ```
  Scenario: Auth utilities compile and export correctly
    Tool: Bash
    Preconditions: T1 complete
    Steps:
      1. Run `npx tsc --noEmit` → exit 0
      2. Run `grep "export.*getCookie" src/shared/lib/auth.ts` → 1 match
      3. Run `grep "export.*isTokenExpired" src/shared/lib/auth.ts` → 1 match
      4. Run `grep "export.*checkAuthAndRedirect" src/shared/lib/auth.ts` → 1 match
      5. Run `grep "export.*queryClient" src/shared/lib/queryClient.ts` → 1 match
    Expected Result: All utilities exported and compile
    Failure Indicators: Missing exports or type errors
    Evidence: .sisyphus/evidence/task-4-shared-lib.txt

  Scenario: No localStorage or React Context usage
    Tool: Bash
    Preconditions: Files created
    Steps:
      1. Run `grep -r "localStorage" src/shared/` → 0 matches
      2. Run `grep -r "createContext" src/shared/` → 0 matches
      3. Run `grep -r "useContext" src/shared/` → 0 matches
    Expected Result: No forbidden state patterns
    Failure Indicators: Any match
    Evidence: .sisyphus/evidence/task-4-no-forbidden-state.txt
  ```

  **Commit**: YES
  - Message: `feat(shared): add auth utilities and queryClient`
  - Files: `src/shared/lib/auth.ts`, `src/shared/lib/queryClient.ts`, `src/shared/lib/index.ts`, `src/shared/types/index.ts`, `src/shared/ui/index.ts`
  - Pre-commit: `npx tsc --noEmit`

---

- [ ] 5. Users Entity + Zod Schema [TDD]

  **What to do**:
  - **RED**: Create `src/features/users/types/entities/UserEntity.spec.ts`:
    - Test that `UserEntitySchema.parse()` accepts valid data: `{ id: "valid-uuid", name: "John", email: "john@example.com" }`
    - Test that `UserEntitySchema.parse()` rejects invalid data: missing id, empty name, invalid email
    - Test that `UserEntity` type matches expected shape (compile-time check)
    - Run tests → should FAIL (module not found)
  - **GREEN**: Create `src/features/users/types/entities/UserEntity.ts`:
    - `UserEntitySchema = z.object({ id: z.string().uuid(), name: z.string().min(1), email: z.string().email() })`
    - `type UserEntity = z.infer<typeof UserEntitySchema>`
    - Add comment: "UserEntity is the domain model. DTO → UserEntity mapping is Gateway's responsibility."
    - Run tests → should PASS
  - **REFACTOR**: Review for any cleanup needed
  - Create barrel exports: `src/features/users/types/entities/index.ts`, `src/features/users/types/index.ts`

  **Must NOT do**:
  - Do NOT add fields beyond id, name, email (no createdAt, role, status)
  - Do NOT add methods to UserEntity — it's a plain type
  - Do NOT add Nominal ID types (keep it as `z.string().uuid()`)
  - Do NOT import from any other feature or from shared/api/generated/

  **Recommended Agent Profile**:
  - **Category**: `quick`
    - Reason: Single entity file + test, zod schema is straightforward
  - **Skills**: []
  - **Skills Evaluated but Omitted**:
    - None relevant

  **Parallelization**:
  - **Can Run In Parallel**: YES
  - **Parallel Group**: Wave 2 (with T2, T3, T4, T6, T7, T8)
  - **Blocks**: T9 (needs UserEntity type for Gateway interface)
  - **Blocked By**: T1

  **References**:

  **Pattern References**:
  - `../frontend-clean-architecture-react-tanstack-react-query/src/features/orders/types/entities/OrderEntity/OrderEntity.ts` — Entity pattern (adapt: reference uses Nominal types, we use plain string UUIDs)
  - Phase 4 in user's spec provides exact code

  **External References**:
  - Zod docs: `https://zod.dev/?id=primitives` — schema definition syntax

  **WHY Each Reference Matters**:
  - The reference shows the Entity type pattern. Key difference: reference uses `Nominal<string, "OrderEntityId">` for type-safe IDs. We deliberately use plain `z.string().uuid()` to keep the template simple. The executing agent should NOT copy the Nominal pattern.

  **Acceptance Criteria**:

  **If TDD:**
  - [ ] Test file created: `src/features/users/types/entities/UserEntity.spec.ts`
  - [ ] `npx vitest run src/features/users/types/entities/UserEntity.spec.ts` → PASS (at least 3 tests, 0 failures)

  **QA Scenarios (MANDATORY)**:

  ```
  Scenario: UserEntity schema validates correct data
    Tool: Bash
    Preconditions: T1 complete, vitest configured
    Steps:
      1. Run `npx vitest run src/features/users/types/entities/UserEntity.spec.ts` → exit 0
      2. Verify output contains "Tests  X passed" with 0 failures
    Expected Result: All entity tests pass — valid data accepted, invalid data rejected
    Failure Indicators: Any test failure
    Evidence: .sisyphus/evidence/task-5-entity-tests.txt

  Scenario: Entity has no external dependencies beyond zod
    Tool: Bash
    Preconditions: UserEntity.ts exists
    Steps:
      1. Run `grep "^import" src/features/users/types/entities/UserEntity.ts` → only `import { z } from 'zod'`
      2. Run `grep -c "import" src/features/users/types/entities/UserEntity.ts` → exactly 1
    Expected Result: Entity depends only on zod
    Failure Indicators: Additional imports found
    Evidence: .sisyphus/evidence/task-5-entity-deps.txt
  ```

  **Commit**: YES (2 commits for TDD)
  - Message 1: `test(users): add UserEntity schema tests`
  - Message 2: `feat(users): add UserEntity with zod schema`
  - Files: `src/features/users/types/entities/UserEntity.ts`, `src/features/users/types/entities/UserEntity.spec.ts`, barrel `index.ts` files
  - Pre-commit: `npx vitest run src/features/users/types/entities/`

---

- [ ] 6. Auth Entity + Zod Schema [TDD]

  **What to do**:
  - **RED**: Create `src/features/auth/types/entities/TokenEntity.spec.ts`:
    - Test that `TokenEntitySchema.parse()` accepts: `{ token: "jwt.token.here", expiresAt: "2025-12-31T23:59:59Z" }`
    - Test rejection of: missing token, empty token, missing expiresAt
    - Run tests → FAIL
  - **GREEN**: Create `src/features/auth/types/entities/TokenEntity.ts`:
    - `TokenEntitySchema = z.object({ token: z.string().min(1), expiresAt: z.string().datetime() })`
    - `type TokenEntity = z.infer<typeof TokenEntitySchema>`
    - Run tests → PASS
  - Create barrel exports: `src/features/auth/types/entities/index.ts`, `src/features/auth/types/index.ts`

  **Must NOT do**:
  - Do NOT add refreshToken, userId, or roles to TokenEntity
  - Do NOT import from users feature
  - Do NOT add token decoding logic to the entity (that belongs in shared/lib/auth.ts)

  **Recommended Agent Profile**:
  - **Category**: `quick`
    - Reason: Single entity file + test, mirrors T5 pattern exactly
  - **Skills**: []
  - **Skills Evaluated but Omitted**:
    - None relevant

  **Parallelization**:
  - **Can Run In Parallel**: YES
  - **Parallel Group**: Wave 2 (with T2, T3, T4, T5, T7, T8)
  - **Blocks**: T10 (needs TokenEntity type for Auth Gateway interface)
  - **Blocked By**: T1

  **References**:

  **Pattern References**:
  - `src/features/users/types/entities/UserEntity.ts` (from T5) — same pattern, just different schema
  - Phase 4 in spec for Entity pattern reference

  **WHY Each Reference Matters**:
  - Same pattern as UserEntity. The executing agent can directly mirror the structure.

  **Acceptance Criteria**:

  **If TDD:**
  - [ ] Test file created: `src/features/auth/types/entities/TokenEntity.spec.ts`
  - [ ] `npx vitest run src/features/auth/types/entities/TokenEntity.spec.ts` → PASS (at least 2 tests, 0 failures)

  **QA Scenarios (MANDATORY)**:

  ```
  Scenario: TokenEntity schema validates correct data
    Tool: Bash
    Preconditions: T1 complete
    Steps:
      1. Run `npx vitest run src/features/auth/types/entities/TokenEntity.spec.ts` → exit 0
      2. Verify output shows all tests passed
    Expected Result: Token entity tests pass
    Failure Indicators: Any test failure
    Evidence: .sisyphus/evidence/task-6-token-entity-tests.txt

  Scenario: Auth entity has no cross-feature imports
    Tool: Bash
    Preconditions: TokenEntity.ts exists
    Steps:
      1. Run `grep "features/users" src/features/auth/types/entities/TokenEntity.ts` → 0 matches
      2. Run `grep -c "import" src/features/auth/types/entities/TokenEntity.ts` → exactly 1 (only zod)
    Expected Result: Zero cross-feature imports
    Failure Indicators: Any match
    Evidence: .sisyphus/evidence/task-6-no-cross-feature.txt
  ```

  **Commit**: YES (2 commits for TDD)
  - Message 1: `test(auth): add TokenEntity schema tests`
  - Message 2: `feat(auth): add TokenEntity with zod schema`
  - Files: `src/features/auth/types/entities/TokenEntity.ts`, `src/features/auth/types/entities/TokenEntity.spec.ts`, barrel `index.ts` files
  - Pre-commit: `npx vitest run src/features/auth/types/entities/`

---

- [ ] 7. ESLint Boundaries + Dependency-Cruiser Config

  **What to do**:
  - Create `eslint.config.ts` (flat config format) with `eslint-plugin-boundaries` rules:
    - Define element types: `shared`, `features`, `routes`
    - Rule: `shared/` cannot import from `features/` or `routes/`
    - Rule: `features/[name]/` cannot import from other `features/[name2]/`
    - Rule: `features/*/externalResources/*/XxxApi.types.ts` is the ONLY scope allowed to import from `shared/api/generated/`
    - Rule: `routes/` imports only from `features/` (via barrel index.ts only, no deep imports)
    - Rule: Within a feature, inner layers cannot import from outer layers (entities cannot import from repositories, etc.)
  - Create `dependency-cruiser.config.cjs`:
    - Read reference: `../frontend-clean-architecture-react-tanstack-react-query/dependency-cruiser.config.cjs`
    - Adapt to our FSD structure: enforce `shared → features → routes` layer order
    - Add rule: forbid `features/*/` importing from `features/*/` (cross-feature)
    - Add rule: forbid any file outside `externalResources/` importing from `shared/api/generated/`
    - Add rule: forbid circular dependencies
  - Add `dependency-cruiser` to devDependencies if not already installed
  - Test: `npx depcruise --config ./dependency-cruiser.config.cjs ./src` should run (may have no violations yet since few files exist)

  **Must NOT do**:
  - Do NOT add Prettier config (out of scope)
  - Do NOT add husky or lint-staged (out of scope)
  - Do NOT add custom ESLint rules beyond boundary enforcement
  - Do NOT add overly strict ESLint rules that would slow development

  **Recommended Agent Profile**:
  - **Category**: `unspecified-high`
    - Reason: Config requires understanding FSD boundaries and dep-cruiser DSL. More complex than typical config files.
  - **Skills**: []
  - **Skills Evaluated but Omitted**:
    - None relevant

  **Parallelization**:
  - **Can Run In Parallel**: YES
  - **Parallel Group**: Wave 2 (with T2-T6, T8)
  - **Blocks**: None (verification tool, not a build dependency)
  - **Blocked By**: T1

  **References**:

  **Pattern References**:
  - `../frontend-clean-architecture-react-tanstack-react-query/dependency-cruiser.config.cjs` — dep-cruiser rule syntax and structure. Adapt paths from reference's flat structure to our FSD structure.
  - `../frontend-clean-architecture-react-tanstack-react-query/.eslintrc.cjs` — if exists, for boundaries plugin pattern (NOTE: file may be absent in reference repo — rely on eslint-plugin-boundaries docs instead)

  **External References**:
  - eslint-plugin-boundaries: `https://github.com/javierbrea/eslint-plugin-boundaries` — element types and rules configuration
  - dependency-cruiser docs: `https://github.com/sverweij/dependency-cruiser/blob/main/doc/rules-reference.md` — rule format

  **WHY Each Reference Matters**:
  - The reference dep-cruiser config has working rule syntax. Copy the rule structure but adapt path patterns to `src/shared/`, `src/features/[name]/`, `src/routes/`.
  - eslint-plugin-boundaries needs element type definitions matching our FSD layers.

  **Acceptance Criteria**:

  **QA Scenarios (MANDATORY)**:

  ```
  Scenario: dep-cruiser runs without config errors
    Tool: Bash
    Preconditions: T1 complete, dependency-cruiser installed
    Steps:
      1. Run `npx depcruise --config ./dependency-cruiser.config.cjs --validate ./src` → exit 0 (or exits with violations info, NOT config error)
      2. Verify output does NOT contain "ERROR" or "could not read" or "invalid configuration"
    Expected Result: dep-cruiser config parses and runs
    Failure Indicators: Config parse error
    Evidence: .sisyphus/evidence/task-7-depcruise-run.txt

  Scenario: ESLint config parses without errors
    Tool: Bash
    Preconditions: eslint.config.ts exists
    Steps:
      1. Run `npx eslint --print-config src/shared/lib/auth.ts 2>&1 | head -5` → outputs JSON config (not error)
    Expected Result: ESLint config loads
    Failure Indicators: Config parse error
    Evidence: .sisyphus/evidence/task-7-eslint-config.txt
  ```

  **Commit**: YES
  - Message: `chore: configure ESLint boundaries and dependency-cruiser`
  - Files: `eslint.config.ts`, `dependency-cruiser.config.cjs`
  - Pre-commit: `npx depcruise --config ./dependency-cruiser.config.cjs --validate ./src`

---

- [ ] 8. GitHub Actions Workflows + .env.example

  **What to do**:
  - Create `.github/workflows/sync-openapi.yml`:
    - Triggers: `repository_dispatch` (event: `openapi-updated`) + `workflow_dispatch` with `spec_url` input
    - Steps: checkout, backup openapi.yaml, download new spec via curl, run `oasdiff breaking` for diff, `npm ci && npm run generate:api`, create PR via `peter-evans/create-pull-request@v6` with breaking changes in body
    - Do NOT auto-merge the PR
  - Create `.github/workflows/deploy.yml`:
    - Trigger: push to main
    - Steps: checkout, `npm ci`, `npm run generate:api`, `npm run build`, configure AWS credentials, `aws s3 sync ./dist`, CloudFront invalidation
    - Use `${{ secrets.S3_BUCKET }}` and `${{ secrets.CF_DISTRIBUTION_ID }}` placeholders
  - Create `.env.example`:
    - `VITE_API_BASE_URL=http://localhost:8080`
    - `VITE_USE_MOCK=true`
  - Create `src/vite-env.d.ts` (or augment existing) with `ImportMetaEnv` type for VITE_ variables

  **Must NOT do**:
  - Do NOT add actual AWS credentials or secrets
  - Do NOT add auto-merge to the sync-openapi workflow
  - Do NOT add deployment environments or stages beyond what's specified
  - Do NOT add Terraform or CDK infrastructure code

  **Recommended Agent Profile**:
  - **Category**: `quick`
    - Reason: YAML workflow files with provided structure, env file
  - **Skills**: []
  - **Skills Evaluated but Omitted**:
    - None relevant

  **Parallelization**:
  - **Can Run In Parallel**: YES
  - **Parallel Group**: Wave 2 (with T2-T7)
  - **Blocks**: None
  - **Blocked By**: T1

  **References**:

  **Pattern References**:
  - Phase 14 in user's spec provides exact workflow structure

  **External References**:
  - peter-evans/create-pull-request: `https://github.com/peter-evans/create-pull-request` — PR creation from workflow
  - aws-actions/configure-aws-credentials: `https://github.com/aws-actions/configure-aws-credentials` — AWS auth

  **WHY Each Reference Matters**:
  - The workflow YAML syntax and action versions need to be correct. Reference the action READMEs for current input/output format.

  **Acceptance Criteria**:

  **QA Scenarios (MANDATORY)**:

  ```
  Scenario: Workflow files are valid YAML
    Tool: Bash
    Preconditions: Files created
    Steps:
      1. Run `ls .github/workflows/sync-openapi.yml` → exists
      2. Run `ls .github/workflows/deploy.yml` → exists
      3. Run `node -e "require('yaml').parse(require('fs').readFileSync('.github/workflows/sync-openapi.yml','utf8'))"` → no error (or use `python3 -c "import yaml; yaml.safe_load(open('.github/workflows/sync-openapi.yml'))"`)
    Expected Result: Both workflow files exist and parse as valid YAML
    Failure Indicators: File missing or YAML parse error
    Evidence: .sisyphus/evidence/task-8-workflows.txt

  Scenario: .env.example has required variables
    Tool: Bash
    Preconditions: File created
    Steps:
      1. Run `grep "VITE_API_BASE_URL" .env.example` → 1 match
      2. Run `grep "VITE_USE_MOCK" .env.example` → 1 match
    Expected Result: Both env vars present
    Failure Indicators: Missing variable
    Evidence: .sisyphus/evidence/task-8-env-example.txt

  Scenario: No hardcoded secrets
    Tool: Bash
    Preconditions: Workflow files exist
    Steps:
      1. Run `grep -i "AKIA" .github/workflows/deploy.yml` → 0 matches (no AWS access keys)
      2. Run `grep "secrets\." .github/workflows/deploy.yml` → matches (uses secrets reference, good)
    Expected Result: No hardcoded credentials, only ${{ secrets.* }} references
    Failure Indicators: Hardcoded keys found
    Evidence: .sisyphus/evidence/task-8-no-secrets.txt
  ```

  **Commit**: YES
  - Message: `ci: add OpenAPI sync and S3 deploy workflows`
  - Files: `.github/workflows/sync-openapi.yml`, `.github/workflows/deploy.yml`, `.env.example`, `src/vite-env.d.ts`
  - Pre-commit: YAML validation

---

- [ ] 9. Users ExternalResources + UsersGateway Interface

  **What to do**:
  - Create `src/features/users/externalResources/httpClient/httpClient.ts`:
    - Import `createHttpClient` from `@/shared/api/httpClient`
    - Export `usersHttpClient = createHttpClient(import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:8080')`
  - Create `src/features/users/externalResources/UsersApi/UsersApi.types.ts`:
    - Import `paths` type from `@/shared/api/generated/api`
    - Re-export specific DTO types using path access: `UserDTO`, `CreateUserDTO`, `UpdateUserDTO`
    - This is the ONLY file in the users feature that imports from `shared/api/generated/`
  - Create `src/features/users/externalResources/UsersApi/UsersApi.ts`:
    - Import `usersHttpClient` from `../httpClient`
    - Import DTO types from `./UsersApi.types`
    - Export `UsersApi` object with methods: `getAll()`, `getById(id)`, `create(body)`, `update(id, body)`, `delete(id)`
    - Each method calls usersHttpClient with correct path, method, and JSON body
    - Add comment: "UserDTO types NEVER leave externalResources/. Only UserEntity flows outward from Gateway."
  - Create `src/features/users/repositories/usersRepository/UsersGateway/UsersGateway.types.ts`:
    - Import `UserEntity` type from `../../../types/entities/UserEntity`
    - Export `IUsersGateway` interface with methods: `fetchAll()`, `fetchById(id)`, `create(data)`, `update(id, data)`, `remove(id)`
    - All methods return `Promise<UserEntity>` or `Promise<UserEntity[]>` or `Promise<void>`
  - Create all barrel `index.ts` files for each directory level

  **Must NOT do**:
  - Do NOT import from `shared/api/generated/` anywhere except `UsersApi.types.ts`
  - Do NOT add request caching, retry logic, or interceptors to UsersApi
  - Do NOT export UserDTO types from the barrel exports (they stay in externalResources)
  - Do NOT add methods beyond the 5 CRUD operations
  - Do NOT write tests for this task (no logic to test — just wiring)

  **Recommended Agent Profile**:
  - **Category**: `quick`
    - Reason: Mostly import/export wiring, code provided in spec
  - **Skills**: []
  - **Skills Evaluated but Omitted**:
    - None relevant

  **Parallelization**:
  - **Can Run In Parallel**: YES
  - **Parallel Group**: Wave 3 (with T10)
  - **Blocks**: T11, T12 (Gateway implementations need UsersApi + interface)
  - **Blocked By**: T2 (generated types), T3 (httpClient), T5 (UserEntity type)

  **References**:

  **Pattern References**:
  - `../frontend-clean-architecture-react-tanstack-react-query/src/features/orders/externalResources/OrdersApi/OrdersApi.ts` — API class structure. Adapt: reference uses class, we use plain object with arrow functions.
  - `../frontend-clean-architecture-react-tanstack-react-query/src/features/orders/repositories/ordersRepository/OrdersGateway/OrdersGateway.types.ts` — Gateway interface pattern
  - Phase 5 in user's spec provides exact code for UsersApi
  - Phase 6 item 1 provides exact interface

  **API/Type References**:
  - `src/shared/api/generated/api.d.ts` — generated types accessed via `paths['/users']['get']...` pattern
  - `src/shared/api/httpClient.ts` — `createHttpClient` factory function
  - `src/features/users/types/entities/UserEntity.ts` — `UserEntity` type for interface return types

  **WHY Each Reference Matters**:
  - Reference OrdersApi shows the method structure. Key adaptation: our UsersApi uses a plain object (not a class), and our httpClient is created from a shared factory. The Gateway interface in the reference shows how to define the contract between Gateway and Repository.

  **Acceptance Criteria**:

  **QA Scenarios (MANDATORY)**:

  ```
  Scenario: ExternalResources compile with correct imports
    Tool: Bash
    Preconditions: T2, T3, T5 complete
    Steps:
      1. Run `npx tsc --noEmit` → exit 0
      2. Run `grep "from '@/shared/api/generated" src/features/users/externalResources/UsersApi/UsersApi.types.ts` → 1 match
      3. Run `grep -rn "from '@/shared/api/generated" src/features/users/` → matches ONLY in UsersApi.types.ts
    Expected Result: Compiles, generated types imported only from UsersApi.types.ts
    Failure Indicators: Type errors, generated imports in wrong files
    Evidence: .sisyphus/evidence/task-9-external-resources.txt

  Scenario: Gateway interface uses domain types, not DTOs
    Tool: Bash
    Preconditions: UsersGateway.types.ts exists
    Steps:
      1. Run `grep "UserEntity" src/features/users/repositories/usersRepository/UsersGateway/UsersGateway.types.ts` → matches
      2. Run `grep "UserDTO" src/features/users/repositories/usersRepository/UsersGateway/UsersGateway.types.ts` → 0 matches
    Expected Result: Interface returns UserEntity, never UserDTO
    Failure Indicators: DTO types in interface
    Evidence: .sisyphus/evidence/task-9-gateway-interface.txt

  Scenario: DTO types don't leak into barrel exports
    Tool: Bash
    Preconditions: All index.ts files created
    Steps:
      1. Run `grep "UserDTO" src/features/users/externalResources/index.ts` → 0 matches
      2. Run `grep "CreateUserDTO" src/features/users/externalResources/index.ts` → 0 matches
    Expected Result: DTOs confined to externalResources internal files
    Failure Indicators: DTO types exported externally
    Evidence: .sisyphus/evidence/task-9-no-dto-leak.txt
  ```

  **Commit**: YES
  - Message: `feat(users): add externalResources and Gateway interface`
  - Files: All files in `externalResources/` + `UsersGateway.types.ts` + barrel `index.ts` files
  - Pre-commit: `npx tsc --noEmit`

---

- [ ] 10. Auth ExternalResources + AuthGateway Interface

  **What to do**:
  - Create `src/features/auth/externalResources/AuthApi/AuthApi.types.ts`:
    - Import `paths` from `@/shared/api/generated/api`
    - Re-export: `LoginRequest`, `TokenResponse` (mapped from generated types)
  - Create `src/features/auth/externalResources/AuthApi/AuthApi.ts`:
    - Use shared httpClient (create auth-scoped instance or import directly)
    - Export `AuthApi` object with: `login(body: LoginRequest): Promise<TokenResponse>`
    - POST to `/auth/login`
  - Create `src/features/auth/repositories/authRepository/AuthGateway/AuthGateway.types.ts`:
    - Import `TokenEntity` from auth entity
    - Export `IAuthGateway` interface with: `login(credentials: { email: string; password: string }): Promise<TokenEntity>`
  - Create all barrel `index.ts` files

  **Must NOT do**:
  - Do NOT import from users feature
  - Do NOT add register, logout, or token refresh endpoints
  - Do NOT import from `shared/api/generated/` anywhere except `AuthApi.types.ts`

  **Recommended Agent Profile**:
  - **Category**: `quick`
    - Reason: Mirrors T9 pattern exactly, smaller scope (only login endpoint)
  - **Skills**: []
  - **Skills Evaluated but Omitted**:
    - None relevant

  **Parallelization**:
  - **Can Run In Parallel**: YES
  - **Parallel Group**: Wave 3 (with T9)
  - **Blocks**: T13 (Auth Gateway implementation)
  - **Blocked By**: T2 (generated types), T3 (httpClient), T6 (TokenEntity type)

  **References**:

  **Pattern References**:
  - `src/features/users/externalResources/` (from T9) — same pattern, just different domain
  - Phase 11 in user's spec for auth structure

  **API/Type References**:
  - `src/shared/api/generated/api.d.ts` — LoginRequest, TokenResponse types
  - `src/features/auth/types/entities/TokenEntity.ts` — for Gateway interface

  **WHY Each Reference Matters**:
  - Direct mirror of users externalResources. Agent should copy T9's structure and adapt for auth domain.

  **Acceptance Criteria**:

  **QA Scenarios (MANDATORY)**:

  ```
  Scenario: Auth externalResources compile correctly
    Tool: Bash
    Preconditions: T2, T3, T6 complete
    Steps:
      1. Run `npx tsc --noEmit` → exit 0
      2. Run `grep -rn "from '@/shared/api/generated" src/features/auth/` → matches ONLY in AuthApi.types.ts
      3. Run `grep -rn "from '@/features/users" src/features/auth/` → 0 matches
    Expected Result: Compiles, no cross-feature imports, generated types boundary respected
    Failure Indicators: Type errors, wrong imports
    Evidence: .sisyphus/evidence/task-10-auth-external.txt

  Scenario: AuthGateway interface uses domain types
    Tool: Bash
    Preconditions: AuthGateway.types.ts exists
    Steps:
      1. Run `grep "TokenEntity" src/features/auth/repositories/authRepository/AuthGateway/AuthGateway.types.ts` → matches
      2. Run `grep "TokenResponse" src/features/auth/repositories/authRepository/AuthGateway/AuthGateway.types.ts` → 0 matches
    Expected Result: Interface returns TokenEntity, not API DTOs
    Failure Indicators: DTO types in interface
    Evidence: .sisyphus/evidence/task-10-auth-gateway-interface.txt
  ```

  **Commit**: YES
  - Message: `feat(auth): add externalResources and Gateway interface`
  - Files: All files in `features/auth/externalResources/` + `AuthGateway.types.ts` + barrel `index.ts` files
  - Pre-commit: `npx tsc --noEmit`

---

- [ ] 11. Users RemoteUsersGateway [TDD]

  **What to do**:
  - **RED**: Create `src/features/users/repositories/usersRepository/UsersGateway/RemoteUsersGateway/RemoteUsersGateway.spec.ts`:
    - Mock `UsersApi` module (vi.mock the externalResources import)
    - Test `fetchAll()`: mock UsersApi.getAll returning DTO array → verify returns UserEntity array with correct mapping
    - Test `fetchById(id)`: mock UsersApi.getById → verify single UserEntity returned
    - Test `create(data)`: mock UsersApi.create → verify data forwarded and result mapped
    - Test `update(id, data)`: mock UsersApi.update → verify correct call + mapping
    - Test `remove(id)`: mock UsersApi.delete → verify called with correct id
    - Test schema validation: mock UsersApi returning invalid data → verify zod throws
    - Run tests → FAIL
  - **GREEN**: Create `src/features/users/repositories/usersRepository/UsersGateway/RemoteUsersGateway/RemoteUsersGateway.ts`:
    - Class implementing `IUsersGateway`
    - Import `UsersApi` from `../../../../externalResources/UsersApi`
    - Import `UserEntitySchema` from `../../../../types/entities/UserEntity`
    - Each method: call UsersApi → map DTO → `UserEntitySchema.parse(mapped)` (zod validation at boundary)
    - Example `fetchAll()`: `const dtos = await UsersApi.getAll(); return dtos.map(dto => UserEntitySchema.parse({ id: dto.id, name: dto.name, email: dto.email }))`
    - Run tests → PASS
  - Create `src/features/users/repositories/usersRepository/UsersGateway/RemoteUsersGateway/index.ts` barrel

  **Must NOT do**:
  - Do NOT add caching in the Gateway (Repository handles caching via TanStack Query)
  - Do NOT catch or swallow errors — let them propagate to Repository/Use Case level
  - Do NOT add retry logic
  - Do NOT export DTO types from this module
  - Do NOT use `as UserEntity` type assertions — always use `UserEntitySchema.parse()` for runtime validation

  **Recommended Agent Profile**:
  - **Category**: `deep`
    - Reason: TDD with mocking, needs to understand Gateway pattern from reference, zod validation at boundary
  - **Skills**: []
  - **Skills Evaluated but Omitted**:
    - None relevant

  **Parallelization**:
  - **Can Run In Parallel**: YES
  - **Parallel Group**: Wave 4 (with T12, T13)
  - **Blocks**: T14 (Repository needs Gateway)
  - **Blocked By**: T9 (needs UsersApi + Gateway interface)

  **References**:

  **Pattern References**:
  - `../frontend-clean-architecture-react-tanstack-react-query/src/features/orders/repositories/ordersRepository/OrdersGateway/RemoteOrdersGateway/RemoteOrdersGateway.ts` — **READ THIS**: Remote Gateway implementation pattern. Shows how to call API, map DTOs, and return domain entities. Key difference: reference may use separate `mappers.ts` — we inline the mapping with zod.parse()
  - Phase 6 item 2 in user's spec provides implementation pattern

  **API/Type References**:
  - `src/features/users/repositories/usersRepository/UsersGateway/UsersGateway.types.ts` — IUsersGateway interface to implement
  - `src/features/users/externalResources/UsersApi/UsersApi.ts` — API methods to call
  - `src/features/users/types/entities/UserEntity.ts` — UserEntitySchema for validation

  **WHY Each Reference Matters**:
  - The reference RemoteOrdersGateway shows the exact pattern: call API → map → return entity. Our version adds zod validation (`UserEntitySchema.parse()`) where the reference might use plain object mapping. The test mocking pattern (mock the API module) is standard vitest.

  **Acceptance Criteria**:

  **If TDD:**
  - [ ] Test file: `RemoteUsersGateway.spec.ts` with 6+ test cases
  - [ ] `npx vitest run src/features/users/repositories/usersRepository/UsersGateway/RemoteUsersGateway/` → PASS

  **QA Scenarios (MANDATORY)**:

  ```
  Scenario: RemoteUsersGateway tests pass with mocked API
    Tool: Bash
    Preconditions: T9 complete (UsersApi exists)
    Steps:
      1. Run `npx vitest run src/features/users/repositories/usersRepository/UsersGateway/RemoteUsersGateway/` → exit 0
      2. Verify output: at least 6 tests passed, 0 failures
    Expected Result: All gateway tests pass with mocked API layer
    Failure Indicators: Any test failure
    Evidence: .sisyphus/evidence/task-11-remote-gateway-tests.txt

  Scenario: RemoteUsersGateway uses zod.parse, not type assertion
    Tool: Bash
    Preconditions: RemoteUsersGateway.ts exists
    Steps:
      1. Run `grep "UserEntitySchema.parse" src/features/users/repositories/usersRepository/UsersGateway/RemoteUsersGateway/RemoteUsersGateway.ts` → at least 1 match
      2. Run `grep "as UserEntity" src/features/users/repositories/usersRepository/UsersGateway/RemoteUsersGateway/RemoteUsersGateway.ts` → 0 matches
    Expected Result: Uses zod parse, not type assertion
    Failure Indicators: Type assertion found, no zod parse
    Evidence: .sisyphus/evidence/task-11-zod-validation.txt

  Scenario: Gateway implements correct interface
    Tool: Bash
    Preconditions: Both files exist
    Steps:
      1. Run `grep "implements IUsersGateway" src/features/users/repositories/usersRepository/UsersGateway/RemoteUsersGateway/RemoteUsersGateway.ts` → 1 match
      2. Run `npx tsc --noEmit` → exit 0 (TypeScript verifies interface compliance)
    Expected Result: Class correctly implements the interface
    Failure Indicators: Missing interface, type error
    Evidence: .sisyphus/evidence/task-11-implements-interface.txt
  ```

  **Commit**: YES (2 commits for TDD)
  - Message 1: `test(users): add RemoteUsersGateway tests`
  - Message 2: `feat(users): implement RemoteUsersGateway`
  - Files: `RemoteUsersGateway.ts`, `RemoteUsersGateway.spec.ts`, `index.ts`
  - Pre-commit: `npx vitest run src/features/users/repositories/usersRepository/UsersGateway/RemoteUsersGateway/`

---

- [ ] 12. Users InMemoryUsersGateway [TDD]

  **What to do**:
  - **RED**: Create `src/features/users/repositories/usersRepository/UsersGateway/InMemoryUsersGateway/InMemoryUsersGateway.spec.ts`:
    - Test `fetchAll()` returns seeded users (3 initial users)
    - Test `fetchById(id)` returns correct user
    - Test `fetchById(invalidId)` throws error
    - Test `create(data)` adds user and returns it with generated id
    - Test `update(id, data)` modifies and returns updated user
    - Test `remove(id)` deletes user, subsequent fetchAll returns fewer
    - All tests operate on in-memory data — NO network mocking needed
    - Run tests → FAIL
  - **GREEN**: Create `src/features/users/repositories/usersRepository/UsersGateway/InMemoryUsersGateway/InMemoryUsersGateway.ts`:
    - Class implementing `IUsersGateway`
    - Private `users: Map<string, UserEntity>` storage
    - Constructor seeds 3 example users: `{ id: crypto.randomUUID(), name: "Alice Johnson", email: "alice@example.com" }` etc.
    - `fetchAll()`: return `Array.from(this.users.values())`
    - `fetchById(id)`: return from map or throw
    - `create(data)`: generate UUID, create UserEntity, add to map
    - `update(id, data)`: find, merge, replace in map
    - `remove(id)`: delete from map
    - Run tests → PASS
  - Create barrel `index.ts`

  **Must NOT do**:
  - Do NOT add network calls or simulated delays (keep it instant for fast tests)
  - Do NOT use singleton pattern (the reference does, but we instantiate per-environment in the hook)
  - Do NOT add more than 3 seed users
  - Do NOT add validation logic (InMemory trusts the input — validation is Remote's job)

  **Recommended Agent Profile**:
  - **Category**: `unspecified-high`
    - Reason: TDD with in-memory data store, needs to correctly implement all 5 CRUD operations
  - **Skills**: []
  - **Skills Evaluated but Omitted**:
    - None relevant

  **Parallelization**:
  - **Can Run In Parallel**: YES
  - **Parallel Group**: Wave 4 (with T11, T13)
  - **Blocks**: T14 (Repository needs both gateways for the hook)
  - **Blocked By**: T9 (needs IUsersGateway interface from UsersGateway.types.ts)

  **References**:

  **Pattern References**:
  - `../frontend-clean-architecture-react-tanstack-react-query/src/features/orders/repositories/ordersRepository/OrdersGateway/InMemoryOrdersGateway/InMemoryOrdersGateway.ts` — **READ THIS**: InMemory Gateway pattern. Shows Map-based storage, seed data, and CRUD methods. Key differences: reference uses `static instance` singleton and `sleep()` delays — we skip both.
  - Phase 6 item 3 in user's spec

  **API/Type References**:
  - `src/features/users/repositories/usersRepository/UsersGateway/UsersGateway.types.ts` — IUsersGateway interface
  - `src/features/users/types/entities/UserEntity.ts` — UserEntity type

  **WHY Each Reference Matters**:
  - The reference InMemoryOrdersGateway shows the exact data structure pattern (Map storage, iteration, CRUD). Key adaptation: skip the singleton `static instance` pattern and the `sleep()` delay simulation. Keep it simple — direct Map operations.

  **Acceptance Criteria**:

  **If TDD:**
  - [ ] Test file: `InMemoryUsersGateway.spec.ts` with 6+ test cases
  - [ ] `npx vitest run src/features/users/repositories/usersRepository/UsersGateway/InMemoryUsersGateway/` → PASS

  **QA Scenarios (MANDATORY)**:

  ```
  Scenario: InMemoryUsersGateway tests pass with no network
    Tool: Bash
    Preconditions: T9 complete (interface exists)
    Steps:
      1. Run `npx vitest run src/features/users/repositories/usersRepository/UsersGateway/InMemoryUsersGateway/` → exit 0
      2. Verify output: at least 6 tests passed, 0 failures
    Expected Result: All in-memory gateway tests pass without any network calls
    Failure Indicators: Any test failure
    Evidence: .sisyphus/evidence/task-12-inmemory-gateway-tests.txt

  Scenario: InMemoryGateway has no network dependencies
    Tool: Bash
    Preconditions: InMemoryUsersGateway.ts exists
    Steps:
      1. Run `grep "fetch" src/features/users/repositories/usersRepository/UsersGateway/InMemoryUsersGateway/InMemoryUsersGateway.ts` → 0 matches
      2. Run `grep "UsersApi" src/features/users/repositories/usersRepository/UsersGateway/InMemoryUsersGateway/InMemoryUsersGateway.ts` → 0 matches
      3. Run `grep "httpClient" src/features/users/repositories/usersRepository/UsersGateway/InMemoryUsersGateway/InMemoryUsersGateway.ts` → 0 matches
    Expected Result: Zero network-related imports
    Failure Indicators: Any network-related import found
    Evidence: .sisyphus/evidence/task-12-no-network.txt
  ```

  **Commit**: YES (2 commits for TDD)
  - Message 1: `test(users): add InMemoryUsersGateway tests`
  - Message 2: `feat(users): implement InMemoryUsersGateway`
  - Files: `InMemoryUsersGateway.ts`, `InMemoryUsersGateway.spec.ts`, `index.ts`
  - Pre-commit: `npx vitest run src/features/users/repositories/usersRepository/UsersGateway/InMemoryUsersGateway/`

---

- [ ] 13. Auth RemoteAuthGateway + useAuthGateway Hook

  **What to do**:
  - Create `src/features/auth/repositories/authRepository/AuthGateway/RemoteAuthGateway/RemoteAuthGateway.ts`:
    - Class implementing `IAuthGateway`
    - Import `AuthApi` from externalResources
    - Import `TokenEntitySchema` from auth entity
    - `login(credentials)`: call `AuthApi.login(credentials)` → map response → `TokenEntitySchema.parse()`
    - On success: set cookie `document.cookie = 'token=' + result.token + '; path=/; Secure; SameSite=Strict'`
    - Note: httpOnly flag can only be set by server (Spring Boot response header). Client sets Secure + SameSite only.
  - Create `src/features/auth/repositories/authRepository/AuthGateway/RemoteAuthGateway/index.ts` barrel
  - Create `src/features/auth/repositories/authRepository/AuthGateway/index.ts` barrel
  - Create `src/features/auth/repositories/authRepository/hooks/useAuthGateway.ts`:
    - Import RemoteAuthGateway
    - Export `useAuthGateway = (): IAuthGateway => new RemoteAuthGateway()`
    - Note: No InMemory variant for auth (login is always real or stubbed at a higher level)
  - Create `src/features/auth/repositories/authRepository/hooks/index.ts` barrel

  **Must NOT do**:
  - Do NOT create InMemoryAuthGateway (auth has no mock mode — in mock mode, skip auth entirely)
  - Do NOT store token in localStorage
  - Do NOT add token refresh logic
  - Do NOT import from users feature

  **Recommended Agent Profile**:
  - **Category**: `quick`
    - Reason: Single gateway + hook, simpler than users (no InMemory variant), code largely provided
  - **Skills**: []
  - **Skills Evaluated but Omitted**:
    - None relevant

  **Parallelization**:
  - **Can Run In Parallel**: YES
  - **Parallel Group**: Wave 4 (with T11, T12)
  - **Blocks**: T15 (Auth Repository)
  - **Blocked By**: T10 (needs AuthApi + AuthGateway interface)

  **References**:

  **Pattern References**:
  - `src/features/users/repositories/usersRepository/UsersGateway/RemoteUsersGateway/RemoteUsersGateway.ts` (from T11) — same pattern, simpler (only login method)
  - `src/features/users/repositories/usersRepository/hooks/useUsersGateway.ts` (pattern shown in T14) — hook structure
  - Phase 11 in user's spec

  **API/Type References**:
  - `src/features/auth/repositories/authRepository/AuthGateway/AuthGateway.types.ts` — IAuthGateway interface
  - `src/features/auth/externalResources/AuthApi/AuthApi.ts` — AuthApi.login()

  **WHY Each Reference Matters**:
  - Same pattern as RemoteUsersGateway but simpler. Only one method (login). The cookie-setting logic is the unique part — ensure Secure + SameSite flags but NOT httpOnly (server's job).

  **Acceptance Criteria**:

  **QA Scenarios (MANDATORY)**:

  ```
  Scenario: Auth Gateway compiles and implements interface
    Tool: Bash
    Preconditions: T10 complete
    Steps:
      1. Run `npx tsc --noEmit` → exit 0
      2. Run `grep "implements IAuthGateway" src/features/auth/repositories/authRepository/AuthGateway/RemoteAuthGateway/RemoteAuthGateway.ts` → 1 match
      3. Run `grep "TokenEntitySchema.parse" src/features/auth/repositories/authRepository/AuthGateway/RemoteAuthGateway/RemoteAuthGateway.ts` → at least 1 match
    Expected Result: Compiles, implements interface, uses zod validation
    Failure Indicators: Type error, missing interface, no zod parse
    Evidence: .sisyphus/evidence/task-13-auth-gateway.txt

  Scenario: No localStorage usage in auth
    Tool: Bash
    Preconditions: RemoteAuthGateway.ts exists
    Steps:
      1. Run `grep -r "localStorage" src/features/auth/` → 0 matches
    Expected Result: No localStorage references
    Failure Indicators: localStorage found
    Evidence: .sisyphus/evidence/task-13-no-localstorage.txt

  Scenario: No cross-feature imports
    Tool: Bash
    Preconditions: Files created
    Steps:
      1. Run `grep -rn "from '@/features/users" src/features/auth/` → 0 matches
    Expected Result: Auth feature is self-contained
    Failure Indicators: Users feature imported
    Evidence: .sisyphus/evidence/task-13-no-cross-import.txt
  ```

  **Commit**: YES
  - Message: `feat(auth): implement RemoteAuthGateway and hook`
  - Files: `RemoteAuthGateway.ts`, `RemoteAuthGateway/index.ts`, `AuthGateway/index.ts`, `hooks/useAuthGateway.ts`, `hooks/index.ts`
  - Pre-commit: `npx tsc --noEmit`

---

- [ ] 14. Users useUsersGateway Hook + Repository

  **What to do**:
  - Create `src/features/users/repositories/usersRepository/hooks/useUsersGateway.ts`:
    - Import `RemoteUsersGateway` and `InMemoryUsersGateway`
    - Import `IUsersGateway` type
    - Create module-level instances: `const remoteGateway = new RemoteUsersGateway()` and `const inMemoryGateway = new InMemoryUsersGateway()`
    - Export `useUsersGateway = (): IUsersGateway => import.meta.env.VITE_USE_MOCK === 'true' ? inMemoryGateway : remoteGateway`
  - Create `src/features/users/repositories/usersRepository/hooks/index.ts` barrel
  - Create `src/features/users/repositories/usersRepository/usersRepositoryKeys.ts`:
    - `USERS_KEYS = { all: ['users'] as const, detail: (id: string) => ['users', id] as const } as const`
  - Create `src/features/users/repositories/usersRepository/usersRepository.ts`:
    - Import `useQuery`, `useMutation`, `useQueryClient` from `@tanstack/react-query`
    - Import `useUsersGateway` from `./hooks/useUsersGateway`
    - Import `USERS_KEYS` from `./usersRepositoryKeys`
    - Export hooks:
      - `useUsersQuery()` — useQuery with USERS_KEYS.all, calls gateway.fetchAll()
      - `useUserQuery(id)` — useQuery with USERS_KEYS.detail(id), calls gateway.fetchById(id), `enabled: !!id`
      - `useCreateUserMutation()` — useMutation, calls gateway.create(data), invalidates USERS_KEYS.all on success
      - `useUpdateUserMutation()` — useMutation, calls gateway.update(id, data), invalidates USERS_KEYS.all on success
      - `useDeleteUserMutation()` — useMutation, calls gateway.remove(id), invalidates USERS_KEYS.all on success
  - Create `src/features/users/repositories/usersRepository/UsersGateway/index.ts` barrel (re-export Gateway types and implementations)
  - Create `src/features/users/repositories/usersRepository/index.ts` barrel
  - Create `src/features/users/repositories/index.ts` barrel

  **Must NOT do**:
  - Do NOT add optimistic updates to mutations
  - Do NOT add custom error handling in Repository hooks (let errors propagate)
  - Do NOT add pagination params to useUsersQuery
  - Do NOT cache gateway instances in React state (module-level is correct)
  - Do NOT import from shared/api/generated/ (Repository works only with domain types)

  **Recommended Agent Profile**:
  - **Category**: `unspecified-high`
    - Reason: TanStack Query hook patterns, multiple exports, needs to understand Repository pattern from reference
  - **Skills**: []
  - **Skills Evaluated but Omitted**:
    - None relevant

  **Parallelization**:
  - **Can Run In Parallel**: YES
  - **Parallel Group**: Wave 5 (with T15)
  - **Blocks**: T16 (Selectors), T17 (Use Cases)
  - **Blocked By**: T11, T12 (needs both Gateway implementations for the hook)

  **References**:

  **Pattern References**:
  - `../frontend-clean-architecture-react-tanstack-react-query/src/features/orders/repositories/ordersRepository/ordersRepository.ts` — **READ THIS**: Repository hook pattern. Shows useQuery/useMutation wrapping with gateway injection. Key differences: reference uses `useGatewayResource()` Zustand store, we use `import.meta.env.VITE_USE_MOCK`.
  - `../frontend-clean-architecture-react-tanstack-react-query/src/features/orders/repositories/ordersRepository/ordersRepositoryKeys.ts` — Query key pattern (NOTE: actual filename is `ordersRepositoryKeys.ts`, not `usersRepositoryKeys.ts` as cited in user spec)
  - `../frontend-clean-architecture-react-tanstack-react-query/src/features/orders/repositories/ordersRepository/hooks/useOrdersGateway.ts` — Gateway hook pattern
  - Phase 7 in user's spec provides exact implementation

  **API/Type References**:
  - `src/features/users/repositories/usersRepository/UsersGateway/UsersGateway.types.ts` — IUsersGateway (return type of hook)
  - `src/features/users/types/entities/UserEntity.ts` — UserEntity type (query return type)

  **WHY Each Reference Matters**:
  - The reference ordersRepository.ts is the canonical pattern. Each hook follows the same structure: get gateway via hook, wrap in useQuery/useMutation, invalidate on success. Our gateway hook uses env var instead of Zustand store — simpler but same concept.

  **Acceptance Criteria**:

  **QA Scenarios (MANDATORY)**:

  ```
  Scenario: Repository hooks compile with correct types
    Tool: Bash
    Preconditions: T11, T12 complete
    Steps:
      1. Run `npx tsc --noEmit` → exit 0
      2. Run `grep "export.*useUsersQuery" src/features/users/repositories/usersRepository/usersRepository.ts` → 1 match
      3. Run `grep "export.*useCreateUserMutation" src/features/users/repositories/usersRepository/usersRepository.ts` → 1 match
      4. Run `grep "export.*useUpdateUserMutation" src/features/users/repositories/usersRepository/usersRepository.ts` → 1 match
      5. Run `grep "export.*useDeleteUserMutation" src/features/users/repositories/usersRepository/usersRepository.ts` → 1 match
    Expected Result: All 5 hooks exported and compile
    Failure Indicators: Missing exports, type errors
    Evidence: .sisyphus/evidence/task-14-repository-hooks.txt

  Scenario: Query keys are centralized
    Tool: Bash
    Preconditions: usersRepositoryKeys.ts exists
    Steps:
      1. Run `grep "USERS_KEYS" src/features/users/repositories/usersRepository/usersRepositoryKeys.ts` → at least 1 match
      2. Run `grep "USERS_KEYS" src/features/users/repositories/usersRepository/usersRepository.ts` → at least 2 matches (used in queries)
    Expected Result: Keys defined in dedicated file and used in repository
    Failure Indicators: Inline query keys in repository
    Evidence: .sisyphus/evidence/task-14-query-keys.txt

  Scenario: Gateway hook switches on VITE_USE_MOCK
    Tool: Bash
    Preconditions: useUsersGateway.ts exists
    Steps:
      1. Run `grep "VITE_USE_MOCK" src/features/users/repositories/usersRepository/hooks/useUsersGateway.ts` → 1 match
      2. Run `grep "InMemoryUsersGateway" src/features/users/repositories/usersRepository/hooks/useUsersGateway.ts` → 1 match
      3. Run `grep "RemoteUsersGateway" src/features/users/repositories/usersRepository/hooks/useUsersGateway.ts` → 1 match
    Expected Result: Hook imports both gateways and switches on env var
    Failure Indicators: Missing gateway import, no env check
    Evidence: .sisyphus/evidence/task-14-gateway-hook.txt
  ```

  **Commit**: YES
  - Message: `feat(users): add useUsersGateway hook and Repository hooks`
  - Files: `hooks/useUsersGateway.ts`, `usersRepositoryKeys.ts`, `usersRepository.ts`, barrel `index.ts` files
  - Pre-commit: `npx tsc --noEmit`

---

- [ ] 15. Auth Repository

  **What to do**:
  - Create `src/features/auth/repositories/authRepository/authRepositoryKeys.ts`:
    - `AUTH_KEYS = { session: ['auth', 'session'] as const } as const`
  - Create `src/features/auth/repositories/authRepository/authRepository.ts`:
    - Import `useMutation` from `@tanstack/react-query`
    - Import `useAuthGateway` from `./hooks/useAuthGateway`
    - Export `useLoginMutation()`: useMutation that calls `gateway.login(credentials)`
    - On success: no query invalidation needed (login redirects to new page)
  - Create `src/features/auth/repositories/authRepository/index.ts` barrel
  - Create `src/features/auth/repositories/index.ts` barrel

  **Must NOT do**:
  - Do NOT add session query (no GET /me endpoint in spec)
  - Do NOT add logout mutation (not in scope)
  - Do NOT import from users feature
  - Do NOT add token refresh mutation

  **Recommended Agent Profile**:
  - **Category**: `quick`
    - Reason: Mirrors T14 pattern, much smaller (only login mutation)
  - **Skills**: []
  - **Skills Evaluated but Omitted**:
    - None relevant

  **Parallelization**:
  - **Can Run In Parallel**: YES
  - **Parallel Group**: Wave 5 (with T14)
  - **Blocks**: T18 (Auth Use Cases)
  - **Blocked By**: T13 (needs Auth Gateway + hook)

  **References**:

  **Pattern References**:
  - `src/features/users/repositories/usersRepository/usersRepository.ts` (from T14) — same pattern, simpler
  - Phase 7 in user's spec for Repository hook pattern

  **WHY Each Reference Matters**:
  - Direct mirror of users Repository, but only the mutation part. No queries for auth.

  **Acceptance Criteria**:

  **QA Scenarios (MANDATORY)**:

  ```
  Scenario: Auth Repository compiles and exports login mutation
    Tool: Bash
    Preconditions: T13 complete
    Steps:
      1. Run `npx tsc --noEmit` → exit 0
      2. Run `grep "export.*useLoginMutation" src/features/auth/repositories/authRepository/authRepository.ts` → 1 match
      3. Run `grep -rn "from '@/features/users" src/features/auth/` → 0 matches
    Expected Result: Compiles, exports hook, no cross-feature imports
    Failure Indicators: Type error, missing export, cross-feature import
    Evidence: .sisyphus/evidence/task-15-auth-repository.txt
  ```

  **Commit**: YES
  - Message: `feat(auth): add auth Repository hooks`
  - Files: `authRepositoryKeys.ts`, `authRepository.ts`, barrel `index.ts` files
  - Pre-commit: `npx tsc --noEmit`

---

- [ ] 16. Users Selectors [TDD]

  **What to do**:
  - **RED**: Create `src/features/users/selectors/useUsersSelector/useUsersSelector.spec.ts`:
    - Mock `useUsersQuery` to return controlled data
    - Test: when data is array of UserEntity → returns UserViewModel[] with correct fields (displayName, email, initials)
    - Test: initials calculation — "Alice Johnson" → "AL", "Bob" → "BO"
    - Test: when isLoading=true → returns empty users array + isLoading=true
    - Test: when isError=true → returns empty users + error
    - Run tests → FAIL
  - **GREEN**: Create `src/features/users/selectors/useUsersSelector/useUsersSelector.ts`:
    - Import `useUsersQuery` from `../../repositories/usersRepository`
    - Export `UserViewModel` type: `{ id: string, displayName: string, email: string, initials: string }`
    - Export `useUsersSelector()` hook: call useUsersQuery, map entities to ViewModels
    - Initials: `entity.name.slice(0, 2).toUpperCase()`
    - Return `{ users: UserViewModel[], isLoading, isError, error }`
    - Run tests → PASS
  - Create `src/features/users/selectors/useUsersSelector/index.ts` barrel
  - Create `src/features/users/selectors/useUserByIdSelector/useUserByIdSelector.ts`:
    - Import `useUserQuery` from repository
    - Return single `UserViewModel | undefined` with same mapping logic
  - Create `src/features/users/selectors/useUserByIdSelector/index.ts` barrel
  - Create `src/features/users/selectors/index.ts` barrel

  **Must NOT do**:
  - Do NOT add filtering, sorting, or pagination logic to selectors
  - Do NOT mutate data in selectors (read-only hooks)
  - Do NOT import from use cases or views (selectors are inner layer)
  - Do NOT add computed fields beyond displayName, email, initials

  **Recommended Agent Profile**:
  - **Category**: `quick`
    - Reason: Simple derived hooks with straightforward mapping, TDD but small scope
  - **Skills**: []
  - **Skills Evaluated but Omitted**:
    - None relevant

  **Parallelization**:
  - **Can Run In Parallel**: YES
  - **Parallel Group**: Wave 6 (with T17, T18)
  - **Blocks**: T19 (Users container), T20 (UserForm container)
  - **Blocked By**: T14 (needs Repository hooks)

  **References**:

  **Pattern References**:
  - `../frontend-clean-architecture-react-tanstack-react-query/src/features/orders/selectors/useOrderByIdSelector/useOrderByIdSelector.ts` — **READ THIS**: Selector pattern. Shows how to derive ViewModels from repository query data. Key concept: selectors are read-only hooks that transform data for the view layer.
  - `../frontend-clean-architecture-react-tanstack-react-query/src/features/orders/selectors/useOrderIdsSelector/useOrderIdsSelector.ts` — Another selector example (list-level)
  - Phase 8 in user's spec provides implementation

  **API/Type References**:
  - `src/features/users/repositories/usersRepository/usersRepository.ts` — useUsersQuery, useUserQuery
  - `src/features/users/types/entities/UserEntity.ts` — UserEntity (input type)

  **WHY Each Reference Matters**:
  - The reference selectors show the pattern: import repository hook → derive view-specific data. Our selectors add `UserViewModel` type with `initials` field. The `useUserByIdSelector` mirrors `useOrderByIdSelector` — select single item from query result.

  **Acceptance Criteria**:

  **If TDD:**
  - [ ] Test file: `useUsersSelector.spec.ts` with 4+ test cases
  - [ ] `npx vitest run src/features/users/selectors/` → PASS

  **QA Scenarios (MANDATORY)**:

  ```
  Scenario: Selector tests pass with mocked repository
    Tool: Bash
    Preconditions: T14 complete
    Steps:
      1. Run `npx vitest run src/features/users/selectors/` → exit 0
      2. Verify output: at least 4 tests passed, 0 failures
    Expected Result: All selector tests pass
    Failure Indicators: Any test failure
    Evidence: .sisyphus/evidence/task-16-selector-tests.txt

  Scenario: Selectors export ViewModels, not Entities
    Tool: Bash
    Preconditions: useUsersSelector.ts exists
    Steps:
      1. Run `grep "UserViewModel" src/features/users/selectors/useUsersSelector/useUsersSelector.ts` → at least 1 match
      2. Run `grep "displayName" src/features/users/selectors/useUsersSelector/useUsersSelector.ts` → at least 1 match
      3. Run `grep "initials" src/features/users/selectors/useUsersSelector/useUsersSelector.ts` → at least 1 match
    Expected Result: ViewModel type with derived fields exported
    Failure Indicators: Missing ViewModel type or derived fields
    Evidence: .sisyphus/evidence/task-16-viewmodel.txt
  ```

  **Commit**: YES (2 commits for TDD)
  - Message 1: `test(users): add selector tests`
  - Message 2: `feat(users): implement selectors`
  - Files: `useUsersSelector.ts`, `useUsersSelector.spec.ts`, `useUserByIdSelector.ts`, barrel `index.ts` files
  - Pre-commit: `npx vitest run src/features/users/selectors/`

---

- [ ] 17. Users Use Cases [TDD]

  **What to do**:
  - **RED**: Create `src/features/users/useCases/useCreateUserUseCase/useCreateUserUseCase.spec.ts`:
    - Mock `useCreateUserMutation` from repository
    - Test: `createUser(data)` calls `mutateAsync(data)` on the mutation
    - Test: `isCreating` reflects mutation's `isPending` state
    - Run tests → FAIL
  - **GREEN**: Create `src/features/users/useCases/useCreateUserUseCase/useCreateUserUseCase.ts`:
    - Import `useCreateUserMutation` from repository
    - Export hook returning `{ createUser, isCreating }`
    - `createUser` delegates to `mutateAsync`
    - Run tests → PASS
  - Similarly for `useDeleteUserUseCase`:
    - `useDeleteUserUseCase.ts` + `useDeleteUserUseCase.spec.ts` (if time) or at minimum `.ts`
    - Returns `{ deleteUser(id), isDeleting }`
  - Also create `useUpdateUserUseCase`:
    - `useUpdateUserUseCase.ts` (needed for UserForm edit mode)
    - Returns `{ updateUser(id, data), isUpdating }`
  - Create barrel `index.ts` files for each use case directory and for `useCases/`

  **Must NOT do**:
  - Do NOT add business logic validation in use cases (validation is at Gateway boundary)
  - Do NOT add error handling/recovery in use cases (let errors propagate)
  - Do NOT add confirmation dialogs or side effects beyond the mutation
  - Do NOT combine multiple mutations in a single use case (each use case = one operation)

  **Recommended Agent Profile**:
  - **Category**: `quick`
    - Reason: Thin wrapper hooks, simple delegation pattern, code mostly provided in spec
  - **Skills**: []
  - **Skills Evaluated but Omitted**:
    - None relevant

  **Parallelization**:
  - **Can Run In Parallel**: YES
  - **Parallel Group**: Wave 6 (with T16, T18)
  - **Blocks**: T19 (Users container), T20 (UserForm container)
  - **Blocked By**: T14 (needs Repository mutation hooks)

  **References**:

  **Pattern References**:
  - `../frontend-clean-architecture-react-tanstack-react-query/src/features/orders/useCases/useDeleteOrderUseCase/useDeleteOrderUseCase.ts` — **READ THIS**: Use Case pattern. Shows how to wrap a mutation in a use case hook. Key difference: reference uses `UseCase<T>` type with `execute()` method — we use a simpler object with named methods.
  - Phase 9 in user's spec provides exact implementation

  **API/Type References**:
  - `src/features/users/repositories/usersRepository/usersRepository.ts` — useCreateUserMutation, useUpdateUserMutation, useDeleteUserMutation

  **WHY Each Reference Matters**:
  - The reference shows the Use Case pattern: wrap mutation's mutateAsync in a domain-named function. Key adaptation: reference returns `UseCase<T>` with generic `execute()`. We return a specific object like `{ createUser, isCreating }` — clearer API for the view layer.

  **Acceptance Criteria**:

  **If TDD:**
  - [ ] Test file: `useCreateUserUseCase.spec.ts` with 2+ test cases
  - [ ] `npx vitest run src/features/users/useCases/` → PASS

  **QA Scenarios (MANDATORY)**:

  ```
  Scenario: Use case tests pass
    Tool: Bash
    Preconditions: T14 complete
    Steps:
      1. Run `npx vitest run src/features/users/useCases/` → exit 0
      2. Verify at least 2 tests passed
    Expected Result: All use case tests pass
    Failure Indicators: Any test failure
    Evidence: .sisyphus/evidence/task-17-usecase-tests.txt

  Scenario: All three use cases exist with correct exports
    Tool: Bash
    Preconditions: Use case files created
    Steps:
      1. Run `grep "export.*useCreateUserUseCase" src/features/users/useCases/useCreateUserUseCase/useCreateUserUseCase.ts` → 1 match
      2. Run `grep "export.*useDeleteUserUseCase" src/features/users/useCases/useDeleteUserUseCase/useDeleteUserUseCase.ts` → 1 match
      3. Run `grep "export.*useUpdateUserUseCase" src/features/users/useCases/useUpdateUserUseCase/useUpdateUserUseCase.ts` → 1 match
      4. Run `npx tsc --noEmit` → exit 0
    Expected Result: All 3 use cases exported and compile
    Failure Indicators: Missing use case, type error
    Evidence: .sisyphus/evidence/task-17-usecases-exist.txt
  ```

  **Commit**: YES (2 commits for TDD)
  - Message 1: `test(users): add use case tests`
  - Message 2: `feat(users): implement use cases`
  - Files: All files in `useCases/` (3 use cases + tests + barrels)
  - Pre-commit: `npx vitest run src/features/users/useCases/`

---

- [ ] 18. Auth Use Cases

  **What to do**:
  - Create `src/features/auth/useCases/useLoginUseCase/useLoginUseCase.ts`:
    - Import `useLoginMutation` from auth repository
    - Export `useLoginUseCase()` hook
    - Returns `{ login(email, password), isLoggingIn }`
    - `login`: calls `mutateAsync({ email, password })`, on success: `window.location.href = '/users'` (redirect to dashboard)
  - Create barrel `index.ts` files for `useLoginUseCase/` and `useCases/`

  **Must NOT do**:
  - Do NOT add registration use case
  - Do NOT add logout use case
  - Do NOT import from users feature
  - Do NOT store auth state in React Context

  **Recommended Agent Profile**:
  - **Category**: `quick`
    - Reason: Single use case, mirrors T17 pattern, simple delegation
  - **Skills**: []
  - **Skills Evaluated but Omitted**:
    - None relevant

  **Parallelization**:
  - **Can Run In Parallel**: YES
  - **Parallel Group**: Wave 6 (with T16, T17)
  - **Blocks**: T21 (LoginForm container)
  - **Blocked By**: T15 (needs Auth Repository)

  **References**:

  **Pattern References**:
  - `src/features/users/useCases/useCreateUserUseCase/useCreateUserUseCase.ts` (from T17) — same pattern
  - Phase 11 in user's spec

  **WHY Each Reference Matters**:
  - Same delegation pattern as users use cases. Unique aspect: includes redirect to `/users` on success.

  **Acceptance Criteria**:

  **QA Scenarios (MANDATORY)**:

  ```
  Scenario: Login use case compiles and exports correctly
    Tool: Bash
    Preconditions: T15 complete
    Steps:
      1. Run `npx tsc --noEmit` → exit 0
      2. Run `grep "export.*useLoginUseCase" src/features/auth/useCases/useLoginUseCase/useLoginUseCase.ts` → 1 match
      3. Run `grep "window.location" src/features/auth/useCases/useLoginUseCase/useLoginUseCase.ts` → 1 match (redirect on success)
    Expected Result: Compiles, exports hook, includes redirect
    Failure Indicators: Type error, missing export
    Evidence: .sisyphus/evidence/task-18-login-usecase.txt

  Scenario: No cross-feature imports
    Tool: Bash
    Preconditions: Files created
    Steps:
      1. Run `grep -rn "from '@/features/users" src/features/auth/useCases/` → 0 matches
    Expected Result: Auth use cases don't import from users
    Failure Indicators: Cross-feature import found
    Evidence: .sisyphus/evidence/task-18-no-cross-import.txt
  ```

  **Commit**: YES
  - Message: `feat(auth): implement useLoginUseCase`
  - Files: `useLoginUseCase.ts`, barrel `index.ts` files
  - Pre-commit: `npx tsc --noEmit`

---

- [ ] 19. Users Container (Users.tsx + Presenter + Controller)

  **What to do**:
  - Create `src/features/users/views/containers/Users/hooks/usePresenter.ts`:
    - Import `useUsersSelector` from `../../../../selectors/useUsersSelector`
    - Export `usePresenter()` → delegates to `useUsersSelector()`, returns `{ users, isLoading, isError, error }`
  - Create `src/features/users/views/containers/Users/hooks/useController.ts`:
    - Import `useDeleteUserUseCase` from `../../../../useCases/useDeleteUserUseCase`
    - Export `useController()` → returns `{ handleDelete(id: string), isDeleting }`
  - Create `src/features/users/views/containers/Users/hooks/index.ts` barrel
  - Create `src/features/users/views/containers/Users/Users.types.ts`:
    - Export `PresenterResult` type (output of usePresenter)
    - Export `ControllerResult` type (output of useController)
  - Create `src/features/users/views/containers/Users/Users.tsx`:
    - Import `useEffect` from React
    - Import `checkAuthAndRedirect` from `@/shared/lib/auth`
    - Import `usePresenter` and `useController` from `./hooks`
    - Call `useEffect(() => { checkAuthAndRedirect() }, [])` at top
    - Loading state: `<div>Loading...</div>`
    - Error state: `<div>Error loading users</div>`
    - Success: HTML `<table>` with Name, Email, Actions columns
    - Each row: displayName, email, Delete button (calls handleDelete, disabled when isDeleting)
    - Add "Add User" link/button that navigates to UserForm (or opens it — depending on routing)
    - Use bare HTML — no styled-components, no Tailwind, no CSS modules
  - Create `src/features/users/views/containers/Users/index.ts` barrel

  **Must NOT do**:
  - Do NOT create shared UI components (Button, Table, etc.) — use native HTML elements
  - Do NOT add CSS framework, CSS modules, or styled-components
  - Do NOT add pagination, sorting, or filtering UI
  - Do NOT add confirmation dialog before delete (keep it simple)
  - Do NOT add inline editing (edit goes through UserForm)
  - Do NOT put business logic in the component — only in hooks

  **Recommended Agent Profile**:
  - **Category**: `visual-engineering`
    - Reason: React component with hooks, rendering logic, user interactions
  - **Skills**: []
  - **Skills Evaluated but Omitted**:
    - `frontend-ui-ux`: Would be relevant for styled components, but this is bare HTML
    - `playwright`: Not needed for this task (QA is via build check, not browser)

  **Parallelization**:
  - **Can Run In Parallel**: YES
  - **Parallel Group**: Wave 7 (with T20, T21)
  - **Blocks**: T22 (feature barrel exports)
  - **Blocked By**: T16 (Selectors), T17 (Use Cases)

  **References**:

  **Pattern References**:
  - `../frontend-clean-architecture-react-tanstack-react-query/src/features/orders/views/containers/Orders/hooks/useController.ts` — **READ THIS**: Controller hook pattern. Shows how to wrap use cases into UI action handlers.
  - `../frontend-clean-architecture-react-tanstack-react-query/src/features/orders/views/containers/Orders/hooks/usePresenter.ts` — **READ THIS**: Presenter hook pattern. Shows how to pass selector data through.
  - `../frontend-clean-architecture-react-tanstack-react-query/src/features/orders/views/containers/Orders/Orders.tsx` — **READ THIS**: Container component pattern. Shows the composition of presenter + controller.
  - Phase 10 in user's spec provides exact component code

  **API/Type References**:
  - `src/features/users/selectors/useUsersSelector/useUsersSelector.ts` — UserViewModel type and useUsersSelector hook
  - `src/features/users/useCases/useDeleteUserUseCase/useDeleteUserUseCase.ts` — useDeleteUserUseCase hook
  - `src/shared/lib/auth.ts` — checkAuthAndRedirect function

  **WHY Each Reference Matters**:
  - The reference shows the Controller/Presenter split: Presenter is read-only (delegates to selectors), Controller handles write actions (delegates to use cases). The component only calls these two hooks — zero direct interaction with repository or gateway.

  **Acceptance Criteria**:

  **QA Scenarios (MANDATORY)**:

  ```
  Scenario: Users container compiles with correct structure
    Tool: Bash
    Preconditions: T16, T17 complete
    Steps:
      1. Run `npx tsc --noEmit` → exit 0
      2. Run `grep "usePresenter" src/features/users/views/containers/Users/Users.tsx` → at least 1 match
      3. Run `grep "useController" src/features/users/views/containers/Users/Users.tsx` → at least 1 match
      4. Run `grep "checkAuthAndRedirect" src/features/users/views/containers/Users/Users.tsx` → at least 1 match
    Expected Result: Component uses presenter + controller pattern and auth check
    Failure Indicators: Missing hook usage, type errors
    Evidence: .sisyphus/evidence/task-19-users-container.txt

  Scenario: No styled-components, Tailwind, or CSS modules
    Tool: Bash
    Preconditions: Users.tsx exists
    Steps:
      1. Run `grep -r "styled\." src/features/users/views/` → 0 matches
      2. Run `grep -r "className=\"tw-" src/features/users/views/` → 0 matches
      3. Run `grep -r "\.module\.css" src/features/users/views/` → 0 matches
    Expected Result: No styling frameworks used — bare HTML only
    Failure Indicators: Any styling framework reference found
    Evidence: .sisyphus/evidence/task-19-no-styling.txt

  Scenario: No direct repository or gateway imports in view
    Tool: Bash
    Preconditions: Users.tsx exists
    Steps:
      1. Run `grep "repositories" src/features/users/views/containers/Users/Users.tsx` → 0 matches
      2. Run `grep "Gateway" src/features/users/views/containers/Users/Users.tsx` → 0 matches
      3. Run `grep "UsersApi" src/features/users/views/containers/Users/Users.tsx` → 0 matches
    Expected Result: View only imports from hooks layer, not deeper
    Failure Indicators: Direct deep imports
    Evidence: .sisyphus/evidence/task-19-clean-imports.txt
  ```

  **Commit**: YES
  - Message: `feat(users): add Users container with presenter and controller`
  - Files: All files in `views/containers/Users/`
  - Pre-commit: `npx tsc --noEmit`

---

- [ ] 20. UserForm Container (Create + Edit Modes)

  **What to do**:
  - Create `src/features/users/views/containers/UserForm/hooks/usePresenter.ts`:
    - Accept optional `userId` parameter
    - If `userId` provided: call `useUserByIdSelector(userId)` to get existing user data for edit mode
    - Return `{ user: UserViewModel | undefined, isLoading, isEditMode: boolean }`
  - Create `src/features/users/views/containers/UserForm/hooks/useController.ts`:
    - Import `useCreateUserUseCase` and `useUpdateUserUseCase`
    - Return `{ handleSubmit(data, userId?), isSubmitting }`
    - If userId provided: call updateUser, else call createUser
    - On success: navigate back to users list (or call a callback)
  - Create `src/features/users/views/containers/UserForm/hooks/index.ts` barrel
  - Create `src/features/users/views/containers/UserForm/UserForm.tsx`:
    - Import `usePresenter` and `useController` from `./hooks`
    - Accept `userId?: string` prop for edit mode
    - Form with `name` and `email` input fields
    - In edit mode: pre-fill fields from presenter's `user` data
    - Use React `useState` for form state (name, email)
    - Submit button: calls handleSubmit with form data
    - Show loading state while submitting
    - Use bare HTML `<form>`, `<input>`, `<button>` — no form library
  - Create `src/features/users/views/containers/UserForm/index.ts` barrel
  - Create `src/features/users/views/containers/index.ts` barrel (re-export both Users and UserForm)
  - Create `src/features/users/views/index.ts` barrel

  **Must NOT do**:
  - Do NOT install form libraries (react-hook-form, formik)
  - Do NOT add client-side form validation beyond basic HTML required/type attributes
  - Do NOT add complex error feedback UI (simple error message is fine)
  - Do NOT create reusable Input/Button components (use bare HTML)
  - Do NOT add file upload or image handling

  **Recommended Agent Profile**:
  - **Category**: `visual-engineering`
    - Reason: React form component with state, controlled inputs, conditional rendering for edit mode
  - **Skills**: []
  - **Skills Evaluated but Omitted**:
    - `frontend-ui-ux`: Not needed — bare HTML form

  **Parallelization**:
  - **Can Run In Parallel**: YES
  - **Parallel Group**: Wave 7 (with T19, T21)
  - **Blocks**: T22 (feature barrel exports)
  - **Blocked By**: T16 (Selectors — for useUserByIdSelector), T17 (Use Cases — for create/update)

  **References**:

  **Pattern References**:
  - `src/features/users/views/containers/Users/hooks/usePresenter.ts` (from T19) — presenter pattern (adapt for single user + edit mode)
  - `src/features/users/views/containers/Users/hooks/useController.ts` (from T19) — controller pattern (adapt for create + update)
  - Phase 10 in spec shows the general container pattern

  **API/Type References**:
  - `src/features/users/selectors/useUserByIdSelector/useUserByIdSelector.ts` — for edit mode data
  - `src/features/users/useCases/useCreateUserUseCase/` — for create action
  - `src/features/users/useCases/useUpdateUserUseCase/` — for update action

  **WHY Each Reference Matters**:
  - UserForm is the most complex view component: it handles both create and edit modes. The presenter conditionally loads existing data. The controller routes to create or update based on whether userId exists.

  **Acceptance Criteria**:

  **QA Scenarios (MANDATORY)**:

  ```
  Scenario: UserForm compiles and handles both modes
    Tool: Bash
    Preconditions: T16, T17 complete
    Steps:
      1. Run `npx tsc --noEmit` → exit 0
      2. Run `grep "usePresenter" src/features/users/views/containers/UserForm/UserForm.tsx` → at least 1 match
      3. Run `grep "useController" src/features/users/views/containers/UserForm/UserForm.tsx` → at least 1 match
      4. Run `grep "isEditMode\|userId" src/features/users/views/containers/UserForm/hooks/usePresenter.ts` → at least 1 match
    Expected Result: Form supports both create and edit modes via presenter/controller
    Failure Indicators: Missing mode handling, type errors
    Evidence: .sisyphus/evidence/task-20-userform.txt

  Scenario: No form libraries installed
    Tool: Bash
    Preconditions: UserForm.tsx exists
    Steps:
      1. Run `grep -r "react-hook-form" src/features/users/` → 0 matches
      2. Run `grep -r "formik" src/features/users/` → 0 matches
      3. Run `grep "useState" src/features/users/views/containers/UserForm/UserForm.tsx` → at least 1 match (using React state)
    Expected Result: Uses React useState, no form library
    Failure Indicators: Form library imported
    Evidence: .sisyphus/evidence/task-20-no-form-lib.txt

  Scenario: Both create and update use cases are wired
    Tool: Bash
    Preconditions: UserForm controller exists
    Steps:
      1. Run `grep "useCreateUserUseCase" src/features/users/views/containers/UserForm/hooks/useController.ts` → 1 match
      2. Run `grep "useUpdateUserUseCase" src/features/users/views/containers/UserForm/hooks/useController.ts` → 1 match
    Expected Result: Controller wires both create and update operations
    Failure Indicators: Missing use case import
    Evidence: .sisyphus/evidence/task-20-both-usecases.txt
  ```

  **Commit**: YES
  - Message: `feat(users): add UserForm container with create and edit modes`
  - Files: All files in `views/containers/UserForm/`, view barrel `index.ts` files
  - Pre-commit: `npx tsc --noEmit`

---

- [ ] 21. Auth LoginForm Container

  **What to do**:
  - Create `src/features/auth/views/containers/LoginForm/hooks/usePresenter.ts`:
    - Track form state: `{ isLoading, errorMessage: string | null }`
    - Return isLoading from login mutation state
    - Return errorMessage from caught login errors
  - Create `src/features/auth/views/containers/LoginForm/hooks/useController.ts`:
    - Import `useLoginUseCase`
    - Return `{ handleSubmit(email: string, password: string) }`
    - handleSubmit: calls login, catch error → set errorMessage
  - Create `src/features/auth/views/containers/LoginForm/hooks/index.ts` barrel
  - Create `src/features/auth/views/containers/LoginForm/LoginForm.tsx`:
    - Simple form with email + password inputs
    - Submit calls controller's handleSubmit
    - Show error message from presenter
    - Show loading state on submit button
    - Use bare HTML form elements
  - Create barrel `index.ts` files up through `views/`
  - Create `src/features/auth/views/containers/index.ts` barrel
  - Create `src/features/auth/views/index.ts` barrel

  **Must NOT do**:
  - Do NOT add "Remember me" checkbox
  - Do NOT add "Forgot password" link (not in scope)
  - Do NOT add registration form or link
  - Do NOT import from users feature
  - Do NOT add complex form validation (basic HTML required is fine)

  **Recommended Agent Profile**:
  - **Category**: `visual-engineering`
    - Reason: React form component with hooks, mirrors T19/T20 pattern
  - **Skills**: []
  - **Skills Evaluated but Omitted**:
    - None relevant

  **Parallelization**:
  - **Can Run In Parallel**: YES
  - **Parallel Group**: Wave 7 (with T19, T20)
  - **Blocks**: T22 (feature barrel exports)
  - **Blocked By**: T18 (needs Auth Use Cases)

  **References**:

  **Pattern References**:
  - `src/features/users/views/containers/Users/` (from T19) — same container pattern
  - Phase 11 in user's spec

  **WHY Each Reference Matters**:
  - Same Controller/Presenter pattern. Simpler than Users — just a form with error display.

  **Acceptance Criteria**:

  **QA Scenarios (MANDATORY)**:

  ```
  Scenario: LoginForm compiles with presenter/controller pattern
    Tool: Bash
    Preconditions: T18 complete
    Steps:
      1. Run `npx tsc --noEmit` → exit 0
      2. Run `grep "usePresenter" src/features/auth/views/containers/LoginForm/LoginForm.tsx` → at least 1 match
      3. Run `grep "useController" src/features/auth/views/containers/LoginForm/LoginForm.tsx` → at least 1 match
      4. Run `grep "password" src/features/auth/views/containers/LoginForm/LoginForm.tsx` → at least 1 match
    Expected Result: Login form follows container pattern with email + password fields
    Failure Indicators: Type error, missing hooks
    Evidence: .sisyphus/evidence/task-21-loginform.txt

  Scenario: No cross-feature imports in auth views
    Tool: Bash
    Preconditions: LoginForm files exist
    Steps:
      1. Run `grep -rn "from '@/features/users" src/features/auth/views/` → 0 matches
    Expected Result: Auth views are self-contained
    Failure Indicators: Users feature imported
    Evidence: .sisyphus/evidence/task-21-no-cross-import.txt
  ```

  **Commit**: YES
  - Message: `feat(auth): add LoginForm container`
  - Files: All files in `features/auth/views/`
  - Pre-commit: `npx tsc --noEmit`

---

- [ ] 22. Feature Barrel Exports + TanStack Router Routes

  **What to do**:
  - Create `src/features/users/index.ts` (PUBLIC API):
    - `export { Users } from './views/containers/Users'`
    - `export { UserForm } from './views/containers/UserForm'`
    - This is the ONLY entry point for routes/ to import from users feature
  - Create `src/features/auth/index.ts` (PUBLIC API):
    - `export { LoginForm } from './views/containers/LoginForm'`
  - Create `src/routes/__root.tsx`:
    - Import `QueryClientProvider` from `@tanstack/react-query`
    - Import `ReactQueryDevtools` from `@tanstack/react-query-devtools`
    - Import `queryClient` from `@/shared/lib/queryClient`
    - Import `Outlet`, `createRootRoute` from `@tanstack/react-router`
    - Wrap Outlet in QueryClientProvider, add ReactQueryDevtools in DEV mode only
  - Create `src/routes/_dashboard.tsx`:
    - Import `Outlet`, `createFileRoute` from `@tanstack/react-router`
    - Simple layout with flex container, sidebar placeholder comment, `<main><Outlet /></main>`
  - Create `src/routes/_dashboard/users.tsx`:
    - Import `createFileRoute` from `@tanstack/react-router`
    - Import `Users` from `@/features/users`
    - `component: Users` — that's it, max 5 lines
  - Create `src/routes/login.tsx`:
    - Import `createFileRoute` from `@tanstack/react-router`
    - Import `LoginForm` from `@/features/auth`
    - `component: LoginForm` — max 5 lines
  - Ensure `src/routes/` is properly set up for TanStack Router's file-based routing plugin

  **Must NOT do**:
  - Do NOT put logic, hooks, or data fetching in route files
  - Do NOT import directly from feature internals (only via index.ts)
  - Do NOT add routes beyond what's specified (/login, /users)
  - Do NOT add a catch-all/404 route (out of scope)
  - Do NOT add route transition animations or loading states
  - Route files should be 5 lines max (import + createFileRoute + component)

  **Recommended Agent Profile**:
  - **Category**: `quick`
    - Reason: Barrel exports (1-2 lines each) + route files (5 lines each)
  - **Skills**: []
  - **Skills Evaluated but Omitted**:
    - None relevant

  **Parallelization**:
  - **Can Run In Parallel**: YES (partially — with T23)
  - **Parallel Group**: Wave 8 (with T23)
  - **Blocks**: F1-F4 (Final verification)
  - **Blocked By**: T19, T20, T21 (needs all containers exported)

  **References**:

  **Pattern References**:
  - Phase 12 in user's spec provides exact route file code
  - Phase 10 item 4 provides exact barrel export code

  **External References**:
  - TanStack Router file-based routing: `https://tanstack.com/router/latest/docs/framework/react/guide/file-based-routing`

  **WHY Each Reference Matters**:
  - TanStack Router's file-based routing uses specific conventions: `__root.tsx` for root layout, `_dashboard.tsx` with underscore prefix for layout routes (pathless), `_dashboard/users.tsx` for nested routes. Getting the file names exactly right is critical.

  **Acceptance Criteria**:

  **QA Scenarios (MANDATORY)**:

  ```
  Scenario: Feature barrel exports compile
    Tool: Bash
    Preconditions: T19, T20, T21 complete
    Steps:
      1. Run `npx tsc --noEmit` → exit 0
      2. Run `grep "export.*Users" src/features/users/index.ts` → 1 match
      3. Run `grep "export.*UserForm" src/features/users/index.ts` → 1 match
      4. Run `grep "export.*LoginForm" src/features/auth/index.ts` → 1 match
    Expected Result: Public APIs export all container components
    Failure Indicators: Missing exports, type errors
    Evidence: .sisyphus/evidence/task-22-barrel-exports.txt

  Scenario: Route files are shell-only (max ~5 lines each)
    Tool: Bash
    Preconditions: Route files created
    Steps:
      1. Run `wc -l src/routes/_dashboard/users.tsx` → ≤8 lines (some flexibility for imports)
      2. Run `wc -l src/routes/login.tsx` → ≤8 lines
      3. Run `grep "useEffect\|useState\|useQuery" src/routes/_dashboard/users.tsx` → 0 matches (no hooks in routes)
      4. Run `grep "useEffect\|useState\|useQuery" src/routes/login.tsx` → 0 matches
    Expected Result: Route files are thin shells — no logic
    Failure Indicators: Routes contain logic or hooks
    Evidence: .sisyphus/evidence/task-22-thin-routes.txt

  Scenario: Routes import only from feature index.ts, not deep
    Tool: Bash
    Preconditions: Route files created
    Steps:
      1. Run `grep "from '@/features/users'" src/routes/_dashboard/users.tsx` → 1 match (barrel import)
      2. Run `grep "from '@/features/users/" src/routes/_dashboard/users.tsx` → 0 matches (no deep import — note trailing slash)
      3. Run `grep "from '@/features/auth'" src/routes/login.tsx` → 1 match
      4. Run `grep "from '@/features/auth/" src/routes/login.tsx` → 0 matches
    Expected Result: Routes use only public barrel exports
    Failure Indicators: Deep imports found
    Evidence: .sisyphus/evidence/task-22-no-deep-imports.txt

  Scenario: Root route provides QueryClientProvider
    Tool: Bash
    Preconditions: __root.tsx exists
    Steps:
      1. Run `grep "QueryClientProvider" src/routes/__root.tsx` → at least 1 match
      2. Run `grep "queryClient" src/routes/__root.tsx` → at least 1 match
      3. Run `grep "ReactQueryDevtools" src/routes/__root.tsx` → at least 1 match
    Expected Result: Root layout wraps app in query provider with devtools
    Failure Indicators: Missing provider
    Evidence: .sisyphus/evidence/task-22-root-route.txt
  ```

  **Commit**: YES
  - Message: `feat: add feature barrel exports and TanStack Router routes`
  - Files: `features/users/index.ts`, `features/auth/index.ts`, `routes/__root.tsx`, `routes/_dashboard.tsx`, `routes/_dashboard/users.tsx`, `routes/login.tsx`
  - Pre-commit: `npx tsc --noEmit`

---

- [ ] 23. README

  **What to do**:
  - Create `README.md` at project root covering:
    1. **One-liner**: "Admin dashboard template. TanStack Start + FSD + Clean Architecture + OpenAPI type safety."
    2. **Architecture units table**: Entity, Gateway, Repository, Selector, Use Case, Controller, Presenter — with location and responsibility
    3. **AI agent usage guide**:
       - "To work on a feature, read only `src/features/[name]/`"
       - "Never need to read `src/shared/api/generated/` (auto-generated noise)"
       - "Use `XxxApi.types.ts` as the entry point for API types instead"
       - "To add a new feature: copy `src/features/users/` as template, replace User/Users, add route, export from index.ts"
    4. **Getting started**:
       - `git clone`, `npm install`, `cp .env.example .env.local`
       - `npm run generate:api`
       - `VITE_USE_MOCK=true npm run dev` — runs without backend
    5. **Auth flow**: JWT in cookie, client-side expiry check (UX only), Spring validates server-side
    6. **Deployment**: `npm run build` → `/dist` → S3 + CloudFront
    7. **CI/CD**: OpenAPI sync workflow, deploy workflow
    8. **FSD structure diagram**: `shared → features → routes` with rules
    9. **Clean Architecture layer diagram within features**

  **Must NOT do**:
  - Do NOT add badges, shields, or CI status badges (not set up yet)
  - Do NOT add extensive API documentation (OpenAPI schema is the source of truth)
  - Do NOT add contributing guide (out of scope)
  - Do NOT over-explain — keep it concise and practical

  **Recommended Agent Profile**:
  - **Category**: `writing`
    - Reason: Documentation task — prose, tables, diagrams in markdown
  - **Skills**: []
  - **Skills Evaluated but Omitted**:
    - None relevant

  **Parallelization**:
  - **Can Run In Parallel**: YES (with T22)
  - **Parallel Group**: Wave 8 (with T22)
  - **Blocks**: F1-F4 (Final verification)
  - **Blocked By**: All prior tasks (needs full picture, but can start in parallel with T22)

  **References**:

  **Pattern References**:
  - Phase 15 in user's spec provides exact structure
  - The actual project files (all tasks T1-T22) are the source of truth for README content

  **WHY Each Reference Matters**:
  - README must accurately reflect the actual project structure. Reference the file tree produced by all tasks, not just the spec.

  **Acceptance Criteria**:

  **QA Scenarios (MANDATORY)**:

  ```
  Scenario: README exists with required sections
    Tool: Bash
    Preconditions: All implementation tasks complete
    Steps:
      1. Run `ls README.md` → exists
      2. Run `grep -c "Getting started\|Architecture\|AI agent\|Deployment\|Auth" README.md` → at least 4 matches (key sections)
      3. Run `grep "VITE_USE_MOCK" README.md` → at least 1 match (mock mode documented)
      4. Run `grep "npm run generate:api" README.md` → at least 1 match (generation step documented)
    Expected Result: README contains all required sections
    Failure Indicators: Missing sections
    Evidence: .sisyphus/evidence/task-23-readme.txt

  Scenario: Architecture table is present
    Tool: Bash
    Preconditions: README.md exists
    Steps:
      1. Run `grep "Entity\|Gateway\|Repository\|Selector\|Use Case\|Controller\|Presenter" README.md` → at least 7 matches
    Expected Result: All architecture units documented
    Failure Indicators: Missing units
    Evidence: .sisyphus/evidence/task-23-arch-table.txt
  ```

  **Commit**: YES
  - Message: `docs: add README with architecture guide`
  - Files: `README.md`
  - Pre-commit: none

---

<!-- TASKS_END -->

---

## Final Verification Wave (MANDATORY — after ALL implementation tasks)

> 4 review agents run in PARALLEL. ALL must APPROVE. Present consolidated results to user and get explicit "okay" before completing.
>
> **Do NOT auto-proceed after verification. Wait for user's explicit approval before marking work complete.**

- [ ] F1. **Plan Compliance Audit** — `oracle`

  Read `.sisyphus/plans/admin-dashboard-template.md` end-to-end. For each "Must Have": verify implementation exists (read file, run command). For each "Must NOT Have": search codebase for forbidden patterns (`grep -r "axios"`, `grep -r "as any"`, check for cross-feature imports via `depcruise`). Check evidence files exist in `.sisyphus/evidence/`. Compare deliverables against plan.

  **Specific checks**:
  - `grep -r "from 'axios'" src/` → 0 matches
  - `grep -r "as any" src/` → 0 matches
  - `grep -rn "from '@/features/" src/features/users/` → only imports from own feature
  - `grep -rn "from '@/features/" src/features/auth/` → only imports from own feature
  - `grep -rn "from '@/shared/api/generated" src/` → only in `*/externalResources/*/XxxApi.types.ts`
  - Verify InMemoryUsersGateway exists and implements IUsersGateway
  - Verify RemoteUsersGateway uses `UserEntitySchema.parse()`
  - Verify all query keys are in `*RepositoryKeys.ts` files

  Output: `Must Have [N/N] | Must NOT Have [N/N] | Tasks [N/N] | VERDICT: APPROVE/REJECT`

- [ ] F2. **Code Quality Review** — `unspecified-high`

  Run `npx tsc --noEmit` + `npx vitest run` + `npx eslint .`. Review all files in `src/` for: `as any`/`@ts-ignore`, empty catches, `console.log` in non-dev code, commented-out code, unused imports. Check AI slop: excessive comments, over-abstraction, generic names (data/result/item/temp), unnecessary type assertions.

  Output: `Build [PASS/FAIL] | Lint [PASS/FAIL] | Tests [N pass/N fail] | Files [N clean/N issues] | VERDICT`

- [ ] F3. **Real QA Testing** — `unspecified-high` (+ `playwright` skill)

  Start from clean state: `npm ci && npm run generate:api && VITE_USE_MOCK=true npm run dev &`. Execute end-to-end flows:
  1. Navigate to `/login` → login form renders
  2. Navigate to `/users` → should redirect to `/login` (if auth check active) OR show users list (in mock mode)
  3. Users list shows 3 seeded users from InMemoryGateway
  4. Delete a user → user disappears from list
  5. Create a user → new user appears in list
  6. Edit a user → form pre-fills, save updates list
  7. `npm run build` → produces `dist/` with `index.html`

  Save screenshots to `.sisyphus/evidence/final-qa/`.

  Output: `Scenarios [N/N pass] | Integration [N/N] | Edge Cases [N tested] | VERDICT`

- [ ] F4. **Scope Fidelity Check** — `deep`

  For each task T1-T23: read "What to do", read actual files created. Verify 1:1 — everything in spec was built (no missing), nothing beyond spec was built (no creep). Check "Must NOT do" compliance. Detect cross-task contamination: Task N touching Task M's files. Flag unaccounted changes (files not in any task's scope).

  Output: `Tasks [N/N compliant] | Contamination [CLEAN/N issues] | Unaccounted [CLEAN/N files] | VERDICT`

---

## Commit Strategy

> Config/infra tasks: 1 commit per task
> TDD tasks: RED (failing test) → GREEN (pass) → REFACTOR (optional) = 2-3 commits per task
> View tasks: 1 commit per container

| Wave | Tasks | Commits |
|---|---|---|
| 1 | T1 | `chore: scaffold project with TanStack Start + deps` |
| 2 | T2 | `chore: add OpenAPI schema and generate types` |
| 2 | T3 | `feat(shared): add httpClient and errorHandler` |
| 2 | T4 | `feat(shared): add auth utilities and queryClient` |
| 2 | T5 | `test(users): add UserEntity schema tests` → `feat(users): add UserEntity with zod schema` |
| 2 | T6 | `test(auth): add TokenEntity schema tests` → `feat(auth): add TokenEntity with zod schema` |
| 2 | T7 | `chore: configure ESLint boundaries and dependency-cruiser` |
| 2 | T8 | `ci: add OpenAPI sync and S3 deploy workflows` |
| 3 | T9 | `feat(users): add externalResources and Gateway interface` |
| 3 | T10 | `feat(auth): add externalResources and Gateway interface` |
| 4 | T11 | `test(users): add RemoteUsersGateway tests` → `feat(users): implement RemoteUsersGateway` |
| 4 | T12 | `test(users): add InMemoryUsersGateway tests` → `feat(users): implement InMemoryUsersGateway` |
| 4 | T13 | `feat(auth): implement RemoteAuthGateway and hook` |
| 5 | T14 | `feat(users): add useUsersGateway hook and Repository hooks` |
| 5 | T15 | `feat(auth): add auth Repository hooks` |
| 6 | T16 | `test(users): add selector tests` → `feat(users): implement selectors` |
| 6 | T17 | `test(users): add use case tests` → `feat(users): implement use cases` |
| 6 | T18 | `feat(auth): implement useLoginUseCase` |
| 7 | T19 | `feat(users): add Users container with presenter and controller` |
| 7 | T20 | `feat(users): add UserForm container with create and edit modes` |
| 7 | T21 | `feat(auth): add LoginForm container` |
| 8 | T22 | `feat: add feature barrel exports and TanStack Router routes` |
| 8 | T23 | `docs: add README with architecture guide` |

---

## Success Criteria

### Verification Commands
```bash
npx tsc --noEmit                    # Expected: 0 errors
npx vitest run                      # Expected: all tests pass
npm run build                       # Expected: exit 0, dist/ exists
npm run generate:api                # Expected: src/shared/api/generated/api.d.ts created
VITE_USE_MOCK=true npm run dev      # Expected: app starts on localhost
npx depcruise --config ./dependency-cruiser.config.cjs ./src  # Expected: 0 violations
```

### Final Checklist
- [ ] All "Must Have" items present and verified
- [ ] All "Must NOT Have" items absent (grep verified)
- [ ] All TDD tests pass (Entity, Gateway, Selectors, UseCases)
- [ ] InMemory mode works end-to-end (list, create, edit, delete users)
- [ ] Login form renders at `/login`
- [ ] Users list renders at `/users` (in mock mode)
- [ ] `npm run build` produces valid `dist/` folder
- [ ] No cross-feature imports in `src/features/`
- [ ] `shared/api/generated/` imported only from `externalResources/*/XxxApi.types.ts`
- [ ] All query keys in `*RepositoryKeys.ts` files
- [ ] TypeScript strict mode, zero `any`
