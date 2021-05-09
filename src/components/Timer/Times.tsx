import { VFC, useMemo, useState } from 'react';
import { calcAo } from '../../utils/calcAo';
import { useModal } from '../Modal';
import { Toast, useToast } from '../Toast';
import { RecordModal } from './RecordModal';
import { showTime } from './showTime';
import { TimeData, DNF } from './timeData';

const SimpleRecord: VFC<{
  index: number;
  time: TimeData;
  onClick?: () => void;
}> = ({ index, time: { time, penalty, isDNF }, onClick }) => {
  const record = isDNF
    ? 'DNF'
    : penalty
    ? `${showTime(time)} + 2`
    : showTime(time);

  return (
    <span onClick={onClick} className="cursor-pointer">
      {index + 1}. {record}
    </span>
  );
};

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
  const { openToast, closeToast, toastProps, showsToast } = useToast();

  return (
    <>
      <ul className="flex flex-col-reverse px-3">
        <li className="grid grid-cols-3 border-b border-gray-300 order-1">
          <span>record</span>
          <span>ao5</span>
          <span>ao12</span>
        </li>
        {times.map((time, index) => {
          const ao5 = ao5List[index];
          const ao12 = ao12List[index];
          return (
            <li key={time.date} className="grid grid-cols-3">
              <SimpleRecord
                index={index}
                time={time}
                onClick={() => {
                  setSelectedIndex(index);
                  openModal();
                }}
              />
              <span>{ao5 ? (ao5 === DNF ? 'DNF' : showTime(ao5)) : '-'}</span>
              <span>
                {ao12 ? (ao12 === DNF ? 'DNF' : showTime(ao12)) : '-'}
              </span>
            </li>
          );
        })}
      </ul>
      {showsModal && (
        <RecordModal
          record={times[selectedIndex]}
          onClose={closeModal}
          changeToDNF={() => changeToDNF(selectedIndex)}
          undoDNF={() => undoDNF(selectedIndex)}
          imposePenalty={() => imposePenalty(selectedIndex)}
          undoPenalty={() => undoPenalty(selectedIndex)}
          deleteRecord={() => {
            const deletedRecord = deleteRecord(selectedIndex);
            closeModal();
            openToast('削除しました', '元に戻す', () => {
              insertRecord(selectedIndex, deletedRecord);
              closeToast();
            });
          }}
        />
      )}
      {showsToast && <Toast {...toastProps} />}
    </>
  );
};
