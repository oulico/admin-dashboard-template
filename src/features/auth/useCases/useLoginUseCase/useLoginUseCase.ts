import { useNavigate } from '@tanstack/react-router'
import { useLoginMutation } from '../../repositories/authRepository/authRepository'

export const useLoginUseCase = () => {
  const { mutateAsync, isPending } = useLoginMutation()
  const navigate = useNavigate()

  return {
    login: async (email: string, password: string): Promise<void> => {
      await mutateAsync({ email, password })
      await navigate({ to: '/users' })
    },
    isLoggingIn: isPending,
  }
}
