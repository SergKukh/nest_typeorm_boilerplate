import {
  Controller,
  FileTypeValidator,
  Get,
  MaxFileSizeValidator,
  ParseFilePipe,
  Patch,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import {
  ApiBody,
  ApiConsumes,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { User } from 'modules/auth/decorators/user.decorator';
import { UserService } from 'modules/user/user.service';
import { UserEntity } from 'database/entities/user.entity';
import { CurrentUserResponseDto } from 'modules/user/dto/current-user-response.dto';
import { AccessTokenGuard } from 'modules/auth/guards/access-token.guard';
import { FileInterceptor } from '@nestjs/platform-express';
import { FILE_SIZE_LIMIT, IMAGE_FILE_TYPE } from 'common/constants/app';

@Controller('user')
@ApiTags('User')
@UseGuards(AccessTokenGuard)
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get()
  @ApiOperation({
    summary: 'Get current user',
  })
  @ApiResponse({
    type: CurrentUserResponseDto,
  })
  async getUser(@User() user: UserEntity): Promise<CurrentUserResponseDto> {
    return new CurrentUserResponseDto(user);
  }

  @Patch('profile-image')
  @ApiOperation({
    summary: 'Update user profile image',
  })
  @UseInterceptors(FileInterceptor('image'))
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    required: true,
    schema: {
      type: 'object',
      properties: {
        image: {
          type: 'string',
          format: 'binary',
        },
      },
    },
  })
  @ApiResponse({
    type: CurrentUserResponseDto,
  })
  async updateProfileImage(
    @User() user: UserEntity,
    @UploadedFile(
      new ParseFilePipe({
        fileIsRequired: true,
        validators: [
          new MaxFileSizeValidator({ maxSize: FILE_SIZE_LIMIT }),
          new FileTypeValidator({
            fileType: IMAGE_FILE_TYPE,
          }),
        ],
      }),
    )
    image: Express.Multer.File,
  ): Promise<CurrentUserResponseDto> {
    const updatedUser = await this.userService.updateProfileImage(user, image);

    return new CurrentUserResponseDto(updatedUser);
  }
}
