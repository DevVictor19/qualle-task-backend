import { CommentEntity } from '../../domain';
import { CommentDto } from '../dtos';
import { TaskMapper } from './task.mapper';
import { UserMapper } from './user.mapper';

export class CommentMapper {
  static toDto(entity: CommentEntity): CommentDto {
    return {
      id: entity.id,
      taskId: entity.taskId,
      userId: entity.userId,
      content: entity.content,
      task: entity.task ? TaskMapper.toDto(entity.task) : undefined,
      user: entity.user ? UserMapper.toDto(entity.user) : undefined,
      createdAt: entity.createdAt,
      updatedAt: entity.updatedAt,
    };
  }

  static toCollectionDto(entities: CommentEntity[]): CommentDto[] {
    return entities.map((entity) => this.toDto(entity));
  }
}
