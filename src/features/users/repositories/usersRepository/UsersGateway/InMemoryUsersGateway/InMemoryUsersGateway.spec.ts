import { describe, it, expect, beforeEach } from 'vitest'
import { InMemoryUsersGateway } from './InMemoryUsersGateway'

describe('InMemoryUsersGateway', () => {
  let gateway: InMemoryUsersGateway

  beforeEach(() => {
    gateway = new InMemoryUsersGateway()
  })

  describe('fetchAll', () => {
    it('returns all seeded users (3 initial)', async () => {
      const users = await gateway.fetchAll()
      expect(users).toHaveLength(3)
    })
  })

  describe('fetchById', () => {
    it('returns a user by id', async () => {
      const users = await gateway.fetchAll()
      const firstId = users[0].id
      const user = await gateway.fetchById(firstId)
      expect(user.id).toBe(firstId)
    })

    it('throws when user not found', async () => {
      await expect(gateway.fetchById('00000000-0000-0000-0000-999999999999')).rejects.toThrow()
    })
  })

  describe('create', () => {
    it('adds a new user and returns it with generated id', async () => {
      const created = await gateway.create({ name: 'New User', email: 'new@example.com' })
      expect(created.name).toBe('New User')
      expect(created.email).toBe('new@example.com')
      expect(created.id).toBeTruthy()

      const all = await gateway.fetchAll()
      expect(all).toHaveLength(4)
    })
  })

  describe('update', () => {
    it('updates a user and returns modified entity', async () => {
      const users = await gateway.fetchAll()
      const userId = users[0].id
      const updated = await gateway.update(userId, { name: 'Updated Name' })
      expect(updated.name).toBe('Updated Name')
      expect(updated.id).toBe(userId)
    })

    it('throws when user not found', async () => {
      await expect(gateway.update('00000000-0000-0000-0000-999999999999', { name: 'x' })).rejects.toThrow()
    })
  })

  describe('remove', () => {
    it('removes a user from store', async () => {
      const users = await gateway.fetchAll()
      const userId = users[0].id
      await gateway.remove(userId)
      const remaining = await gateway.fetchAll()
      expect(remaining).toHaveLength(2)
    })
  })
})
