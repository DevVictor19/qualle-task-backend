export enum TaskEventType {
  TASK_UPDATED = 'TASK_UPDATED',
  TASK_ASSIGNED = 'TASK_ASSIGNED',
  TASK_NEW_COMMENT = 'TASK_NEW_COMMENT',
}

export interface TaskEventProps {
  taskId: string;
  eventAuthorId: string;
  eventType: TaskEventType;
}

export class TaskEvent {
  taskId: string;
  eventAuthorId: string;
  eventType: TaskEventType;
  timestamp: Date;

  private constructor(props: TaskEventProps) {
    this.taskId = props.taskId;
    this.eventAuthorId = props.eventAuthorId;
    this.eventType = props.eventType;
    this.timestamp = new Date();
  }

  static create(props: TaskEventProps): TaskEvent {
    return new TaskEvent(props);
  }
}
