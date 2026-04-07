import { useEffect } from 'react'
import { checkAuthAndRedirect } from '@/shared/lib/auth'
import { usePresenter } from './hooks/usePresenter'
import { useController } from './hooks/useController'

export const Users = () => {
  useEffect(() => { checkAuthAndRedirect() }, [])

  const { users, isLoading, isError } = usePresenter()
  const { handleDelete, isDeleting } = useController()

  if (isLoading) return <div>Loading...</div>
  if (isError) return <div>Error loading users</div>

  return (
    <div>
      <h1>Users</h1>
      <table>
        <thead>
          <tr>
            <th>Name</th>
            <th>Email</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.map(user => (
            <tr key={user.id}>
              <td>{user.displayName}</td>
              <td>{user.email}</td>
              <td>
                <button
                  onClick={() => handleDelete(user.id)}
                  disabled={isDeleting}
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
