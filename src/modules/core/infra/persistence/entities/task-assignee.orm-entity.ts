/* eslint-disable @typescript-eslint/no-unsafe-return */
import { Entity, JoinColumn, ManyToOne, PrimaryColumn } from 'typeorm';
import { TaskOrmEntity } from './task.orm-entity';
import { UserOrmEntity } from './user.orm-entity';

@Entity('task_assignee')
export class TaskAssigneeOrmEntity {
  @PrimaryColumn({ type: 'uuid', name: 'task_id' })
  taskId: string;

  @PrimaryColumn({ type: 'uuid', name: 'user_id' })
  userId: string;

  @ManyToOne(() => TaskOrmEntity, (task) => task.taskAssignees)
  @JoinColumn({ name: 'task_id' })
  task: TaskOrmEntity;

  @ManyToOne(() => UserOrmEntity, (user) => user.taskAssignees)
  @JoinColumn({ name: 'user_id' })
  user: UserOrmEntity;
}
