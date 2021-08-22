import {
  faAngleRight,
  faInfoCircle,
  faVolumeMute,
  faVolumeUp,
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Temporal } from 'proposal-temporal';
import {
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  VFC,
} from 'react';
import { useIntl } from 'react-intl';
import Scrambo from 'scrambo';
import SwiperCore, { Navigation, Keyboard } from 'swiper';
import { Swiper, SwiperSlide } from 'swiper/react';
import tw from 'twin.macro';

import { IconButton } from '../components/common/IconButton';
import { useModal } from '../components/common/Modal';
import { PrimaryButton } from '../components/common/PrimaryButton';
import { Toast, useToast } from '../components/common/Toast';
import { ToggleButton } from '../components/common/ToggleButton';
import { ExportButton } from '../components/Timer/ExportButton';
import { FileInput } from '../components/Timer/FileInput';
import { RecordItem } from '../components/Timer/RecordItem';
import { RecordModifier } from '../components/Timer/RecordModifier';
import { Session } from '../components/Timer/Session';
import { StatisticsModal } from '../components/Timer/StatisticsModal';
import { TapTimer } from '../components/Timer/TapTimer';
import { TimerArea } from '../components/Timer/TimerArea';
import { TimerCover } from '../components/Timer/TimerCover';
import {
  IDOLING,
  STEADY,
  READY,
  INSPECTION,
  INSPECTION_READY,
  INSPECTION_STEADY,
  WORKING,
} from '../components/Timer/timerState';
import { Times } from '../components/Timer/Times';
import { TypingTimer } from '../components/Timer/TypingTimer';
import { VariationModal } from '../components/Timer/VariationModal';
import {
  defaultVariations,
  UserDefinedVariationContext,
} from '../data/variations';

import eightSecondsSoundUrl from '../sound/eightSeconds.mp3';
import steadySoundUrl from '../sound/steady.mp3';
import twelveSecondsSoundUrl from '../sound/twelveSeconds.mp3';
import { calcAo } from '../utils/calcAo';
import { useAudio } from '../utils/hooks/useAudio';
import { useCubeTimer } from '../utils/hooks/useCubeTimer';
import { useStoragedState } from '../utils/hooks/useLocalStorage';
import { useSessions } from '../utils/hooks/useSessions';
import { useTitle } from '../utils/hooks/useTitle';
import { isAwayFromBeginningElement } from '../utils/isAwayFromBeginningElement';
import { playSilence } from '../utils/playAudio';
import { showAverage } from '../utils/showAverage';
import { showTime } from '../utils/showTime';
import { toCsTimer } from '../utils/toCsTimer';
import { withPrefix } from '../utils/withPrefix';
import { withStopPropagation } from '../utils/withStopPropagation';

import '../swiper.css';
import './TimerPage.css';

const steadySound = fetch(steadySoundUrl).then((response) =>
  response.arrayBuffer()
);
const eightSecondsSound = fetch(eightSecondsSoundUrl).then((response) =>
  response.arrayBuffer()
);
const twelveSecondsSound = fetch(twelveSecondsSoundUrl).then((response) =>
  response.arrayBuffer()
);

const VARIATION_MODAL = 'VARIATION_MODAL';
const STATISTICS_MODAL = 'STATISTICS_MODAL';
type ModalType = typeof VARIATION_MODAL | typeof STATISTICS_MODAL;

SwiperCore.use([Navigation, Keyboard]);

export const TimerPage: VFC = () => {
  useTitle('Hi-Timer');
  const { formatMessage } = useIntl();
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
  const [userDefinedVariation] = useContext(UserDefinedVariationContext);

  const {
    sessions,
    currentSessionCollection,
    sessionIndex,
    variationName,
    setSessionIndex,
    setVariation,
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
  const { times } = currentSessionCollection.sessions[sessionIndex];
  const { volume, setVolume, playAudio } = useAudio();

  const ao5 = useMemo(() => calcAo(5, times.slice(-5)).pop() || null, [times]);
  const ao12 = useMemo(
    () => calcAo(12, times.slice(-12)).pop() || null,
    [times]
  );

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
          date: Temporal.now.instant().epochMilliseconds,
        });
        swiper?.slideNext();
      },
      [addTime, index, scrambles, swiper]
    ),
  });
  const inspectionTimeInteger = Math.ceil(inspectionTime / 1000);
  useEffect(() => {
    (async () => {
      if (timerState === STEADY || timerState === INSPECTION_STEADY) {
        playAudio(await steadySound);
      }
    })();
  }, [playAudio, timerState]);

  // インスペクションの経過時間に応じて効果音を鳴らす
  useEffect(() => {
    (async () => {
      if (15 - inspectionTimeInteger === 8) {
        playAudio(await eightSecondsSound);
      }
      if (15 - inspectionTimeInteger === 12) {
        playAudio(await twelveSecondsSound);
      }
    })();
  }, [inspectionTimeInteger, playAudio, timerState]);

  const { openToast, closeToast, ...toastProps } = useToast();
  const [modalType, setModalType] = useState<ModalType | null>(null);
  const { openModal, closeModal: _closeModal } = useModal();
  const openVariationModal = () => {
    openModal();
    setModalType(VARIATION_MODAL);
  };
  const openStatisticsModal = () => {
    openModal();
    setModalType(STATISTICS_MODAL);
  };
  const closeModal = () => {
    _closeModal();
    setModalType(null);
  };

  const onTypingTimerInput = useCallback(
    (secTime) => {
      addTime({
        time: secTime * 1000,
        scramble: scrambles[index],
        date: Temporal.now.instant().epochMilliseconds,
      });
      swiper?.slideNext();
    },
    [addTime, scrambles, index, swiper]
  );

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
        <IconButton
          tw="inline-block cursor-pointer select-none px-2"
          icon={volume === 1 ? faVolumeUp : faVolumeMute}
          onClick={() => setVolume((n) => 1 - n)}
        />
        <ToggleButton checked={usesInspection} onChange={setUsesInspection}>
          {formatMessage({
            id: 's3DHhX',
            description: 'ボタン。インスペクションを使用するか選択する',
            defaultMessage: 'インスペクションを使用',
          })}
        </ToggleButton>
        <ToggleButton
          checked={inputsTimeManually}
          onChange={setInputsTimeManually}
        >
          {formatMessage({
            id: 'Fbp3x5',
            description: 'ボタン。手動でタイムを入力するかどうか選択する',
            defaultMessage: '手動でタイムを入力',
          })}
        </ToggleButton>
        <FileInput onChange={importFromCsTimer} />
        <ExportButton getContent={() => JSON.stringify(toCsTimer(sessions))}>
          {formatMessage({
            id: 'PhOg3j',
            description: 'ボタン。ファイルをエクスポートする',
            defaultMessage: 'ファイルをエクスポート',
          })}
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
        cover={
          <TimerCover
            onPointerDown={() => {
              if (volume > 0) {
                playSilence();
              }
              onPointerDown();
            }}
            onPointerUp={onPointerUp}
            disabled={inputsTimeManually}
            transparent={timerState === IDOLING}
          />
        }
      >
        <PrimaryButton
          tw="absolute top-1.5 left-2 px-5 py-0"
          onTouchEnd={(event) => {
            if (isAwayFromBeginningElement(event)) {
              return;
            }
            event.stopPropagation();
            openVariationModal();
          }}
          onClick={withStopPropagation(openVariationModal)}
        >
          {variationName}
        </PrimaryButton>
        <IconButton
          icon={faInfoCircle}
          title="session list"
          tw="absolute top-1.5 right-2 px-2 py-1 text-lg"
          onTouchEnd={(event) => {
            if (isAwayFromBeginningElement(event)) {
              return;
            }
            event.stopPropagation();
            openStatisticsModal();
          }}
          onClick={openStatisticsModal}
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
                    title: formatMessage({
                      id: 'nWPbmS',
                      description:
                        'トースト。タイムを削除するときに出すメッセージ。',
                      defaultMessage: '削除しました',
                    }),
                    buttonLabel: formatMessage({
                      id: 'MyF1FU',
                      description:
                        'トースト。タイムを削除したあと元に戻すためのボタン。',
                      defaultMessage: '元に戻す',
                    }),
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
        sessionIndex={sessionIndex}
        setSessionIndex={setSessionIndex}
        currentVariation={variationName}
        changeSessionName={changeSessionName}
        sessions={sessions}
        addSession={addSession}
        deleteSession={deleteSession}
        recordListComponent={
          <div tw="pt-12">
            <Times
              times={times}
              changeToDNF={changeToDNF}
              imposePenalty={imposePenalty}
              undoDNF={undoDNF}
              undoPenalty={undoPenalty}
              deleteRecord={deleteRecord}
              insertRecord={insertRecord}
            />
          </div>
        }
      />
      <Toast {...toastProps} />

      {modalType === VARIATION_MODAL ? (
        <VariationModal onClose={closeModal}>
          {[...defaultVariations, ...userDefinedVariation].map((variation) => (
            <li
              tw="px-3 pb-1 pt-3 lg:mr-6 text-lg border-b cursor-pointer hover:text-hover hover:dark:text-hover-dark"
              key={variation.name}
              onClick={() => {
                setVariation(variation);
                closeModal();
              }}
            >
              {variation.name === variationName ? (
                <span tw="pr-1">
                  <FontAwesomeIcon icon={faAngleRight} />
                </span>
              ) : (
                <span tw="w-3 inline-block" />
              )}
              {variation.name}
            </li>
          ))}
        </VariationModal>
      ) : modalType === STATISTICS_MODAL ? (
        <StatisticsModal sessions={sessions} onClose={closeModal} />
      ) : null}
    </div>
  );
};
