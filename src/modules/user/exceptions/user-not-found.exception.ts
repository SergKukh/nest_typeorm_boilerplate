import type { HttpExceptionOptions } from '@nestjs/common';
import { NotFoundException } from '@nestjs/common';

export class UserNotFoundException extends NotFoundException {
  constructor(options?: HttpExceptionOptions) {
    super(`User not found`, options);
  }
}
