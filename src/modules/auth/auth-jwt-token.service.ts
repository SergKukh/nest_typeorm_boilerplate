import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JsonWebTokenError, JwtService, TokenExpiredError } from '@nestjs/jwt';
import { instanceToPlain } from 'class-transformer';
import { validateOrReject } from 'class-validator';
import { Env } from 'environment/environment.type';
import { AuthTokenType } from 'modules/auth/enums/auth-token-type.enum';
import { UserJwtPayloadDto } from 'modules/auth/dto/user-jwt-payload.dto';
import { JwtExpiredException } from 'modules/auth/exceptions/jwt-expired.exception';
import { InvalidJwtException } from 'modules/auth/exceptions/invalid-jwt.exception';
import { UserEntity } from 'database/entities/user.entity';
import { AccessRefreshTokensData } from 'modules/auth/types/access-refresh-tokens-data.type';
import { InvalidJwtTypeException } from 'modules/auth/exceptions/invalid-jwt-type.exception';
import { UserService } from 'modules/user/user.service';

@Injectable()
export class AuthJwtTokenService {
  constructor(
    private jwtService: JwtService,
    private readonly userService: UserService,
    private configService: ConfigService<Env, true>,
  ) {}

  private readonly tokenTypeExpiresInEnvNameMap = {
    [AuthTokenType.ACCESS]: 'JWT_ACCESS_TOKEN_EXPIRE_IN',
    [AuthTokenType.REFRESH]: 'JWT_REFRESH_TOKEN_EXPIRE_IN',
  } satisfies Record<AuthTokenType, Partial<keyof Env>>;

  async generateToken(payload: UserJwtPayloadDto): Promise<string> {
    const payloadInstance = new UserJwtPayloadDto(payload);

    await validateOrReject(payloadInstance);

    const { tokenType } = payloadInstance;
    const expiresInEnvName = this.tokenTypeExpiresInEnvNameMap[tokenType];
    const JWT_TOKEN_EXPIRES_IN = this.configService.get(expiresInEnvName, {
      infer: true,
    });
    const expiresIn = (JWT_TOKEN_EXPIRES_IN || 0) / 1000;
    const payloadPlain = instanceToPlain(payloadInstance, {
      excludeExtraneousValues: true,
    });
    const token = this.jwtService.sign(payloadPlain, { expiresIn });

    return token;
  }

  verifyToken(jwtToken: string): UserJwtPayloadDto {
    try {
      return this.jwtService.verify<UserJwtPayloadDto>(jwtToken);
    } catch (error) {
      if (error instanceof TokenExpiredError)
        throw new JwtExpiredException({ cause: error });
      else if (error instanceof JsonWebTokenError)
        throw new InvalidJwtException({ cause: error });
      else throw error;
    }
  }

  async generateAccessRefreshTokens(
    user: UserEntity,
  ): Promise<AccessRefreshTokensData> {
    const { id: userId } = user;

    const accessToken = await this.generateToken({
      userId,
      tokenType: AuthTokenType.ACCESS,
    });

    const refreshToken = await this.generateToken({
      userId,
      tokenType: AuthTokenType.REFRESH,
    });

    return { accessToken, refreshToken };
  }

  async refreshAccessRefreshTokens(
    refreshToken: string,
  ): Promise<AccessRefreshTokensData> {
    const payload = this.verifyToken(refreshToken);
    const { tokenType, userId } = payload;

    if (tokenType !== AuthTokenType.REFRESH)
      throw new InvalidJwtTypeException();
    const user = await this.userService.getUserByIdOrFail(userId);

    const accessRefreshTokens = await this.generateAccessRefreshTokens(user);

    return accessRefreshTokens;
  }
}
