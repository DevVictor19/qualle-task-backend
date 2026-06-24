import { UseCase } from '@/shared/application';
import { Injectable } from '@nestjs/common';
import { TaskDto } from '../dtos';
import {
  CommentEntity,
  CommentRepository,
  TaskEvent,
  TaskEventType,
  TaskRepository,
} from '../../domain';
import { TaskEventBusService } from '../services';
import { ResourceNotFoundError } from '../errors';
import { TaskMapper } from '../mappers';

export interface AddTaskCommentInputDto {
  userId: string;
  taskId: string;
  content: string;
}

@Injectable()
export class AddTaskCommentUseCase implements UseCase<
  AddTaskCommentInputDto,
  TaskDto
> {
  constructor(
    private readonly taskRepository: TaskRepository,
    private readonly taskEventBusService: TaskEventBusService,
    private readonly commentRepository: CommentRepository,
  ) {}

  async execute(input: AddTaskCommentInputDto): Promise<TaskDto> {
    let task = await this.taskRepository.findById(input.taskId);
    if (!task) {
      throw new ResourceNotFoundError(`Task with id ${input.taskId} not found`);
    }

    const comment = CommentEntity.create({
      userId: input.userId,
      taskId: input.taskId,
      content: input.content,
    });

    await this.commentRepository.save(comment);

    task = await this.taskRepository.findById(input.taskId);
    if (!task) {
      throw new ResourceNotFoundError(`Task with id ${input.taskId} not found`);
    }

    this.taskEventBusService.publish(
      TaskEvent.create({
        taskId: task.id,
        eventAuthorId: input.userId,
        eventType: TaskEventType.TASK_NEW_COMMENT,
      }),
    );

    return TaskMapper.toDto(task);
  }
}
