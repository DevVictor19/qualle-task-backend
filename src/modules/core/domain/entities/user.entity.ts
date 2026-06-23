import { BaseEntity, BaseEntityProps } from '@/shared/domain';
import { TaskEntity } from './task.entity';

export interface UserEntityProps extends BaseEntityProps {
  name: string;
  email: string;
  password: string;
  createdTasks?: TaskEntity[];
  assignedTasks?: TaskEntity[];
}

export class UserEntity extends BaseEntity {
  name: string;
  email: string;
  password: string;
  createdTasks?: TaskEntity[];
  assignedTasks?: TaskEntity[];

  private constructor({
    name,
    email,
    password,
    createdTasks,
    assignedTasks,
    ...base
  }: UserEntityProps) {
    super(base);
    this.name = name;
    this.email = email;
    this.password = password;
    this.createdTasks = createdTasks;
    this.assignedTasks = assignedTasks;
  }

  static create(props: UserEntityProps): UserEntity {
    return new UserEntity(props);
  }
}
