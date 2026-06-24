/* eslint-disable @typescript-eslint/no-unsafe-return */
import { Column, Entity, JoinColumn, ManyToOne, OneToMany } from 'typeorm';
import { BaseOrmEntity } from '@/shared/infra/persistence/entities/base-orm.entity';
import {
  TaskPriority,
  TaskStatus,
} from '@/modules/core/domain/entities/task.entity';
import { UserOrmEntity } from './user.orm-entity';
import { TaskAssigneeOrmEntity } from './task-assignee.orm-entity';
import { CommentOrmEntity } from './comment.orm-entity';

@Entity('task')
export class TaskOrmEntity extends BaseOrmEntity {
  @Column({ type: 'uuid', name: 'creator_id' })
  creatorId: string;

  @Column({ type: 'varchar' })
  title: string;

  @Column({ type: 'text', nullable: true })
  description: string | null;

  @Column({ type: 'enum', enum: TaskStatus })
  status: TaskStatus;

  @Column({ type: 'enum', enum: TaskPriority })
  priority: TaskPriority;

  @Column({ type: 'timestamp', nullable: true, name: 'overdue_date' })
  overdueDate: Date | null;

  @ManyToOne(() => UserOrmEntity, (user) => user.createdTasks)
  @JoinColumn({ name: 'creator_id' })
  creator: UserOrmEntity;

  @OneToMany(() => TaskAssigneeOrmEntity, (ta) => ta.task)
  taskAssignees: TaskAssigneeOrmEntity[];

  @OneToMany(() => CommentOrmEntity, (comment) => comment.task)
  comments: CommentOrmEntity[];
}
