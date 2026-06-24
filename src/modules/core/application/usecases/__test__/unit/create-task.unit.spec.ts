/* eslint-disable @typescript-eslint/unbound-method */
import { Test, TestingModule } from '@nestjs/testing';
import { CreateTaskUseCase } from '../../create-task.usecase';
import {
  TaskRepository,
  TaskEntity,
  TaskStatus,
  TaskPriority,
} from '@/modules/core/domain';
import { TaskMapper, TaskDto } from '@/modules/core/application';

const mockTask = TaskEntity.create({
  creatorId: 'creator-1',
  title: 'Test Task',
  status: TaskStatus.TODO,
  priority: TaskPriority.LOW,
});

const mockTaskDto: TaskDto = {
  id: mockTask.id,
  creatorId: 'creator-1',
  title: 'Test Task',
  status: TaskStatus.TODO,
  priority: TaskPriority.LOW,
  createdAt: new Date(),
  updatedAt: new Date(),
};

describe('CreateTaskUseCase', () => {
  let useCase: CreateTaskUseCase;
  let taskRepository: jest.Mocked<TaskRepository>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CreateTaskUseCase,
        {
          provide: TaskRepository,
          useValue: { save: jest.fn() },
        },
      ],
    }).compile();

    useCase = module.get(CreateTaskUseCase);
    taskRepository = module.get(TaskRepository);
    taskRepository.save.mockResolvedValue(mockTask);
    jest.spyOn(TaskMapper, 'toDto').mockReturnValue(mockTaskDto);
  });

  afterEach(() => jest.restoreAllMocks());

  it('should call taskRepository.save', async () => {
    await useCase.execute({
      creatorId: 'creator-1',
      title: 'Test Task',
      status: TaskStatus.TODO,
      priority: TaskPriority.LOW,
    });

    expect(taskRepository.save).toHaveBeenCalledTimes(1);
  });

  it('should return the dto produced by TaskMapper.toDto', async () => {
    const result = await useCase.execute({
      creatorId: 'creator-1',
      title: 'Test Task',
      status: TaskStatus.TODO,
      priority: TaskPriority.LOW,
    });

    expect(result).toBe(mockTaskDto);
  });
});
