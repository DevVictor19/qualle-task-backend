import { UseCase } from '@/shared/application';
import { Injectable } from '@nestjs/common';
import { UserLoginInputDto, UserLoginOutputDto } from '../dtos';
import { UserRepository } from '../../domain';
import { HashService, JwtService } from '../services';
import { UnauthorizedError } from '../errors';

@Injectable()
export class UserLoginUseCase implements UseCase<
  UserLoginInputDto,
  UserLoginOutputDto
> {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly jwtService: JwtService,
    private readonly hashService: HashService,
  ) {}

  async execute(input: UserLoginInputDto): Promise<UserLoginOutputDto> {
    const user = await this.userRepository.findByEmail(input.email);
    if (!user) {
      throw new UnauthorizedError('Invalid email or password');
    }

    const isValidPassword = await this.hashService.compare(
      input.password,
      user.password,
    );
    if (!isValidPassword) {
      throw new UnauthorizedError('Invalid email or password');
    }

    const oneHourInSeconds = 60 * 60;
    const sevenDaysInSeconds = 60 * 60 * 24 * 7;

    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.sign(
        { userId: user.id, type: 'access_token' },
        oneHourInSeconds,
      ),
      this.jwtService.sign(
        { userId: user.id, type: 'refresh_token' },
        sevenDaysInSeconds,
      ),
    ]);

    return {
      accessToken,
      refreshToken,
    };
  }
}
