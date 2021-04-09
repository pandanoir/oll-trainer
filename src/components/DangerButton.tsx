import { VFC } from 'react';
import { basicButtonStyle, ButtonProps } from './Button';
import '../index.css';

export const DangerButton: VFC<ButtonProps> = ({ children, ...props }) => {
  return (
    <button
      {...props}
      className={`${basicButtonStyle} border-red-200 bg-red-600 text-white`}
    >
      {children}
    </button>
  );
};
