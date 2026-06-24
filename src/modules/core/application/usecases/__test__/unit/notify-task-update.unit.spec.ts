/* eslint-disable @typescript-eslint/unbound-method */
import { Test, TestingModule } from '@nestjs/testing';
import { NotifyTaskUpdateUseCase } from '../../notify-task-update.usecase';
import { TaskPubSubService } from '@/modules/core/application';
import { TaskEvent, TaskEventType } from '@/modules/core/domain';

const mockEvent = TaskEvent.create({
  taskId: 'task-1',
  eventAuthorId: 'user-1',
  eventType: TaskEventType.TASK_UPDATED,
  assigneeIds: ['user-2'],
});

describe('NotifyTaskUpdateUseCase', () => {
  let useCase: NotifyTaskUpdateUseCase;
  let taskPubSubService: jest.Mocked<TaskPubSubService>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        NotifyTaskUpdateUseCase,
        {
          provide: TaskPubSubService,
          useValue: { publish: jest.fn() },
        },
      ],
    }).compile();

    useCase = module.get(NotifyTaskUpdateUseCase);
    taskPubSubService = module.get(TaskPubSubService);
    taskPubSubService.publish.mockResolvedValue(undefined);
  });

  afterEach(() => jest.restoreAllMocks());

  it('should call taskPubSubService.publish with TASK_UPDATED event type', async () => {
    await useCase.handle(mockEvent);

    expect(taskPubSubService.publish).toHaveBeenCalledWith(
      TaskEventType.TASK_UPDATED,
      expect.anything(),
    );
  });

  it('should call taskPubSubService.publish with the received event payload', async () => {
    await useCase.handle(mockEvent);

    expect(taskPubSubService.publish).toHaveBeenCalledWith(
      expect.anything(),
      mockEvent,
    );
  });
});
