export abstract class TaskAssigneeRepository {
  abstract deleteAndInsert(
    taskId: string,
    assigneeIds: string[],
  ): Promise<void>;
}
