import { TouchEvent } from 'react';
import tw from 'twin.macro';

import { TimeData } from '../../features/timer/data/timeData';
import { isAwayFromBeginningElement } from '../../utils/isAwayFromBeginningElement';
import { withStopPropagation } from '../../utils/withStopPropagation';
import { SecondaryButton } from '../common/SecondaryButton';
import { SecondaryDangerButton } from '../common/SecondaryDangerButton';

const ButtonWrapper = tw.div`flex justify-center space-x-2 flex-wrap pointer-events-none`;
const touchEnd = (cb: () => void) => (event: TouchEvent<HTMLButtonElement>) => {
  if (isAwayFromBeginningElement(event)) {
    return;
  }
  event.stopPropagation();
  event.preventDefault();
  cb();
};
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
        <SecondaryButton
          onClick={withStopPropagation(undoDNF)}
          onTouchEnd={touchEnd(undoDNF)}
        >
          undo DNF
        </SecondaryButton>
        <SecondaryDangerButton
          onClick={withStopPropagation(deleteRecord)}
          onTouchEnd={touchEnd(deleteRecord)}
        >
          delete
        </SecondaryDangerButton>
      </ButtonWrapper>
    );
  }
  if (record.penalty) {
    return (
      <ButtonWrapper>
        <SecondaryButton
          onClick={withStopPropagation(undoPenalty)}
          onTouchEnd={touchEnd(undoPenalty)}
        >
          undo +2
        </SecondaryButton>
        <SecondaryButton
          onClick={withStopPropagation(changeToDNF)}
          onTouchEnd={touchEnd(changeToDNF)}
        >
          DNF
        </SecondaryButton>
        <SecondaryDangerButton
          onClick={withStopPropagation(deleteRecord)}
          onTouchEnd={touchEnd(deleteRecord)}
        >
          delete
        </SecondaryDangerButton>
      </ButtonWrapper>
    );
  }
  return (
    <ButtonWrapper>
      <SecondaryButton
        onClick={withStopPropagation(imposePenalty)}
        onTouchEnd={touchEnd(imposePenalty)}
      >
        +2
      </SecondaryButton>
      <SecondaryButton
        onClick={withStopPropagation(changeToDNF)}
        onTouchEnd={touchEnd(changeToDNF)}
      >
        DNF
      </SecondaryButton>
      <SecondaryDangerButton
        onClick={withStopPropagation(deleteRecord)}
        onTouchEnd={touchEnd(deleteRecord)}
      >
        delete
      </SecondaryDangerButton>
    </ButtonWrapper>
  );
};
