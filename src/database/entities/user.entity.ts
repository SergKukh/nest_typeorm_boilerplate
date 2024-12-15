import { Column, Entity } from 'typeorm';
import { BaseEntity } from 'database/entities/base.entity';

@Entity('user')
export abstract class UserEntity extends BaseEntity {
  @Column({ nullable: false, unique: true })
  email: string;

  @Column()
  firstName: string;

  @Column()
  lastName: string;

  @Column({ select: false })
  password: string;

  @Column({ nullable: true })
  imageKey: string;
}
