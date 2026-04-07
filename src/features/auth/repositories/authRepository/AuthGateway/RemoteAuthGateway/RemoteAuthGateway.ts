import { AuthApi } from '../../../../externalResources/AuthApi/AuthApi'
import { TokenEntitySchema } from '../../../../types/entities/TokenEntity'
import type { IAuthGateway } from '../AuthGateway.types'
import type { TokenEntity } from '../../../../types/entities/TokenEntity'

export class RemoteAuthGateway implements IAuthGateway {
  async login(credentials: { email: string; password: string }): Promise<TokenEntity> {
    const response = await AuthApi.login(credentials)
    const entity = TokenEntitySchema.parse({
      token: response.token,
      expiresAt: response.expiresAt,
    })
    // Set cookie — Secure and SameSite only (httpOnly must be set by server/Spring Boot)
    document.cookie = `token=${entity.token}; path=/; Secure; SameSite=Strict`
    return entity
  }
}
