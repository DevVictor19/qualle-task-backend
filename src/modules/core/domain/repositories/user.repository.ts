import { PaginatedRepository } from '@/shared/domain';
import { UserEntity } from '../entities';

export abstract class UserRepository extends PaginatedRepository<UserEntity> {
  abstract findByEmail(email: string): Promise<UserEntity | null>;
}
