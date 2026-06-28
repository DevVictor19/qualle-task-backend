/* eslint-disable @typescript-eslint/unbound-method */
import { Test, TestingModule } from '@nestjs/testing';
import { NotifyTaskAssignUseCase } from '../../notify-task-assign.usecase';
import { TaskPubSubService } from '@/modules/core/application';
import { TaskEvent, TaskEventType } from '@/modules/core/domain';

const mockEvent = TaskEvent.create({
  taskId: 'task-1',
  eventAuthorId: 'user-1',
  eventType: TaskEventType.TASK_ASSIGNED,
  assigneeIds: ['user-2'],
});

describe('NotifyTaskAssignUseCase', () => {
  let useCase: NotifyTaskAssignUseCase;
  let taskPubSubService: jest.Mocked<TaskPubSubService>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        NotifyTaskAssignUseCase,
        {
          provide: TaskPubSubService,
          useValue: { publish: jest.fn() },
        },
      ],
    }).compile();

    useCase = module.get(NotifyTaskAssignUseCase);
    taskPubSubService = module.get(TaskPubSubService);
    taskPubSubService.publish.mockResolvedValue(undefined);
  });

  afterEach(() => jest.restoreAllMocks());

  it('should call taskPubSubService.publish with TASK_ASSIGNED event type', async () => {
    await useCase.execute(mockEvent);

    expect(taskPubSubService.publish).toHaveBeenCalledWith(
      TaskEventType.TASK_ASSIGNED,
      expect.anything(),
    );
  });

  it('should call taskPubSubService.publish with the received event payload', async () => {
    await useCase.execute(mockEvent);

    expect(taskPubSubService.publish).toHaveBeenCalledWith(
      expect.anything(),
      mockEvent,
    );
  });
});
