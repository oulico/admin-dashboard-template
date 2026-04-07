import { useUserQuery } from '../../repositories/usersRepository/usersRepository'
import type { UserViewModel } from '../useUsersSelector/useUsersSelector'

export const useUserByIdSelector = (id: string) => {
  const { data, isLoading, isError } = useUserQuery(id)

  const user: UserViewModel | undefined = data
    ? {
        id: data.id,
        displayName: data.name,
        email: data.email,
        initials: data.name.slice(0, 2).toUpperCase(),
      }
    : undefined

  return { user, isLoading, isError }
}
