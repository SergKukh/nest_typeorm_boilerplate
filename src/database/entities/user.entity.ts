import { Column, Entity } from 'typeorm';
import { BaseEntity } from 'database/entities/base.entity';

@Entity('user')
export class UserEntity extends BaseEntity {
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

  private _profileImage: string | null;

  get profileImage(): string | null {
    return this._profileImage;
  }

  set profileImage(url: string | null) {
    this._profileImage = url;
  }
}
