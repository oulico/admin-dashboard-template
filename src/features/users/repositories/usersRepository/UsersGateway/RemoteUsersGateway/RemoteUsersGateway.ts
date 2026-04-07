import { UsersApi } from '../../../../externalResources/UsersApi/UsersApi'
import {
  UserEntitySchema,
  type UserEntity,
} from '../../../../types/entities/UserEntity'
import type { IUsersGateway } from '../UsersGateway.types'

export class RemoteUsersGateway implements IUsersGateway {
  async fetchAll(): Promise<UserEntity[]> {
    const dtos = await UsersApi.getAll()

    return dtos.map((dto) =>
      UserEntitySchema.parse({
        id: dto.id,
        name: dto.name,
        email: dto.email,
      }),
    )
  }

  async fetchById(id: string): Promise<UserEntity> {
    const dto = await UsersApi.getById(id)

    return UserEntitySchema.parse({
      id: dto.id,
      name: dto.name,
      email: dto.email,
    })
  }

  async create(data: { name: string; email: string }): Promise<UserEntity> {
    const dto = await UsersApi.create(data)

    return UserEntitySchema.parse({
      id: dto.id,
      name: dto.name,
      email: dto.email,
    })
  }

  async update(
    id: string,
    data: { name?: string; email?: string },
  ): Promise<UserEntity> {
    const dto = await UsersApi.update(id, data)

    return UserEntitySchema.parse({
      id: dto.id,
      name: dto.name,
      email: dto.email,
    })
  }

  async remove(id: string): Promise<void> {
    await UsersApi.delete(id)
  }
}
