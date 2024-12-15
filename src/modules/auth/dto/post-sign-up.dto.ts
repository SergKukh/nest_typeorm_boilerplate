import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString } from 'class-validator';
import type { UserEntity } from 'database/entities/user.entity';
import { StrongPasswordValidator } from 'modules/auth/decorators/strong-password-validator.decorator';

export class PostSignUpDto implements Partial<UserEntity> {
  @IsEmail()
  @ApiProperty({ example: 'user@example.com' })
  email: string;

  @StrongPasswordValidator()
  @ApiProperty({ example: 'Qwerty123' })
  password: string;

  @IsString()
  @ApiProperty({ example: 'John' })
  firstName: string;

  @IsString()
  @ApiProperty({ example: 'Doe' })
  lastName: string;
}
