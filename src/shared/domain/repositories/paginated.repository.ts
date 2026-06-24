import {
  BaseEntity,
  PaginatedResult,
  PaginatedSearchParams,
} from '@/shared/domain';
import { BaseRepository } from './base.repository';

export abstract class PaginatedRepository<
  E extends BaseEntity,
> extends BaseRepository<E> {
  abstract findPaginated(
    params: PaginatedSearchParams,
  ): Promise<PaginatedResult<E>>;
}
