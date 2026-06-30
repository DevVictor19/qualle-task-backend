import { TaskEntity, TaskStatus, TaskPriority } from '../../task.entity';

export const makeTask = (
  overrides: Partial<Parameters<typeof TaskEntity.create>[0]> = {},
) =>
  TaskEntity.create({
    id: 'task-1',
    creatorId: 'creator-1',
    title: 'Test Task',
    status: TaskStatus.TODO,
    priority: TaskPriority.LOW,
    ...overrides,
  });
