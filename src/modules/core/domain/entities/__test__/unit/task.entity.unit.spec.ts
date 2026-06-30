import { TaskEntity, TaskStatus, TaskPriority } from '../../task.entity';
import { makeTask, makeUser, makeComment } from '../generators';

describe('TaskEntity.create', () => {
  it('should create a task with required props', () => {
    const task = makeTask();

    expect(task).toBeInstanceOf(TaskEntity);
  });

  it('should expose id from base entity', () => {
    const task = makeTask({ id: 'task-99' });

    expect(task.id).toBe('task-99');
  });

  it('should expose creatorId', () => {
    const task = makeTask({ creatorId: 'creator-42' });

    expect(task.creatorId).toBe('creator-42');
  });

  it('should expose title', () => {
    const task = makeTask({ title: 'My Task' });

    expect(task.title).toBe('My Task');
  });

  it('should expose status', () => {
    const task = makeTask({ status: TaskStatus.IN_PROGRESS });

    expect(task.status).toBe(TaskStatus.IN_PROGRESS);
  });

  it('should expose priority', () => {
    const task = makeTask({ priority: TaskPriority.HIGH });

    expect(task.priority).toBe(TaskPriority.HIGH);
  });

  it('should have description as undefined when not provided', () => {
    const task = makeTask();

    expect(task.description).toBeUndefined();
  });

  it('should expose description when provided', () => {
    const task = makeTask({ description: 'Some description' });

    expect(task.description).toBe('Some description');
  });

  it('should have overDueDate as undefined when not provided', () => {
    const task = makeTask();

    expect(task.overDueDate).toBeUndefined();
  });

  it('should expose overDueDate when provided', () => {
    const date = new Date('2025-12-31');
    const task = makeTask({ overDueDate: date });

    expect(task.overDueDate).toBe(date);
  });

  it('should have creator as undefined when not provided', () => {
    const task = makeTask();

    expect(task.creator).toBeUndefined();
  });

  it('should expose creator when provided', () => {
    const creator = makeUser();
    const task = makeTask({ creator });

    expect(task.creator).toBe(creator);
  });

  it('should have assignees as undefined when not provided', () => {
    const task = makeTask();

    expect(task.assignees).toBeUndefined();
  });

  it('should expose assignees when provided', () => {
    const assignees = [makeUser({ id: 'user-2' })];
    const task = makeTask({ assignees });

    expect(task.assignees).toBe(assignees);
  });

  it('should have comments as undefined when not provided', () => {
    const task = makeTask();

    expect(task.comments).toBeUndefined();
  });

  it('should expose comments when provided', () => {
    const comments = [makeComment()];
    const task = makeTask({ comments });

    expect(task.comments).toBe(comments);
  });

  it('should expose createdAt from base entity', () => {
    const task = makeTask();

    expect(task.createdAt).toBeInstanceOf(Date);
  });

  it('should expose updatedAt from base entity', () => {
    const task = makeTask();

    expect(task.updatedAt).toBeInstanceOf(Date);
  });

  it('should generate different ids for two tasks when id is not provided', () => {
    const taskA = TaskEntity.create({
      creatorId: 'c-1',
      title: 'A',
      status: TaskStatus.TODO,
      priority: TaskPriority.LOW,
    });
    const taskB = TaskEntity.create({
      creatorId: 'c-1',
      title: 'B',
      status: TaskStatus.TODO,
      priority: TaskPriority.LOW,
    });

    expect(taskA.id).not.toBe(taskB.id);
  });
});

describe('TaskEntity.update', () => {
  it('should update title when provided', () => {
    const task = makeTask({ title: 'Old Title' });
    task.update({ title: 'New Title' });

    expect(task.title).toBe('New Title');
  });

  it('should update description when provided', () => {
    const task = makeTask({ description: 'Old' });
    task.update({ description: 'New' });

    expect(task.description).toBe('New');
  });

  it('should update description to null when explicitly set to null', () => {
    const task = makeTask({ description: 'Some description' });
    task.update({ description: null });

    expect(task.description).toBeNull();
  });

  it('should update status when provided', () => {
    const task = makeTask({ status: TaskStatus.TODO });
    task.update({ status: TaskStatus.IN_PROGRESS });

    expect(task.status).toBe(TaskStatus.IN_PROGRESS);
  });

  it('should update priority when provided', () => {
    const task = makeTask({ priority: TaskPriority.LOW });
    task.update({ priority: TaskPriority.HIGH });

    expect(task.priority).toBe(TaskPriority.HIGH);
  });

  it('should update overDueDate when provided', () => {
    const newDate = new Date('2026-06-01');
    const task = makeTask();
    task.update({ overDueDate: newDate });

    expect(task.overDueDate).toBe(newDate);
  });

  it('should update overDueDate to null when explicitly set to null', () => {
    const task = makeTask({ overDueDate: new Date('2025-12-31') });
    task.update({ overDueDate: null });

    expect(task.overDueDate).toBeNull();
  });

  it('should update assignees when provided', () => {
    const newAssignees = [makeUser({ id: 'user-99' })];
    const task = makeTask();
    task.update({ assignees: newAssignees });

    expect(task.assignees).toBe(newAssignees);
  });

  it('should update comments when provided', () => {
    const newComments = [makeComment({ id: 'comment-99' })];
    const task = makeTask();
    task.update({ comments: newComments });

    expect(task.comments).toBe(newComments);
  });

  it('should not modify fields that are not provided in the update', () => {
    const task = makeTask({
      title: 'Original',
      status: TaskStatus.TODO,
      priority: TaskPriority.LOW,
    });
    task.update({ title: 'Changed' });

    expect(task.status).toBe(TaskStatus.TODO);
    expect(task.priority).toBe(TaskPriority.LOW);
  });
});

describe('TaskStatus enum', () => {
  it('should have TODO value', () => {
    expect(TaskStatus.TODO).toBe('TODO');
  });

  it('should have IN_PROGRESS value', () => {
    expect(TaskStatus.IN_PROGRESS).toBe('IN_PROGRESS');
  });

  it('should have DONE value', () => {
    expect(TaskStatus.DONE).toBe('DONE');
  });

  it('should have CANCELLED value', () => {
    expect(TaskStatus.CANCELLED).toBe('CANCELLED');
  });
});

describe('TaskPriority enum', () => {
  it('should have LOW value', () => {
    expect(TaskPriority.LOW).toBe('LOW');
  });

  it('should have MEDIUM value', () => {
    expect(TaskPriority.MEDIUM).toBe('MEDIUM');
  });

  it('should have HIGH value', () => {
    expect(TaskPriority.HIGH).toBe('HIGH');
  });
});
