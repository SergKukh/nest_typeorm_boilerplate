import { Global, Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { Env } from 'environment/environment.type';
import { AuthService } from 'modules/auth/auth.service';
import { AuthController } from 'modules/auth/auth.controller';
import { AuthPasswordService } from 'modules/auth/auth-password.service';
import { AuthJwtTokenService } from 'modules/auth/auth-jwt-token.service';
import { AccessTokenGuard } from 'modules/auth/guards/access-token.guard';
import { AuthOneTimeTokenService } from 'modules/auth/auth-one-time-token.service';

@Global()
@Module({
  imports: [
    JwtModule.registerAsync({
      useFactory: (configService: ConfigService<Env, true>) => ({
        secret: configService.get('JWT_SECRET', { infer: true }),
      }),
      inject: [ConfigService],
    }),
  ],
  providers: [
    AuthService,
    AuthPasswordService,
    AuthJwtTokenService,
    AccessTokenGuard,
    AuthOneTimeTokenService,
  ],
  controllers: [AuthController],
  exports: [
    AuthService,
    AuthPasswordService,
    AuthJwtTokenService,
    AccessTokenGuard,
    AuthOneTimeTokenService,
  ],
})
export class AuthModule {}
