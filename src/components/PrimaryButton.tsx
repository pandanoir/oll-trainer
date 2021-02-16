import { ButtonHTMLAttributes, DetailedHTMLProps, FC } from 'react';
import { basicButtonStyle, ButtonProps } from './Button';
import '../index.css';

export const PrimaryButton: FC<ButtonProps> = ({ children, ...props }) => {
  return (
    <button
      {...props}
      className={`${basicButtonStyle} border-blue-200 bg-blue-300`}
    >
      {children}
    </button>
  );
};
