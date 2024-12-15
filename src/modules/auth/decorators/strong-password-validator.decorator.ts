import { applyDecorators } from '@nestjs/common';
import { IsStrongPassword } from 'class-validator';

export const StrongPasswordValidator = (): ReturnType<typeof applyDecorators> =>
  applyDecorators(
    IsStrongPassword({
      minLength: 8,
      minLowercase: 0,
      minUppercase: 0,
      minSymbols: 0,
      minNumbers: 0,
    }),
  );
