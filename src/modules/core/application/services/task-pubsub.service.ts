import { TaskEventType } from '../../domain';

export abstract class TaskPubSubService {
  abstract publish(eventType: TaskEventType, payload: unknown): Promise<void>;
  abstract asyncIterator(
    eventType: TaskEventType,
  ): AsyncIterableIterator<unknown>;
}
