import 'twin.macro';
import { Modal } from '../Modal';
import { BigRecord } from './BigRecord';
import { RecordModifier } from './RecordModifier';
import { TimeData } from './timeData';

export const RecordModal = ({
  onClose,
  record,
  changeToDNF,
  undoDNF,
  imposePenalty,
  undoPenalty,
  deleteRecord,
}: {
  record: TimeData;
  onClose: () => void;
  changeToDNF: () => void;
  undoDNF: () => void;
  imposePenalty: () => void;
  undoPenalty: () => void;
  deleteRecord: () => void;
}) => {
  return (
    <Modal onClose={onClose}>
      <div tw="flex flex-col gap-6 p-6">
        <BigRecord record={record} onClick={onClose} />
        <RecordModifier
          record={record}
          changeToDNF={changeToDNF}
          undoDNF={undoDNF}
          imposePenalty={imposePenalty}
          undoPenalty={undoPenalty}
          deleteRecord={deleteRecord}
        />
        <span tw="flex gap-2">
          <span>scramble:</span>
          <textarea
            tw="inline-block resize-none flex-1"
            readOnly
            value={record.scramble}
          />
        </span>
      </div>
    </Modal>
  );
};
