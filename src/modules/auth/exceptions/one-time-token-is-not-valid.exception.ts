import type { HttpExceptionOptions } from '@nestjs/common';
import { UnauthorizedException } from '@nestjs/common';

export class OneTimeTokenIsNotValidException extends UnauthorizedException {
  constructor(options?: HttpExceptionOptions) {
    super(`One time token is not valid`, options);
  }
}
