import { Controller, Get, UseGuards } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { User } from 'modules/auth/decorators/user.decorator';
import { UserService } from 'modules/user/user.service';
import { UserEntity } from 'database/entities/user.entity';
import { CurrentUserResponseDto } from 'modules/user/dto/current-user-response.dto';
import { AccessTokenGuard } from 'modules/auth/guards/access-token.guard';

@Controller('user')
@ApiTags(UserController.name)
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
}
