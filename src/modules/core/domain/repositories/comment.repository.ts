import { BaseRepository } from '@/shared/domain';
import { CommentEntity } from '../entities';

export abstract class CommentRepository extends BaseRepository<CommentEntity> {}
