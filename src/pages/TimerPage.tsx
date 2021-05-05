import { useCallback, useEffect, useRef, useState, VFC } from 'react';
import { useHotkeys } from 'react-hotkeys-hook';
import SwiperCore, { Navigation, Keyboard } from 'swiper';
import { Swiper, SwiperSlide } from 'swiper/react';
import Scrambo from 'scrambo';

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
import { Times } from '../components/Timer/Times';
import { Switch } from '../components/Switch';
import { useTimer } from '../utils/hooks/useTimer';
import { useTimes } from '../utils/hooks/useTimes';

SwiperCore.use([Navigation, Keyboard]);

export const TimerPage: VFC = () => {
  const [scrambles, setScrambles] = useState<string[]>([]);
  const [index, setIndex] = useState(0);
  const [usesInspection, setUsesInspection] = useState(true);
  const [swiper, setControlledSwiper] = useState<SwiperCore>();

  const {
    times,
    changeToDNF,
    undoDNF,
    imposePenalty,
    undoPenalty,
    addTime,
  } = useTimes();

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
        addTime({ time, scramble: scrambles[index] });
        swiper?.slideNext();
      },
      [swiper, addTime]
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
              startTimer();
              break;
            default:
              exhaustiveCheck(timerState);
          }
          return;
        }
        if (type !== 'keydown') {
          return;
        }
        switch (timerState) {
          case READY:
          case STEADY:
          case INSPECTION_READY:
          case INSPECTION_STEADY:
            break;
          case IDOLING:
            if (!spacePressed.current) {
              if (usesInspection) {
                startInspection();
              } else {
                tapTimer();
              }
            }
            break;
          case INSPECTION:
            if (!spacePressed.current) {
              tapTimerInInspection();
            }
            break;
          case WORKING:
            finishTimer();
            break;
          default:
            exhaustiveCheck(timerState);
        }
        spacePressed.current = true;
      }
    },
    { keyup: true, keydown: true },
    [usesInspection, timerState]
  );
  return (
    <div className="w-full">
      <div className="font-bold text-3xl text-center">#{index + 1}</div>
      <Switch checked={usesInspection} onChange={setUsesInspection}>
        インスペクションを使用
      </Switch>
      <Swiper
        slidesOffsetAfter={27 * 2}
        onSlideChange={({ activeIndex }: { activeIndex: number }) =>
          setIndex(activeIndex)
        }
        keyboard
        spaceBetween={50}
        navigation
        onSwiper={setControlledSwiper}
      >
        {scrambles.map((scramble, index) => (
          <SwiperSlide key={index}>{scramble}</SwiperSlide>
        ))}
      </Swiper>
      <Timer timerState={timerState}>
        {timerState === INSPECTION ||
        timerState === INSPECTION_READY ||
        timerState === INSPECTION_STEADY
          ? Math.ceil(inspectionTime / 1000)
          : timerState === IDOLING && times.length > 0
          ? showTime(times[times.length - 1].time)
          : timerState === READY
          ? 'READY'
          : timerState === STEADY
          ? 'STEADY'
          : showTime(time)}
      </Timer>
      <Times
        times={times}
        changeToDNF={changeToDNF}
        imposePenalty={imposePenalty}
        undoDNF={undoDNF}
        undoPenalty={undoPenalty}
      />
    </div>
  );
};
