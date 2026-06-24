import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtPayload, JwtService } from '../../application';
import { sign, verify } from 'jsonwebtoken';

@Injectable()
export class JwtServiceImpl implements JwtService {
  private readonly logger = new Logger(JwtService.name);
  private readonly jwtSecret: string;
  private readonly issuer: string;

  constructor(private readonly configService: ConfigService) {
    this.jwtSecret = this.configService.getOrThrow<string>('JWT_SECRET');
    this.issuer = this.configService.getOrThrow<string>('JWT_ISSUER');
  }

  sign(payload: JwtPayload, expInSeconds: number): string {
    return sign(payload, this.jwtSecret, {
      issuer: this.issuer,
      expiresIn: expInSeconds,
    });
  }

  verify<T>(token: string): T | null {
    try {
      const decoded = verify(token, this.jwtSecret, {
        issuer: this.issuer,
      }) as T;
      return decoded;
    } catch (error) {
      this.logger.error(
        `JWT verification failed: ${error instanceof Error ? error.message : String(error)}`,
      );
      return null;
    }
  }
}
