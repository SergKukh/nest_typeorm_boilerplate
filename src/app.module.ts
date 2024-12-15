import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { environmentValidator } from 'environment/environment.validator';
import { dataSourceOptions } from 'database/data-source-options';
import { AppService } from 'app.service';
import { AuthModule } from 'modules/auth/auth.module';
import { UserModule } from 'modules/user/user.module';
import { MailModule } from 'modules/mail/mail.module';
import { CacheModule } from 'modules/cache/cache.module';

@Module({
  imports: [
    ConfigModule.forRoot({ validate: environmentValidator, isGlobal: true }),
    TypeOrmModule.forRoot(dataSourceOptions),
    CacheModule,
    AuthModule,
    UserModule,
    MailModule,
  ],
  providers: [AppService],
})
export class AppModule {}
