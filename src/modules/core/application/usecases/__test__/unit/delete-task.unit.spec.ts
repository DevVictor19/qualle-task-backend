/* eslint-disable @typescript-eslint/unbound-method */
import { Test, TestingModule } from '@nestjs/testing';
import { DeleteTaskUseCase } from '../../delete-task.usecase';
import { TaskRepository } from '@/modules/core/domain';

describe('DeleteTaskUseCase', () => {
  let useCase: DeleteTaskUseCase;
  let taskRepository: jest.Mocked<TaskRepository>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        DeleteTaskUseCase,
        {
          provide: TaskRepository,
          useValue: { delete: jest.fn() },
        },
      ],
    }).compile();

    useCase = module.get(DeleteTaskUseCase);
    taskRepository = module.get(TaskRepository);
    taskRepository.delete.mockResolvedValue();
  });

  afterEach(() => jest.restoreAllMocks());

  it('should call taskRepository.delete with the correct taskId', async () => {
    await useCase.execute({ taskId: 'task-1' });

    expect(taskRepository.delete).toHaveBeenCalledWith('task-1');
  });
});
