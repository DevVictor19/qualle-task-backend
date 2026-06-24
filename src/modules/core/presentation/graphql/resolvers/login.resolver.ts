import { Args, Mutation, Resolver } from '@nestjs/graphql';
import { Public } from '@/shared/infra';
import { UserLoginUseCase } from '../../../application/usecases/user-login.usecase';
import { LoginInput } from '../inputs/login.input';
import { LoginOutput } from '../outputs/login.output';

@Resolver()
export class LoginResolver {
  constructor(private readonly userLoginUseCase: UserLoginUseCase) {}

  @Public()
  @Mutation(() => LoginOutput)
  async login(@Args('input') input: LoginInput): Promise<LoginOutput> {
    return this.userLoginUseCase.execute(input);
  }
}
