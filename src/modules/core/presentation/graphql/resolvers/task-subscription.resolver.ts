/* eslint-disable @typescript-eslint/no-unsafe-return */
import { Resolver, Subscription } from '@nestjs/graphql';
import { TaskPubSubService } from '../../../application';
import { TaskEventType } from '../../../domain';
import { TaskNotificationOutput } from '../outputs';

@Resolver()
export class TaskSubscriptionResolver {
  constructor(private readonly taskPubSubService: TaskPubSubService) {}

  @Subscription(() => TaskNotificationOutput, { resolve: (payload) => payload })
  taskUpdated() {
    return this.taskPubSubService.asyncIterator(TaskEventType.TASK_UPDATED);
  }

  @Subscription(() => TaskNotificationOutput, { resolve: (payload) => payload })
  taskAssigned() {
    return this.taskPubSubService.asyncIterator(TaskEventType.TASK_ASSIGNED);
  }

  @Subscription(() => TaskNotificationOutput, { resolve: (payload) => payload })
  taskNewComment() {
    return this.taskPubSubService.asyncIterator(TaskEventType.TASK_NEW_COMMENT);
  }
}
