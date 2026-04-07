import { createHttpClient } from '@/shared/api/httpClient'
import type { LoginRequest, TokenResponse } from './AuthApi.types'

const authHttpClient = createHttpClient(
  (import.meta.env.VITE_API_BASE_URL as string | undefined) ?? 'http://localhost:8080',
)

export const AuthApi = {
  login: (body: LoginRequest): Promise<TokenResponse> =>
    authHttpClient('/auth/login', { method: 'POST', body: JSON.stringify(body) }),
}
