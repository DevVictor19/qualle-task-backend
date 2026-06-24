import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { UserSignupUseCase } from '../../../application/usecases/user-signup.usecase';
import { SignupInput } from '../inputs/signup.input';

@Resolver()
export class SignupResolver {
  constructor(private readonly userSignupUseCase: UserSignupUseCase) {}

  @Query(() => Boolean, { name: '_' })
  placeholder() {
    return true;
  }

  @Mutation(() => Boolean)
  async register(@Args('input') input: SignupInput): Promise<boolean> {
    await this.userSignupUseCase.execute(input);
    return true;
  }
}
