import { BaseEntity, BaseEntityProps, Maybe } from '@/shared/domain';
import { UserEntity } from './user.entity';

export interface TaskEntityProps extends BaseEntityProps {
  creatorId: string;
  title: string;
  description?: Maybe<string>;
  status: TaskStatus;
  priority: TaskPriority;
  overDueDate?: Maybe<Date>;
  creator?: UserEntity;
  assignees?: UserEntity[];
}

export interface TaskEntityUpdateProps {
  title?: string;
  description?: Maybe<string>;
  status?: TaskStatus;
  priority?: TaskPriority;
  overDueDate?: Maybe<Date>;
  assignees?: UserEntity[];
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

  private constructor({
    creatorId,
    title,
    description,
    status,
    priority,
    overDueDate,
    creator,
    assignees,
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
