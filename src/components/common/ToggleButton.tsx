import { faCheck } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { VFC, PropsWithChildren, memo } from 'react';
import './ToggleButton.css';
import 'twin.macro';

const ToggleButtonRaw: VFC<
  PropsWithChildren<{ checked: boolean; onChange: (newValue: boolean) => void }>
> = ({ children, checked = true, onChange }) => (
  <label
    className={checked ? 'toggle-btn--checked' : 'toggle-btn'}
    tw="focus-within:outline-black dark:focus-within:outline-white"
  >
    <input
      type="checkbox"
      onChange={() => onChange(!checked)}
      checked={checked}
      tw="absolute top-0 w-0 h-0"
    />
    {checked && <FontAwesomeIcon icon={faCheck} />}
    {children}
  </label>
);

export const ToggleButton = memo(ToggleButtonRaw);
