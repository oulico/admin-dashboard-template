import { useMutation } from '@tanstack/react-query'

import { useAuthGateway } from './hooks/useAuthGateway'
import type { LoginCredentials } from './AuthGateway/AuthGateway.types'

export const useLoginMutation = () => {
  const gateway = useAuthGateway()

  return useMutation({
    mutationFn: (credentials: LoginCredentials) => gateway.login(credentials),
  })
}

export const useLogoutMutation = () => {
  const gateway = useAuthGateway()

  return useMutation({
    mutationFn: () => gateway.logout(),
  })
}
