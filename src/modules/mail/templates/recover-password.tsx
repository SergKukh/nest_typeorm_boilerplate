import type { JSX } from 'react';
import React from 'react';
import { Button, Paragraph, Wrapper } from 'modules/mail/templates/components';
import { PROJECT_NAME } from 'modules/mail/constants/project-name.const';

interface Props {
  recoverUrl: string;
  name: string;
  logoCid?: string;
}

const recoverPassword = ({ recoverUrl, name, logoCid }: Props): JSX.Element => {
  return (
    <Wrapper previewText={`${PROJECT_NAME} reset password`} logoCid={logoCid}>
      <Paragraph>Hi {name},</Paragraph>
      <Paragraph>
        Someone recently requested a password change for your account. If this
        was you, you can set a new password here:
      </Paragraph>
      <Button href={recoverUrl}>Reset Password</Button>
      <Paragraph>
        If you don't want to change your password or didn't request this, just
        ignore and delete this message.
      </Paragraph>
    </Wrapper>
  );
};

export default recoverPassword;
