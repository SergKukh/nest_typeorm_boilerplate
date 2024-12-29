import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindOneOptions, Repository } from 'typeorm';
import { UserEntity } from 'database/entities/user.entity';
import { CreateUserData } from 'modules/user/types/create-user-data.type';
import { AuthPasswordService } from 'modules/auth/auth-password.service';
import { UserAlreadyExistsException } from 'modules/user/exceptions/user-already-exists.exception';
import { UserNotFoundException } from 'modules/user/exceptions/user-not-found.exception';
import { UpdateUserData } from 'modules/user/types/update-user-data.type';
import { StorageService } from 'modules/storage/storage.service';

@Injectable()
export class UserService {
  constructor(
    private readonly authPasswordService: AuthPasswordService,
    private readonly storageService: StorageService,

    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
  ) {}

  async findUser(
    options: FindOneOptions<UserEntity>,
  ): Promise<UserEntity | null> {
    const user = await this.userRepository.findOne(options);

    return user;
  }

  async findUserAndProcessData(
    options: FindOneOptions<UserEntity>,
  ): Promise<UserEntity | null> {
    const user = await this.findUser(options);

    if (!user) return null;

    return this.processUserData(user);
  }

  async processUserData(user: UserEntity): Promise<UserEntity> {
    user.profileImage = user.imageKey
      ? await this.storageService.getSignedUrl(user.imageKey)
      : null;

    return user;
  }

  async getUserByIdOrFail(
    userId: string,
    options?: FindOneOptions<UserEntity>,
  ): Promise<UserEntity> {
    const user = await this.findUserAndProcessData({
      where: { id: userId },
      ...options,
    });

    if (!user) throw new UserNotFoundException();

    return user;
  }

  async getUserByEmailOrFail(
    email: string,
    options?: FindOneOptions<UserEntity>,
  ): Promise<UserEntity> {
    const user = await this.findUserAndProcessData({
      where: { email: email.toLocaleLowerCase() },
      ...options,
    });

    if (!user) throw new UserNotFoundException();

    return user;
  }

  async createUser(data: CreateUserData): Promise<UserEntity> {
    const { email, password } = data;
    const lowercaseEmail = email.toLowerCase();
    const existingUser = await this.userRepository.findOne({
      where: { email: lowercaseEmail },
    });

    if (existingUser) throw new UserAlreadyExistsException(data.email);

    const hashedPassword =
      await this.authPasswordService.hashPassword(password);

    const user = this.userRepository.create({
      ...data,
      email: lowercaseEmail,
      password: hashedPassword,
    });

    return this.userRepository.save(user);
  }

  async updateUser(userId: string, data: UpdateUserData): Promise<UserEntity> {
    const user = await this.getUserByIdOrFail(userId);

    await this.userRepository.save({
      ...user,
      ...data,
    });

    return this.getUserByIdOrFail(userId);
  }

  async updateProfileImage(
    user: UserEntity,
    file: Express.Multer.File,
  ): Promise<UserEntity> {
    const { buffer, originalname } = file;

    const fileKey = await this.storageService.upload(
      `user/${user.id}/${originalname}`,
      buffer,
    );

    if (user.imageKey) {
      await this.storageService.delete(user.imageKey);
    }

    const updatedUser = await this.userRepository.save({
      ...user,
      imageKey: fileKey,
    });

    return this.getUserByIdOrFail(updatedUser.id);
  }
}
