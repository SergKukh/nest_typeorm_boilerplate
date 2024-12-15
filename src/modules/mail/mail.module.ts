import { Global, Module } from '@nestjs/common';
import { MailService } from 'modules/mail/mail.service';

@Global()
@Module({
  imports: [],
  providers: [MailService],
  exports: [MailService],
})
export class MailModule {}
