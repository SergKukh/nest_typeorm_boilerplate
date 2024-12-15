import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { compare, hash } from 'bcrypt';
import { Env } from 'environment/environment.type';
import { IncorrectPasswordException } from 'modules/auth/exceptions/incorrect-password.exception';

@Injectable()
export class AuthPasswordService {
  constructor(private readonly configService: ConfigService<Env, true>) {}

  private readonly randomPasswordChars =
    'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()_+[]{}|;:,.<>?';

  private PASSWORD_SALT_ROUNDS = this.configService.get(
    'PASSWORD_SALT_ROUNDS',
    { infer: true },
  );

  async hashPassword(password: string): Promise<string> {
    const hashedPassword = await hash(password, this.PASSWORD_SALT_ROUNDS);

    return hashedPassword;
  }

  async verifyPassword(
    password: string,
    hashedPassword: string,
  ): Promise<boolean> {
    const isPasswordCorrect = await compare(password, hashedPassword);

    return isPasswordCorrect;
  }

  async verifyPasswordOrThrow(
    ...args: Parameters<typeof this.verifyPassword>
  ): Promise<void> {
    const isPasswordCorrect = await this.verifyPassword(...args);

    if (!isPasswordCorrect) throw new IncorrectPasswordException();
  }

  generateRandomPassword(length: number = 12): string {
    const { randomPasswordChars: chars } = this;

    return Array.from({ length }, () =>
      chars.charAt(Math.floor(Math.random() * chars.length)),
    ).join('');
  }
}
