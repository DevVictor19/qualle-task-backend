import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TypeOrmPaginatedRepository } from '@/shared/infra/persistence/repositories';
import {
  CommentEntity,
  TaskEntity,
  UserEntity,
} from '@/modules/core/domain/entities';
import { TaskRepository } from '@/modules/core/domain/repositories';
import { CommentOrmEntity, TaskOrmEntity, UserOrmEntity } from '../entities';

@Injectable()
export class TaskTypeOrmRepository
  extends TypeOrmPaginatedRepository<TaskEntity, TaskOrmEntity>
  implements TaskRepository
{
  constructor(
    @InjectRepository(TaskOrmEntity)
    repository: Repository<TaskOrmEntity>,
  ) {
    super(repository);
  }

  getRelations(): string[] {
    return ['creator', 'taskAssignees.user', 'comments'];
  }

  toInfraEntity(entity: TaskEntity): TaskOrmEntity {
    return Object.assign(new TaskOrmEntity(), {
      id: entity.id,
      createdAt: entity.createdAt,
      updatedAt: entity.updatedAt,
      creatorId: entity.creatorId,
      title: entity.title,
      description: entity.description,
      status: entity.status,
      priority: entity.priority,
      overdueDate: entity.overDueDate,
    });
  }

  toDomainEntity(orm: TaskOrmEntity): TaskEntity {
    return TaskEntity.create({
      id: orm.id,
      createdAt: orm.createdAt,
      updatedAt: orm.updatedAt,
      creatorId: orm.creatorId,
      title: orm.title,
      description: orm.description,
      status: orm.status,
      priority: orm.priority,
      overDueDate: orm.overdueDate,
      creator: orm.creator ? this.mapUserToEntity(orm.creator) : undefined,
      assignees: orm.taskAssignees
        ?.map((ta) => (ta.user ? this.mapUserToEntity(ta.user) : null))
        .filter((u): u is UserEntity => u !== null),
      comments: orm.comments?.map((c) => this.mapCommentToEntity(c)),
    });
  }

  private mapUserToEntity(orm: UserOrmEntity): UserEntity {
    return UserEntity.create({
      id: orm.id,
      createdAt: orm.createdAt,
      updatedAt: orm.updatedAt,
      name: orm.name,
      email: orm.email,
      password: orm.password,
    });
  }

  private mapCommentToEntity(orm: CommentOrmEntity): CommentEntity {
    return CommentEntity.create({
      id: orm.id,
      createdAt: orm.createdAt,
      updatedAt: orm.updatedAt,
      content: orm.content,
      userId: orm.userId,
      taskId: orm.taskId,
    });
  }
}
