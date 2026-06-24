import { UseCase } from '@/shared/application';
import { PaginatedResult, PaginatedSearchParams } from '@/shared/domain';
import { Injectable } from '@nestjs/common';
import { TaskDto } from '../dtos';
import { TaskRepository } from '../../domain';
import { TaskMapper } from '../mappers';

@Injectable()
export class FindTasksPaginatedUseCase implements UseCase<
  PaginatedSearchParams,
  PaginatedResult<TaskDto>
> {
  constructor(private readonly taskRepository: TaskRepository) {}

  async execute(
    input: PaginatedSearchParams,
  ): Promise<PaginatedResult<TaskDto>> {
    const result = await this.taskRepository.findPaginated(input);

    return {
      page: result.page,
      limit: result.limit,
      total: result.total,
      data: TaskMapper.toCollectionDto(result.data),
    };
  }
}
