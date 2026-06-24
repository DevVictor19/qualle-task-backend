import { CommentMapper } from '../../comment.mapper';
import { TaskMapper } from '../../task.mapper';
import { UserMapper } from '../../user.mapper';
import { TaskStatus, TaskPriority } from '@/modules/core/domain';
import { TaskDto, UserDto } from '@/modules/core/application';
import { makeTask, makeUser, makeComment } from '../generators';

afterEach(() => jest.restoreAllMocks());

describe('CommentMapper.toDto', () => {
  it('should map id', () => {
    const comment = makeComment();
    expect(CommentMapper.toDto(comment).id).toBe('comment-1');
  });

  it('should map userId', () => {
    const comment = makeComment();
    expect(CommentMapper.toDto(comment).userId).toBe('user-1');
  });

  it('should map taskId', () => {
    const comment = makeComment();
    expect(CommentMapper.toDto(comment).taskId).toBe('task-1');
  });

  it('should map content', () => {
    const comment = makeComment();
    expect(CommentMapper.toDto(comment).content).toBe('A comment');
  });

  it('should map createdAt', () => {
    const comment = makeComment();
    expect(CommentMapper.toDto(comment).createdAt).toBe(comment.createdAt);
  });

  it('should map updatedAt', () => {
    const comment = makeComment();
    expect(CommentMapper.toDto(comment).updatedAt).toBe(comment.updatedAt);
  });

  it('should map task as undefined when not present', () => {
    const comment = makeComment({ task: undefined });
    expect(CommentMapper.toDto(comment).task).toBeUndefined();
  });

  it('should map task using TaskMapper.toDto when present', () => {
    const task = makeTask();
    const taskDto: TaskDto = {
      id: task.id,
      creatorId: 'creator-1',
      title: 'Test Task',
      status: TaskStatus.TODO,
      priority: TaskPriority.LOW,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    jest.spyOn(TaskMapper, 'toDto').mockReturnValue(taskDto);

    const comment = makeComment({ task });
    const result = CommentMapper.toDto(comment);

    expect(result.task).toBe(taskDto);
  });

  it('should map user as undefined when not present', () => {
    const comment = makeComment({ user: undefined });
    expect(CommentMapper.toDto(comment).user).toBeUndefined();
  });

  it('should map user using UserMapper.toDto when present', () => {
    const user = makeUser({ name: 'U', email: 'u@e.com' });
    const userDto: UserDto = {
      id: user.id,
      name: 'U',
      email: 'u@e.com',
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    jest.spyOn(UserMapper, 'toDto').mockReturnValue(userDto);

    const comment = makeComment({ user });
    const result = CommentMapper.toDto(comment);

    expect(result.user).toBe(userDto);
  });
});

describe('CommentMapper.toCollectionDto', () => {
  it('should return an empty array when collection is empty', () => {
    expect(CommentMapper.toCollectionDto([])).toEqual([]);
  });

  it('should return one dto per entity in the collection', () => {
    const comments = [makeComment({ id: 'c-1' }), makeComment({ id: 'c-2' })];
    expect(CommentMapper.toCollectionDto(comments)).toHaveLength(2);
  });

  it('should map each comment id in the collection', () => {
    const comments = [makeComment({ id: 'c-1' }), makeComment({ id: 'c-2' })];
    const result = CommentMapper.toCollectionDto(comments);
    expect(result.map((d) => d.id)).toEqual(['c-1', 'c-2']);
  });
});
