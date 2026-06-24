import { UseCase } from '@/shared/application';
import { Injectable } from '@nestjs/common';
import { TaskDto } from '../dtos';
import { TaskRepository } from '../../domain';
import { ResourceNotFoundError } from '../errors';
import { TaskMapper } from '../mappers';

export interface FindTaskDetailsInputDto {
  taskId: string;
}

@Injectable()
export class FindTaskDetailsUseCase implements UseCase<
  FindTaskDetailsInputDto,
  TaskDto
> {
  constructor(private readonly taskRepository: TaskRepository) {}

  async execute(input: FindTaskDetailsInputDto): Promise<TaskDto> {
    const task = await this.taskRepository.findById(input.taskId);
    if (!task) {
      throw new ResourceNotFoundError(`Task with ID ${input.taskId} not found`);
    }

    return TaskMapper.toDto(task);
  }
}
