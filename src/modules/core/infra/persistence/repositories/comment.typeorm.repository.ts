import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TypeOrmBaseRepository } from '@/shared/infra/persistence/repositories';
import {
  CommentEntity,
  TaskEntity,
  UserEntity,
} from '@/modules/core/domain/entities';
import { CommentRepository } from '@/modules/core/domain/repositories';
import { CommentOrmEntity, TaskOrmEntity, UserOrmEntity } from '../entities';

@Injectable()
export class CommentTypeOrmRepository
  extends TypeOrmBaseRepository<CommentEntity, CommentOrmEntity>
  implements CommentRepository
{
  constructor(
    @InjectRepository(CommentOrmEntity)
    repository: Repository<CommentOrmEntity>,
  ) {
    super(repository);
  }

  getRelations(): string[] {
    return [];
  }

  toInfraEntity(entity: CommentEntity): CommentOrmEntity {
    return Object.assign(new CommentOrmEntity(), {
      id: entity.id,
      createdAt: entity.createdAt,
      updatedAt: entity.updatedAt,
      content: entity.content,
      userId: entity.userId,
      taskId: entity.taskId,
    });
  }

  toDomainEntity(orm: CommentOrmEntity): CommentEntity {
    return CommentEntity.create({
      id: orm.id,
      createdAt: orm.createdAt,
      updatedAt: orm.updatedAt,
      content: orm.content,
      userId: orm.userId,
      taskId: orm.taskId,
      task: orm.task ? this.mapTaskToEntity(orm.task) : undefined,
      user: orm.user ? this.mapUserToEntity(orm.user) : undefined,
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

  private mapTaskToEntity(orm: TaskOrmEntity): TaskEntity {
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
    });
  }
}
