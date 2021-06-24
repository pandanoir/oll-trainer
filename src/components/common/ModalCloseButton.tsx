import { VFC } from 'react';
import { faTimes } from '@fortawesome/free-solid-svg-icons';
import 'twin.macro';

import { IconButton } from './IconButton';

export const ModalCloseButton: VFC<{ onClick: () => void }> = ({ onClick }) => (
  <IconButton
    icon={faTimes}
    tw="absolute top-0 right-0 -m-2 inline-grid w-6 h-6 place-items-center rounded-full bg-white dark:bg-gray-700"
    onClick={onClick}
  />
);
