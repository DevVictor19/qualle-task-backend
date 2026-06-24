import { Injectable } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { TaskPubSubService } from '../services';
import { TaskEvent, TaskEventType } from '../../domain';

@Injectable()
export class NotifyTaskCommentUseCase {
  constructor(private readonly taskPubSubService: TaskPubSubService) {}

  @OnEvent(TaskEventType.TASK_NEW_COMMENT)
  async handle(event: TaskEvent): Promise<void> {
    await this.taskPubSubService.publish(TaskEventType.TASK_NEW_COMMENT, event);
  }
}
