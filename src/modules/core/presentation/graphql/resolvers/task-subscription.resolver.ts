/* eslint-disable @typescript-eslint/no-unsafe-return */
import { Resolver, Subscription } from '@nestjs/graphql';
import { TaskPubSubService } from '../../../application';
import { TaskEvent, TaskEventType } from '../../../domain';
import { TaskNotificationOutput } from '../outputs';

function filterByAssignee(
  payload: TaskEvent,
  _variables: unknown,
  context: { req?: { user?: { userId: string } } },
): boolean {
  const userId = context.req?.user?.userId;
  return !!userId && payload.assigneeIds.includes(userId);
}

@Resolver()
export class TaskSubscriptionResolver {
  constructor(private readonly taskPubSubService: TaskPubSubService) {}

  @Subscription(() => TaskNotificationOutput, {
    filter: filterByAssignee,
    resolve: (payload) => payload,
  })
  taskUpdated() {
    return this.taskPubSubService.asyncIterator(TaskEventType.TASK_UPDATED);
  }

  @Subscription(() => TaskNotificationOutput, {
    filter: filterByAssignee,
    resolve: (payload) => payload,
  })
  taskAssigned() {
    return this.taskPubSubService.asyncIterator(TaskEventType.TASK_ASSIGNED);
  }

  @Subscription(() => TaskNotificationOutput, {
    filter: filterByAssignee,
    resolve: (payload) => payload,
  })
  taskNewComment() {
    return this.taskPubSubService.asyncIterator(TaskEventType.TASK_NEW_COMMENT);
  }
}
