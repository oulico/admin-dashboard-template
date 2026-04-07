import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useUsersGateway } from './hooks/useUsersGateway'
import { USERS_KEYS } from './usersRepositoryKeys'
import type { UserEntity } from '../../types/entities/UserEntity'

export const useUsersQuery = () => {
  const gateway = useUsersGateway()
  return useQuery({
    queryKey: USERS_KEYS.all,
    queryFn: (): Promise<UserEntity[]> => gateway.fetchAll(),
  })
}

export const useUserQuery = (id: string) => {
  const gateway = useUsersGateway()
  return useQuery({
    queryKey: USERS_KEYS.detail(id),
    queryFn: (): Promise<UserEntity> => gateway.fetchById(id),
    enabled: !!id,
  })
}

export const useCreateUserMutation = () => {
  const gateway = useUsersGateway()
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (data: { name: string; email: string }) => gateway.create(data),
    onSuccess: () => qc.invalidateQueries({ queryKey: USERS_KEYS.all }),
  })
}

export const useUpdateUserMutation = () => {
  const gateway = useUsersGateway()
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: { name?: string; email?: string } }) =>
      gateway.update(id, data),
    onSuccess: () => qc.invalidateQueries({ queryKey: USERS_KEYS.all }),
  })
}

export const useDeleteUserMutation = () => {
  const gateway = useUsersGateway()
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => gateway.remove(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: USERS_KEYS.all }),
  })
}
