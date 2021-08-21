import { faCheck } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { VFC, PropsWithChildren } from 'react';
import './ToggleButton.css';

export const ToggleButton: VFC<
  PropsWithChildren<{ checked: boolean; onChange: (newValue: boolean) => void }>
> = ({ children, checked = true, onChange }) => {
  return (
    <div
      className={checked ? 'toggle-btn--checked' : 'toggle-btn'}
      onClick={() => onChange(!checked)}
    >
      {checked && <FontAwesomeIcon icon={faCheck} />}
      {children}
    </div>
  );
};
