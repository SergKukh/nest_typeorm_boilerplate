import { Injectable } from '@nestjs/common';
import * as URL from 'node:url';
import { PostSignUpDto } from 'modules/auth/dto/post-sign-up.dto';
import { UserService } from 'modules/user/user.service';
import { AccessRefreshTokensData } from 'modules/auth/types/access-refresh-tokens-data.type';
import { AuthJwtTokenService } from 'modules/auth/auth-jwt-token.service';
import { AuthPasswordService } from 'modules/auth/auth-password.service';
import { PostSignInDto } from 'modules/auth/dto/post-sign-in.dto';
import { AuthOneTimeTokenService } from 'modules/auth/auth-one-time-token.service';
import { OneTimeTokenType } from 'modules/auth/enums/one-time-token-type.enum';
import { MailService } from 'modules/mail/mail.service';
import { ConfigService } from '@nestjs/config';
import { Env } from 'environment/environment.type';

@Injectable()
export class AuthService {
  constructor(
    private readonly authJwtTokenService: AuthJwtTokenService,
    private readonly authPasswordService: AuthPasswordService,
    private readonly authOneTimeTokenService: AuthOneTimeTokenService,
    private readonly userService: UserService,
    private readonly mailService: MailService,
    private readonly configService: ConfigService<Env, true>,
  ) {}

  private frontendUrl = this.configService
    .get<string>('FRONTEND_URL')
    .replace(/\/$/, ''); // Removes trailing slash if it exists

  async signUp(dto: PostSignUpDto): Promise<AccessRefreshTokensData> {
    const user = await this.userService.createUser(dto);

    return this.authJwtTokenService.generateAccessRefreshTokens(user);
  }

  async singIn(dto: PostSignInDto): Promise<AccessRefreshTokensData> {
    const { email, password } = dto;
    const user = await this.userService.getUserByEmailOrFail(email, {
      select: ['id', 'password'],
    });

    await this.authPasswordService.verifyPasswordOrThrow(
      password,
      user.password,
    );

    return this.authJwtTokenService.generateAccessRefreshTokens(user);
  }

  async sendRecoverPasswordEmail(email: string): Promise<void> {
    const user = await this.userService.getUserByEmailOrFail(email);

    const { token } = await this.authOneTimeTokenService.generateToken({
      type: OneTimeTokenType.RESET_PASSWORD,
      email,
    });

    const url = URL.format({
      host: this.frontendUrl,
      pathname: '/auth/set-new-password',
      query: { token },
    });

    await this.mailService.sendRecoverPasswordEmail(user, url);
  }

  async resetPassword(args: {
    token: string;
    password: string;
  }): Promise<void> {
    const { token, password } = args;

    const { email } = await this.authOneTimeTokenService.verifyOneTimeToken({
      type: OneTimeTokenType.RESET_PASSWORD,
      token,
    });

    const { id: userId } = await this.userService.getUserByEmailOrFail(email);

    const hashedPassword =
      await this.authPasswordService.hashPassword(password);

    await this.userService.updateUser(userId, {
      password: hashedPassword,
    });
  }
}
