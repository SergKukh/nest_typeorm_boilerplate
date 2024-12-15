import type { HttpExceptionOptions } from '@nestjs/common';
import { UnauthorizedException } from '@nestjs/common';

export class JwtExpiredException extends UnauthorizedException {
  constructor(options?: HttpExceptionOptions) {
    super(`JWT expired`, options);
  }
}
