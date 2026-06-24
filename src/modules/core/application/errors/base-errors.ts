import { ApplicationErrCode, ApplicationError } from './application.error';

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
