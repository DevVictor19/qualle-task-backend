import { PaginatedRepository } from '@/shared/domain';
import { TaskEntity } from '../entities';

export abstract class TaskRepository extends PaginatedRepository<TaskEntity> {}
