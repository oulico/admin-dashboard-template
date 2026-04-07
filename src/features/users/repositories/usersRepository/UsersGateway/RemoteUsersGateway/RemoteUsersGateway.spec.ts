import { beforeEach, describe, expect, it, vi } from 'vitest'
import { RemoteUsersGateway } from './RemoteUsersGateway'

vi.mock('../../../../externalResources/UsersApi/UsersApi', () => ({
  UsersApi: {
    getAll: vi.fn(),
    getById: vi.fn(),
    create: vi.fn(),
    update: vi.fn(),
    delete: vi.fn(),
  },
}))

import { UsersApi } from '../../../../externalResources/UsersApi/UsersApi'

const VALID_UUID = '123e4567-e89b-42d3-a456-426614174000'
const VALID_DTO = {
  id: VALID_UUID,
  name: 'Alice Johnson',
  email: 'alice@example.com',
}

describe('RemoteUsersGateway', () => {
  let gateway: RemoteUsersGateway

  beforeEach(() => {
    gateway = new RemoteUsersGateway()
    vi.clearAllMocks()
  })

  describe('fetchAll', () => {
    it('maps DTOs to UserEntities', async () => {
      vi.mocked(UsersApi.getAll).mockResolvedValue([VALID_DTO])

      const result = await gateway.fetchAll()

      expect(result).toHaveLength(1)
      expect(result[0]).toEqual(VALID_DTO)
    })

    it('throws if API returns invalid data', async () => {
      vi.mocked(UsersApi.getAll).mockResolvedValue([
        { id: 'not-a-uuid', name: 'Alice', email: 'alice@example.com' },
      ] as never)

      await expect(gateway.fetchAll()).rejects.toThrow()
    })
  })

  describe('fetchById', () => {
    it('returns a UserEntity by id', async () => {
      vi.mocked(UsersApi.getById).mockResolvedValue(VALID_DTO)

      const result = await gateway.fetchById(VALID_UUID)

      expect(result.id).toBe(VALID_UUID)
      expect(result.email).toBe('alice@example.com')
    })
  })

  describe('create', () => {
    it('creates a user and returns mapped entity', async () => {
      vi.mocked(UsersApi.create).mockResolvedValue(VALID_DTO)

      const result = await gateway.create({
        name: 'Alice Johnson',
        email: 'alice@example.com',
      })

      expect(result.name).toBe('Alice Johnson')
      expect(UsersApi.create).toHaveBeenCalledWith({
        name: 'Alice Johnson',
        email: 'alice@example.com',
      })
    })
  })

  describe('update', () => {
    it('updates a user and returns mapped entity', async () => {
      const updatedDto = { ...VALID_DTO, name: 'Alice Smith' }
      vi.mocked(UsersApi.update).mockResolvedValue(updatedDto)

      const result = await gateway.update(VALID_UUID, { name: 'Alice Smith' })

      expect(result.name).toBe('Alice Smith')
      expect(UsersApi.update).toHaveBeenCalledWith(VALID_UUID, {
        name: 'Alice Smith',
      })
    })
  })

  describe('remove', () => {
    it('calls delete with correct id', async () => {
      vi.mocked(UsersApi.delete).mockResolvedValue(undefined)

      await gateway.remove(VALID_UUID)

      expect(UsersApi.delete).toHaveBeenCalledWith(VALID_UUID)
    })
  })
})
