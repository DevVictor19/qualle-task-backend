import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TypeOrmPaginatedRepository } from '@/shared/infra/persistence/repositories';
import { UserEntity } from '@/modules/core/domain/entities';
import { UserRepository } from '@/modules/core/domain/repositories';
import { UserOrmEntity } from '../entities';

@Injectable()
export class UserTypeOrmRepository
  extends TypeOrmPaginatedRepository<UserEntity, UserOrmEntity>
  implements UserRepository
{
  constructor(
    @InjectRepository(UserOrmEntity)
    repository: Repository<UserOrmEntity>,
  ) {
    super(repository);
  }

  getRelations(): string[] {
    return [];
  }

  async findByEmail(email: string): Promise<UserEntity | null> {
    const found = await this.repository.findOne({ where: { email } });
    return found ? this.toDomainEntity(found) : null;
  }

  toInfraEntity(entity: UserEntity): UserOrmEntity {
    return Object.assign(new UserOrmEntity(), {
      id: entity.id,
      createdAt: entity.createdAt,
      updatedAt: entity.updatedAt,
      name: entity.name,
      email: entity.email,
      password: entity.password,
    });
  }

  toDomainEntity(orm: UserOrmEntity): UserEntity {
    return UserEntity.create({
      id: orm.id,
      createdAt: orm.createdAt,
      updatedAt: orm.updatedAt,
      name: orm.name,
      email: orm.email,
      password: orm.password,
    });
  }
}
