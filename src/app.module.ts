import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { environmentValidator } from 'environment/environment.validator';
import { dataSourceOptions } from 'database/data-source-options';
import { AppService } from 'app.service';
import { AuthModule } from 'modules/auth/auth.module';
import { UserModule } from 'modules/user/user.module';
import { MailModule } from 'modules/mail/mail.module';
import { CacheModule } from 'modules/cache/cache.module';
import { StorageModule } from 'modules/storage/storage.module';
import { Env } from 'environment/environment.type';

@Module({
  imports: [
    ConfigModule.forRoot({ validate: environmentValidator, isGlobal: true }),
    TypeOrmModule.forRoot(dataSourceOptions),
    CacheModule,
    StorageModule.registerAsync({
      useFactory: (configService: ConfigService<Env, true>) => ({
        awsS3Region: configService.get('AWS_S3_REGION', { infer: true }),
        awsS3Bucket: configService.get('AWS_S3_BUCKET', { infer: true }),
        awsAccessKeyId: configService.get('AWS_ACCESS_KEY_ID', {
          infer: true,
        }),
        awsSecretAccessKey: configService.get('AWS_SECRET_ACCESS_KEY', {
          infer: true,
        }),
        globalPrefix: configService.get('NODE_ENV', { infer: true }),
      }),
      inject: [ConfigService],
      isGlobal: true,
    }),
    AuthModule,
    UserModule,
    MailModule,
  ],
  providers: [AppService],
})
export class AppModule {}
