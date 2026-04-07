import type { IUsersGateway } from '../UsersGateway.types'
import type { UserEntity } from '../../../../types/entities/UserEntity'

export class InMemoryUsersGateway implements IUsersGateway {
  private users: Map<string, UserEntity>

  constructor() {
    this.users = new Map([
      [
        '10000000-0000-0000-0000-000000000001',
        {
          id: '10000000-0000-0000-0000-000000000001',
          name: 'Alice Johnson',
          email: 'alice@example.com',
        },
      ],
      [
        '10000000-0000-0000-0000-000000000002',
        {
          id: '10000000-0000-0000-0000-000000000002',
          name: 'Bob Smith',
          email: 'bob@example.com',
        },
      ],
      [
        '10000000-0000-0000-0000-000000000003',
        {
          id: '10000000-0000-0000-0000-000000000003',
          name: 'Carol White',
          email: 'carol@example.com',
        },
      ],
    ])
  }

  async fetchAll(): Promise<UserEntity[]> {
    return Array.from(this.users.values())
  }

  async fetchById(id: string): Promise<UserEntity> {
    const user = this.users.get(id)
    if (!user) throw new Error(`User not found: ${id}`)
    return user
  }

  async create(data: { name: string; email: string }): Promise<UserEntity> {
    const id = crypto.randomUUID()
    const user: UserEntity = { id, name: data.name, email: data.email }
    this.users.set(id, user)
    return user
  }

  async update(
    id: string,
    data: { name?: string; email?: string },
  ): Promise<UserEntity> {
    const existing = this.users.get(id)
    if (!existing) throw new Error(`User not found: ${id}`)
    const updated: UserEntity = {
      id,
      name: data.name ?? existing.name,
      email: data.email ?? existing.email,
    }
    this.users.set(id, updated)
    return updated
  }

  async remove(id: string): Promise<void> {
    this.users.delete(id)
  }
}
