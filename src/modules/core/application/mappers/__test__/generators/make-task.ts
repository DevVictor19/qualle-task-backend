import { TaskEntity, TaskStatus, TaskPriority } from '@/modules/core/domain';

export const makeTask = (
  overrides: Partial<Parameters<typeof TaskEntity.create>[0]> = {},
) =>
  TaskEntity.create({
    id: 'task-1',
    creatorId: 'creator-1',
    title: 'Test Task',
    description: 'A description',
    status: TaskStatus.TODO,
    priority: TaskPriority.LOW,
    overDueDate: new Date('2025-12-31'),
    ...overrides,
  });
