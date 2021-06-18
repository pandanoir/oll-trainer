import { TouchEvent } from 'react';
import tw from 'twin.macro';

import { PrimaryButton } from '../common/PrimaryButton';
import { DangerButton } from '../common/DangerButton';
import { TimeData } from './timeData';
import { SecondaryButton } from '../common/SecondaryButton';
import { withStopPropagation } from '../../utils/withStopPropagation';
import { elementFromTouch } from '../../utils/elementFromTouch';

const ButtonWrapper = tw.div`flex justify-center space-x-2 flex-wrap pointer-events-none`;
const touchEnd = (cb: () => void) => (event: TouchEvent<HTMLButtonElement>) => {
  if (event.target !== elementFromTouch(event.changedTouches[0])) {
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
        <DangerButton
          onClick={withStopPropagation(undoDNF)}
          onTouchEnd={touchEnd(undoDNF)}
        >
          undo DNF
        </DangerButton>
        <SecondaryButton
          onClick={withStopPropagation(deleteRecord)}
          onTouchEnd={touchEnd(deleteRecord)}
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
          onClick={withStopPropagation(undoPenalty)}
          onTouchEnd={touchEnd(undoPenalty)}
        >
          undo +2
        </PrimaryButton>
        <DangerButton
          onClick={withStopPropagation(changeToDNF)}
          onTouchEnd={touchEnd(changeToDNF)}
        >
          DNF
        </DangerButton>
        <SecondaryButton
          onClick={withStopPropagation(deleteRecord)}
          onTouchEnd={touchEnd(deleteRecord)}
        >
          delete
        </SecondaryButton>
      </ButtonWrapper>
    );
  }
  return (
    <ButtonWrapper>
      <PrimaryButton
        onClick={withStopPropagation(imposePenalty)}
        onTouchEnd={touchEnd(imposePenalty)}
      >
        +2
      </PrimaryButton>
      <DangerButton
        onClick={withStopPropagation(changeToDNF)}
        onTouchEnd={touchEnd(changeToDNF)}
      >
        DNF
      </DangerButton>
      <SecondaryButton
        onClick={withStopPropagation(deleteRecord)}
        onTouchEnd={touchEnd(deleteRecord)}
      >
        delete
      </SecondaryButton>
    </ButtonWrapper>
  );
};
