import { useEffect } from 'react'
import { checkAuthAndRedirect } from '@/shared/lib/auth'
import { runtimeEnv } from '@/shared/lib'
import { usePresenter } from './hooks/usePresenter'
import { useController } from './hooks/useController'

export const Users = () => {
  useEffect(() => {
    if (runtimeEnv.VITE_USE_MOCK !== 'true') {
      checkAuthAndRedirect()
    }
  }, [])

  const { users } = usePresenter()
  const { handleDelete, isDeleting } = useController()

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
