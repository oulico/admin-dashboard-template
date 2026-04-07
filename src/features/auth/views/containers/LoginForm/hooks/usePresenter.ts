import { useLoginMutation } from '../../../../repositories/authRepository/authRepository'

export const usePresenter = () => {
  const { isPending, isError, error } = useLoginMutation()
  return {
    isLoading: isPending,
    errorMessage: isError && error instanceof Error ? error.message : null,
  }
}
