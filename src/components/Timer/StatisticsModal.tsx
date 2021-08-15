import { VFC, useState, useContext, useEffect, ReactNode } from 'react';
import tw from 'twin.macro';
import {
  UserDefinedVariationContext,
  defaultVariations,
} from '../../data/variations';
import { useInput } from '../../utils/hooks/useInput';
import { analyzeSessionCollection } from '../../utils/recordWorkerClient';
import { showAverage } from '../../utils/showAverage';
import { showRecord } from '../../utils/showRecord';
import { Awaited } from '../../utils/typeUtils';
import { LoadingIndicator } from '../common/LoadingIndicator';
import { Modal } from '../common/Modal';
import { ModalCloseButton } from '../common/ModalCloseButton';
import { SessionCollection } from './timeData';
import './StatisticsModal.css';

const Tab = <T extends readonly string[]>({
  tabs,
  tabLabel,
  tabComponent,
}: {
  tabs: T;
  tabLabel: { [K in T[number]]: string };
  tabComponent: { [K in T[number]]: () => ReactNode };
}) => {
  const [selectedTab, setSelectedTab] = useState<T[number]>(tabs[0]);
  return (
    <div>
      <ul tw="flex mb-3">
        {tabs.map((tabName: T[number]) => (
          <li
            className={selectedTab === tabName ? 'tab--selected' : 'tab'}
            onClick={() => setSelectedTab(tabName)}
            key={tabName}
          >
            {tabLabel[tabName]}
          </li>
        ))}
      </ul>
      {tabComponent[selectedTab]()}
    </div>
  );
};

const Details: VFC<{ summary: ReactNode; detail: () => ReactNode }> = ({
  summary,
  detail,
}) => {
  const [showsDetail, setShowsDetail] = useState(false);
  return (
    <details open={showsDetail} onToggle={() => setShowsDetail((v) => !v)}>
      <summary tw="cursor-pointer select-none">{summary}</summary>
      {showsDetail && detail()}
    </details>
  );
};
export const StatisticsModal: VFC<{
  onClose: () => void;
  sessions: SessionCollection;
}> = ({ onClose, sessions }) => {
  const [statistics, setStatistics] = useState<
    Awaited<ReturnType<typeof analyzeSessionCollection>>
  >({});
  const [userDefinedVariation] = useContext(UserDefinedVariationContext);

  const [isLoading, setIsLoading] = useState(true);
  useEffect(() => {
    const abortController = new AbortController();
    (async () => {
      const value = await analyzeSessionCollection(sessions, abortController);
      setStatistics(value);
      setIsLoading(false);
    })();
    return () => {
      abortController.abort();
    };
  }, [sessions]);

  const {
    value: selectedVariationName,
    onChange: onSelectedVariationNameChange,
  } = useInput(defaultVariations[0].name);

  const {
    best = null,
    bestAo5 = null,
    bestAo12 = null,
    bestAo25 = null,
    bestAo50 = null,
    bestAo100 = null,
    sessionAverage = null,
    average = null,
  } = statistics[selectedVariationName] || {};

  const EverySessionTab = () => (
    <div tw="flex flex-col space-y-5">
      {sessions
        .find(({ variation }) => variation.name === selectedVariationName)
        ?.sessions.map(({ times, name }, sessionIndex) => {
          const { ao5, ao12, ao25, ao50, ao100, average, standardDeviation } =
            sessionAverage?.[sessionIndex] || {};
          return (
            <div key={sessionIndex}>
              <h1 tw="bg-blue-200 dark:bg-blue-900">{name}</h1>
              <ul>
                {ao5 && <li>ao5: {showAverage(ao5)}</li>}
                {ao12 && <li>ao12: {showAverage(ao12)}</li>}
                {ao25 && <li>ao25: {showAverage(ao25)}</li>}
                {ao50 && <li>ao50: {showAverage(ao50)}</li>}
                {ao100 && <li>ao100: {showAverage(ao100)}</li>}
                {average && <li>average: {showAverage(average)}</li>}
                {standardDeviation && (
                  <li>standardDeviation: {standardDeviation}</li>
                )}
              </ul>
              <Details
                summary="セッション記録"
                detail={() => (
                  <ul
                    tw="grid px-3 gap-y-1"
                    style={{
                      gridTemplateColumns:
                        'max-content repeat(3, minmax(0, 1fr))',
                    }}
                  >
                    <li tw="contents order-1">
                      <span tw="pr-2 border-b border-gray-300">No.</span>
                      <span tw="border-b border-gray-300">record</span>
                      <span tw="border-b border-gray-300">ao5</span>
                      <span tw="border-b border-gray-300">ao12</span>
                    </li>
                    {times.map((time, index) => {
                      const style = [
                        index !== times.length - 1 && tw`border-b`,
                        tw`border-gray-200 dark:border-gray-700`,
                      ];
                      return (
                        <li key={time.date} tw="contents">
                          <span css={[style, tw`pr-2`]}>{index + 1}</span>
                          <span css={style}>{showRecord(time)}</span>
                          <span css={style}>
                            {showAverage(
                              sessionAverage?.[sessionIndex].ao5List[index] ||
                                null,
                              '-'
                            )}
                          </span>
                          <span css={style}>
                            {showAverage(
                              sessionAverage?.[sessionIndex].ao12List[index] ||
                                null,
                              '-'
                            )}
                          </span>
                        </li>
                      );
                    })}
                  </ul>
                )}
              />
            </div>
          );
        })}
    </div>
  );

  return (
    <Modal tw="lg:inset-x-1/4 lg:w-1/2" onClose={onClose}>
      <ModalCloseButton onClick={onClose} />
      <div tw="flex flex-col px-3.5 py-5 space-y-2 h-full">
        <div tw="flex space-x-2">
          <span tw="text-3xl">Statistics</span>
        </div>
        {isLoading ? (
          <div tw="text-2xl">
            <LoadingIndicator />
          </div>
        ) : (
          <div tw="flex-1 overflow-auto">
            種目:
            <select
              tw="bg-transparent"
              value={selectedVariationName}
              onChange={onSelectedVariationNameChange}
            >
              {[...defaultVariations, ...userDefinedVariation].map(
                ({ name }) => (
                  <option key={name}>{name}</option>
                )
              )}
            </select>
            <Tab
              tabs={['all', 'every']}
              tabLabel={{ all: '全セッション', every: 'セッション別' }}
              tabComponent={{
                all: function AllSessionsTab() {
                  return (
                    <ul tw="flex flex-col space-y-5">
                      <li>
                        <ul>
                          <li>best time: {best ? showAverage(best) : '-'}</li>
                          <li>
                            best ao5: {bestAo5 ? showAverage(bestAo5) : '-'}
                          </li>
                          <li>
                            best ao12: {bestAo12 ? showAverage(bestAo12) : '-'}
                          </li>
                          <li>
                            best ao25: {bestAo25 ? showAverage(bestAo25) : '-'}
                          </li>
                          <li>
                            best ao50: {bestAo50 ? showAverage(bestAo50) : '-'}
                          </li>
                          <li>
                            best ao100:{' '}
                            {bestAo100 ? showAverage(bestAo100) : '-'}
                          </li>
                          <li>
                            average: {average ? showAverage(average) : '-'}
                          </li>
                        </ul>
                        1/5/12/25/50/100 ={best ? showAverage(best) : '-'}/
                        {bestAo5 ? showAverage(bestAo5) : '-'}/
                        {bestAo12 ? showAverage(bestAo12) : '-'}/
                        {bestAo25 ? showAverage(bestAo25) : '-'}/
                        {bestAo50 ? showAverage(bestAo50) : '-'}/
                        {bestAo100 ? showAverage(bestAo100) : '-'}
                      </li>
                      <li>推移グラフ</li>
                      <li>日別平均</li>
                    </ul>
                  );
                },
                every: EverySessionTab,
              }}
            />
          </div>
        )}
      </div>
    </Modal>
  );
};
