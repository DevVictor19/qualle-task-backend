import { BaseEntity, BaseEntityProps } from '@/shared/domain';
import { TaskEntity } from './task.entity';
import { CommentEntity } from './comment.entity';

export interface UserEntityProps extends BaseEntityProps {
  name: string;
  email: string;
  password: string;
  createdTasks?: TaskEntity[];
  assignedTasks?: TaskEntity[];
  comments?: CommentEntity[];
}

export class UserEntity extends BaseEntity {
  name: string;
  email: string;
  password: string;
  createdTasks?: TaskEntity[];
  assignedTasks?: TaskEntity[];
  comments?: CommentEntity[];

  private constructor({
    name,
    email,
    password,
    createdTasks,
    assignedTasks,
    comments,
    ...base
  }: UserEntityProps) {
    super(base);
    this.name = name;
    this.email = email;
    this.password = password;
    this.createdTasks = createdTasks;
    this.assignedTasks = assignedTasks;
    this.comments = comments;
  }

  static create(props: UserEntityProps): UserEntity {
    return new UserEntity(props);
  }
}
