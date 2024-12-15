import { PickType } from '@nestjs/swagger';
import { PostSignUpDto } from 'modules/auth/dto/post-sign-up.dto';

export class PostSignInDto extends PickType(PostSignUpDto, [
  'email',
  'password',
]) {}
