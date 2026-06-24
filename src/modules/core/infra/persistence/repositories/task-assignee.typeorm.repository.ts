import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TaskAssigneeRepository } from '@/modules/core/domain/repositories';
import { TaskAssigneeOrmEntity } from '../entities';

@Injectable()
export class TaskAssigneeTypeOrmRepository extends TaskAssigneeRepository {
  constructor(
    @InjectRepository(TaskAssigneeOrmEntity)
    private readonly repository: Repository<TaskAssigneeOrmEntity>,
  ) {
    super();
  }

  async deleteAndInsert(taskId: string, assigneeIds: string[]): Promise<void> {
    await this.repository.delete({ taskId });

    if (assigneeIds.length === 0) return;

    const entities = assigneeIds.map((userId) =>
      Object.assign(new TaskAssigneeOrmEntity(), { taskId, userId }),
    );

    await this.repository.save(entities);
  }
}
