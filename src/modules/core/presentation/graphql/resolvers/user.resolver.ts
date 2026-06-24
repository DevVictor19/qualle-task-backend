import { Args, Query, Resolver } from '@nestjs/graphql';
import { CurrentUser, type LoggedUser } from '@/shared/infra';
import { SearchOperator } from '@/shared/domain';
import {
  FindUserDetailsUseCase,
  FindUsersPaginatedUseCase,
} from '../../../application';
import { UsersFilterInput } from '../inputs';
import { PaginatedUsersOutput, UserType } from '../outputs';

@Resolver()
export class UserResolver {
  constructor(
    private readonly findUserDetailsUseCase: FindUserDetailsUseCase,
    private readonly findUsersPaginatedUseCase: FindUsersPaginatedUseCase,
  ) {}

  @Query(() => UserType)
  async me(@CurrentUser() user: LoggedUser): Promise<UserType> {
    return this.findUserDetailsUseCase.execute({
      userId: user.userId,
    });
  }

  @Query(() => PaginatedUsersOutput)
  async users(
    @Args('input') input: UsersFilterInput,
  ): Promise<PaginatedUsersOutput> {
    const filters = [];
    if (input.name)
      filters.push({
        field: 'name',
        operator: SearchOperator.LIKE,
        value: input.name,
      });

    return this.findUsersPaginatedUseCase.execute({
      page: input.page,
      limit: input.limit,
      filters,
    });
  }
}
