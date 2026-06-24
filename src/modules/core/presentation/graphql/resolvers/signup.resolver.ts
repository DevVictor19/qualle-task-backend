import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { Public } from '@/shared/infra';
import { UserSignupUseCase } from '../../../application/usecases/user-signup.usecase';
import { SignupInput } from '../inputs/signup.input';

@Resolver()
export class SignupResolver {
  constructor(private readonly userSignupUseCase: UserSignupUseCase) {}

  @Public()
  @Query(() => Boolean, { name: '_' })
  placeholder() {
    return true;
  }

  @Public()
  @Mutation(() => Boolean)
  async register(@Args('input') input: SignupInput): Promise<boolean> {
    await this.userSignupUseCase.execute(input);
    return true;
  }
}
