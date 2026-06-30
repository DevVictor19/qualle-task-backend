import { TaskAssigneeEntity } from '../../task-assignee.entity';
import { makeTaskAssignee } from '../generators';

describe('TaskAssigneeEntity.create', () => {
  it('should create a task assignee with required props', () => {
    const assignee = makeTaskAssignee();

    expect(assignee).toBeInstanceOf(TaskAssigneeEntity);
  });

  it('should expose taskId', () => {
    const assignee = makeTaskAssignee({ taskId: 'task-99' });

    expect(assignee.taskId).toBe('task-99');
  });

  it('should expose userId', () => {
    const assignee = makeTaskAssignee({ userId: 'user-99' });

    expect(assignee.userId).toBe('user-99');
  });

  it('should create two independent instances with the same props', () => {
    const assigneeA = makeTaskAssignee();
    const assigneeB = makeTaskAssignee();

    expect(assigneeA).not.toBe(assigneeB);
    expect(assigneeA.taskId).toBe(assigneeB.taskId);
    expect(assigneeA.userId).toBe(assigneeB.userId);
  });

  it('should allow different taskId and userId combinations', () => {
    const assigneeA = makeTaskAssignee({ taskId: 'task-1', userId: 'user-1' });
    const assigneeB = makeTaskAssignee({ taskId: 'task-2', userId: 'user-2' });

    expect(assigneeA.taskId).not.toBe(assigneeB.taskId);
    expect(assigneeA.userId).not.toBe(assigneeB.userId);
  });
});
