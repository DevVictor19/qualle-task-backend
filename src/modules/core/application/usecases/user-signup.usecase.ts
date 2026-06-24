import { UseCase } from '@/shared/application';
import { Injectable } from '@nestjs/common';
import { UserEntity, UserRepository } from '../../domain';
import { HashService } from '../services';
import { ConflictError } from '../errors';

export interface SignupInputDto {
  name: string;
  email: string;
  password: string;
}

@Injectable()
export class UserSignupUseCase implements UseCase<SignupInputDto, void> {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly hashService: HashService,
  ) {}

  async execute(input: SignupInputDto): Promise<void> {
    const existentUser = await this.userRepository.findByEmail(input.email);
    if (existentUser) {
      throw new ConflictError('Email already in use');
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
