/* eslint-disable @typescript-eslint/unbound-method */
import { Test, TestingModule } from '@nestjs/testing';
import { FindUserDetailsUseCase } from '../../find-user-details.usecase';
import { UserRepository, UserEntity } from '@/modules/core/domain';
import {
  ResourceNotFoundError,
  UserMapper,
  UserDto,
} from '@/modules/core/application';

const mockUser = UserEntity.create({
  id: 'user-1',
  name: 'Test User',
  email: 'test@example.com',
  password: 'hashed',
});

const mockUserDto: UserDto = {
  id: 'user-1',
  name: 'Test User',
  email: 'test@example.com',
  createdAt: new Date(),
  updatedAt: new Date(),
};

describe('FindUserDetailsUseCase', () => {
  let useCase: FindUserDetailsUseCase;
  let userRepository: jest.Mocked<UserRepository>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        FindUserDetailsUseCase,
        {
          provide: UserRepository,
          useValue: { findById: jest.fn() },
        },
      ],
    }).compile();

    useCase = module.get(FindUserDetailsUseCase);
    userRepository = module.get(UserRepository);
  });

  afterEach(() => jest.restoreAllMocks());

  it('should throw ResourceNotFoundError when user is not found', async () => {
    userRepository.findById.mockResolvedValue(null);

    await expect(useCase.execute({ userId: 'user-1' })).rejects.toThrow(
      ResourceNotFoundError,
    );
  });

  it('should call userRepository.findById with the correct id', async () => {
    userRepository.findById.mockResolvedValue(mockUser);
    jest.spyOn(UserMapper, 'toDto').mockReturnValue(mockUserDto);

    await useCase.execute({ userId: 'user-1' });

    expect(userRepository.findById).toHaveBeenCalledWith('user-1');
  });

  it('should return the dto produced by UserMapper.toDto', async () => {
    userRepository.findById.mockResolvedValue(mockUser);
    jest.spyOn(UserMapper, 'toDto').mockReturnValue(mockUserDto);

    const result = await useCase.execute({ userId: 'user-1' });

    expect(result).toBe(mockUserDto);
  });
});
