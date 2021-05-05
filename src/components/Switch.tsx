import { VFC, PropsWithChildren } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheck } from '@fortawesome/free-solid-svg-icons';

export const Switch: VFC<
  PropsWithChildren<{ checked: boolean; onChange: (newValue: boolean) => void }>
> = ({ children, checked = true, onChange }) => {
  const className = `${
    checked
      ? 'border border-blue-400 bg-blue-500 text-white px-1.5'
      : 'border border-gray-400 px-3.5'
  } inline-block rounded`;
  return (
    <div className={className} onClick={() => onChange(!checked)}>
      {checked && <FontAwesomeIcon icon={faCheck} />}
      {children}
    </div>
  );
};
