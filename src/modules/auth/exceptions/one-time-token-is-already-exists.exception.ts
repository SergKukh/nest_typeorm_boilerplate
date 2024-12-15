import type { HttpExceptionOptions } from '@nestjs/common';
import { BadRequestException } from '@nestjs/common';
import humanizeDuration from 'humanize-duration';

export class OneTimeTokenIsAlreadyExistsException extends BadRequestException {
  constructor(resendInMs: number, options?: HttpExceptionOptions) {
    super(
      `One time token is already exists, try again in ${humanizeDuration(
        resendInMs,
        { round: true },
      )}`,
      options,
    );
  }
}
