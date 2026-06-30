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
  private _content: string;
  private _userId: string;
  private _taskId: string;
  private _task?: TaskEntity;
  private _user?: UserEntity;

  private constructor({
    content,
    userId,
    taskId,
    task,
    user,
    ...base
  }: CommentEntityProps) {
    super(base);
    this._content = content;
    this._userId = userId;
    this._taskId = taskId;
    this._task = task;
    this._user = user;
  }

  static create(props: CommentEntityProps): CommentEntity {
    return new CommentEntity(props);
  }

  get content(): string {
    return this._content;
  }

  get userId(): string {
    return this._userId;
  }

  get taskId(): string {
    return this._taskId;
  }

  get task(): TaskEntity | undefined {
    return this._task;
  }

  get user(): UserEntity | undefined {
    return this._user;
  }
}
