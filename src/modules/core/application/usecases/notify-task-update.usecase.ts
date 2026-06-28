import { Injectable } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { UseCase } from '@/shared/application';
import { TaskPubSubService } from '../services';
import { TaskEvent, TaskEventType } from '../../domain';

@Injectable()
export class NotifyTaskUpdateUseCase implements UseCase<TaskEvent, void> {
  constructor(private readonly taskPubSubService: TaskPubSubService) {}

  @OnEvent(TaskEventType.TASK_UPDATED)
  async execute(input: TaskEvent): Promise<void> {
    await this.taskPubSubService.publish(TaskEventType.TASK_UPDATED, input);
  }
}
