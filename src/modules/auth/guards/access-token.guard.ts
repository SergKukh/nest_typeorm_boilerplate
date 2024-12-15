import type { CanActivate, ExecutionContext } from '@nestjs/common';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { UserService } from 'modules/user/user.service';
import { AuthJwtTokenService } from 'modules/auth/auth-jwt-token.service';
import { PUBLIC_KEY } from 'modules/auth/decorators/public.decorator';
import { tokenFromHeader } from 'modules/auth/utils/token-from-header';
import { AuthTokenType } from 'modules/auth/enums/auth-token-type.enum';
import { InvalidJwtTypeException } from 'modules/auth/exceptions/invalid-jwt-type.exception';

@Injectable()
export class AccessTokenGuard implements CanActivate {
  constructor(
    private readonly reflector: Reflector,
    private readonly authJwtTokenService: AuthJwtTokenService,
    private readonly userService: UserService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const isPublic = this.reflector.get<boolean>(
      PUBLIC_KEY,
      context.getHandler(),
    );

    if (isPublic) return true;

    const request = context.switchToHttp().getRequest();
    const accessToken = tokenFromHeader(request);

    if (!accessToken) throw new UnauthorizedException();

    const payload = this.authJwtTokenService.verifyToken(accessToken);
    const { tokenType, userId } = payload;

    if (tokenType !== AuthTokenType.ACCESS) throw new InvalidJwtTypeException();

    const user = await this.userService.getUserByIdOrFail(userId);

    request.user = user;

    return true;
  }
}
