export interface TaskAssigneeEntityProps {
  taskId: string;
  userId: string;
}

export class TaskAssigneeEntity {
  taskId: string;
  userId: string;

  private constructor(props: TaskAssigneeEntityProps) {
    this.taskId = props.taskId;
    this.userId = props.userId;
  }

  static create(props: TaskAssigneeEntityProps): TaskAssigneeEntity {
    return new TaskAssigneeEntity(props);
  }
}
