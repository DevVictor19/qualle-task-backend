/* eslint-disable @typescript-eslint/unbound-method */
import { Test, TestingModule } from '@nestjs/testing';
import { UserLoginUseCase } from '../../user-login.usecase';
import { UserRepository } from '@/modules/core/domain';
import {
  JwtService,
  HashService,
  UnauthorizedError,
} from '@/modules/core/application';
import { UserEntity } from '@/modules/core/domain';

const mockUser = UserEntity.create({
  name: 'Test User',
  email: 'test@example.com',
  password: 'hashed-password',
});

describe('UserLoginUseCase', () => {
  let useCase: UserLoginUseCase;
  let userRepository: jest.Mocked<UserRepository>;
  let jwtService: jest.Mocked<JwtService>;
  let hashService: jest.Mocked<HashService>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserLoginUseCase,
        {
          provide: UserRepository,
          useValue: { findByEmail: jest.fn() },
        },
        {
          provide: JwtService,
          useValue: { sign: jest.fn() },
        },
        {
          provide: HashService,
          useValue: { compare: jest.fn() },
        },
      ],
    }).compile();

    useCase = module.get(UserLoginUseCase);
    userRepository = module.get(UserRepository);
    jwtService = module.get(JwtService);
    hashService = module.get(HashService);
  });

  afterEach(() => jest.restoreAllMocks());

  it('should throw UnauthorizedError when user is not found', async () => {
    userRepository.findByEmail.mockResolvedValue(null);

    await expect(
      useCase.execute({ email: 'test@example.com', password: 'pass' }),
    ).rejects.toThrow(UnauthorizedError);
  });

  it('should throw UnauthorizedError when password is invalid', async () => {
    userRepository.findByEmail.mockResolvedValue(mockUser);
    hashService.compare.mockResolvedValue(false);

    await expect(
      useCase.execute({ email: 'test@example.com', password: 'wrong' }),
    ).rejects.toThrow(UnauthorizedError);
  });

  it('should return accessToken on successful login', async () => {
    userRepository.findByEmail.mockResolvedValue(mockUser);
    hashService.compare.mockResolvedValue(true);
    jwtService.sign
      .mockReturnValueOnce('access-token')
      .mockReturnValueOnce('refresh-token');

    const result = await useCase.execute({
      email: 'test@example.com',
      password: 'pass',
    });

    expect(result.accessToken).toBe('access-token');
  });

  it('should return refreshToken on successful login', async () => {
    userRepository.findByEmail.mockResolvedValue(mockUser);
    hashService.compare.mockResolvedValue(true);
    jwtService.sign
      .mockReturnValueOnce('access-token')
      .mockReturnValueOnce('refresh-token');

    const result = await useCase.execute({
      email: 'test@example.com',
      password: 'pass',
    });

    expect(result.refreshToken).toBe('refresh-token');
  });

  it('should call jwtService.sign with access_token type', async () => {
    userRepository.findByEmail.mockResolvedValue(mockUser);
    hashService.compare.mockResolvedValue(true);
    jwtService.sign.mockReturnValue('token');

    await useCase.execute({ email: 'test@example.com', password: 'pass' });

    expect(jwtService.sign).toHaveBeenCalledWith(
      { userId: mockUser.id, type: 'access_token' },
      expect.any(Number),
    );
  });

  it('should call jwtService.sign with refresh_token type', async () => {
    userRepository.findByEmail.mockResolvedValue(mockUser);
    hashService.compare.mockResolvedValue(true);
    jwtService.sign.mockReturnValue('token');

    await useCase.execute({ email: 'test@example.com', password: 'pass' });

    expect(jwtService.sign).toHaveBeenCalledWith(
      { userId: mockUser.id, type: 'refresh_token' },
      expect.any(Number),
    );
  });
});
