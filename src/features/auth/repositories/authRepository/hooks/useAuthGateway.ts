import { RemoteAuthGateway } from '../AuthGateway/RemoteAuthGateway'
import type { IAuthGateway } from '../AuthGateway/AuthGateway.types'

const remoteGateway = new RemoteAuthGateway()

export const useAuthGateway = (): IAuthGateway => remoteGateway
