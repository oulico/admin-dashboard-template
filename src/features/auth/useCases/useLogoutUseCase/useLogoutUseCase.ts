import { useNavigate } from '@tanstack/react-router'
import { useLogoutMutation } from '../../repositories/authRepository/authRepository'

export const useLogoutUseCase = () => {
  const { mutateAsync, isPending } = useLogoutMutation()
  const navigate = useNavigate()

  return {
    logout: async (): Promise<void> => {
      await mutateAsync()
      await navigate({ to: '/login' })
    },
    isLoggingOut: isPending,
  }
}
