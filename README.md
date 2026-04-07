# Admin Dashboard Template

> Admin dashboard template. TanStack Start + FSD + Clean Architecture + OpenAPI type safety.

## Architecture

This template uses **Feature-Sliced Design (FSD)** as the primary organization, with **Clean Architecture** units inside each feature slice.

### Layer Order (inner → outer, no reverse imports)
```
shared → features → routes
```

### Architecture Units

| Unit | Location | Responsibility |
|---|---|---|
| **Entity** | `types/entities/` | Domain model + zod schema |
| **Gateway** | `repositories/XxxGateway/` | DTO ↔ Entity mapping + API calls |
| **Repository** | `repositories/` | TanStack Query wrapper |
| **Selector** | `selectors/` | Read-only ViewModel derivation |
| **Use Case** | `useCases/` | Write operation orchestration |
| **Controller** | `views/.../useController` | User action handlers |
| **Presenter** | `views/.../usePresenter` | Data preparation for rendering |

### Data Flow
```
API (DTO) → RemoteGateway → UserEntity → Repository → Selector → ViewModel → View
                ↑ zod.parse()                                        ↑ derived
```

## AI Agent Usage Guide

This template is optimized for AI-assisted development. Each feature slice is fully self-contained.

### Per-task context guide

| Task | Read only |
|---|---|
| Modify a feature | `src/features/[name]/` |
| Add a new feature | `src/features/users/` as reference |
| Update API types | Run `generate:api`, update `XxxApi.types.ts` only |
| Add a route | `src/routes/_dashboard/[name].tsx` (5 lines) |
| Debug API calls | `externalResources/` only |
| Debug business logic | `useCases/` + `selectors/` only |
| Debug UI | `views/containers/` only |

**Never read**: `src/shared/api/generated/` (auto-generated noise)

### Adding a new feature

1. Copy `src/features/users/` as template
2. Replace `User`/`Users` with your domain name
3. Add route in `src/routes/_dashboard/[name].tsx` (5 lines)
4. Export from `src/features/[name]/index.ts`

## Getting Started

```bash
git clone <repo-url>
cd admin-dashboard-template
npm install
cp .env.example .env.local
npm run generate:api
VITE_USE_MOCK=true npm run dev   # runs without backend
```

### Available Scripts

| Script | Description |
|---|---|
| `npm run dev` | Start dev server |
| `npm run build` | Build for production → `/dist` |
| `npm run test` | Run vitest |
| `npm run generate:api` | Regenerate API types from `openapi.yaml` |
| `npm run dep-graph` | Generate dependency graph SVG |

## Auth Flow

- JWT stored in cookie (set by Spring Boot via `Set-Cookie` response header with `httpOnly`)
- Client-side expiry check is **UX only** — Spring Boot validates JWT on every API call (real security)
- On 401 response: `httpClient` automatically redirects to `/login`
- On page load: `checkAuthAndRedirect()` checks token expiry and redirects if expired

## Mock Mode

Run without a backend:
```bash
VITE_USE_MOCK=true npm run dev
```

This switches all features to `InMemoryGateway` implementations, which use in-memory data with 3 seeded users.

## Deployment

### S3 + CloudFront

```bash
npm run build          # produces /dist
aws s3 sync ./dist s3://$S3_BUCKET --delete
aws cloudfront create-invalidation --distribution-id $CF_ID --paths "/*"
```

### CI/CD

- **`sync-openapi.yml`**: Triggered by `repository_dispatch` or `workflow_dispatch`. Downloads new OpenAPI spec, checks for breaking changes, regenerates types, creates PR.
- **`deploy.yml`**: Triggered on push to `main`. Builds and deploys to S3 + CloudFront.

Required GitHub secrets: `AWS_ACCESS_KEY_ID`, `AWS_SECRET_ACCESS_KEY`, `AWS_REGION`, `S3_BUCKET`, `CF_DISTRIBUTION_ID`

## Project Structure

```
src/
  shared/
    api/
      generated/        ← openapi-typescript output (NEVER edit manually)
      httpClient.ts     ← thin fetch wrapper (no axios)
      errorHandler.ts   ← ApiError class
    lib/
      auth.ts           ← isTokenExpired, checkAuthAndRedirect
      queryClient.ts    ← TanStack QueryClient singleton
  features/
    users/              ← Full CRUD feature
    auth/               ← Login feature
  routes/               ← TanStack Router (shells only, ~5 lines each)
```

## Tech Stack

- **Framework**: Vite + TanStack Router (SPA, no SSR)
- **Data fetching**: TanStack Query
- **Validation**: zod (at Gateway boundary only)
- **API types**: openapi-typescript (types only, no client codegen)
- **HTTP**: native fetch (no axios)
- **Testing**: vitest + @testing-library/react
- **Architecture**: Feature-Sliced Design + Clean Architecture
