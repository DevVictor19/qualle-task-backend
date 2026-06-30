export interface TaskAssigneeEntityProps {
  taskId: string;
  userId: string;
}

export class TaskAssigneeEntity {
  private _taskId: string;
  private _userId: string;

  private constructor(props: TaskAssigneeEntityProps) {
    this._taskId = props.taskId;
    this._userId = props.userId;
  }

  static create(props: TaskAssigneeEntityProps): TaskAssigneeEntity {
    return new TaskAssigneeEntity(props);
  }

  get taskId(): string {
    return this._taskId;
  }

  get userId(): string {
    return this._userId;
  }
}
