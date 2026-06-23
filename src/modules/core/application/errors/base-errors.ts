import { ApplicationError } from './application.error';

export enum ApplicationErrCode {
  VALIDATION_ERROR = 'VALIDATION_ERROR',
  RESOURCE_NOT_FOUND = 'RESOURCE_NOT_FOUND',
  UNAUTHORIZED = 'UNAUTHORIZED',
  CONFLICT = 'CONFLICT',
}

export class ValidationError extends ApplicationError {
  readonly code = ApplicationErrCode.VALIDATION_ERROR;
}

export class ResourceNotFoundError extends ApplicationError {
  readonly code = ApplicationErrCode.RESOURCE_NOT_FOUND;
}

export class UnauthorizedError extends ApplicationError {
  readonly code = ApplicationErrCode.UNAUTHORIZED;
}

export class ConflictError extends ApplicationError {
  readonly code = ApplicationErrCode.CONFLICT;
}
