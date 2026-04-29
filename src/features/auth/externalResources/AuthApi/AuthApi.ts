import { createHttpClient } from '@/shared/api/httpClient'
import { runtimeEnv } from '@/shared/lib'
import type { LoginRequest, TokenResponse } from './AuthApi.types'

const authHttpClient = createHttpClient(runtimeEnv.VITE_API_BASE_URL)

export const AuthApi = {
  login: (body: LoginRequest): Promise<TokenResponse> =>
    authHttpClient('/v1/auth/login', {
      method: 'POST',
      body: JSON.stringify(body),
    }),
  logout: (): Promise<boolean> =>
    authHttpClient('/v1/auth/logout', { method: 'POST' }),
}
