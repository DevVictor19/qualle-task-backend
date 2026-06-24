import { UserEntity } from '../../domain';
import { UserDto } from '../dtos';
import { TaskMapper } from './task.mapper';

export class UserMapper {
  static toDto(user: UserEntity): UserDto {
    return {
      id: user.id,
      email: user.email,
      name: user.name,
      assignedTasks: user.assignedTasks
        ? TaskMapper.toCollectionDto(user.assignedTasks)
        : undefined,
      createdTasks: user.createdTasks
        ? TaskMapper.toCollectionDto(user.createdTasks)
        : undefined,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    };
  }

  static toCollectionDto(users: UserEntity[]): UserDto[] {
    return users.map((user) => this.toDto(user));
  }
}
