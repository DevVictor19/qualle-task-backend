/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { GqlExecutionContext } from '@nestjs/graphql';
import { JwtService } from '@/modules/core/application/services/jwt.service';
import { IS_PUBLIC_KEY } from '../decorators/public.decorator';
import { Request } from 'express';
import { LoggedUser } from '../types';

@Injectable()
export class JwtAuthGuard implements CanActivate {
  constructor(
    private readonly jwtService: JwtService,
    private readonly reflector: Reflector,
  ) {}

  canActivate(context: ExecutionContext): boolean {
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (isPublic) return true;

    const req = GqlExecutionContext.create(context).getContext()
      .req as Request & { user?: LoggedUser };
    const [type, token] = (req.headers?.authorization ?? '').split(' ');

    if (type !== 'Bearer' || !token) {
      throw new UnauthorizedException('Token not provided');
    }

    const payload = this.jwtService.verify<{ userId: string; type: string }>(
      token,
    );

    if (!payload || payload.type !== 'access_token') {
      throw new UnauthorizedException('Invalid token');
    }

    req.user = { userId: payload.userId };

    return true;
  }
}
