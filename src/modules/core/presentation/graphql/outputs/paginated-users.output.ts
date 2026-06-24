import { Field, Int, ObjectType } from '@nestjs/graphql';
import { UserType } from './user.type';

@ObjectType()
export class PaginatedUsersOutput {
  @Field(() => Int)
  total: number;

  @Field(() => Int)
  page: number;

  @Field(() => Int)
  limit: number;

  @Field(() => [UserType])
  data: UserType[];
}
