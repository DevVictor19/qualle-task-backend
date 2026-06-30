import { BaseEntity, BaseEntityProps, Maybe } from '@/shared/domain';
import { UserEntity } from './user.entity';
import { CommentEntity } from './comment.entity';

export interface TaskEntityProps extends BaseEntityProps {
  creatorId: string;
  title: string;
  description?: Maybe<string>;
  status: TaskStatus;
  priority: TaskPriority;
  overDueDate?: Maybe<Date>;
  creator?: UserEntity;
  assignees?: UserEntity[];
  comments?: CommentEntity[];
}

export interface TaskEntityUpdateProps {
  title?: string;
  description?: Maybe<string>;
  status?: TaskStatus;
  priority?: TaskPriority;
  overDueDate?: Maybe<Date>;
  assignees?: UserEntity[];
  comments?: CommentEntity[];
}

export class TaskEntity extends BaseEntity {
  private _creatorId: string;
  private _title: string;
  private _description?: Maybe<string>;
  private _status: TaskStatus;
  private _priority: TaskPriority;
  private _overDueDate?: Maybe<Date>;
  private _creator?: UserEntity;
  private _assignees?: UserEntity[];
  private _comments?: CommentEntity[];

  private constructor({
    creatorId,
    title,
    description,
    status,
    priority,
    overDueDate,
    creator,
    assignees,
    comments,
    ...base
  }: TaskEntityProps) {
    super(base);
    this._creatorId = creatorId;
    this._title = title;
    this._description = description;
    this._status = status;
    this._priority = priority;
    this._overDueDate = overDueDate;
    this._creator = creator;
    this._assignees = assignees;
    this._comments = comments;
  }

  static create(props: TaskEntityProps): TaskEntity {
    return new TaskEntity(props);
  }

  update(props: TaskEntityUpdateProps): void {
    if (props.title !== undefined) {
      this._title = props.title;
    }
    if (props.description !== undefined) {
      this._description = props.description;
    }
    if (props.status !== undefined) {
      this._status = props.status;
    }
    if (props.priority !== undefined) {
      this._priority = props.priority;
    }
    if (props.overDueDate !== undefined) {
      this._overDueDate = props.overDueDate;
    }
    if (props.assignees !== undefined) {
      this._assignees = props.assignees;
    }
    if (props.comments !== undefined) {
      this._comments = props.comments;
    }
  }

  get creatorId(): string {
    return this._creatorId;
  }

  get title(): string {
    return this._title;
  }

  get description(): Maybe<string> {
    return this._description;
  }

  get status(): TaskStatus {
    return this._status;
  }

  get priority(): TaskPriority {
    return this._priority;
  }

  get overDueDate(): Maybe<Date> {
    return this._overDueDate;
  }

  get creator(): UserEntity | undefined {
    return this._creator;
  }

  get assignees(): UserEntity[] | undefined {
    return this._assignees;
  }

  get comments(): CommentEntity[] | undefined {
    return this._comments;
  }
}

export enum TaskStatus {
  TODO = 'TODO',
  IN_PROGRESS = 'IN_PROGRESS',
  DONE = 'DONE',
  CANCELLED = 'CANCELLED',
}

export enum TaskPriority {
  LOW = 'LOW',
  MEDIUM = 'MEDIUM',
  HIGH = 'HIGH',
}
