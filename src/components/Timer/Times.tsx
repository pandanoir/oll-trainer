import { Temporal } from '@js-temporal/polyfill';
import { VFC, useMemo, useState } from 'react';
import tw from 'twin.macro';
import {
  useDeleteRecord,
  useInsertRecord,
} from '../../features/sessionList/hooks/useSessions';

import { DNF, TimeData } from '../../features/timer/data/timeData';
import { useI18nContext } from '../../i18n/i18n-react';
import { calcAo } from '../../utils/calcAo';
import { exhaustiveCheck } from '../../utils/exhaustiveCheck';
import { findIndexOfMax } from '../../utils/findIndexOfMax';
import { findIndexOfMin } from '../../utils/findIndexOfMin';
import { showAverage } from '../../utils/showAverage';
import { showRecord } from '../../utils/showRecord';

import { Modal, useModal } from '../common/Modal';
import { ModalCloseButton } from '../common/ModalCloseButton';
import { useToast } from '../common/Toast';
import { ToggleButton } from '../common/ToggleButton';
import { TweetButton } from '../TweetButton';
import { BigRecord } from './BigRecord';
import { RecordModifier } from './RecordModifier';

const BestRecordListItem = tw.button`text-left py-1 hover:text-hover hover:dark:text-hover-dark`;
const SessionRecordListItem = tw.button`text-left border-b border-gray-200 dark:border-gray-700 hover:text-hover hover:dark:text-hover-dark`;

export const Times: VFC<{
  times: TimeData[];
}> = ({ times }) => {
  const { LL } = useI18nContext();
  const ao5 = useMemo(() => calcAo(5, times), [times]);
  const ao12 = useMemo(() => calcAo(12, times), [times]);
  const [selectedIndex, setSelectedIndex] = useState(0);

  const { showsModal, openModal: openModalRaw, closeModal } = useModal();
  const { openToast, closeToast, Toast } = useToast();
  const [modalType, setModalType] = useState<'time' | 'ao5' | 'ao12'>('time');

  const deleteRecord = useDeleteRecord(),
    insertRecord = useInsertRecord();

  const bestRecordIndex = useMemo(
    () =>
      findIndexOfMin(
        times.map(({ isDNF, penalty, time }) =>
          isDNF === true ? Infinity : time + (penalty === true ? 2000 : 0)
        )
      ),
    [times]
  );
  // 最もao5がよくなった瞬間のindex = このインデックスより前の5個が対象
  const bestAo5Index = useMemo(
    () =>
      findIndexOfMin(ao5.map((v) => (v === DNF || v === null ? Infinity : v))),
    [ao5]
  );
  // 最もao12がよくなった瞬間のindex = このインデックスより前の12個が対象
  const bestAo12Index = useMemo(
    () =>
      findIndexOfMin(ao12.map((v) => (v === DNF || v === null ? Infinity : v))),
    [ao12]
  );

  const openModal = (index: number) => {
    setSelectedIndex(index);
    setModalType('time');
    openModalRaw();
  };
  const openAo5Modal = (index: number) => {
    setSelectedIndex(index);
    setModalType('ao5');
    openModalRaw();
  };
  const openAo12Modal = (index: number) => {
    setSelectedIndex(index);
    setModalType('ao12');
    openModalRaw();
  };
  const [sharesScramble, onChange] = useState(false);

  return (
    <>
      <div tw="flex flex-col space-y-5">
        <ul tw="flex flex-col-reverse px-3" aria-label="best records">
          <li tw="grid grid-cols-3 border-b border-gray-300 order-1">
            <span>best time</span>
            <span>best ao5</span>
            <span>best ao12</span>
          </li>
          <li tw="grid grid-cols-3">
            <BestRecordListItem
              onClick={() => openModal(bestRecordIndex)}
              disabled={bestRecordIndex === -1}
            >
              {bestRecordIndex !== -1
                ? showRecord(times[bestRecordIndex])
                : '-'}
            </BestRecordListItem>
            <BestRecordListItem
              onClick={() => openAo5Modal(bestAo5Index)}
              disabled={bestAo5Index === -1 || ao5[bestAo5Index] === null}
            >
              {bestAo5Index !== -1 ? showAverage(ao5[bestAo5Index], '-') : '-'}
            </BestRecordListItem>
            <BestRecordListItem
              onClick={() => openAo12Modal(bestAo12Index)}
              disabled={bestAo12Index === -1 || ao12[bestAo12Index] === null}
            >
              {bestAo12Index !== -1
                ? showAverage(ao12[bestAo12Index], '-')
                : '-'}
            </BestRecordListItem>
          </li>
        </ul>
        <ul
          tw="grid px-3 gap-y-1"
          css="grid-template-columns: max-content repeat(3, minmax(0, 1fr))"
          aria-label="session record"
        >
          <li tw="contents order-1">
            <span tw="pr-2 border-b border-gray-300">No.</span>
            <span tw="border-b border-gray-300">record</span>
            <span tw="border-b border-gray-300">ao5</span>
            <span tw="border-b border-gray-300">ao12</span>
          </li>
          {times
            .map((time, index) => (
              <li key={time.date} tw="contents">
                <span tw="border-b border-gray-200 dark:border-gray-700 pr-2">
                  {index + 1}
                </span>
                <SessionRecordListItem onClick={() => openModal(index)}>
                  {showRecord(time)}
                </SessionRecordListItem>
                <SessionRecordListItem
                  onClick={() => openAo5Modal(index)}
                  disabled={ao5[index] === null}
                >
                  {showAverage(ao5[index], '-')}
                </SessionRecordListItem>
                <SessionRecordListItem
                  onClick={() => openAo12Modal(index)}
                  disabled={ao12[index] === null}
                >
                  {showAverage(ao12[index], '-')}
                </SessionRecordListItem>
              </li>
            ))
            .reverse()}
        </ul>
      </div>
      {showsModal &&
        (() => {
          if (modalType === 'time') {
            return (
              <Modal onClose={closeModal} ariaLabel="single record">
                <ModalCloseButton onClick={closeModal} />
                <div tw="relative flex flex-col space-y-8 p-6 h-full">
                  <BigRecord
                    record={times[selectedIndex]}
                    onClick={closeModal}
                  />
                  <RecordModifier
                    record={times[selectedIndex]}
                    timeIndex={selectedIndex}
                    deleteRecord={() => {
                      const deletedRecord = deleteRecord(selectedIndex);
                      closeModal();
                      openToast({
                        title: LL['Deleted'](),
                        buttonLabel: LL['undo'](),
                        callback: () => {
                          insertRecord(selectedIndex, deletedRecord);
                          closeToast();
                        },
                        timeout: 10 * 1000,
                      });
                    }}
                  />
                  <div
                    tw="grid gap-x-3"
                    css="grid-template-columns: max-content 1fr"
                  >
                    <span>date:</span>
                    <span>
                      {Temporal.Now.timeZone()
                        .getPlainDateTimeFor(
                          Temporal.Instant.fromEpochMilliseconds(
                            times[selectedIndex].date
                          )
                        )
                        .toLocaleString('ja-JP', {
                          year: 'numeric',
                          month: 'numeric',
                          day: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit',
                          second: '2-digit',
                        })}
                    </span>

                    <span>scramble:</span>
                    <span>{times[selectedIndex].scramble}</span>
                  </div>
                  <span>
                    <TweetButton
                      text={`${showRecord(times[selectedIndex])} scramble: ${
                        times[selectedIndex].scramble
                      }`}
                    />
                  </span>
                </div>
              </Modal>
            );
          }
          if (modalType === 'ao5' || modalType === 'ao12') {
            const averageSize = modalType === 'ao5' ? 5 : 12;
            const avg = (averageSize === 5 ? ao5 : ao12)[selectedIndex];

            const startIndex = selectedIndex - averageSize + 1;
            const selectedTimes = times.slice(startIndex, selectedIndex + 1);
            const selectedRecords = selectedTimes.map(
              ({ isDNF, penalty, time }) =>
                isDNF === true ? Infinity : time + (penalty === true ? 2000 : 0)
            );
            const maxIndex = findIndexOfMax(selectedRecords);
            const minIndex = findIndexOfMin(selectedRecords);
            const tweetText = `avg of ${averageSize}: ${showAverage(avg)}
${selectedTimes.reduce((acc, time, index) => {
  const record = showRecord(time).replace(/\s/g, '');
  return `${acc}${
    index === maxIndex || index === minIndex
      ? `${index + 1}. (${record})`
      : `${index + 1}. ${record}`
  }${sharesScramble ? ` ${times[startIndex + index].scramble}` : ''}
`;
}, '')}`.trimEnd();
            return (
              <Modal onClose={closeModal} ariaLabel={`ao${averageSize} record`}>
                <ModalCloseButton onClick={closeModal} />
                <div tw="relative flex flex-col space-y-6 p-6 h-full">
                  <span tw="bg-blue-200 dark:bg-blue-800 w-max px-3 rounded text-lg font-bold dark:font-normal">
                    ao{averageSize}
                  </span>
                  <div
                    css={[
                      tw`text-center text-4xl md:text-8xl font-bold cursor-pointer`,
                    ]}
                    onClick={closeModal}
                  >
                    {showAverage(avg)}
                  </div>
                  <div tw="flex-shrink overflow-x-hidden overflow-y-auto">
                    <ul
                      tw="inline-grid gap-x-2 gap-y-1"
                      css="grid-template-columns: max-content 1fr"
                    >
                      {selectedTimes.map((time, index) => (
                        <li tw="contents" key={startIndex + index}>
                          <span>
                            {index === maxIndex || index === minIndex
                              ? `${startIndex + index + 1}. (${showRecord(
                                  time
                                )})`
                              : `${startIndex + index + 1}. ${showRecord(
                                  time
                                )}`}
                          </span>
                          <span>{times[startIndex + index].scramble}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                  <span
                    tw="flex space-x-3 items-center flex-wrap"
                    key={tweetText}
                  >
                    <TweetButton text={tweetText} />
                    <ToggleButton checked={sharesScramble} onChange={onChange}>
                      {LL['Share record with scramble']()}
                    </ToggleButton>
                  </span>
                </div>
              </Modal>
            );
          }

          exhaustiveCheck(modalType);
        })()}
      {Toast}
    </>
  );
};
