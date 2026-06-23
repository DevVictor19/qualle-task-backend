import { BaseEntity, BaseEntityProps } from '@/shared/domain';

export interface CommentEntityProps extends BaseEntityProps {
  content: string;
  userId: string;
  taskId: string;
}

export class CommentEntity extends BaseEntity {
  content: string;
  userId: string;
  taskId: string;

  private constructor({
    content,
    userId,
    taskId,
    ...base
  }: CommentEntityProps) {
    super(base);
    this.content = content;
    this.userId = userId;
    this.taskId = taskId;
  }

  static create(props: CommentEntityProps): CommentEntity {
    return new CommentEntity(props);
  }
}
