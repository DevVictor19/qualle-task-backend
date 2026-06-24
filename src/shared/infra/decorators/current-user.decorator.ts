/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';
import { LoggedUser } from '../types';

export const CurrentUser = createParamDecorator(
  (_: unknown, context: ExecutionContext): LoggedUser => {
    const ctx = GqlExecutionContext.create(context);
    const req = ctx.getContext().req as Request & { user?: LoggedUser };
    return req.user as LoggedUser;
  },
);
