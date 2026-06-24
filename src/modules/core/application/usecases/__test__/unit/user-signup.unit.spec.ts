/* eslint-disable @typescript-eslint/unbound-method */
import { Test, TestingModule } from '@nestjs/testing';
import { UserSignupUseCase } from '../../user-signup.usecase';
import { UserRepository } from '@/modules/core/domain';
import { HashService, ConflictError } from '@/modules/core/application';
import { UserEntity } from '@/modules/core/domain';

const mockUser = UserEntity.create({
  name: 'Existing User',
  email: 'existing@example.com',
  password: 'hashed',
});

describe('UserSignupUseCase', () => {
  let useCase: UserSignupUseCase;
  let userRepository: jest.Mocked<UserRepository>;
  let hashService: jest.Mocked<HashService>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserSignupUseCase,
        {
          provide: UserRepository,
          useValue: { findByEmail: jest.fn(), save: jest.fn() },
        },
        {
          provide: HashService,
          useValue: { hash: jest.fn() },
        },
      ],
    }).compile();

    useCase = module.get(UserSignupUseCase);
    userRepository = module.get(UserRepository);
    hashService = module.get(HashService);
  });

  afterEach(() => jest.restoreAllMocks());

  it('should throw ConflictError when email is already in use', async () => {
    userRepository.findByEmail.mockResolvedValue(mockUser);

    await expect(
      useCase.execute({
        name: 'New User',
        email: 'existing@example.com',
        password: 'pass',
      }),
    ).rejects.toThrow(ConflictError);
  });

  it('should call hashService.hash with the given password', async () => {
    userRepository.findByEmail.mockResolvedValue(null);
    hashService.hash.mockResolvedValue('hashed-password');
    userRepository.save.mockResolvedValue(undefined as any);

    await useCase.execute({
      name: 'New User',
      email: 'new@example.com',
      password: 'plain-pass',
    });

    expect(hashService.hash).toHaveBeenCalledWith('plain-pass');
  });

  it('should call userRepository.save after hashing the password', async () => {
    userRepository.findByEmail.mockResolvedValue(null);
    hashService.hash.mockResolvedValue('hashed-password');
    userRepository.save.mockResolvedValue(undefined as any);

    await useCase.execute({
      name: 'New User',
      email: 'new@example.com',
      password: 'plain-pass',
    });

    expect(userRepository.save).toHaveBeenCalledTimes(1);
  });
});
