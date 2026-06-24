import {
  ArgumentsHost,
  BadRequestException,
  Catch,
  UnauthorizedException,
} from '@nestjs/common';
import { GqlExceptionFilter } from '@nestjs/graphql';
import { GraphQLError } from 'graphql';
import {
  ApplicationErrCode,
  ApplicationError,
} from '../../../application/errors';
import { ApplicationErrorMapper } from '@/shared/presentation';

@Catch()
export class GraphqlExceptionFilter implements GqlExceptionFilter {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  catch(exception: unknown, _host: ArgumentsHost) {
    if (exception instanceof ApplicationError) {
      const mapped = ApplicationErrorMapper.toPresentation(exception);
      return new GraphQLError(mapped.message, {
        extensions: {
          code: mapped.code,
          status: mapped.status,
        },
      });
    }

    if (exception instanceof UnauthorizedException) {
      return new GraphQLError(exception.message, {
        extensions: { code: ApplicationErrCode.UNAUTHORIZED, status: 401 },
      });
    }

    if (exception instanceof BadRequestException) {
      const response = exception.getResponse() as {
        message: string | string[];
      };
      const messages = Array.isArray(response.message)
        ? response.message
        : [response.message];
      return new GraphQLError(messages.join('; '), {
        extensions: { code: ApplicationErrCode.BAD_REQUEST, status: 400 },
      });
    }

    return new GraphQLError('Internal server error', {
      extensions: { code: ApplicationErrCode.INTERNAL_ERROR, status: 500 },
    });
  }
}
