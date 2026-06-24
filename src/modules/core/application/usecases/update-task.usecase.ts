import { UseCase } from '@/shared/application';
import { Injectable } from '@nestjs/common';
import {
  TaskStatus,
  TaskPriority,
  TaskRepository,
  TaskEvent,
  TaskEventType,
} from '../../domain';
import { TaskDto } from '../dtos';
import { TaskEventBusService } from '../services';
import { ResourceNotFoundError } from '../errors';
import { TaskMapper } from '../mappers';

export interface UpdateTaskInputDto {
  taskId: string;
  userId: string;
  title?: string;
  description?: string;
  status?: TaskStatus;
  priority?: TaskPriority;
  overDueDate?: Date;
}

@Injectable()
export class UpdateTaskUseCase implements UseCase<UpdateTaskInputDto, TaskDto> {
  constructor(
    private readonly taskRepository: TaskRepository,
    private readonly taskEventBusService: TaskEventBusService,
  ) {}

  async execute(input: UpdateTaskInputDto): Promise<TaskDto> {
    let task = await this.taskRepository.findById(input.taskId);
    if (!task) {
      throw new ResourceNotFoundError(`Task with ID ${input.taskId} not found`);
    }

    task.update({
      title: input.title,
      description: input.description,
      status: input.status,
      priority: input.priority,
      overDueDate: input.overDueDate,
    });

    task = await this.taskRepository.update(task);

    this.taskEventBusService.publish(
      TaskEvent.create({
        taskId: task.id,
        eventAuthorId: input.userId,
        eventType: TaskEventType.TASK_UPDATED,
      }),
    );

    return TaskMapper.toDto(task);
  }
}
