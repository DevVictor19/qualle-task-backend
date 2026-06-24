import { UserMapper } from '../../user.mapper';
import { TaskMapper } from '../../task.mapper';
import { CommentMapper } from '../../comment.mapper';
import { TaskStatus, TaskPriority } from '@/modules/core/domain';
import { TaskDto, CommentDto } from '@/modules/core/application';
import { makeTask, makeUser, makeComment } from '../generators';

afterEach(() => jest.restoreAllMocks());

describe('UserMapper.toDto', () => {
  it('should map id', () => {
    const user = makeUser();
    expect(UserMapper.toDto(user).id).toBe('user-1');
  });

  it('should map name', () => {
    const user = makeUser();
    expect(UserMapper.toDto(user).name).toBe('Test User');
  });

  it('should map email', () => {
    const user = makeUser();
    expect(UserMapper.toDto(user).email).toBe('test@example.com');
  });

  it('should map createdAt', () => {
    const user = makeUser();
    expect(UserMapper.toDto(user).createdAt).toBe(user.createdAt);
  });

  it('should map updatedAt', () => {
    const user = makeUser();
    expect(UserMapper.toDto(user).updatedAt).toBe(user.updatedAt);
  });

  it('should map assignedTasks as undefined when not present', () => {
    const user = makeUser({ assignedTasks: undefined });
    expect(UserMapper.toDto(user).assignedTasks).toBeUndefined();
  });

  it('should map assignedTasks using TaskMapper.toCollectionDto when present', () => {
    const taskDtos: TaskDto[] = [
      {
        id: 't-1',
        creatorId: 'user-1',
        title: 'T',
        status: TaskStatus.TODO,
        priority: TaskPriority.LOW,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ];
    jest.spyOn(TaskMapper, 'toCollectionDto').mockReturnValue(taskDtos);

    const user = makeUser({ assignedTasks: [makeTask()] });
    const result = UserMapper.toDto(user);

    expect(result.assignedTasks).toBe(taskDtos);
  });

  it('should map createdTasks as undefined when not present', () => {
    const user = makeUser({ createdTasks: undefined });
    expect(UserMapper.toDto(user).createdTasks).toBeUndefined();
  });

  it('should map createdTasks using TaskMapper.toCollectionDto when present', () => {
    const taskDtos: TaskDto[] = [
      {
        id: 't-2',
        creatorId: 'user-1',
        title: 'T',
        status: TaskStatus.TODO,
        priority: TaskPriority.LOW,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ];
    jest.spyOn(TaskMapper, 'toCollectionDto').mockReturnValue(taskDtos);

    const user = makeUser({ createdTasks: [makeTask()] });
    const result = UserMapper.toDto(user);

    expect(result.createdTasks).toBe(taskDtos);
  });

  it('should map comments as undefined when not present', () => {
    const user = makeUser({ comments: undefined });
    expect(UserMapper.toDto(user).comments).toBeUndefined();
  });

  it('should map comments using CommentMapper.toCollectionDto when present', () => {
    const commentDtos: CommentDto[] = [
      {
        id: 'c-1',
        userId: 'user-1',
        taskId: 't-1',
        content: 'x',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ];
    jest.spyOn(CommentMapper, 'toCollectionDto').mockReturnValue(commentDtos);

    const comment = makeComment({
      userId: 'user-1',
      taskId: 't-1',
      content: 'x',
    });
    const user = makeUser({ comments: [comment] });
    const result = UserMapper.toDto(user);

    expect(result.comments).toBe(commentDtos);
  });
});

describe('UserMapper.toCollectionDto', () => {
  it('should return an empty array when users list is empty', () => {
    expect(UserMapper.toCollectionDto([])).toEqual([]);
  });

  it('should return one dto per user in the collection', () => {
    const users = [makeUser({ id: 'user-1' }), makeUser({ id: 'user-2' })];
    expect(UserMapper.toCollectionDto(users)).toHaveLength(2);
  });

  it('should map each user id in the collection', () => {
    const users = [makeUser({ id: 'user-1' }), makeUser({ id: 'user-2' })];
    const result = UserMapper.toCollectionDto(users);
    expect(result.map((d) => d.id)).toEqual(['user-1', 'user-2']);
  });
});
