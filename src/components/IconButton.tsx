import { ButtonHTMLAttributes } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { IconProp } from '@fortawesome/fontawesome-svg-core';

export const IconButton = ({
  icon,
  ...props
}: { icon: IconProp } & ButtonHTMLAttributes<HTMLButtonElement>) => (
  <button {...props}>
    <FontAwesomeIcon icon={icon} />
  </button>
);
