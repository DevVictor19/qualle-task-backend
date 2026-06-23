import { BaseRepository } from '@/shared/domain';
import { UserEntity } from '../entities';

export abstract class UserRepository extends BaseRepository<UserEntity> {
  abstract findByEmail(email: string): Promise<UserEntity | null>;
}
