import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { CurrentUser, type LoggedUser } from '@/shared/infra';
import { SearchFilter, SearchOperator } from '@/shared/domain';
import {
  AddTaskCommentUseCase,
  AssignTaskUseCase,
  CreateTaskUseCase,
  DeleteTaskUseCase,
  FindTaskDetailsUseCase,
  FindTasksPaginatedUseCase,
  UpdateTaskUseCase,
} from '../../../application';
import {
  AddCommentInput,
  AssignTaskInput,
  CreateTaskInput,
  DeleteTaskInput,
  TasksFilterInput,
  UpdateTaskInput,
} from '../inputs';
import { PaginatedTasksOutput, TaskType } from '../outputs';

@Resolver()
export class TaskResolver {
  constructor(
    private readonly createTaskUseCase: CreateTaskUseCase,
    private readonly updateTaskUseCase: UpdateTaskUseCase,
    private readonly deleteTaskUseCase: DeleteTaskUseCase,
    private readonly assignTaskUseCase: AssignTaskUseCase,
    private readonly addTaskCommentUseCase: AddTaskCommentUseCase,
    private readonly findTaskDetailsUseCase: FindTaskDetailsUseCase,
    private readonly findTasksPaginatedUseCase: FindTasksPaginatedUseCase,
  ) {}

  @Query(() => PaginatedTasksOutput)
  async tasks(
    @Args('input') input: TasksFilterInput,
  ): Promise<PaginatedTasksOutput> {
    const filters: SearchFilter[] = [];
    if (input.status)
      filters.push({
        field: 'status',
        operator: SearchOperator.EQ,
        value: input.status,
      });
    if (input.priority)
      filters.push({
        field: 'priority',
        operator: SearchOperator.EQ,
        value: input.priority,
      });
    if (input.overDueDate)
      filters.push({
        field: 'overDueDate',
        operator: SearchOperator.EQ,
        value: input.overDueDate,
      });

    return this.findTasksPaginatedUseCase.execute({
      page: input.page,
      limit: input.limit,
      filters,
    }) as Promise<PaginatedTasksOutput>;
  }

  @Query(() => TaskType)
  async task(@Args('taskId') taskId: string): Promise<TaskType> {
    return this.findTaskDetailsUseCase.execute({ taskId }) as Promise<TaskType>;
  }

  @Mutation(() => TaskType)
  async createTask(
    @Args('input') input: CreateTaskInput,
    @CurrentUser() user: LoggedUser,
  ): Promise<TaskType> {
    return this.createTaskUseCase.execute({
      creatorId: user.userId,
      ...input,
    }) as Promise<TaskType>;
  }

  @Mutation(() => TaskType)
  async updateTask(
    @Args('input') input: UpdateTaskInput,
    @CurrentUser() user: LoggedUser,
  ): Promise<TaskType> {
    return this.updateTaskUseCase.execute({
      userId: user.userId,
      ...input,
    }) as Promise<TaskType>;
  }

  @Mutation(() => Boolean)
  async deleteTask(@Args('input') input: DeleteTaskInput): Promise<boolean> {
    await this.deleteTaskUseCase.execute(input);
    return true;
  }

  @Mutation(() => TaskType)
  async assignTask(
    @Args('input') input: AssignTaskInput,
    @CurrentUser() user: LoggedUser,
  ): Promise<TaskType> {
    return this.assignTaskUseCase.execute({
      loggedUserId: user.userId,
      ...input,
    }) as Promise<TaskType>;
  }

  @Mutation(() => TaskType)
  async addComment(
    @Args('input') input: AddCommentInput,
    @CurrentUser() user: LoggedUser,
  ): Promise<TaskType> {
    return this.addTaskCommentUseCase.execute({
      userId: user.userId,
      ...input,
    }) as Promise<TaskType>;
  }
}
