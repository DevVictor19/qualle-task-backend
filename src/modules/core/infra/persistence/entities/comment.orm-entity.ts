/* eslint-disable @typescript-eslint/no-unsafe-return */
import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { BaseOrmEntity } from '@/shared/infra/persistence/entities/base-orm.entity';
import { TaskOrmEntity } from './task.orm-entity';
import { UserOrmEntity } from './user.orm-entity';

@Entity('comment')
export class CommentOrmEntity extends BaseOrmEntity {
  @Column({ type: 'uuid', name: 'task_id' })
  taskId: string;

  @Column({ type: 'uuid', name: 'user_id' })
  userId: string;

  @Column({ type: 'text' })
  content: string;

  @ManyToOne(() => TaskOrmEntity, (task) => task.comments)
  @JoinColumn({ name: 'task_id' })
  task: TaskOrmEntity;

  @ManyToOne(() => UserOrmEntity, (user) => user.comments)
  @JoinColumn({ name: 'user_id' })
  user: UserOrmEntity;
}
