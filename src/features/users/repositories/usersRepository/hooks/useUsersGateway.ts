import { runtimeEnv } from '@/shared/lib'
import { RemoteUsersGateway } from '../UsersGateway/RemoteUsersGateway'
import { InMemoryUsersGateway } from '../UsersGateway/InMemoryUsersGateway'
import type { IUsersGateway } from '../UsersGateway/UsersGateway.types'

const remoteGateway = new RemoteUsersGateway()
const inMemoryGateway = new InMemoryUsersGateway()

export const useUsersGateway = (): IUsersGateway =>
  runtimeEnv.VITE_USE_MOCK === 'true' ? inMemoryGateway : remoteGateway
