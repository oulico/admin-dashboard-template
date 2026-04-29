import type { paths } from '@/shared/api/generated/api'

export type LoginRequest =
  paths['/v1/auth/login']['post']['requestBody']['content']['application/json']

export type TokenResponse =
  paths['/v1/auth/login']['post']['responses']['200']['content']['application/json']
