import { useUsersQuery } from '../../repositories/usersRepository/usersRepository'

export type UserViewModel = {
  id: string
  displayName: string
  email: string
  initials: string
}

export const useUsersSelector = () => {
  const { data, isLoading, isError, error } = useUsersQuery()

  return {
    users: (data ?? []).map((entity): UserViewModel => ({
      id: entity.id,
      displayName: entity.name,
      email: entity.email,
      initials: entity.name.slice(0, 2).toUpperCase(),
    })),
    isLoading,
    isError,
    error,
  }
}
