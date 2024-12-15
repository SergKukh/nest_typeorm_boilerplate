import { Button as EmailButton } from '@react-email/components';
import type { JSX, ReactNode } from 'react';
import React from 'react';

interface Props {
  children: ReactNode;
  href?: string;
}

const Button = ({ children, href }: Props): JSX.Element => {
  return (
    <EmailButton
      style={{
        backgroundColor: '#0410bd',
        borderRadius: '5px',
        color: '#fff',
        fontSize: '16px',
        fontWeight: 'bold',
        textDecoration: 'none',
        textAlign: 'center',
        display: 'block',
        width: '100%',
        padding: '10px',
      }}
      href={href}
    >
      {children}
    </EmailButton>
  );
};

export default Button;
