import { PickType } from '@nestjs/swagger';
import { PostSignUpDto } from 'modules/auth/dto/post-sign-up.dto';

export class PostRecoverPasswordDto extends PickType(PostSignUpDto, [
  'email',
]) {}
