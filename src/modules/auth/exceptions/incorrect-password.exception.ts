import type { HttpExceptionOptions } from '@nestjs/common';
import { UnauthorizedException } from '@nestjs/common';

export class IncorrectPasswordException extends UnauthorizedException {
  constructor(options?: HttpExceptionOptions) {
    super(`Incorrect password`, options);
  }
}
