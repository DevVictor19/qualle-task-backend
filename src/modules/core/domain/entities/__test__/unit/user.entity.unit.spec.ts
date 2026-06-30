import { UserEntity } from '../../user.entity';
import { makeTask, makeComment, makeUser } from '../generators';

describe('UserEntity.create', () => {
  it('should create a user with required props', () => {
    const user = makeUser();

    expect(user).toBeInstanceOf(UserEntity);
  });

  it('should expose the id from base entity', () => {
    const user = makeUser({ id: 'user-42' });

    expect(user.id).toBe('user-42');
  });

  it('should expose name', () => {
    const user = makeUser({ name: 'Alice' });

    expect(user.name).toBe('Alice');
  });

  it('should expose email', () => {
    const user = makeUser({ email: 'alice@example.com' });

    expect(user.email).toBe('alice@example.com');
  });

  it('should expose password', () => {
    const user = makeUser({ password: 'secret' });

    expect(user.password).toBe('secret');
  });

  it('should expose createdAt from base entity', () => {
    const user = makeUser();

    expect(user.createdAt).toBeInstanceOf(Date);
  });

  it('should expose updatedAt from base entity', () => {
    const user = makeUser();

    expect(user.updatedAt).toBeInstanceOf(Date);
  });

  it('should have createdTasks as undefined when not provided', () => {
    const user = makeUser();

    expect(user.createdTasks).toBeUndefined();
  });

  it('should expose createdTasks when provided', () => {
    const tasks = [makeTask()];
    const user = makeUser({ createdTasks: tasks });

    expect(user.createdTasks).toBe(tasks);
  });

  it('should have assignedTasks as undefined when not provided', () => {
    const user = makeUser();

    expect(user.assignedTasks).toBeUndefined();
  });

  it('should expose assignedTasks when provided', () => {
    const tasks = [makeTask({ id: 'task-2' })];
    const user = makeUser({ assignedTasks: tasks });

    expect(user.assignedTasks).toBe(tasks);
  });

  it('should have comments as undefined when not provided', () => {
    const user = makeUser();

    expect(user.comments).toBeUndefined();
  });

  it('should expose comments when provided', () => {
    const comments = [makeComment()];
    const user = makeUser({ comments });

    expect(user.comments).toBe(comments);
  });

  it('should generate different ids for two users when id is not provided', () => {
    const userA = UserEntity.create({
      name: 'A',
      email: 'a@example.com',
      password: 'pass',
    });
    const userB = UserEntity.create({
      name: 'B',
      email: 'b@example.com',
      password: 'pass',
    });

    expect(userA.id).not.toBe(userB.id);
  });
});
