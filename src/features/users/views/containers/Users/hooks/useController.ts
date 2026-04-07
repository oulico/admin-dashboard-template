import { useDeleteUserUseCase } from '../../../../useCases/useDeleteUserUseCase'

export const useController = () => {
  const { deleteUser, isDeleting } = useDeleteUserUseCase()
  return {
    handleDelete: (id: string) => deleteUser(id),
    isDeleting,
  }
}
