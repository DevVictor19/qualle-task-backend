import { CommentEntity } from '../../comment.entity';
import { makeTask, makeUser, makeComment } from '../generators';

describe('CommentEntity.create', () => {
  it('should create a comment with required props', () => {
    const comment = makeComment();

    expect(comment).toBeInstanceOf(CommentEntity);
  });

  it('should expose id from base entity', () => {
    const comment = makeComment({ id: 'comment-99' });

    expect(comment.id).toBe('comment-99');
  });

  it('should expose content', () => {
    const comment = makeComment({ content: 'Hello world' });

    expect(comment.content).toBe('Hello world');
  });

  it('should expose userId', () => {
    const comment = makeComment({ userId: 'user-42' });

    expect(comment.userId).toBe('user-42');
  });

  it('should expose taskId', () => {
    const comment = makeComment({ taskId: 'task-42' });

    expect(comment.taskId).toBe('task-42');
  });

  it('should expose createdAt from base entity', () => {
    const comment = makeComment();

    expect(comment.createdAt).toBeInstanceOf(Date);
  });

  it('should expose updatedAt from base entity', () => {
    const comment = makeComment();

    expect(comment.updatedAt).toBeInstanceOf(Date);
  });

  it('should have task as undefined when not provided', () => {
    const comment = makeComment();

    expect(comment.task).toBeUndefined();
  });

  it('should expose task when provided', () => {
    const task = makeTask();
    const comment = makeComment({ task });

    expect(comment.task).toBe(task);
  });

  it('should have user as undefined when not provided', () => {
    const comment = makeComment();

    expect(comment.user).toBeUndefined();
  });

  it('should expose user when provided', () => {
    const user = makeUser();
    const comment = makeComment({ user });

    expect(comment.user).toBe(user);
  });

  it('should generate different ids for two comments when id is not provided', () => {
    const commentA = CommentEntity.create({
      userId: 'user-1',
      taskId: 'task-1',
      content: 'First',
    });
    const commentB = CommentEntity.create({
      userId: 'user-1',
      taskId: 'task-1',
      content: 'Second',
    });

    expect(commentA.id).not.toBe(commentB.id);
  });
});
