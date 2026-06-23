/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { ObjectLiteral } from 'typeorm';
import {
  PaginatedRepository,
  PaginatedResult,
  PaginatedSearchParams,
  SearchOperator,
  SortOrder,
} from '@/shared/application';
import { BaseEntity } from '@/shared/domain';
import { TypeOrmBaseRepository } from './typeorm-base.repository';

export abstract class TypeOrmPaginatedRepository<
  D extends BaseEntity,
  I extends ObjectLiteral,
>
  extends TypeOrmBaseRepository<D, I>
  implements PaginatedRepository<D>
{
  async findPaginated(
    params: PaginatedSearchParams,
  ): Promise<PaginatedResult<D>> {
    const { page, limit, filters = [], sort } = params;
    const alias = 'entity';

    const qb = this.repository.createQueryBuilder(alias);

    for (const relation of this.getRelations()) {
      qb.leftJoinAndSelect(`${alias}.${relation}`, relation);
    }

    filters.forEach((filter, index) => {
      const paramKey = `param_${index}`;
      const column = `${alias}.${filter.field}`;

      switch (filter.operator) {
        case SearchOperator.EQ:
          qb.andWhere(`${column} = :${paramKey}`, { [paramKey]: filter.value });
          break;
        case SearchOperator.NE:
          qb.andWhere(`${column} != :${paramKey}`, {
            [paramKey]: filter.value,
          });
          break;
        case SearchOperator.GT:
          qb.andWhere(`${column} > :${paramKey}`, { [paramKey]: filter.value });
          break;
        case SearchOperator.LT:
          qb.andWhere(`${column} < :${paramKey}`, { [paramKey]: filter.value });
          break;
        case SearchOperator.GTE:
          qb.andWhere(`${column} >= :${paramKey}`, {
            [paramKey]: filter.value,
          });
          break;
        case SearchOperator.LTE:
          qb.andWhere(`${column} <= :${paramKey}`, {
            [paramKey]: filter.value,
          });
          break;
        case SearchOperator.IN:
          qb.andWhere(`${column} IN (:...${paramKey})`, {
            [paramKey]: filter.value,
          });
          break;
        case SearchOperator.NIN:
          qb.andWhere(`${column} NOT IN (:...${paramKey})`, {
            [paramKey]: filter.value,
          });
          break;
        case SearchOperator.LIKE:
          qb.andWhere(`${column} LIKE :${paramKey}`, {
            [paramKey]: `%${filter.value as string}%`,
          });
          break;
      }
    });

    if (sort) {
      qb.orderBy(
        `${alias}.${sort.field}`,
        sort.order === SortOrder.ASC ? 'ASC' : 'DESC',
      );
    }

    qb.skip((page - 1) * limit).take(limit);

    const [data, total] = await qb.getManyAndCount();

    return {
      total,
      page,
      limit,
      data: data.map((e) => this.toDomainEntity(e)),
    };
  }
}
