/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { ObjectLiteral, Repository } from 'typeorm';
import { BaseRepository } from '@/shared/application';
import { BaseEntity } from '@/shared/domain';

export abstract class TypeOrmBaseRepository<
  D extends BaseEntity,
  I extends ObjectLiteral,
> implements BaseRepository<D> {
  constructor(protected readonly repository: Repository<I>) {}

  async save(entity: D): Promise<D> {
    const infraEntity = this.toInfraEntity(entity);
    const saved = await this.repository.save(infraEntity);
    return this.toDomainEntity(saved);
  }

  async saveMany(entities: D[]): Promise<D[]> {
    const infraEntities = entities.map((e) => this.toInfraEntity(e));
    const saved = await this.repository.save(infraEntities);
    return saved.map((e) => this.toDomainEntity(e));
  }

  async update(entity: D): Promise<D> {
    const infraEntity = this.toInfraEntity(entity);
    const saved = await this.repository.save(infraEntity);
    return this.toDomainEntity(saved);
  }

  async findById(id: string): Promise<D | null> {
    const found = await this.repository.findOne({
      where: { id } as any,
      relations: this.translateRelations(this.getRelations()) as any,
    });
    return found ? this.toDomainEntity(found) : null;
  }

  async findAll(): Promise<D[]> {
    const found = await this.repository.find({
      relations: this.translateRelations(this.getRelations()) as any,
    });
    return found.map((e) => this.toDomainEntity(e));
  }

  async count(): Promise<number> {
    return this.repository.count();
  }

  async delete(id: string): Promise<void> {
    await this.repository.delete(id);
  }

  private translateRelations(
    relations: string[],
  ): Record<string, boolean | Record<string, boolean>> {
    const relationMap: Record<string, boolean | Record<string, boolean>> = {};
    for (const relation of relations) {
      if (relation.includes('.')) {
        const parts = relation.split('.');
        const lastIndex = parts.length - 1;
        let lastKey = '';

        for (let i = 0; i < parts.length; i++) {
          if (i === lastIndex) {
            const obj = relationMap[lastKey] as Record<string, boolean>;
            obj[parts[i]] = true;
          } else {
            relationMap[parts[i]] = {};
            lastKey = parts[i];
          }
        }
      } else {
        relationMap[relation] = true;
      }
    }
    return relationMap;
  }

  abstract getRelations(): string[];
  abstract toInfraEntity(entity: D): I;
  abstract toDomainEntity(entity: I): D;
}
