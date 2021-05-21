import { useCallback, useEffect, useMemo, useRef, useState, VFC } from 'react';
import { useHotkeys } from 'react-hotkeys-hook';
import SwiperCore, { Navigation, Keyboard } from 'swiper';
import { Swiper, SwiperSlide } from 'swiper/react';
import Scrambo from 'scrambo';
import 'twin.macro';

import {
  IDOLING,
  WORKING,
  STEADY,
  READY,
  INSPECTION,
  INSPECTION_READY,
  INSPECTION_STEADY,
} from '../components/Timer/timerState';
import { exhaustiveCheck } from '../utils/exhaustiveCheck';
import { Timer } from '../components/Timer/Timer';
import { showTime } from '../components/Timer/showTime';
import { Switch } from '../components/Switch';
import { useTimer } from '../utils/hooks/useTimer';
import { useSessions } from '../utils/hooks/useTimes';
import { RecordModifier } from '../components/Timer/RecordModifier';
import { RecordItem } from '../components/Timer/RecordItem';
import { Toast, useToast } from '../components/Toast';
import { TypingTimer } from '../components/Timer/TypingTimer';
import { ExportButton } from '../components/Timer/ExportButton';
import { FileInput } from '../components/Timer/FileInput';
import { DNF, toCsTimer } from '../components/Timer/timeData';
import { calcAo } from '../utils/calcAo';
import '../swiper.css';
import { Record } from '../components/Timer/Record';

SwiperCore.use([Navigation, Keyboard]);

export const TimerPage: VFC = () => {
  const [scrambles, setScrambles] = useState<string[]>([]);
  const [index, setIndex] = useState(0);
  const [usesInspection, setUsesInspection] = useState(true);
  const [inputsTimeManually, setInputsTimeManually] = useState(false);

  const [swiper, setControlledSwiper] = useState<SwiperCore>();

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
  } = useSessions();
  const { times } = sessions[sessionIndex];
  const ao5 = useMemo(
    () => calcAo(5, sessions[sessionIndex].times.slice(-5)).pop(),
    [sessions, sessionIndex]
  );
  const ao12 = useMemo(
    () => calcAo(12, sessions[sessionIndex].times.slice(-12)).pop(),
    [sessions, sessionIndex]
  );

  const [penalty, setPenalty] = useState<null | '+2' | 'DNF'>(null);
  const {
    time,
    inspectionTime,
    timerState,

    startTimer,
    finishTimer,
    tapTimer,
    cancelTimer,
    startInspection,
    tapTimerInInspection,
    returnToInspection,
  } = useTimer({
    onFinishTimer: useCallback(
      (time) => {
        if (penalty === '+2') {
          addTime({
            time,
            scramble: scrambles[index],
            date: Date.now(),
            penalty: true,
          });
        } else if (penalty === 'DNF') {
          addTime({
            time,
            scramble: scrambles[index],
            date: Date.now(),
            isDNF: true,
          });
        } else {
          addTime({ time, scramble: scrambles[index], date: Date.now() });
        }
        swiper?.slideNext();
      },
      [addTime, scrambles, index, swiper, penalty]
    ),
  });

  useEffect(() => {
    if (index + 3 >= scrambles.length) {
      const id = setTimeout(() => {
        setScrambles(scrambles.concat(new Scrambo().get(3)));
      }, 1000 / 60);
      return () => clearTimeout(id);
    }
  });
  useEffect(() => {
    if (timerState === IDOLING) {
      setPenalty(null);
    }
  }, [timerState]);

  const onPointerDown = useCallback(() => {
      switch (timerState) {
        case READY:
        case STEADY:
        case INSPECTION_READY:
        case INSPECTION_STEADY:
          break;
        case IDOLING:
          if (usesInspection) {
            startInspection();
          } else {
            tapTimer();
          }
          break;
        case INSPECTION:
          tapTimerInInspection();
          break;
        case WORKING:
          finishTimer();
          break;
        default:
          exhaustiveCheck(timerState);
      }
    }, [
      finishTimer,
      startInspection,
      tapTimer,
      tapTimerInInspection,
      timerState,
      usesInspection,
    ]),
    onPointerUp = useCallback(() => {
      switch (timerState) {
        case IDOLING:
        case INSPECTION:
        case WORKING:
          break;
        case READY:
          cancelTimer();
          break;
        case INSPECTION_READY:
          returnToInspection();
          break;
        case STEADY:
        case INSPECTION_STEADY:
          if (usesInspection) {
            if (inspectionTime >= 0) {
              // 問題なし
            } else if (inspectionTime >= -2000) {
              // +2
              setPenalty('+2');
            } else {
              // DNF
              setPenalty('DNF');
            }
          }
          startTimer();
          break;
        default:
          exhaustiveCheck(timerState);
      }
    }, [
      cancelTimer,
      inspectionTime,
      returnToInspection,
      startTimer,
      timerState,
      usesInspection,
    ]);
  const spacePressed = useRef(false);
  /**
   * なんでかわからないけど space,esc で設定をするとバグがある。
   * スペースキーを押したままescapeを押したときに
   * escape キーの keydown イベントへ切り替わらずに
   * keyboard event が取得できなくなる。
   * そのため '*' で設定してある */
  useHotkeys(
    '*',
    (event) => {
      const { type, code } = event;
      if (inputsTimeManually) {
        return;
      }
      if (code === 'Escape') {
        if (
          timerState === READY ||
          timerState === STEADY ||
          timerState === INSPECTION ||
          timerState === INSPECTION_READY ||
          timerState === INSPECTION_STEADY
        ) {
          event.preventDefault();
          cancelTimer();
        }
        return;
      }
      if (code === 'Space') {
        event.preventDefault();
        if (type === 'keyup') {
          spacePressed.current = false;
          onPointerUp();
          return;
        }
        if (type !== 'keydown') {
          return;
        }
        if (!spacePressed.current) {
          onPointerDown();
        }
        spacePressed.current = true;
      }
    },
    { keyup: true, keydown: true },
    [cancelTimer, inputsTimeManually, onPointerDown, onPointerUp, timerState]
  );
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

  return (
    <div tw="w-full flex flex-col flex-1 overflow-hidden">
      <div tw="flex gap-1 px-3 overflow-x-auto">
        <Switch checked={usesInspection} onChange={setUsesInspection}>
          インスペクションを使用
        </Switch>
        <Switch checked={inputsTimeManually} onChange={setInputsTimeManually}>
          手動でタイムを入力
        </Switch>
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
        tw="text-center flex-1 flex flex-col justify-center"
        onTouchStart={(event) => {
          if (event.currentTarget === event.target) {
            onPointerDown();
          }
        }}
        onTouchEnd={(event) => {
          if (event.currentTarget === event.target) {
            onPointerUp();
          }
        }}
      >
        {inputsTimeManually ? (
          <TypingTimer
            prevTime={times.length > 0 ? times[times.length - 1] : undefined}
            onInput={onTypingTimerInput}
          />
        ) : (
          <Timer
            onTouchStart={onPointerDown}
            onTouchEnd={onPointerUp}
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
        {times.length > 0 && (
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
        )}
      </div>
      <Record
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
      />
      <Toast {...toastProps} />
    </div>
  );
};
