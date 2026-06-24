import { Test, TestingModule } from '@nestjs/testing';
import { FindUsersPaginatedUseCase } from '../../find-users-paginated.usecase';
import { UserRepository, UserEntity } from '@/modules/core/domain';
import { UserMapper, UserDto } from '@/modules/core/application';

const mockUser = UserEntity.create({
  name: 'Test User',
  email: 'test@example.com',
  password: 'hashed',
});

const mockUserDto: UserDto = {
  id: mockUser.id,
  name: 'Test User',
  email: 'test@example.com',
  createdAt: new Date(),
  updatedAt: new Date(),
};

const mockPaginatedResult = {
  page: 2,
  limit: 10,
  total: 50,
  data: [mockUser],
};

describe('FindUsersPaginatedUseCase', () => {
  let useCase: FindUsersPaginatedUseCase;
  let userRepository: jest.Mocked<UserRepository>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        FindUsersPaginatedUseCase,
        {
          provide: UserRepository,
          useValue: { findPaginated: jest.fn() },
        },
      ],
    }).compile();

    useCase = module.get(FindUsersPaginatedUseCase);
    userRepository = module.get(UserRepository);
    jest.spyOn(UserMapper, 'toCollectionDto').mockReturnValue([mockUserDto]);
    userRepository.findPaginated.mockResolvedValue(mockPaginatedResult);
  });

  afterEach(() => jest.restoreAllMocks());

  it('should return correct page from repository result', async () => {
    const result = await useCase.execute({ page: 2, limit: 10 });

    expect(result.page).toBe(2);
  });

  it('should return correct limit from repository result', async () => {
    const result = await useCase.execute({ page: 2, limit: 10 });

    expect(result.limit).toBe(10);
  });

  it('should return correct total from repository result', async () => {
    const result = await useCase.execute({ page: 2, limit: 10 });

    expect(result.total).toBe(50);
  });

  it('should return data mapped by UserMapper.toCollectionDto', async () => {
    const result = await useCase.execute({ page: 2, limit: 10 });

    expect(result.data).toEqual([mockUserDto]);
  });
});
