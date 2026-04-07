import { useLoginUseCase } from '../../../../useCases/useLoginUseCase'

export const useController = () => {
  const { login } = useLoginUseCase()
  return {
    handleSubmit: (email: string, password: string) => login(email, password),
  }
}
