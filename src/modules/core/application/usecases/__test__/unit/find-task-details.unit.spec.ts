/* eslint-disable @typescript-eslint/unbound-method */
import { Test, TestingModule } from '@nestjs/testing';
import { FindTaskDetailsUseCase } from '../../find-task-details.usecase';
import {
  TaskRepository,
  TaskEntity,
  TaskStatus,
  TaskPriority,
} from '@/modules/core/domain';
import {
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

describe('FindTaskDetailsUseCase', () => {
  let useCase: FindTaskDetailsUseCase;
  let taskRepository: jest.Mocked<TaskRepository>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        FindTaskDetailsUseCase,
        {
          provide: TaskRepository,
          useValue: { findById: jest.fn() },
        },
      ],
    }).compile();

    useCase = module.get(FindTaskDetailsUseCase);
    taskRepository = module.get(TaskRepository);
  });

  afterEach(() => jest.restoreAllMocks());

  it('should throw ResourceNotFoundError when task is not found', async () => {
    taskRepository.findById.mockResolvedValue(null);

    await expect(useCase.execute({ taskId: 'task-1' })).rejects.toThrow(
      ResourceNotFoundError,
    );
  });

  it('should call taskRepository.findById with the correct id', async () => {
    taskRepository.findById.mockResolvedValue(mockTask);
    jest.spyOn(TaskMapper, 'toDto').mockReturnValue(mockTaskDto);

    await useCase.execute({ taskId: 'task-1' });

    expect(taskRepository.findById).toHaveBeenCalledWith('task-1');
  });

  it('should return the dto produced by TaskMapper.toDto', async () => {
    taskRepository.findById.mockResolvedValue(mockTask);
    jest.spyOn(TaskMapper, 'toDto').mockReturnValue(mockTaskDto);

    const result = await useCase.execute({ taskId: 'task-1' });

    expect(result).toBe(mockTaskDto);
  });
});
