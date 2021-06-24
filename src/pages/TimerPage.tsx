import { useCallback, useEffect, useMemo, useState, VFC } from 'react';
import SwiperCore, { Navigation, Keyboard } from 'swiper';
import { Swiper, SwiperSlide } from 'swiper/react';
import Scrambo from 'scrambo';
import tw from 'twin.macro';

import {
  IDOLING,
  STEADY,
  READY,
  INSPECTION,
  INSPECTION_READY,
  INSPECTION_STEADY,
  WORKING,
} from '../components/Timer/timerState';
import { TapTimer } from '../components/Timer/TapTimer';
import { showTime } from '../utils/showTime';
import { ToggleButton } from '../components/common/ToggleButton';
import { useSessions } from '../utils/hooks/useSessions';
import { RecordModifier } from '../components/Timer/RecordModifier';
import { RecordItem } from '../components/Timer/RecordItem';
import { Toast, useToast } from '../components/common/Toast';
import { TypingTimer } from '../components/Timer/TypingTimer';
import { ExportButton } from '../components/Timer/ExportButton';
import { FileInput } from '../components/Timer/FileInput';
import { calcAo } from '../utils/calcAo';
import { Session } from '../components/Timer/Session';
import { PrimaryButton } from '../components/common/PrimaryButton';
import { useTitle } from '../utils/hooks/useTitle';
import { useStoragedState } from '../utils/hooks/useLocalStorage';
import { withStopPropagation } from '../utils/withStopPropagation';
import '../swiper.css';
import './TimerPage.css';
import { withPrefix } from '../utils/withPrefix';
import { useCubeTimer } from '../utils/hooks/useCubeTimer';
import { toCsTimer } from '../utils/toCsTimer';
import { TimerCover } from '../components/Timer/TimerCover';
import { TimerArea } from '../components/Timer/TimerArea';
import { showAverage } from '../utils/showAverage';
import { isAwayFromBeginningElement } from '../utils/isAwayFromBeginningElement';

import { playAudio } from '../utils/playAudio';
import steadySoundUrl from '../sound/steady.mp3';

const steadySound = fetch(steadySoundUrl).then((response) =>
  response.arrayBuffer()
);

SwiperCore.use([Navigation, Keyboard]);

export const TimerPage: VFC = () => {
  useTitle('Hi-Timer');
  const [scrambles, setScrambles] = useState<string[]>([]);
  const [index, setIndex] = useState(0);
  const [swiper, setControlledSwiper] = useState<SwiperCore>();
  // options
  const [usesInspection, setUsesInspection] = useStoragedState(
    withPrefix('uses-inspection'),
    true
  );
  const [inputsTimeManually, setInputsTimeManually] = useStoragedState(
    withPrefix('inputs-time-manually'),
    false
  );

  const {
    sessions,
    sessionIndex,
    setSessionIndex,
    importFromCsTimer,
    changeSessionName,
    changeToDNF,
    undoDNF,
    imposePenalty,
    undoPenalty,
    deleteRecord,
    insertRecord,
    addTime,
    addSession,
    deleteSession,
  } = useSessions();
  const { times } = sessions[sessionIndex];

  const ao5 = useMemo(() => calcAo(5, times.slice(-5)).pop() || null, [times]);
  const ao12 = useMemo(() => calcAo(12, times.slice(-12)).pop() || null, [
    times,
  ]);

  useEffect(() => {
    if (index + 3 >= scrambles.length) {
      const id = setTimeout(() => {
        setScrambles(scrambles.concat(new Scrambo().get(3)));
      }, 1000 / 60);
      return () => clearTimeout(id);
    }
  }, [index, scrambles]);

  const {
    onPointerDown,
    onPointerUp,
    cancelTimer,
    timerState,
    inspectionTime,
    time,
  } = useCubeTimer({
    usesInspection,
    inputsTimeManually,
    onFinish: useCallback(
      (data) => {
        addTime({
          ...data,
          scramble: scrambles[index],
          date: Date.now(),
        });
        swiper?.slideNext();
      },
      [addTime, index, scrambles, swiper]
    ),
  });
  useEffect(() => {
    (async () => {
      if (timerState === STEADY || timerState === INSPECTION_STEADY) {
        playAudio(await steadySound);
      }
    })();
  }, [timerState]);

  const { openToast, closeToast, ...toastProps } = useToast();
  const onTypingTimerInput = useCallback(
    (secTime) => {
      addTime({
        time: secTime * 1000,
        scramble: scrambles[index],
        date: Date.now(),
      });
      swiper?.slideNext();
    },
    [addTime, scrambles, index, swiper]
  );

  const inspectionTimeInteger = Math.ceil(inspectionTime / 1000);
  const timerStr = useMemo(() => {
    if (
      timerState === INSPECTION ||
      timerState === INSPECTION_READY ||
      timerState === INSPECTION_STEADY
    )
      return inspectionTimeInteger > 0
        ? inspectionTimeInteger
        : inspectionTimeInteger > -2
        ? '+ 2'
        : 'DNF';
    if (timerState === IDOLING && times.length > 0)
      return <RecordItem record={times[times.length - 1]} />;
    if (timerState === READY) return 'READY';
    if (timerState === STEADY) return 'STEADY';
    return showTime(time);
  }, [inspectionTimeInteger, time, timerState, times]);

  return (
    <div tw="relative w-full flex flex-col flex-1 dark:bg-gray-800 dark:text-white">
      <div tw="flex space-x-1 px-3 overflow-x-auto">
        <ToggleButton checked={usesInspection} onChange={setUsesInspection}>
          インスペクションを使用
        </ToggleButton>
        <ToggleButton
          checked={inputsTimeManually}
          onChange={setInputsTimeManually}
        >
          手動でタイムを入力
        </ToggleButton>
        <FileInput onChange={importFromCsTimer} />
        <ExportButton getContent={() => JSON.stringify(toCsTimer(sessions))}>
          ファイルをエクスポート
        </ExportButton>
      </div>
      <Swiper
        slidesOffsetAfter={27 * 2}
        onSlideChange={({ activeIndex }) => setIndex(activeIndex)}
        keyboard
        spaceBetween={50}
        navigation
        onSwiper={setControlledSwiper}
        style={{ zIndex: 10 }}
      >
        {scrambles.map((scramble, index) => (
          <SwiperSlide key={index}>{scramble}</SwiperSlide>
        ))}
      </Swiper>
      <TimerArea
        disabled={inputsTimeManually}
        overlappingScreen={timerState !== IDOLING}
      >
        <TimerCover
          onPointerDown={onPointerDown}
          onPointerUp={onPointerUp}
          disabled={inputsTimeManually}
          transparent={timerState === IDOLING}
        />
        {inputsTimeManually ? (
          <TypingTimer
            tw="z-20"
            prevTime={times.length > 0 ? times[times.length - 1] : undefined}
            onInput={onTypingTimerInput}
          />
        ) : (
          <TapTimer tw="z-20 pointer-events-none" timerState={timerState}>
            {timerStr}
          </TapTimer>
        )}
        <div>ao5: {showAverage(ao5, '-')}</div>
        <div>ao12: {showAverage(ao12, '-')}</div>
        <div
          css={[
            tw`pointer-events-none select-none`,
            timerState === READY ||
            timerState === STEADY ||
            timerState === WORKING
              ? tw`z-auto`
              : tw`z-20`,
          ]}
        >
          {timerState === INSPECTION ||
          timerState === INSPECTION_READY ||
          timerState === INSPECTION_STEADY ? (
            <PrimaryButton
              onTouchEnd={(event) => {
                if (isAwayFromBeginningElement(event)) {
                  return;
                }
                event.stopPropagation();
                event.preventDefault();
                cancelTimer();
              }}
              onClick={withStopPropagation(cancelTimer)}
            >
              cancel
            </PrimaryButton>
          ) : (
            times.length > 0 && (
              <RecordModifier
                record={times[times.length - 1]}
                changeToDNF={() => changeToDNF(times.length - 1)}
                imposePenalty={() => imposePenalty(times.length - 1)}
                undoDNF={() => undoDNF(times.length - 1)}
                undoPenalty={() => undoPenalty(times.length - 1)}
                deleteRecord={() => {
                  const deletedRecord = deleteRecord(times.length - 1);
                  openToast({
                    title: '削除しました',
                    buttonLabel: '元に戻す',
                    callback: () => {
                      insertRecord(times.length - 1, deletedRecord);
                      closeToast();
                    },
                    timeout: 10 * 1000,
                  });
                }}
              />
            )
          )}
        </div>
      </TimerArea>
      <Session
        times={times}
        changeToDNF={changeToDNF}
        imposePenalty={imposePenalty}
        undoDNF={undoDNF}
        undoPenalty={undoPenalty}
        deleteRecord={deleteRecord}
        insertRecord={insertRecord}
        sessionIndex={sessionIndex}
        setSessionIndex={setSessionIndex}
        changeSessionName={changeSessionName}
        sessions={sessions}
        addSession={addSession}
        deleteSession={deleteSession}
      />
      <Toast {...toastProps} />
    </div>
  );
};
