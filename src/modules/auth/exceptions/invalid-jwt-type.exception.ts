import {
  UnauthorizedException,
  type HttpExceptionOptions,
} from '@nestjs/common';

export class InvalidJwtTypeException extends UnauthorizedException {
  constructor(options?: HttpExceptionOptions) {
    super(`Invalid JWT type`, options);
  }
}
