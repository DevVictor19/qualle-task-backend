import { BaseEntity } from '@/shared/domain';
import { BaseRepository } from './base.repository';

export interface PaginatedSearchParams {
  page: number;
  limit: number;
  filters?: SearchFilter[];
  sort?: SortOption;
}

export interface SearchFilter {
  field: string;
  operator: SearchOperator;
  value: any;
}

export enum SearchOperator {
  EQ = 'eq',
  NE = 'ne',
  GT = 'gt',
  LT = 'lt',
  GTE = 'gte',
  LTE = 'lte',
  IN = 'in',
  NIN = 'nin',
  LIKE = 'like',
}

export interface SortOption {
  field: string;
  order: SortOrder;
}

export enum SortOrder {
  ASC = 'asc',
  DESC = 'desc',
}

export interface PaginatedResult<E> {
  total: number;
  page: number;
  limit: number;
  data: E[];
}

export abstract class PaginatedRepository<
  E extends BaseEntity,
> extends BaseRepository<E> {
  abstract findPaginated(
    params: PaginatedSearchParams,
  ): Promise<PaginatedResult<E>>;
}
