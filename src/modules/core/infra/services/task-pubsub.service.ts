import { Injectable } from '@nestjs/common';
import { PubSub } from 'graphql-subscriptions';
import { TaskPubSubService } from '../../application';
import { TaskEventType } from '../../domain';

@Injectable()
export class TaskPubSubServiceImpl extends TaskPubSubService {
  private readonly pubSub = new PubSub();

  async publish(eventType: TaskEventType, payload: unknown): Promise<void> {
    await this.pubSub.publish(eventType, payload);
  }

  asyncIterator(eventType: TaskEventType): AsyncIterableIterator<unknown> {
    return this.pubSub.asyncIterableIterator(eventType);
  }
}
