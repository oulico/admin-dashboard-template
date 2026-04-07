import { useState, type FormEvent } from 'react'
import { usePresenter } from './hooks/usePresenter'
import { useController } from './hooks/useController'

export const LoginForm = () => {
  const { isLoading, errorMessage } = usePresenter()
  const { handleSubmit } = useController()

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    await handleSubmit(email, password)
  }

  return (
    <form onSubmit={onSubmit}>
      <h1>Login</h1>
      {errorMessage && <div role="alert">{errorMessage}</div>}
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
      <div>
        <label htmlFor="password">Password</label>
        <input
          id="password"
          type="password"
          value={password}
          onChange={e => setPassword(e.target.value)}
          required
        />
      </div>
      <button type="submit" disabled={isLoading}>
        {isLoading ? 'Logging in...' : 'Login'}
      </button>
    </form>
  )
}
