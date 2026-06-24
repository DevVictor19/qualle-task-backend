/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/unbound-method */
import { Test, TestingModule } from '@nestjs/testing';
import { AddTaskCommentUseCase } from '../../add-task-comment.usecase';
import {
  TaskRepository,
  CommentRepository,
  TaskEntity,
  TaskStatus,
  TaskPriority,
  TaskEventType,
} from '@/modules/core/domain';
import {
  TaskEventBusService,
  ResourceNotFoundError,
  TaskMapper,
  TaskDto,
} from '@/modules/core/application';

const mockTask = TaskEntity.create({
  id: 'task-1',
  creatorId: 'creator-1',
  title: 'Test Task',
  status: TaskStatus.TODO,
  priority: TaskPriority.LOW,
  assignees: [],
});

const mockTaskDto: TaskDto = {
  id: 'task-1',
  creatorId: 'creator-1',
  title: 'Test Task',
  status: TaskStatus.TODO,
  priority: TaskPriority.LOW,
  createdAt: new Date(),
  updatedAt: new Date(),
};

const input = { userId: 'user-1', taskId: 'task-1', content: 'A comment' };

describe('AddTaskCommentUseCase', () => {
  let useCase: AddTaskCommentUseCase;
  let taskRepository: jest.Mocked<TaskRepository>;
  let commentRepository: jest.Mocked<CommentRepository>;
  let taskEventBusService: jest.Mocked<TaskEventBusService>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AddTaskCommentUseCase,
        {
          provide: TaskRepository,
          useValue: { findById: jest.fn() },
        },
        {
          provide: CommentRepository,
          useValue: { save: jest.fn() },
        },
        {
          provide: TaskEventBusService,
          useValue: { publish: jest.fn() },
        },
      ],
    }).compile();

    useCase = module.get(AddTaskCommentUseCase);
    taskRepository = module.get(TaskRepository);
    commentRepository = module.get(CommentRepository);
    taskEventBusService = module.get(TaskEventBusService);
  });

  afterEach(() => jest.restoreAllMocks());

  it('should throw ResourceNotFoundError when task is not found on first check', async () => {
    taskRepository.findById.mockResolvedValue(null);

    await expect(useCase.execute(input)).rejects.toThrow(ResourceNotFoundError);
  });

  it('should call commentRepository.save', async () => {
    taskRepository.findById.mockResolvedValue(mockTask);
    commentRepository.save.mockResolvedValue(undefined as any);
    jest.spyOn(TaskMapper, 'toDto').mockReturnValue(mockTaskDto);

    await useCase.execute(input);

    expect(commentRepository.save).toHaveBeenCalledTimes(1);
  });

  it('should publish a TASK_NEW_COMMENT event', async () => {
    taskRepository.findById.mockResolvedValue(mockTask);
    commentRepository.save.mockResolvedValue(undefined as any);
    jest.spyOn(TaskMapper, 'toDto').mockReturnValue(mockTaskDto);

    await useCase.execute(input);

    expect(taskEventBusService.publish).toHaveBeenCalledWith(
      expect.objectContaining({ eventType: TaskEventType.TASK_NEW_COMMENT }),
    );
  });

  it('should return the dto produced by TaskMapper.toDto', async () => {
    taskRepository.findById.mockResolvedValue(mockTask);
    commentRepository.save.mockResolvedValue(undefined as any);
    jest.spyOn(TaskMapper, 'toDto').mockReturnValue(mockTaskDto);

    const result = await useCase.execute(input);

    expect(result).toBe(mockTaskDto);
  });
});
