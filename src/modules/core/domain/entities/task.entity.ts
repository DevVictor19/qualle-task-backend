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
