import { UseCase } from '@/shared/application';
import { Injectable } from '@nestjs/common';
import { UserRepository } from '../../domain';
import { FindUserDetailsInputDto, UserDto } from '../dtos';
import { ResourceNotFoundError } from '../errors';
import { UserMapper } from '../mappers';

@Injectable()
export class FindUserDetailsUseCase implements UseCase<
  FindUserDetailsInputDto,
  UserDto
> {
  constructor(private readonly userRepository: UserRepository) {}

  async execute(input: FindUserDetailsInputDto): Promise<UserDto> {
    const user = await this.userRepository.findById(input.userId);
    if (!user) {
      throw new ResourceNotFoundError(`User with ID ${input.userId} not found`);
    }

    return UserMapper.toDto(user);
  }
}
