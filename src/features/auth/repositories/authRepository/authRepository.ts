import { useMutation } from '@tanstack/react-query'

import { useAuthGateway } from './hooks/useAuthGateway'

export const useLoginMutation = () => {
  const gateway = useAuthGateway()

  return useMutation({
    mutationFn: (credentials: { email: string; password: string }) =>
      gateway.login(credentials),
  })
}
