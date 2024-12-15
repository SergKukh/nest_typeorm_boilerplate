import { Body, Controller, Param, Post } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { AuthService } from 'modules/auth/auth.service';
import { PostSignUpDto } from 'modules/auth/dto/post-sign-up.dto';
import { TokenAuthResponseDto } from 'modules/auth/dto/token-auth-response.dto';
import { PostSignInDto } from 'modules/auth/dto/post-sign-in.dto';
import { PostRefreshAccessTokenDto } from 'modules/auth/dto/post-refresh-access-token.dto';
import { AuthJwtTokenService } from 'modules/auth/auth-jwt-token.service';
import { PostRecoverPasswordDto } from 'modules/auth/dto/post-recover-password.dto';
import { PostResetPasswordDto } from 'modules/auth/dto/post-reset-password.dto';

@Controller('auth')
@ApiTags(AuthController.name)
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly authJwtTokenService: AuthJwtTokenService,
  ) {}

  @Post('sign-up')
  @ApiOperation({
    summary: 'Sign up user',
  })
  @ApiResponse({
    type: TokenAuthResponseDto,
  })
  async signUp(@Body() body: PostSignUpDto): Promise<TokenAuthResponseDto> {
    const tokenData = await this.authService.signUp(body);

    return new TokenAuthResponseDto(tokenData);
  }

  @Post('sign-in')
  @ApiOperation({
    summary: 'Sign in user',
  })
  @ApiResponse({
    type: TokenAuthResponseDto,
  })
  async signIn(@Body() body: PostSignInDto): Promise<TokenAuthResponseDto> {
    const tokenData = await this.authService.singIn(body);

    return new TokenAuthResponseDto(tokenData);
  }

  @Post('refresh-tokens')
  @ApiOperation({
    summary: 'Refresh access and refresh tokens',
  })
  @ApiResponse({
    type: TokenAuthResponseDto,
  })
  async refreshTokens(
    @Body() body: PostRefreshAccessTokenDto,
  ): Promise<TokenAuthResponseDto> {
    const { refreshToken } = body;
    const tokenData =
      await this.authJwtTokenService.refreshAccessRefreshTokens(refreshToken);

    return new TokenAuthResponseDto(tokenData);
  }

  @Post('recover-password')
  @ApiOperation({
    summary: 'Recover password',
  })
  async recoverPassword(@Body() body: PostRecoverPasswordDto): Promise<void> {
    const { email } = body;

    await this.authService.sendRecoverPasswordEmail(email);
  }

  @Post('set-new-password/:token')
  @ApiOperation({
    summary: 'Set new password',
  })
  async setNewPassword(
    @Param('token') token: string,
    @Body() body: PostResetPasswordDto,
  ): Promise<void> {
    const { password } = body;

    await this.authService.resetPassword({ token, password });
  }
}
