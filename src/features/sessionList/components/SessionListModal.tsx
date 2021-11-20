import {
  faPlus,
  faSortNumericDown,
  faSortNumericUpAlt,
} from '@fortawesome/free-solid-svg-icons';
import { VFC, ReactNode } from 'react';
import tw from 'twin.macro';
import { IconButton } from '../../../components/common/IconButton';
import { Modal } from '../../../components/common/Modal';
import { ModalCloseButton } from '../../../components/common/ModalCloseButton';
import { usePersistentToggle } from '../../../utils/hooks/usePersistentToggle';
import { withPrefix } from '../../../utils/withPrefix';

interface Props {
  onClose: () => void;
  onAddButtonClick: () => void;
  sessions: ReactNode;
}
export const SessionListModal: VFC<Props> = ({
  onClose,
  onAddButtonClick,
  sessions,
}) => {
  const [isAscendingOrder, toggleOrder] = usePersistentToggle(
    withPrefix('session-list-order'),
    true
  );
  return (
    <Modal tw="lg:inset-x-1/4 lg:w-1/2" onClose={onClose}>
      <ModalCloseButton onClick={onClose} />
      <div tw="flex flex-col px-3.5 py-5 space-y-2 h-full">
        <div tw="flex space-x-2">
          <span tw="text-3xl">Sessions</span>
          <IconButton
            icon={faPlus}
            tw="px-2.5 my-1.5 text-lg text-white bg-gray-700 rounded"
            onClick={onAddButtonClick}
          />
        </div>
        <IconButton
          tw="w-max px-2.5 my-1.5 text-xl"
          icon={isAscendingOrder ? faSortNumericDown : faSortNumericUpAlt}
          onClick={toggleOrder}
        />
        <ul
          tw="flex flex-col flex-1 overflow-y-auto"
          css={[isAscendingOrder ? '' : tw`flex-col-reverse justify-end`]}
        >
          {sessions}
        </ul>
      </div>
    </Modal>
  );
};
