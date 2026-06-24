import { CommentEntity } from '@/modules/core/domain';

export const makeComment = (
  overrides: Partial<Parameters<typeof CommentEntity.create>[0]> = {},
) =>
  CommentEntity.create({
    id: 'comment-1',
    userId: 'user-1',
    taskId: 'task-1',
    content: 'A comment',
    ...overrides,
  });
