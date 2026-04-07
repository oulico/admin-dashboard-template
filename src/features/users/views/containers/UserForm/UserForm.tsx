import { useEffect, useState, type FormEvent } from 'react'
import { usePresenter } from './hooks/usePresenter'
import { useController } from './hooks/useController'

type UserFormProps = {
  userId?: string
  onSuccess?: () => void
}

export const UserForm = ({ userId, onSuccess }: UserFormProps) => {
  const { user, isLoading, isEditMode } = usePresenter(userId)
  const { handleSubmit, isSubmitting } = useController()

  const [name, setName] = useState('')
  const [email, setEmail] = useState('')

  useEffect(() => {
    if (user) {
      setName(user.displayName)
      setEmail(user.email)
    }
  }, [user])

  if (isLoading) return <div>Loading...</div>

  const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    await handleSubmit({ name, email }, userId)
    onSuccess?.()
  }

  return (
    <form onSubmit={onSubmit}>
      <h2>{isEditMode ? 'Edit User' : 'Create User'}</h2>
      <div>
        <label htmlFor="name">Name</label>
        <input
          id="name"
          type="text"
          value={name}
          onChange={e => setName(e.target.value)}
          required
        />
      </div>
      <div>
        <label htmlFor="email">Email</label>
        <input
          id="email"
          type="email"
          value={email}
          onChange={e => setEmail(e.target.value)}
          required
        />
      </div>
      <button type="submit" disabled={isSubmitting}>
        {isSubmitting ? 'Saving...' : isEditMode ? 'Update' : 'Create'}
      </button>
    </form>
  )
}
