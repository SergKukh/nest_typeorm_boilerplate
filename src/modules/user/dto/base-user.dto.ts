import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import { randomUUID } from 'crypto';
import { UserEntity } from 'database/entities/user.entity';

export class BaseUserDto {
  constructor(data: UserEntity) {
    Object.assign(this, data);

    this.profileImage = data.profileImage || null;
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

  @Expose()
  @ApiProperty({ example: 'https://example.com/user/image.png' })
  profileImage: string | null;

  @Expose()
  @ApiProperty({ example: '2024-01-01T00:00:00.000Z' })
  createdAt: Date;
}
