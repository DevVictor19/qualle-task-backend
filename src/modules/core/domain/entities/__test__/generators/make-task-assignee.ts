import { TaskAssigneeEntity } from '../../task-assignee.entity';

export const makeTaskAssignee = (
  overrides: Partial<Parameters<typeof TaskAssigneeEntity.create>[0]> = {},
) =>
  TaskAssigneeEntity.create({
    taskId: 'task-1',
    userId: 'user-1',
    ...overrides,
  });
