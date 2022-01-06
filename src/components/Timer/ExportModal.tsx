import { VFC } from 'react';
import { HiTimerDataJSON } from '../../types/HiTimerDataJSON';
import { toCsTimer } from '../../utils/toCsTimer';
import { Modal } from '../common/Modal';
import { ModalCloseButton } from '../common/ModalCloseButton';
import { SecondaryButton } from '../common/SecondaryButton';
import { ExportButton } from './ExportButton';
import 'twin.macro';

export const ExportModal: VFC<{
  onClose: () => void;
  getSetting: () => HiTimerDataJSON;
}> = ({ onClose, getSetting }) => (
  <Modal onClose={onClose} ariaLabel="export data">
    <ModalCloseButton onClick={onClose} />
    <div tw="p-10">
      <span tw="flex space-x-0 space-y-2 flex-col justify-center items-center sm:flex-row sm:space-x-3 sm:space-y-0">
        <ExportButton
          getContent={() => JSON.stringify(toCsTimer(getSetting().sessions))}
        >
          <SecondaryButton>csTimer 形式でエクスポート</SecondaryButton>
        </ExportButton>
        <ExportButton getContent={() => JSON.stringify(getSetting())}>
          <SecondaryButton>Hi-Timer 形式でエクスポート</SecondaryButton>
        </ExportButton>
      </span>
    </div>
  </Modal>
);
