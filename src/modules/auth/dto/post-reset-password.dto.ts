import { PickType } from '@nestjs/swagger';
import { PostSignInDto } from 'modules/auth/dto/post-sign-in.dto';

export class PostResetPasswordDto extends PickType(PostSignInDto, [
  'password',
]) {}
