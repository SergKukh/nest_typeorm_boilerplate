import type { HttpExceptionOptions } from '@nestjs/common';
import { ConflictException } from '@nestjs/common';

export class UserAlreadyExistsException extends ConflictException {
  constructor(email: string, options?: HttpExceptionOptions) {
    super(`User with email '${email}' already exists`, options);
  }
}
