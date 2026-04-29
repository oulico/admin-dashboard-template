import type { TokenEntity } from '../../../types/entities/TokenEntity'

export type LoginCredentials = {
  email: string
  password: string
}

export interface IAuthGateway {
  login(credentials: LoginCredentials): Promise<TokenEntity>
  logout(): Promise<void>
}
