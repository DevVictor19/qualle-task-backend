import { BaseEntity, BaseEntityProps } from '@/shared/domain';
import { TaskEntity } from './task.entity';
import { UserEntity } from './user.entity';

export interface CommentEntityProps extends BaseEntityProps {
  content: string;
  userId: string;
  taskId: string;
  task?: TaskEntity;
  user?: UserEntity;
}

export class CommentEntity extends BaseEntity {
  content: string;
  userId: string;
  taskId: string;
  task?: TaskEntity;
  user?: UserEntity;

  private constructor({
    content,
    userId,
    taskId,
    task,
    user,
    ...base
  }: CommentEntityProps) {
    super(base);
    this.content = content;
    this.userId = userId;
    this.taskId = taskId;
    this.task = task;
    this.user = user;
  }

  static create(props: CommentEntityProps): CommentEntity {
    return new CommentEntity(props);
  }
}
