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
} from '../components/Timer/timerState';
import { Timer } from '../components/Timer/Timer';
import { showTime } from '../utils/showTime';
import { ToggleButton } from '../components/common/ToggleButton';
import { useSessions } from '../utils/hooks/useTimes';
import { RecordModifier } from '../components/Timer/RecordModifier';
import { RecordItem } from '../components/Timer/RecordItem';
import { Toast, useToast } from '../components/common/Toast';
import { TypingTimer } from '../components/Timer/TypingTimer';
import { ExportButton } from '../components/Timer/ExportButton';
import { FileInput } from '../components/Timer/FileInput';
import { DNF } from '../components/Timer/timeData';
import { calcAo } from '../utils/calcAo';
import { Session } from '../components/Timer/Session';
import { PrimaryButton } from '../components/common/PrimaryButton';
import { useTitle } from '../utils/hooks/useTitle';
import { useStoragedState } from '../utils/hooks/useLocalStorage';
import { usePreventDefault } from '../utils/hooks/usePreventDefault';
import { withStopPropagation } from '../utils/withStopPropagation';
import { noop } from '../utils/noop';
import '../swiper.css';
import './TimerPage.css';
import { withPrefix } from '../utils/withPrefix';
import { useCubeTimer } from '../utils/hooks/useCubeTimer';
import { toCsTimer } from '../utils/toCsTimer';
import { TimerCover } from '../components/Timer/TimerCover';

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

  const ao5 = useMemo(() => calcAo(5, times.slice(-5)).pop(), [times]);
  const ao12 = useMemo(() => calcAo(12, times.slice(-12)).pop(), [times]);

  useEffect(() => {
    if (index + 3 >= scrambles.length) {
      const id = setTimeout(() => {
        setScrambles(scrambles.concat(new Scrambo().get(3)));
      }, 1000 / 60);
      return () => clearTimeout(id);
    }
  });

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

  const [isTouchingCover, setIsTouchingCover] = useState(false);
  const noopWithStopPropagation = useMemo(() => withStopPropagation(noop), []);

  const onTouchStart = useMemo(() => withStopPropagation(onPointerDown), [
    onPointerDown,
  ]);
  const onTouchEnd = useMemo(() => withStopPropagation(onPointerUp), [
    onPointerUp,
  ]);

  const wrapperRef = usePreventDefault<HTMLDivElement>(
    'touchstart',
    !inputsTimeManually
  );

  return (
    <div tw="relative w-full flex flex-col flex-1 dark:bg-gray-800 dark:text-white">
      <div tw="flex gap-1 px-3 overflow-x-auto">
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
      >
        {scrambles.map((scramble, index) => (
          <SwiperSlide key={index}>{scramble}</SwiperSlide>
        ))}
      </Swiper>
      <div
        css={[
          tw`text-center flex-1 flex flex-col justify-center items-center select-none`,
          timerState === IDOLING ? '' : tw`z-50`,
        ]}
        onTouchStart={(event) => {
          if (timerState !== IDOLING) return;
          event.stopPropagation();
          onPointerDown();
        }}
        onTouchEnd={onTouchEnd}
        onMouseDown={(event) => {
          if (timerState !== IDOLING) return;
          event.stopPropagation();
          onPointerDown();
        }}
        ref={wrapperRef}
      >
        {(timerState !== IDOLING || isTouchingCover) && (
          <TimerCover
            onPointerDown={onPointerDown}
            onPointerUp={onPointerUp}
            onTouch={() => setIsTouchingCover(true)}
            onLeave={() => setIsTouchingCover(false)}
            disabled={inputsTimeManually}
            transparent={timerState === IDOLING && isTouchingCover}
          />
        )}
        {inputsTimeManually ? (
          <TypingTimer
            prevTime={times.length > 0 ? times[times.length - 1] : undefined}
            onInput={onTypingTimerInput}
          />
        ) : (
          <Timer
            tw="z-20"
            onTouchStart={onTouchStart}
            onTouchMove={noopWithStopPropagation}
            onTouchEnd={onTouchEnd}
            onMouseDown={onTouchStart}
            onMouseUp={onTouchEnd}
            timerState={timerState}
          >
            {timerState === INSPECTION ||
            timerState === INSPECTION_READY ||
            timerState === INSPECTION_STEADY ? (
              Math.ceil(inspectionTime / 1000) > 0 ? (
                Math.ceil(inspectionTime / 1000)
              ) : Math.ceil(inspectionTime / 1000) > -2 ? (
                '+ 2'
              ) : (
                'DNF'
              )
            ) : timerState === IDOLING && times.length > 0 ? (
              <RecordItem record={times[times.length - 1]} />
            ) : timerState === READY ? (
              'READY'
            ) : timerState === STEADY ? (
              'STEADY'
            ) : (
              showTime(time)
            )}
          </Timer>
        )}
        <div>ao5: {ao5 ? (ao5 === DNF ? 'DNF' : showTime(ao5)) : '-'}</div>
        <div>ao12: {ao12 ? (ao12 === DNF ? 'DNF' : showTime(ao12)) : '-'}</div>
        {timerState === INSPECTION ||
        timerState === INSPECTION_READY ||
        timerState === INSPECTION_STEADY ? (
          <PrimaryButton
            tw="z-20 select-none"
            onMouseDown={noopWithStopPropagation}
            onTouchStart={noopWithStopPropagation}
            onMouseUp={withStopPropagation(cancelTimer)}
            onTouchEnd={withStopPropagation(cancelTimer)}
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
