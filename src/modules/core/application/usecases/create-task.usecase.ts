import { UseCase } from '@/shared/application';
import { Injectable } from '@nestjs/common';
import { TaskDto } from '../dtos';
import {
  TaskStatus,
  TaskPriority,
  TaskRepository,
  TaskEntity,
} from '../../domain';
import { TaskMapper } from '../mappers';

export interface CreateTaskInputDto {
  creatorId: string;
  title: string;
  description?: string;
  status: TaskStatus;
  priority: TaskPriority;
  overDueDate?: Date;
}

@Injectable()
export class CreateTaskUseCase implements UseCase<CreateTaskInputDto, TaskDto> {
  constructor(private readonly taskRepository: TaskRepository) {}

  async execute(input: CreateTaskInputDto): Promise<TaskDto> {
    let task = TaskEntity.create({
      creatorId: input.creatorId,
      title: input.title,
      description: input.description,
      status: input.status,
      priority: input.priority,
      overDueDate: input.overDueDate,
    });

    task = await this.taskRepository.save(task);

    return TaskMapper.toDto(task);
  }
}
