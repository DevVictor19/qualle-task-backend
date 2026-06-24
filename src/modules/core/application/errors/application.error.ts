export abstract class ApplicationError extends Error {
  abstract readonly code: ApplicationErrCode;

  constructor(message: string) {
    super(message);
  }
}

export enum ApplicationErrCode {
  VALIDATION_ERROR = 'VALIDATION_ERROR',
  RESOURCE_NOT_FOUND = 'RESOURCE_NOT_FOUND',
  UNAUTHORIZED = 'UNAUTHORIZED',
  CONFLICT = 'CONFLICT',
}
