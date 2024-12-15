import {
  Body,
  Container,
  Head,
  Html,
  Img,
  Preview,
  Section,
  Text,
} from '@react-email/components';
import type { JSX, ReactNode } from 'react';
import React from 'react';
import Hr from 'modules/mail/templates/components/Hr';

interface Props {
  children: ReactNode;
  previewText?: string;
  logoCid?: string;
}

const Wrapper = ({ children, previewText, logoCid }: Props): JSX.Element => {
  return (
    <Html>
      <Head />
      {previewText && <Preview>{previewText}</Preview>}
      <Body
        style={{
          backgroundColor: '#f6f9fcd0',
          fontFamily:
            '-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,"Helvetica Neue",Ubuntu,sans-serif',
        }}
      >
        <Container
          style={{
            backgroundColor: '#ffffff',
            margin: '0 auto',
            padding: '20px 0 48px',
            marginBottom: '64px',
          }}
        >
          <Section style={{ padding: '0 48px' }}>
            {!!logoCid && (
              <>
                <Img
                  src={`cid:${logoCid}`}
                  width="315"
                  height="80"
                  alt="Logo"
                  style={{
                    margin: '0 auto',
                  }}
                />
                <Hr />
              </>
            )}
            {children}
            <Hr />
            <Text
              style={{
                color: '#8898aa',
                fontSize: '12px',
                lineHeight: '16px',
              }}
            >
              Company Footer Text
            </Text>
          </Section>
        </Container>
      </Body>
    </Html>
  );
};

export default Wrapper;
