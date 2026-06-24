/* eslint-disable @typescript-eslint/unbound-method */
import { Test, TestingModule } from '@nestjs/testing';
import { UpdateTaskUseCase } from '../../update-task.usecase';
import {
  TaskRepository,
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
  title: 'Original Title',
  status: TaskStatus.TODO,
  priority: TaskPriority.LOW,
  assignees: [],
});

const mockTaskDto: TaskDto = {
  id: 'task-1',
  creatorId: 'creator-1',
  title: 'Updated Title',
  status: TaskStatus.IN_PROGRESS,
  priority: TaskPriority.HIGH,
  createdAt: new Date(),
  updatedAt: new Date(),
};

describe('UpdateTaskUseCase', () => {
  let useCase: UpdateTaskUseCase;
  let taskRepository: jest.Mocked<TaskRepository>;
  let taskEventBusService: jest.Mocked<TaskEventBusService>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UpdateTaskUseCase,
        {
          provide: TaskRepository,
          useValue: { findById: jest.fn(), update: jest.fn() },
        },
        {
          provide: TaskEventBusService,
          useValue: { publish: jest.fn() },
        },
      ],
    }).compile();

    useCase = module.get(UpdateTaskUseCase);
    taskRepository = module.get(TaskRepository);
    taskEventBusService = module.get(TaskEventBusService);
  });

  afterEach(() => jest.restoreAllMocks());

  it('should throw ResourceNotFoundError when task is not found', async () => {
    taskRepository.findById.mockResolvedValue(null);

    await expect(
      useCase.execute({ taskId: 'task-1', userId: 'user-1' }),
    ).rejects.toThrow(ResourceNotFoundError);
  });

  it('should call task.update with the provided fields', async () => {
    taskRepository.findById.mockResolvedValue(mockTask);
    taskRepository.update.mockResolvedValue(mockTask);
    jest.spyOn(TaskMapper, 'toDto').mockReturnValue(mockTaskDto);
    const updateSpy = jest.spyOn(mockTask, 'update');

    await useCase.execute({
      taskId: 'task-1',
      userId: 'user-1',
      title: 'Updated Title',
      status: TaskStatus.IN_PROGRESS,
    });

    expect(updateSpy).toHaveBeenCalledWith({
      title: 'Updated Title',
      description: undefined,
      status: TaskStatus.IN_PROGRESS,
      priority: undefined,
      overDueDate: undefined,
    });
  });

  it('should call taskRepository.update', async () => {
    taskRepository.findById.mockResolvedValue(mockTask);
    taskRepository.update.mockResolvedValue(mockTask);
    jest.spyOn(TaskMapper, 'toDto').mockReturnValue(mockTaskDto);

    await useCase.execute({ taskId: 'task-1', userId: 'user-1' });

    expect(taskRepository.update).toHaveBeenCalledTimes(1);
  });

  it('should publish a TASK_UPDATED event via taskEventBusService', async () => {
    taskRepository.findById.mockResolvedValue(mockTask);
    taskRepository.update.mockResolvedValue(mockTask);
    jest.spyOn(TaskMapper, 'toDto').mockReturnValue(mockTaskDto);

    await useCase.execute({ taskId: 'task-1', userId: 'user-1' });

    expect(taskEventBusService.publish).toHaveBeenCalledWith(
      expect.objectContaining({ eventType: TaskEventType.TASK_UPDATED }),
    );
  });

  it('should return the dto produced by TaskMapper.toDto', async () => {
    taskRepository.findById.mockResolvedValue(mockTask);
    taskRepository.update.mockResolvedValue(mockTask);
    jest.spyOn(TaskMapper, 'toDto').mockReturnValue(mockTaskDto);

    const result = await useCase.execute({
      taskId: 'task-1',
      userId: 'user-1',
    });

    expect(result).toBe(mockTaskDto);
  });
});
