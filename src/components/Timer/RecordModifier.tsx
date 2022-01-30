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
  className,
  changeToDNF,
  undoDNF,
  imposePenalty,
  undoPenalty,
  deleteRecord,
}: {
  record: TimeData;
  className?: string;
  changeToDNF: () => void;
  undoDNF: () => void;
  imposePenalty: () => void;
  undoPenalty: () => void;
  deleteRecord: () => void;
}) => {
  if (record.isDNF) {
    return (
      <ButtonWrapper className={className}>
        <SecondaryButton
          onClick={withStopPropagation(undoDNF)}
          onTouchEnd={touchEnd(undoDNF)}
          key="dnf"
        >
          undo DNF
        </SecondaryButton>
        <SecondaryDangerButton
          onClick={withStopPropagation(deleteRecord)}
          onTouchEnd={touchEnd(deleteRecord)}
          key="delete"
        >
          delete
        </SecondaryDangerButton>
      </ButtonWrapper>
    );
  }
  if (record.penalty) {
    return (
      <ButtonWrapper className={className}>
        <SecondaryButton
          onClick={withStopPropagation(undoPenalty)}
          onTouchEnd={touchEnd(undoPenalty)}
          key="+2"
        >
          undo +2
        </SecondaryButton>
        <SecondaryButton
          onClick={withStopPropagation(changeToDNF)}
          onTouchEnd={touchEnd(changeToDNF)}
          key="dnf"
        >
          DNF
        </SecondaryButton>
        <SecondaryDangerButton
          onClick={withStopPropagation(deleteRecord)}
          onTouchEnd={touchEnd(deleteRecord)}
          key="delete"
        >
          delete
        </SecondaryDangerButton>
      </ButtonWrapper>
    );
  }
  return (
    <ButtonWrapper className={className}>
      <SecondaryButton
        onClick={withStopPropagation(imposePenalty)}
        onTouchEnd={touchEnd(imposePenalty)}
        key="+2"
      >
        +2
      </SecondaryButton>
      <SecondaryButton
        onClick={withStopPropagation(changeToDNF)}
        onTouchEnd={touchEnd(changeToDNF)}
        key="dnf"
      >
        DNF
      </SecondaryButton>
      <SecondaryDangerButton
        onClick={withStopPropagation(deleteRecord)}
        onTouchEnd={touchEnd(deleteRecord)}
        key="delete"
      >
        delete
      </SecondaryDangerButton>
    </ButtonWrapper>
  );
};
