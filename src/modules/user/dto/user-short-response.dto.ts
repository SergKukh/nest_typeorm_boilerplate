import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import { randomUUID } from 'crypto';
import { UserEntity } from 'database/entities/user.entity';

export class UserShortResponseDto {
  constructor(data: UserEntity) {
    Object.assign(this, data);
  }

  @Expose()
  @ApiProperty({ example: randomUUID() })
  id: string;

  @Expose()
  @ApiProperty({ example: 'user@example.com' })
  email: string;

  @Expose()
  @ApiProperty({ example: 'John' })
  firstName: string;

  @Expose()
  @ApiProperty({ example: 'Doe' })
  lastName: string;
}
