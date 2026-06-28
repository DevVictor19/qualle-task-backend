/* eslint-disable @typescript-eslint/unbound-method */
import { Test, TestingModule } from '@nestjs/testing';
import { NotifyTaskCommentUseCase } from '../../notify-task-comment.usecase';
import { TaskPubSubService } from '@/modules/core/application';
import { TaskEvent, TaskEventType } from '@/modules/core/domain';

const mockEvent = TaskEvent.create({
  taskId: 'task-1',
  eventAuthorId: 'user-1',
  eventType: TaskEventType.TASK_NEW_COMMENT,
  assigneeIds: ['user-2'],
});

describe('NotifyTaskCommentUseCase', () => {
  let useCase: NotifyTaskCommentUseCase;
  let taskPubSubService: jest.Mocked<TaskPubSubService>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        NotifyTaskCommentUseCase,
        {
          provide: TaskPubSubService,
          useValue: { publish: jest.fn() },
        },
      ],
    }).compile();

    useCase = module.get(NotifyTaskCommentUseCase);
    taskPubSubService = module.get(TaskPubSubService);
    taskPubSubService.publish.mockResolvedValue(undefined);
  });

  afterEach(() => jest.restoreAllMocks());

  it('should call taskPubSubService.publish with TASK_NEW_COMMENT event type', async () => {
    await useCase.execute(mockEvent);

    expect(taskPubSubService.publish).toHaveBeenCalledWith(
      TaskEventType.TASK_NEW_COMMENT,
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
