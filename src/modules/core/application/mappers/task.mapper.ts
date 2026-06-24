import { TaskEntity } from '../../domain';
import { TaskDto } from '../dtos';
import { CommentMapper } from './comment.mapper';
import { UserMapper } from './user.mapper';

export class TaskMapper {
  static toDto(task: TaskEntity): TaskDto {
    return {
      id: task.id,
      creatorId: task.creatorId,
      title: task.title,
      description: task.description,
      status: task.status,
      priority: task.priority,
      overDueDate: task.overDueDate,
      creator: task.creator ? UserMapper.toDto(task.creator) : undefined,
      assignees: task.assignees
        ? UserMapper.toCollectionDto(task.assignees)
        : undefined,
      comments: task.comments
        ? CommentMapper.toCollectionDto(task.comments)
        : undefined,
      createdAt: task.createdAt,
      updatedAt: task.updatedAt,
    };
  }

  static toCollectionDto(tasks: TaskEntity[]): TaskDto[] {
    return tasks.map((task) => this.toDto(task));
  }
}
