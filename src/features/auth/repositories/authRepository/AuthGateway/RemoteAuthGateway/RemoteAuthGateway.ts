import { setAccessTokenCookie, clearAuthCookies } from '@/shared/lib'
import { AuthApi } from '../../../../externalResources/AuthApi/AuthApi'
import { TokenEntitySchema } from '../../../../types/entities/TokenEntity'
import type { IAuthGateway, LoginCredentials } from '../AuthGateway.types'
import type { TokenEntity } from '../../../../types/entities/TokenEntity'

export class RemoteAuthGateway implements IAuthGateway {
  async login(credentials: LoginCredentials): Promise<TokenEntity> {
    const response = await AuthApi.login({
      auth_type: 'email',
      user_email: credentials.email,
      user_password: credentials.password,
    })
    const entity = TokenEntitySchema.parse({
      accessToken: response.access_token,
      isAdmin: response.is_admin ?? false,
    })
    // access_token is intentionally a JS-readable cookie (not HttpOnly).
    // The 30-minute TTL bounds the XSS exposure window; refresh_token is
    // HttpOnly + Secure on the server side and is never touched by JS.
    setAccessTokenCookie(entity.accessToken)
    return entity
  }

  async logout(): Promise<void> {
    try {
      await AuthApi.logout()
    } finally {
      clearAuthCookies()
    }
  }
}
