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

export interface PaginatedResult<DomainEntity> {
  total: number;
  page: number;
  limit: number;
  data: DomainEntity[];
}

export abstract class PaginatedRepository<
  DomainEntity,
  InfraEntity,
> extends BaseRepository<DomainEntity, InfraEntity> {
  abstract findPaginated(
    params: PaginatedSearchParams,
  ): Promise<PaginatedResult<DomainEntity>>;
}
