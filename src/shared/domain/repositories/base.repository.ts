import { BaseEntity } from '@/shared/domain';

export abstract class BaseRepository<E extends BaseEntity> {
  abstract save(entity: E): Promise<E>;
  abstract saveMany(entities: E[]): Promise<E[]>;
  abstract update(entity: E): Promise<E>;
  abstract findById(id: string): Promise<E | null>;
  abstract findAll(): Promise<E[]>;
  abstract count(): Promise<number>;
  abstract delete(id: string): Promise<void>;
}
