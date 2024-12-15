import { Text } from '@react-email/components';
import type { JSX, ReactNode } from 'react';
import React from 'react';

interface Props {
  children: ReactNode;
}

const Paragraph = ({ children }: Props): JSX.Element => {
  return (
    <Text
      style={{
        color: '#444c63',

        fontSize: '16px',
        lineHeight: '24px',
        textAlign: 'left',
      }}
    >
      {children}
    </Text>
  );
};

export default Paragraph;
