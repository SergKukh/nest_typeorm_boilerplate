import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { createHash, randomBytes } from 'crypto';
import { Env } from 'environment/environment.type';
import { CacheService } from 'modules/cache/cache.service';
import { OneTimeTokenType } from 'modules/auth/enums/one-time-token-type.enum';
import { redisPrefixFactory } from 'modules/cache/factories/redis-prefix.factory';
import { RedisPrefixes } from 'modules/cache/enums/redis-prefixes.enum';
import { OneTimeTokenData } from 'modules/auth/types/one-time-token-data.type';
import { OneTimeTokenIsAlreadyExistsException } from 'modules/auth/exceptions/one-time-token-is-already-exists.exception';
import { OneTimeTokenIsNotValidException } from 'modules/auth/exceptions/one-time-token-is-not-valid.exception';

@Injectable()
export class AuthOneTimeTokenService {
  constructor(
    private configService: ConfigService<Env, true>,
    private readonly cacheService: CacheService,
  ) {}

  private readonly tokenTypeExpiresInEnvNameMap = {
    [OneTimeTokenType.RESET_PASSWORD]: 'RESET_PASSWORD_TOKEN_EXPIRE_IN',
  } satisfies Record<OneTimeTokenType, Partial<keyof Env>>;

  private readonly tokenTypeResendInEnvNameMap = {
    [OneTimeTokenType.RESET_PASSWORD]: 'RESET_PASSWORD_TOKEN_RESEND_IN',
  } satisfies Record<OneTimeTokenType, Partial<keyof Env>>;

  private readonly oneTimeTokenTypeRedisPrefixMap = {
    [OneTimeTokenType.RESET_PASSWORD]:
      RedisPrefixes.RESET_PASSWORD_ONE_TIME_TOKEN,
  } satisfies Record<OneTimeTokenType, Partial<RedisPrefixes>>;

  private hashToken(token: string): string {
    return createHash('sha256').update(token).digest('hex');
  }

  async generateToken(args: {
    type: OneTimeTokenType;
    email: string;
  }): Promise<{
    token: string;
    expiresIn: number;
  }> {
    const { type, email } = args;
    const currentTimestamp = Date.now();
    const emailKey = redisPrefixFactory(
      this.oneTimeTokenTypeRedisPrefixMap[type],
      email,
    );
    const existingToken =
      await this.cacheService.get<OneTimeTokenData>(emailKey);
    const resendInEnvName = this.tokenTypeResendInEnvNameMap[type];
    const resendIn =
      this.configService.get(resendInEnvName, { infer: true }) || 0;

    if (existingToken) {
      const { timestamp: existingTokenTimestamp } = existingToken;
      const timeStampDifference = currentTimestamp - existingTokenTimestamp;

      if (timeStampDifference < resendIn) {
        const retryAttemptIn = resendIn - timeStampDifference;

        throw new OneTimeTokenIsAlreadyExistsException(retryAttemptIn);
      }
    }

    const expiresInEnvName = this.tokenTypeExpiresInEnvNameMap[type];
    const expiresIn =
      this.configService.get(expiresInEnvName, { infer: true }) ||
      24 * 60 * 60 * 1000;
    const newToken = randomBytes(64).toString('hex');
    const hashedNewToken = this.hashToken(newToken);
    const hashedTokenKey = redisPrefixFactory(
      this.oneTimeTokenTypeRedisPrefixMap[type],
      hashedNewToken,
    );
    const tokenData: OneTimeTokenData = {
      email,
      hashedToken: hashedNewToken,
      timestamp: currentTimestamp,
    };

    await Promise.all([
      this.cacheService.set(emailKey, tokenData, expiresIn),
      this.cacheService.set(hashedTokenKey, tokenData, expiresIn),
    ]);

    return {
      token: newToken,
      expiresIn,
    };
  }

  async verifyOneTimeToken(args: {
    type: OneTimeTokenType;
    token: string;
  }): Promise<{
    email: string;
  }> {
    const { type, token } = args;
    const hashedToken = this.hashToken(token);
    const hashedTokenKey = redisPrefixFactory(
      this.oneTimeTokenTypeRedisPrefixMap[type],
      hashedToken,
    );
    const tokenData =
      await this.cacheService.get<OneTimeTokenData>(hashedTokenKey);

    if (!tokenData) throw new OneTimeTokenIsNotValidException();

    const { email } = tokenData;
    const emailKey = redisPrefixFactory(
      this.oneTimeTokenTypeRedisPrefixMap[type],
      email,
    );

    await Promise.all([
      this.cacheService.delete(emailKey),
      this.cacheService.delete(hashedTokenKey),
    ]);

    return { email };
  }
}
