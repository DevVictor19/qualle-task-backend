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
  creatorId: string;
  title: string;
  description?: Maybe<string>;
  status: TaskStatus;
  priority: TaskPriority;
  overDueDate?: Maybe<Date>;
  creator?: UserEntity;
  assignees?: UserEntity[];
  comments?: CommentEntity[];

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
    this.creatorId = creatorId;
    this.title = title;
    this.description = description;
    this.status = status;
    this.priority = priority;
    this.overDueDate = overDueDate;
    this.creator = creator;
    this.assignees = assignees;
    this.comments = comments;
  }

  static create(props: TaskEntityProps): TaskEntity {
    return new TaskEntity(props);
  }

  update(props: TaskEntityUpdateProps): void {
    if (props.title !== undefined) {
      this.title = props.title;
    }
    if (props.description !== undefined) {
      this.description = props.description;
    }
    if (props.status !== undefined) {
      this.status = props.status;
    }
    if (props.priority !== undefined) {
      this.priority = props.priority;
    }
    if (props.overDueDate !== undefined) {
      this.overDueDate = props.overDueDate;
    }
    if (props.assignees !== undefined) {
      this.assignees = props.assignees;
    }
    if (props.comments !== undefined) {
      this.comments = props.comments;
    }
  }
}

export enum TaskStatus {
  TODO = 'TODO',
  IN_PROGRESS = 'IN_PROGRESS',
  DONE = 'DONE',
  CANCELED = 'CANCELED',
}

export enum TaskPriority {
  LOW = 'LOW',
  MEDIUM = 'MEDIUM',
  HIGH = 'HIGH',
}
