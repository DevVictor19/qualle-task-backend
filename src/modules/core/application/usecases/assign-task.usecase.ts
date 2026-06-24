import { UseCase } from '@/shared/application';
import { Injectable } from '@nestjs/common';
import { TaskDto } from '../dtos';
import {
  TaskAssigneeRepository,
  TaskEvent,
  TaskEventType,
  TaskRepository,
} from '../../domain';
import { TaskEventBusService } from '../services';
import { ResourceNotFoundError } from '../errors';
import { TaskMapper } from '../mappers';

export interface AssignTaskInputDto {
  loggedUserId: string;
  taskId: string;
  assigneeIds: string[];
}

@Injectable()
export class AssignTaskUseCase implements UseCase<AssignTaskInputDto, TaskDto> {
  constructor(
    private readonly taskRepository: TaskRepository,
    private readonly taskEventBusService: TaskEventBusService,
    private readonly taskAssigneeRepository: TaskAssigneeRepository,
  ) {}

  async execute(input: AssignTaskInputDto): Promise<TaskDto> {
    let task = await this.taskRepository.findById(input.taskId);
    if (!task) {
      throw new ResourceNotFoundError(`Task with id ${input.taskId} not found`);
    }

    await this.taskAssigneeRepository.deleteAndInsert(
      input.taskId,
      input.assigneeIds,
    );

    task = await this.taskRepository.findById(input.taskId);
    if (!task) {
      throw new ResourceNotFoundError(`Task with id ${input.taskId} not found`);
    }

    this.taskEventBusService.publish(
      TaskEvent.create({
        taskId: task.id,
        eventAuthorId: input.loggedUserId,
        eventType: TaskEventType.TASK_ASSIGNED,
      }),
    );

    return TaskMapper.toDto(task);
  }
}
