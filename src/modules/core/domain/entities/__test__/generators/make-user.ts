import { UserEntity } from '../../user.entity';

export const makeUser = (
  overrides: Partial<Parameters<typeof UserEntity.create>[0]> = {},
) =>
  UserEntity.create({
    id: 'user-1',
    name: 'Test User',
    email: 'test@example.com',
    password: 'hashed-password',
    ...overrides,
  });
