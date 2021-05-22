import 'twin.macro';
import { PrimaryButton } from '../PrimaryButton';
import { DangerButton } from '../DangerButton';
import { TimeData } from './timeData';
import { SecondaryButton } from '../SecondaryButton';

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
      <div tw="flex justify-center flex-wrap" className="">
        <DangerButton onClick={undoDNF}>undo DNF</DangerButton>
        <SecondaryButton onClick={deleteRecord}>delete</SecondaryButton>
      </div>
    );
  }
  if (record.penalty) {
    return (
      <div tw="flex justify-center gap-2 flex-wrap">
        <PrimaryButton onClick={undoPenalty}>undo +2</PrimaryButton>
        <DangerButton onClick={changeToDNF}>DNF</DangerButton>
        <SecondaryButton onClick={deleteRecord}>delete</SecondaryButton>
      </div>
    );
  }
  return (
    <div tw="flex justify-center gap-2 flex-wrap">
      <PrimaryButton onClick={imposePenalty}>+2</PrimaryButton>
      <DangerButton onClick={changeToDNF}>DNF</DangerButton>
      <SecondaryButton onClick={deleteRecord}>delete</SecondaryButton>
    </div>
  );
};
