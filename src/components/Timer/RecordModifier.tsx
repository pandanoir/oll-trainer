import 'twin.macro';

import { PrimaryButton } from '../PrimaryButton';
import { DangerButton } from '../DangerButton';
import { TimeData } from './timeData';
import { SecondaryButton } from '../SecondaryButton';
import { noop } from '../../utils/noop';
import { withStopPropagation } from '../../utils/withStopPropagation';

export const RecordModifier = ({
  record,
  changeToDNF,
  undoDNF,
  imposePenalty,
  undoPenalty,
  deleteRecord,
}: {
  record: TimeData;
  changeToDNF: () => void;
  undoDNF: () => void;
  imposePenalty: () => void;
  undoPenalty: () => void;
  deleteRecord: () => void;
}) => {
  if (record.isDNF) {
    return (
      <div tw="flex justify-center flex-wrap">
        <DangerButton
          onMouseDown={withStopPropagation(noop)}
          onTouchStart={withStopPropagation(undoDNF)}
          onMouseUp={withStopPropagation(undoDNF)}
          onTouchEnd={withStopPropagation(noop)}
        >
          undo DNF
        </DangerButton>
        <SecondaryButton
          onMouseDown={withStopPropagation(noop)}
          onTouchStart={withStopPropagation(deleteRecord)}
          onMouseUp={withStopPropagation(deleteRecord)}
          onTouchEnd={withStopPropagation(noop)}
        >
          delete
        </SecondaryButton>
      </div>
    );
  }
  if (record.penalty) {
    return (
      <div tw="flex justify-center gap-2 flex-wrap">
        <PrimaryButton
          onMouseDown={withStopPropagation(noop)}
          onTouchStart={withStopPropagation(undoPenalty)}
          onMouseUp={withStopPropagation(undoPenalty)}
          onTouchEnd={withStopPropagation(noop)}
        >
          undo +2
        </PrimaryButton>
        <DangerButton
          onMouseDown={withStopPropagation(noop)}
          onTouchStart={withStopPropagation(changeToDNF)}
          onMouseUp={withStopPropagation(changeToDNF)}
          onTouchEnd={withStopPropagation(noop)}
        >
          DNF
        </DangerButton>
        <SecondaryButton
          onMouseDown={withStopPropagation(noop)}
          onTouchStart={withStopPropagation(deleteRecord)}
          onMouseUp={withStopPropagation(deleteRecord)}
          onTouchEnd={withStopPropagation(noop)}
        >
          delete
        </SecondaryButton>
      </div>
    );
  }
  return (
    <div tw="flex justify-center gap-2 flex-wrap">
      <PrimaryButton
        onMouseDown={withStopPropagation(noop)}
        onTouchStart={withStopPropagation(imposePenalty)}
        onMouseUp={withStopPropagation(imposePenalty)}
        onTouchEnd={withStopPropagation(noop)}
      >
        +2
      </PrimaryButton>
      <DangerButton
        onMouseDown={withStopPropagation(noop)}
        onTouchStart={withStopPropagation(changeToDNF)}
        onMouseUp={withStopPropagation(changeToDNF)}
        onTouchEnd={withStopPropagation(noop)}
      >
        DNF
      </DangerButton>
      <SecondaryButton
        onMouseDown={withStopPropagation(noop)}
        onTouchStart={withStopPropagation(deleteRecord)}
        onMouseUp={withStopPropagation(deleteRecord)}
        onTouchEnd={withStopPropagation(noop)}
      >
        delete
      </SecondaryButton>
    </div>
  );
};
