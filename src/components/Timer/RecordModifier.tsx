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
          onTouchStart={withStopPropagation(noop)}
          onMouseUp={withStopPropagation(undoDNF)}
          onTouchEnd={(event) => {
            event.stopPropagation();
            event.preventDefault();
            undoDNF();
          }}
        >
          undo DNF
        </DangerButton>
        <SecondaryButton
          onMouseDown={withStopPropagation(noop)}
          onTouchStart={withStopPropagation(noop)}
          onMouseUp={withStopPropagation(deleteRecord)}
          onTouchEnd={(event) => {
            event.stopPropagation();
            event.preventDefault();
            deleteRecord();
          }}
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
          onTouchStart={withStopPropagation(noop)}
          onMouseUp={withStopPropagation(undoPenalty)}
          onTouchEnd={(event) => {
            event.stopPropagation();
            event.preventDefault();
            undoPenalty();
          }}
        >
          undo +2
        </PrimaryButton>
        <DangerButton
          onMouseDown={withStopPropagation(noop)}
          onTouchStart={withStopPropagation(noop)}
          onMouseUp={withStopPropagation(changeToDNF)}
          onTouchEnd={(event) => {
            event.stopPropagation();
            event.preventDefault();
            changeToDNF();
          }}
        >
          DNF
        </DangerButton>
        <SecondaryButton
          onMouseDown={withStopPropagation(noop)}
          onTouchStart={withStopPropagation(noop)}
          onMouseUp={withStopPropagation(deleteRecord)}
          onTouchEnd={(event) => {
            event.stopPropagation();
            event.preventDefault();
            deleteRecord();
          }}
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
        onTouchStart={withStopPropagation(noop)}
        onMouseUp={withStopPropagation(imposePenalty)}
        onTouchEnd={(event) => {
          event.stopPropagation();
          event.preventDefault();
          imposePenalty();
        }}
      >
        +2
      </PrimaryButton>
      <DangerButton
        onMouseDown={withStopPropagation(noop)}
        onTouchStart={withStopPropagation(noop)}
        onMouseUp={withStopPropagation(changeToDNF)}
        onTouchEnd={(event) => {
          event.stopPropagation();
          event.preventDefault();
          changeToDNF();
        }}
      >
        DNF
      </DangerButton>
      <SecondaryButton
        onMouseDown={withStopPropagation(noop)}
        onTouchStart={withStopPropagation(noop)}
        onMouseUp={withStopPropagation(deleteRecord)}
        onTouchEnd={(event) => {
          event.stopPropagation();
          event.preventDefault();
          deleteRecord();
        }}
      >
        delete
      </SecondaryButton>
    </div>
  );
};
