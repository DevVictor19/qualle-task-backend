import { Test, TestingModule } from '@nestjs/testing';
import { FindTasksPaginatedUseCase } from '../../find-tasks-paginated.usecase';
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

const mockPaginatedResult = {
  page: 3,
  limit: 5,
  total: 100,
  data: [mockTask],
};

describe('FindTasksPaginatedUseCase', () => {
  let useCase: FindTasksPaginatedUseCase;
  let taskRepository: jest.Mocked<TaskRepository>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        FindTasksPaginatedUseCase,
        {
          provide: TaskRepository,
          useValue: { findPaginated: jest.fn() },
        },
      ],
    }).compile();

    useCase = module.get(FindTasksPaginatedUseCase);
    taskRepository = module.get(TaskRepository);
    taskRepository.findPaginated.mockResolvedValue(mockPaginatedResult);
    jest.spyOn(TaskMapper, 'toCollectionDto').mockReturnValue([mockTaskDto]);
  });

  afterEach(() => jest.restoreAllMocks());

  it('should return correct page from repository result', async () => {
    const result = await useCase.execute({ page: 3, limit: 5 });

    expect(result.page).toBe(3);
  });

  it('should return correct limit from repository result', async () => {
    const result = await useCase.execute({ page: 3, limit: 5 });

    expect(result.limit).toBe(5);
  });

  it('should return correct total from repository result', async () => {
    const result = await useCase.execute({ page: 3, limit: 5 });

    expect(result.total).toBe(100);
  });

  it('should return data mapped by TaskMapper.toCollectionDto', async () => {
    const result = await useCase.execute({ page: 3, limit: 5 });

    expect(result.data).toEqual([mockTaskDto]);
  });
});
