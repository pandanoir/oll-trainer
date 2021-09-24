import { IconProp } from '@fortawesome/fontawesome-svg-core';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { ButtonHTMLAttributes, memo } from 'react';

const IconButtonRaw = ({
  icon,
  ...props
}: { icon: IconProp } & ButtonHTMLAttributes<HTMLButtonElement>) => (
  <button {...props}>
    <FontAwesomeIcon icon={icon} />
  </button>
);

export const IconButton = memo(IconButtonRaw);
