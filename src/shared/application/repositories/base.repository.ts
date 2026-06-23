import { BaseEntity } from '@/shared/domain';

export abstract class BaseRepository<
  DomainEntity extends BaseEntity,
  InfraEntity,
> {
  abstract save(entity: DomainEntity): Promise<DomainEntity>;
  abstract saveMany(entities: DomainEntity[]): Promise<DomainEntity[]>;
  abstract update(entity: DomainEntity): Promise<DomainEntity>;
  abstract findById(id: string): Promise<DomainEntity | null>;
  abstract findAll(): Promise<DomainEntity[]>;
  abstract count(): Promise<number>;
  abstract delete(id: string): Promise<void>;

  abstract getRelations(): string[];
  abstract toInfraEntity(entity: DomainEntity): InfraEntity;
  abstract toDomainEntity(entity: InfraEntity): DomainEntity;
}
