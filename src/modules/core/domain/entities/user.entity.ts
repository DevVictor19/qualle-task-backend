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
  private _name: string;
  private _email: string;
  private _password: string;
  private _createdTasks?: TaskEntity[];
  private _assignedTasks?: TaskEntity[];
  private _comments?: CommentEntity[];

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
    this._name = name;
    this._email = email;
    this._password = password;
    this._createdTasks = createdTasks;
    this._assignedTasks = assignedTasks;
    this._comments = comments;
  }

  static create(props: UserEntityProps): UserEntity {
    return new UserEntity(props);
  }

  get name(): string {
    return this._name;
  }

  get email(): string {
    return this._email;
  }

  get password(): string {
    return this._password;
  }

  get createdTasks(): TaskEntity[] | undefined {
    return this._createdTasks;
  }

  get assignedTasks(): TaskEntity[] | undefined {
    return this._assignedTasks;
  }

  get comments(): CommentEntity[] | undefined {
    return this._comments;
  }
}
