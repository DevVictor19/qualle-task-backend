import { TaskEvent } from '../../domain';

export abstract class TaskEventBusService {
  abstract publish(event: TaskEvent): void;
}
