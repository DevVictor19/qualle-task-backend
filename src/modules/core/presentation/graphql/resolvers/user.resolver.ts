import { Query, Resolver } from '@nestjs/graphql';
import { CurrentUser, type LoggedUser } from '@/shared/infra';
import { FindUserDetailsUseCase } from '../../../application';
import { UserType } from '../outputs';

@Resolver()
export class UserResolver {
  constructor(
    private readonly findUserDetailsUseCase: FindUserDetailsUseCase,
  ) {}

  @Query(() => UserType)
  async me(@CurrentUser() user: LoggedUser): Promise<UserType> {
    return this.findUserDetailsUseCase.execute({
      userId: user.userId,
    });
  }
}
