import { UseCase } from '@/shared/application';
import { Injectable } from '@nestjs/common';
import { UserSignupInputDto } from '../dtos';
import { UserEntity, UserRepository } from '../../domain';
import { HashService } from '../services';

@Injectable()
export class UserSignupUseCase implements UseCase<UserSignupInputDto, void> {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly hashService: HashService,
  ) {}

  async execute(input: UserSignupInputDto): Promise<void> {
    const existentUser = await this.userRepository.findByEmail(input.email);
    if (existentUser) {
      throw new Error('User already exists');
    }

    const hashedPwd = await this.hashService.hash(input.password);

    const user = UserEntity.create({
      name: input.name,
      email: input.email,
      password: hashedPwd,
    });

    await this.userRepository.save(user);
  }
}
