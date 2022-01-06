import {
  faPlus,
  faSortNumericDownAlt,
  faSortNumericUp,
} from '@fortawesome/free-solid-svg-icons';
import { VFC, useMemo } from 'react';
import 'twin.macro';
import { IconButton } from '../../../components/common/IconButton';
import { Modal } from '../../../components/common/Modal';
import { ModalCloseButton } from '../../../components/common/ModalCloseButton';
import { usePersistentToggle } from '../../../utils/hooks/usePersistentToggle';
import { withPrefix } from '../../../utils/withPrefix';

interface Props {
  onClose: () => void;
  onAddButtonClick: () => void;
  sessions: JSX.Element[];
}
export const SessionListModal: VFC<Props> = ({
  onClose,
  onAddButtonClick,
  sessions,
}) => {
  const [sortsByOldest, toggleOrder] = usePersistentToggle(
    withPrefix('session-list-order'),
    true
  );

  const sortedSessions = useMemo(() => {
    return sortsByOldest ? sessions : sessions.concat().reverse();
  }, [sessions, sortsByOldest]);
  return (
    <Modal
      tw="lg:inset-x-1/4 lg:w-1/2"
      onClose={onClose}
      ariaLabel="session list"
    >
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
          title={sortsByOldest ? 'sort by latest' : 'sort by oldest'}
          tw="w-max px-2.5 my-1.5 text-xl"
          icon={sortsByOldest ? faSortNumericUp : faSortNumericDownAlt}
          onClick={toggleOrder}
        />
        <ul tw="flex flex-col flex-1 overflow-y-auto" aria-label="session list">
          {sortedSessions}
        </ul>
      </div>
    </Modal>
  );
};
