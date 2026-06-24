import { Field, Int, ObjectType } from '@nestjs/graphql';
import { TaskType } from './task.type';

@ObjectType()
export class PaginatedTasksOutput {
  @Field(() => Int)
  total: number;

  @Field(() => Int)
  page: number;

  @Field(() => Int)
  limit: number;

  @Field(() => [TaskType])
  data: TaskType[];
}
