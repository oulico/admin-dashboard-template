import type { TokenEntity } from '../../../types/entities/TokenEntity'

export interface IAuthGateway {
  login(credentials: { email: string; password: string }): Promise<TokenEntity>
}
