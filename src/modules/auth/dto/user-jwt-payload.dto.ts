import { Expose } from 'class-transformer';
import { IsEnum, IsNumber, IsOptional, IsUUID } from 'class-validator';
import { AuthTokenType } from 'modules/auth/enums/auth-token-type.enum';

export class UserJwtPayloadDto {
  constructor(data: Omit<UserJwtPayloadDto, 'iat' | 'exp'>) {
    Object.assign(this, data);
  }

  @Expose()
  @IsUUID()
  userId: string;

  @Expose()
  @IsEnum(AuthTokenType)
  tokenType: AuthTokenType;

  @IsNumber()
  @IsOptional()
  iat?: number;

  @IsNumber()
  @IsOptional()
  exp?: number;
}
