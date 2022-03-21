import { TouchEvent } from 'react';
import tw from 'twin.macro';
import {
  useChangeToDNF,
  useUndoDNF,
  useImposePenalty,
  useUndoPenalty,
} from '../../features/sessionList/hooks/useSessions';

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
  timeIndex,
  disabled = false,
  deleteRecord,
}: {
  record: TimeData;
  className?: string;
  timeIndex: number;
  deleteRecord: () => void;
  disabled?: boolean;
}) => {
  const changeToDNF = useChangeToDNF(),
    undoDNF = useUndoDNF(),
    imposePenalty = useImposePenalty(),
    undoPenalty = useUndoPenalty();

  if (record.isDNF) {
    return (
      <ButtonWrapper className={className}>
        <SecondaryButton
          onClick={withStopPropagation(() => undoDNF(timeIndex))}
          onTouchEnd={touchEnd(() => undoDNF(timeIndex))}
          disabled={disabled}
          key="dnf"
        >
          undo DNF
        </SecondaryButton>
        <SecondaryDangerButton
          onClick={withStopPropagation(deleteRecord)}
          onTouchEnd={touchEnd(deleteRecord)}
          disabled={disabled}
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
          onClick={withStopPropagation(() => undoPenalty(timeIndex))}
          onTouchEnd={touchEnd(() => undoPenalty(timeIndex))}
          disabled={disabled}
          key="+2"
        >
          undo +2
        </SecondaryButton>
        <SecondaryButton
          onClick={withStopPropagation(() => changeToDNF(timeIndex))}
          onTouchEnd={touchEnd(() => changeToDNF(timeIndex))}
          disabled={disabled}
          key="dnf"
        >
          DNF
        </SecondaryButton>
        <SecondaryDangerButton
          onClick={withStopPropagation(deleteRecord)}
          onTouchEnd={touchEnd(deleteRecord)}
          disabled={disabled}
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
        onClick={withStopPropagation(() => imposePenalty(timeIndex))}
        onTouchEnd={touchEnd(() => imposePenalty(timeIndex))}
        disabled={disabled}
        key="+2"
      >
        +2
      </SecondaryButton>
      <SecondaryButton
        onClick={withStopPropagation(() => changeToDNF(timeIndex))}
        onTouchEnd={touchEnd(() => changeToDNF(timeIndex))}
        disabled={disabled}
        key="dnf"
      >
        DNF
      </SecondaryButton>
      <SecondaryDangerButton
        onClick={withStopPropagation(deleteRecord)}
        onTouchEnd={touchEnd(deleteRecord)}
        disabled={disabled}
        key="delete"
      >
        delete
      </SecondaryDangerButton>
    </ButtonWrapper>
  );
};
