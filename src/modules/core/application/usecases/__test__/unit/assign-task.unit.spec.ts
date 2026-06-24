/* eslint-disable @typescript-eslint/unbound-method */
import { Test, TestingModule } from '@nestjs/testing';
import { AssignTaskUseCase } from '../../assign-task.usecase';
import {
  TaskRepository,
  TaskAssigneeRepository,
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

const input = {
  loggedUserId: 'user-1',
  taskId: 'task-1',
  assigneeIds: ['user-2', 'user-3'],
};

describe('AssignTaskUseCase', () => {
  let useCase: AssignTaskUseCase;
  let taskRepository: jest.Mocked<TaskRepository>;
  let taskAssigneeRepository: jest.Mocked<TaskAssigneeRepository>;
  let taskEventBusService: jest.Mocked<TaskEventBusService>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AssignTaskUseCase,
        {
          provide: TaskRepository,
          useValue: { findById: jest.fn() },
        },
        {
          provide: TaskAssigneeRepository,
          useValue: { deleteAndInsert: jest.fn() },
        },
        {
          provide: TaskEventBusService,
          useValue: { publish: jest.fn() },
        },
      ],
    }).compile();

    useCase = module.get(AssignTaskUseCase);
    taskRepository = module.get(TaskRepository);
    taskAssigneeRepository = module.get(TaskAssigneeRepository);
    taskEventBusService = module.get(TaskEventBusService);
  });

  afterEach(() => jest.restoreAllMocks());

  it('should throw ResourceNotFoundError when task is not found', async () => {
    taskRepository.findById.mockResolvedValue(null);

    await expect(useCase.execute(input)).rejects.toThrow(ResourceNotFoundError);
  });

  it('should call taskAssigneeRepository.deleteAndInsert with correct arguments', async () => {
    taskRepository.findById.mockResolvedValue(mockTask);
    taskAssigneeRepository.deleteAndInsert.mockResolvedValue(undefined);
    jest.spyOn(TaskMapper, 'toDto').mockReturnValue(mockTaskDto);

    await useCase.execute(input);

    expect(taskAssigneeRepository.deleteAndInsert).toHaveBeenCalledWith(
      'task-1',
      ['user-2', 'user-3'],
    );
  });

  it('should publish a TASK_ASSIGNED event', async () => {
    taskRepository.findById.mockResolvedValue(mockTask);
    taskAssigneeRepository.deleteAndInsert.mockResolvedValue(undefined);
    jest.spyOn(TaskMapper, 'toDto').mockReturnValue(mockTaskDto);

    await useCase.execute(input);

    expect(taskEventBusService.publish).toHaveBeenCalledWith(
      expect.objectContaining({ eventType: TaskEventType.TASK_ASSIGNED }),
    );
  });

  it('should return the dto produced by TaskMapper.toDto', async () => {
    taskRepository.findById.mockResolvedValue(mockTask);
    taskAssigneeRepository.deleteAndInsert.mockResolvedValue(undefined);
    jest.spyOn(TaskMapper, 'toDto').mockReturnValue(mockTaskDto);

    const result = await useCase.execute(input);

    expect(result).toBe(mockTaskDto);
  });
});
