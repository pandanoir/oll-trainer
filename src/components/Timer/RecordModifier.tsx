import tw from 'twin.macro';

import { PrimaryButton } from '../common/PrimaryButton';
import { DangerButton } from '../common/DangerButton';
import { TimeData } from './timeData';
import { SecondaryButton } from '../common/SecondaryButton';
import { noop } from '../../utils/noop';
import { withStopPropagation } from '../../utils/withStopPropagation';

const ButtonWrapper = tw.div`flex justify-center space-x-2 flex-wrap pointer-events-none`;
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
      <ButtonWrapper>
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
      </ButtonWrapper>
    );
  }
  if (record.penalty) {
    return (
      <ButtonWrapper>
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
      </ButtonWrapper>
    );
  }
  return (
    <ButtonWrapper>
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
    </ButtonWrapper>
  );
};
