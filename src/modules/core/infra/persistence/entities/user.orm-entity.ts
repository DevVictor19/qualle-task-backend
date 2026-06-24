/* eslint-disable @typescript-eslint/no-unsafe-return */
import { Column, Entity, OneToMany } from 'typeorm';
import { BaseOrmEntity } from '@/shared/infra/persistence/entities/base-orm.entity';
import { TaskOrmEntity } from './task.orm-entity';
import { TaskAssigneeOrmEntity } from './task-assignee.orm-entity';
import { CommentOrmEntity } from './comment.orm-entity';

@Entity('user')
export class UserOrmEntity extends BaseOrmEntity {
  @Column({ type: 'varchar' })
  name: string;

  @Column({ type: 'varchar', unique: true })
  email: string;

  @Column({ type: 'varchar' })
  password: string;

  @OneToMany(() => TaskOrmEntity, (task) => task.creator)
  createdTasks: TaskOrmEntity[];

  @OneToMany(() => TaskAssigneeOrmEntity, (ta) => ta.user)
  taskAssignees: TaskAssigneeOrmEntity[];

  @OneToMany(() => CommentOrmEntity, (comment) => comment.user)
  comments: CommentOrmEntity[];
}
