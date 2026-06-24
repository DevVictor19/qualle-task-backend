import {
  ApplicationErrCode,
  ApplicationError,
} from '@/modules/core/application';
import { PresentationError } from '../errors';

export class ApplicationErrorMapper {
  static toPresentation(error: ApplicationError): PresentationError {
    switch (error.code) {
      case ApplicationErrCode.RESOURCE_NOT_FOUND:
        return {
          status: 404,
          code: error.code,
          message: error.message,
        };

      case ApplicationErrCode.CONFLICT:
        return {
          status: 409,
          code: error.code,
          message: error.message,
        };

      case ApplicationErrCode.VALIDATION_ERROR:
        return {
          status: 400,
          code: error.code,
          message: error.message,
        };

      case ApplicationErrCode.UNAUTHORIZED:
        return {
          status: 401,
          code: error.code,
          message: error.message,
        };

      default:
        return {
          status: 500,
          code: 'INTERNAL_ERROR',
          message: 'Internal Server Error',
        };
    }
  }
}
