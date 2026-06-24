import { UseCase } from '@/shared/application';
import { PaginatedResult, PaginatedSearchParams } from '@/shared/domain';
import { Injectable } from '@nestjs/common';
import { UserDto } from '../dtos';
import { UserRepository } from '../../domain';
import { UserMapper } from '../mappers';

@Injectable()
export class FindUsersPaginatedUseCase implements UseCase<
  PaginatedSearchParams,
  PaginatedResult<UserDto>
> {
  constructor(private readonly userRepository: UserRepository) {}

  async execute(
    input: PaginatedSearchParams,
  ): Promise<PaginatedResult<UserDto>> {
    const result = await this.userRepository.findPaginated(input);

    return {
      page: result.page,
      limit: result.limit,
      total: result.total,
      data: UserMapper.toCollectionDto(result.data),
    };
  }
}
