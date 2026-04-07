import type { paths } from '@/shared/api/generated/api'

export type LoginRequest =
  paths['/auth/login']['post']['requestBody']['content']['application/json']

export type TokenResponse =
  paths['/auth/login']['post']['responses']['200']['content']['application/json']
