import { Hr as EmailHr } from '@react-email/components';
import type { JSX } from 'react';
import React from 'react';

const Hr = (): JSX.Element => {
  return (
    <EmailHr
      style={{
        borderColor: '#ced0d3',
        margin: '20px 0',
      }}
    />
  );
};

export default Hr;
