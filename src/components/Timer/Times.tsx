import 'twin.macro';
import { VFC, useMemo, useState } from 'react';

import { calcAo } from '../../utils/calcAo';
import { Modal, useModal } from '../Modal';
import { Toast, useToast } from '../Toast';
import { showTime } from './showTime';
import { TimeData, DNF } from './timeData';
import { showRecord } from '../../utils/showRecord';
import { BigRecord } from './BigRecord';
import { RecordModifier } from './RecordModifier';

export const Times: VFC<{
  times: TimeData[];
  changeToDNF: (index: number) => void;
  undoDNF: (index: number) => void;
  imposePenalty: (index: number) => void;
  undoPenalty: (index: number) => void;
  deleteRecord: (index: number) => TimeData;
  insertRecord: (index: number, record: TimeData) => void;
}> = ({
  times,
  changeToDNF,
  undoDNF,
  imposePenalty,
  undoPenalty,
  deleteRecord,
  insertRecord,
}) => {
  const ao5List = useMemo(() => calcAo(5, times), [times]);
  const ao12List = useMemo(() => calcAo(12, times), [times]);
  const [selectedIndex, setSelectedIndex] = useState(0);

  const { showsModal, openModal, closeModal } = useModal();
  const { openToast, closeToast, ...toastProps } = useToast();

  return (
    <>
      <ul tw="flex flex-col-reverse px-3">
        <li tw="grid grid-cols-3 border-b border-gray-300 order-1">
          <span>record</span>
          <span>ao5</span>
          <span>ao12</span>
        </li>
        {times.map((time, index) => {
          const ao5 = ao5List[index];
          const ao12 = ao12List[index];
          return (
            <li
              key={time.date}
              tw="grid grid-cols-3 border-b border-gray-200 dark:border-gray-700"
            >
              <span
                onClick={() => {
                  setSelectedIndex(index);
                  openModal();
                }}
                tw="cursor-pointer py-1"
              >
                {index + 1}. {showRecord(time)}
              </span>
              <span tw="cursor-pointer py-1">
                {ao5 ? (ao5 === DNF ? 'DNF' : showTime(ao5)) : '-'}
              </span>
              <span tw="cursor-pointer py-1">
                {ao12 ? (ao12 === DNF ? 'DNF' : showTime(ao12)) : '-'}
              </span>
            </li>
          );
        })}
      </ul>
      {showsModal && (
        <Modal onClose={closeModal}>
          <div tw="flex flex-col gap-6 p-6">
            <BigRecord record={times[selectedIndex]} onClick={closeModal} />
            <RecordModifier
              record={times[selectedIndex]}
              changeToDNF={() => changeToDNF(selectedIndex)}
              undoDNF={() => undoDNF(selectedIndex)}
              imposePenalty={() => imposePenalty(selectedIndex)}
              undoPenalty={() => undoPenalty(selectedIndex)}
              deleteRecord={() => {
                const deletedRecord = deleteRecord(selectedIndex);
                closeModal();
                openToast({
                  title: '削除しました',
                  buttonLabel: '元に戻す',
                  callback: () => {
                    insertRecord(selectedIndex, deletedRecord);
                    closeToast();
                  },
                  timeout: 10 * 1000,
                });
              }}
            />
            <span tw="flex gap-2">
              <span>scramble:</span>
              <textarea
                tw="inline-block resize-none flex-1 bg-transparent"
                readOnly
                value={times[selectedIndex].scramble}
              />
            </span>
          </div>
        </Modal>
      )}
      <Toast {...toastProps} />
    </>
  );
};
