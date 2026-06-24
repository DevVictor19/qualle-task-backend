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

type GqlContext = {
  req?: { headers?: Record<string, string>; user?: { userId: string } };
  connectionParams?: Record<string, unknown>;
};

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

    const gqlCtx = GqlExecutionContext.create(context).getContext<GqlContext>();

    const authorization =
      gqlCtx.req?.headers?.authorization ||
      (gqlCtx.connectionParams?.Authorization as string | undefined);

    const [type, token] = (authorization ?? '').split(' ');

    if (type !== 'Bearer' || !token) {
      throw new UnauthorizedException('Token not provided');
    }

    const payload = this.jwtService.verify<{ userId: string; type: string }>(
      token,
    );

    if (!payload || payload.type !== 'access_token') {
      throw new UnauthorizedException('Invalid token');
    }

    if (gqlCtx.req) {
      gqlCtx.req.user = { userId: payload.userId };
    }

    return true;
  }
}
