import type { HttpExceptionOptions } from '@nestjs/common';
import { UnauthorizedException } from '@nestjs/common';

export class InvalidJwtException extends UnauthorizedException {
  constructor(options?: HttpExceptionOptions) {
    super(`Invalid JWT`, options);
  }
}
