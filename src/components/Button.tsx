import { ButtonHTMLAttributes, DetailedHTMLProps, FC } from 'react';
import '../index.css';

export const basicButtonStyle =
  'block px-6 py-2 mx-auto my-2 border rounded shadow-md active:shadow-none active:top-1 active:relative focus:outline-none';

export type ButtonProps = DetailedHTMLProps<
  ButtonHTMLAttributes<HTMLButtonElement>,
  HTMLButtonElement
>;
export const Button: FC<ButtonProps> = ({ children, ...props }) => {
  return (
    <button {...props} className={`${basicButtonStyle} border-gray-200`}>
      {children}
    </button>
  );
};
