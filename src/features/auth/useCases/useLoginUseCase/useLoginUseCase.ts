import { useLoginMutation } from '../../repositories/authRepository/authRepository'

export const useLoginUseCase = () => {
  const { mutateAsync, isPending } = useLoginMutation()

  return {
    login: async (email: string, password: string): Promise<void> => {
      await mutateAsync({ email, password })
      window.location.href = '/users'
    },
    isLoggingIn: isPending,
  }
}
