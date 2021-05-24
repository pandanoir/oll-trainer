import 'twin.macro';
import { PrimaryButton } from '../PrimaryButton';
import { DangerButton } from '../DangerButton';
import { TimeData } from './timeData';
import { SecondaryButton } from '../SecondaryButton';
import { EventHandler, SyntheticEvent } from 'react';

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
  const stopPropagation: EventHandler<SyntheticEvent> = (event) => {
    event.stopPropagation();
  };
  if (record.isDNF) {
    return (
      <div tw="flex justify-center flex-wrap">
        <DangerButton
          onMouseDown={stopPropagation}
          onTouchStart={stopPropagation}
          onMouseUp={stopPropagation}
          onTouchEnd={stopPropagation}
          onClick={undoDNF}
        >
          undo DNF
        </DangerButton>
        <SecondaryButton
          onMouseDown={stopPropagation}
          onTouchStart={stopPropagation}
          onMouseUp={stopPropagation}
          onTouchEnd={stopPropagation}
          onClick={deleteRecord}
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
          onMouseDown={stopPropagation}
          onTouchStart={stopPropagation}
          onMouseUp={stopPropagation}
          onTouchEnd={stopPropagation}
          onClick={undoPenalty}
        >
          undo +2
        </PrimaryButton>
        <DangerButton
          onMouseDown={stopPropagation}
          onTouchStart={stopPropagation}
          onMouseUp={stopPropagation}
          onTouchEnd={stopPropagation}
          onClick={changeToDNF}
        >
          DNF
        </DangerButton>
        <SecondaryButton
          onMouseDown={stopPropagation}
          onTouchStart={stopPropagation}
          onMouseUp={stopPropagation}
          onTouchEnd={stopPropagation}
          onClick={deleteRecord}
        >
          delete
        </SecondaryButton>
      </div>
    );
  }
  return (
    <div tw="flex justify-center gap-2 flex-wrap">
      <PrimaryButton
        onMouseDown={stopPropagation}
        onTouchStart={stopPropagation}
        onMouseUp={stopPropagation}
        onTouchEnd={stopPropagation}
        onClick={imposePenalty}
      >
        +2
      </PrimaryButton>
      <DangerButton
        onMouseDown={stopPropagation}
        onTouchStart={stopPropagation}
        onMouseUp={stopPropagation}
        onTouchEnd={stopPropagation}
        onClick={changeToDNF}
      >
        DNF
      </DangerButton>
      <SecondaryButton
        onMouseDown={stopPropagation}
        onTouchStart={stopPropagation}
        onMouseUp={stopPropagation}
        onTouchEnd={stopPropagation}
        onClick={deleteRecord}
      >
        delete
      </SecondaryButton>
    </div>
  );
};
