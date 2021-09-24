import { faCheck } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { VFC, PropsWithChildren, memo } from 'react';
import './ToggleButton.css';

const ToggleButtonRaw: VFC<
  PropsWithChildren<{ checked: boolean; onChange: (newValue: boolean) => void }>
> = ({ children, checked = true, onChange }) => (
  <div
    className={checked ? 'toggle-btn--checked' : 'toggle-btn'}
    onClick={() => onChange(!checked)}
  >
    {checked && <FontAwesomeIcon icon={faCheck} />}
    {children}
  </div>
);

export const ToggleButton = memo(ToggleButtonRaw);
