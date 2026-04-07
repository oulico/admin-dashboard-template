import { describe, it, expect, vi } from 'vitest'
import { renderHook } from '@testing-library/react'
import { useUsersSelector } from './useUsersSelector'

vi.mock('../../repositories/usersRepository/usersRepository', () => ({
  useUsersQuery: vi.fn(),
}))

import { useUsersQuery } from '../../repositories/usersRepository/usersRepository'

const MOCK_USERS = [
  { id: '123e4567-e89b-12d3-a456-426614174000', name: 'Alice Johnson', email: 'alice@example.com' },
  { id: '123e4567-e89b-12d3-a456-426614174001', name: 'Bob', email: 'bob@example.com' },
]

describe('useUsersSelector', () => {
  it('maps entities to view models with correct fields', () => {
    vi.mocked(useUsersQuery).mockReturnValue({
      data: MOCK_USERS,
      isLoading: false,
      isError: false,
      error: null,
    } as ReturnType<typeof useUsersQuery>)

    const { result } = renderHook(() => useUsersSelector())

    expect(result.current.users).toHaveLength(2)
    expect(result.current.users[0].displayName).toBe('Alice Johnson')
    expect(result.current.users[0].email).toBe('alice@example.com')
    expect(result.current.users[0].id).toBe('123e4567-e89b-12d3-a456-426614174000')
  })

  it('computes initials from first 2 characters', () => {
    vi.mocked(useUsersQuery).mockReturnValue({
      data: MOCK_USERS,
      isLoading: false,
      isError: false,
      error: null,
    } as ReturnType<typeof useUsersQuery>)

    const { result } = renderHook(() => useUsersSelector())

    expect(result.current.users[0].initials).toBe('AL')
    expect(result.current.users[1].initials).toBe('BO')
  })

  it('returns empty array when data is undefined', () => {
    vi.mocked(useUsersQuery).mockReturnValue({
      data: undefined,
      isLoading: true,
      isError: false,
      error: null,
    } as ReturnType<typeof useUsersQuery>)

    const { result } = renderHook(() => useUsersSelector())

    expect(result.current.users).toHaveLength(0)
    expect(result.current.isLoading).toBe(true)
  })

  it('propagates isError and error from query', () => {
    const mockError = new Error('Network failure')
    vi.mocked(useUsersQuery).mockReturnValue({
      data: undefined,
      isLoading: false,
      isError: true,
      error: mockError,
    } as ReturnType<typeof useUsersQuery>)

    const { result } = renderHook(() => useUsersSelector())

    expect(result.current.isError).toBe(true)
    expect(result.current.error).toBe(mockError)
  })
})
