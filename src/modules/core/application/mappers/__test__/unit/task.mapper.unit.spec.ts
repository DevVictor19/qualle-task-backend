import { TaskMapper } from '../../task.mapper';
import { UserMapper } from '../../user.mapper';
import { CommentMapper } from '../../comment.mapper';
import { TaskStatus, TaskPriority, UserEntity } from '@/modules/core/domain';
import { UserDto, CommentDto } from '@/modules/core/application';
import { makeTask } from '../generators';

afterEach(() => jest.restoreAllMocks());

describe('TaskMapper.toDto', () => {
  it('should map id', () => {
    const task = makeTask();
    expect(TaskMapper.toDto(task).id).toBe('task-1');
  });

  it('should map creatorId', () => {
    const task = makeTask();
    expect(TaskMapper.toDto(task).creatorId).toBe('creator-1');
  });

  it('should map title', () => {
    const task = makeTask();
    expect(TaskMapper.toDto(task).title).toBe('Test Task');
  });

  it('should map description', () => {
    const task = makeTask();
    expect(TaskMapper.toDto(task).description).toBe('A description');
  });

  it('should map status', () => {
    const task = makeTask();
    expect(TaskMapper.toDto(task).status).toBe(TaskStatus.TODO);
  });

  it('should map priority', () => {
    const task = makeTask();
    expect(TaskMapper.toDto(task).priority).toBe(TaskPriority.LOW);
  });

  it('should map overDueDate', () => {
    const overDueDate = new Date('2025-12-31');
    const task = makeTask({ overDueDate });
    expect(TaskMapper.toDto(task).overDueDate).toBe(overDueDate);
  });

  it('should map createdAt', () => {
    const task = makeTask();
    expect(TaskMapper.toDto(task).createdAt).toBe(task.createdAt);
  });

  it('should map updatedAt', () => {
    const task = makeTask();
    expect(TaskMapper.toDto(task).updatedAt).toBe(task.updatedAt);
  });

  it('should map creator as undefined when not present', () => {
    const task = makeTask({ creator: undefined });
    expect(TaskMapper.toDto(task).creator).toBeUndefined();
  });

  it('should map creator using UserMapper.toDto when present', () => {
    const creator = UserEntity.create({
      name: 'Creator',
      email: 'c@e.com',
      password: 'h',
    });
    const creatorDto = {
      id: creator.id,
      name: 'Creator',
      email: 'c@e.com',
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    jest.spyOn(UserMapper, 'toDto').mockReturnValue(creatorDto);

    const task = makeTask({ creator });
    const result = TaskMapper.toDto(task);

    expect(result.creator).toBe(creatorDto);
  });

  it('should map assignees as undefined when not present', () => {
    const task = makeTask({ assignees: undefined });
    expect(TaskMapper.toDto(task).assignees).toBeUndefined();
  });

  it('should map assignees using UserMapper.toCollectionDto when present', () => {
    const assigneeDtos: UserDto[] = [
      {
        id: 'u-1',
        name: 'A',
        email: 'a@e.com',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ];
    jest.spyOn(UserMapper, 'toCollectionDto').mockReturnValue(assigneeDtos);

    const task = makeTask({ assignees: [] });
    const result = TaskMapper.toDto(task);

    expect(result.assignees).toBe(assigneeDtos);
  });

  it('should map comments as undefined when not present', () => {
    const task = makeTask({ comments: undefined });
    expect(TaskMapper.toDto(task).comments).toBeUndefined();
  });

  it('should map comments using CommentMapper.toCollectionDto when present', () => {
    const commentDtos: CommentDto[] = [
      {
        id: 'c-1',
        userId: 'u-1',
        taskId: 'task-1',
        content: 'x',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ];
    jest.spyOn(CommentMapper, 'toCollectionDto').mockReturnValue(commentDtos);

    const task = makeTask({ comments: [] });
    const result = TaskMapper.toDto(task);

    expect(result.comments).toBe(commentDtos);
  });
});

describe('TaskMapper.toCollectionDto', () => {
  it('should return an empty array when tasks list is empty', () => {
    expect(TaskMapper.toCollectionDto([])).toEqual([]);
  });

  it('should return one dto per task in the collection', () => {
    const tasks = [makeTask({ id: 'task-1' }), makeTask({ id: 'task-2' })];
    expect(TaskMapper.toCollectionDto(tasks)).toHaveLength(2);
  });

  it('should map each task id in the collection', () => {
    const tasks = [makeTask({ id: 'task-1' }), makeTask({ id: 'task-2' })];
    const result = TaskMapper.toCollectionDto(tasks);
    expect(result.map((d) => d.id)).toEqual(['task-1', 'task-2']);
  });
});
