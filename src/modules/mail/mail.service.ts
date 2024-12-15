import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { createTransport } from 'nodemailer';
import { Env } from 'environment/environment.type';
import { UserEntity } from 'database/entities/user.entity';
import { render } from '@react-email/components';
import recoverPassword from 'modules/mail/templates/recover-password';
import { PROJECT_NAME } from 'modules/mail/constants/project-name.const';
import { randomUUID } from 'node:crypto';
import { resolve } from 'node:path';

@Injectable()
export class MailService {
  constructor(private readonly configService: ConfigService<Env, true>) {}

  private transporter = createTransport({
    host: this.configService.get<string>('SMTP_HOST'),
    port: Number(this.configService.get<number>('SMTP_PORT')),
    secure: true,
    auth: {
      user: this.configService.get<string>('SMTP_USER'),
      pass: this.configService.get<string>('SMTP_PASSWORD'),
    },
  });

  private from = `${PROJECT_NAME} <${this.configService.get('SMTP_FROM')}>`;

  private getLogoAttachment(): { cid: string; path: string } {
    const cid = randomUUID();
    const path = resolve(__dirname, './static/logo.png');

    return { cid, path };
  }

  async sendRecoverPasswordEmail(
    user: UserEntity,
    recoverUrl: string,
  ): Promise<void> {
    if (!user.email) return;

    const { cid, path } = this.getLogoAttachment();

    await this.transporter.sendMail({
      from: this.from,
      to: user.email,
      subject: 'Reset your password',
      html: await render(
        recoverPassword({ recoverUrl, name: user.firstName, logoCid: cid }),
      ),
      attachments: [{ path, cid }],
    });
  }
}
