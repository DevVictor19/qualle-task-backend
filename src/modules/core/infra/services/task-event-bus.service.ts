import { Injectable } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { TaskEventBusService } from '../../application';
import { TaskEvent } from '../../domain';

@Injectable()
export class TaskEventBusServiceImpl implements TaskEventBusService {
  constructor(private readonly eventEmitter: EventEmitter2) {}

  publish(event: TaskEvent): void {
    this.eventEmitter.emit(event.eventType, event);
  }
}
