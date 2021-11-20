import {
  faAngleRight,
  faDownload,
  faInfoCircle,
  faTimes,
  faUpload,
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
import 'twin.macro';
import { useIntl } from 'react-intl';
import { useTitle } from 'react-use';
import Scrambo from 'scrambo';
import SwiperCore, { Navigation, Keyboard } from 'swiper';
import { Swiper, SwiperSlide } from 'swiper/react';
import { IconButton } from '../components/common/IconButton';
import { useModal } from '../components/common/Modal';
import { PrimaryButton } from '../components/common/PrimaryButton';
import { SecondaryButton } from '../components/common/SecondaryButton';
import { Toast, useToast } from '../components/common/Toast';
import { ToggleButton } from '../components/common/ToggleButton';
import { ExportModal } from '../components/Timer/ExportModal';
import { ImportModal } from '../components/Timer/ImportModal';
import { RecordModifier } from '../components/Timer/RecordModifier';
import { StatisticsModal } from '../components/Timer/StatisticsModal';
import { Times } from '../components/Timer/Times';
import { VariationModal } from '../components/Timer/VariationModal';
import {
  defaultVariations,
  UserDefinedVariationContext,
} from '../data/variations';
import { Session } from '../features/sessionList/components/SessionToolbar';
import { Timer } from '../features/timer/components/Timer';
import { exhaustiveCheck } from '../utils/exhaustiveCheck';
import { useAudio } from '../utils/hooks/useAudio';
import { useStoragedState } from '../utils/hooks/useLocalStorage';
import { useSessions } from '../utils/hooks/useSessions';
import { isAwayFromBeginningElement } from '../utils/isAwayFromBeginningElement';
import { withPrefix } from '../utils/withPrefix';
import { withStopPropagation } from '../utils/withStopPropagation';
import '../swiper.css';
import './TimerPage.css';

const VARIATION_MODAL = 'VARIATION_MODAL';
const STATISTICS_MODAL = 'STATISTICS_MODAL';
const IMPORT_MODAL = 'IMPORT_MODAL';
const EXPORT_MODAL = 'EXPORT_MODAL';
type ModalType =
  | typeof VARIATION_MODAL
  | typeof STATISTICS_MODAL
  | typeof IMPORT_MODAL
  | typeof EXPORT_MODAL;

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
    importFromUserData,
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
    deleteAllSessionsByVariation,
  } = useSessions();
  const [, updateUserDefinedVariation] = useContext(
    UserDefinedVariationContext
  );
  const { times } = currentSessionCollection.sessions[sessionIndex];
  const { volume, setVolume } = useAudio();

  useEffect(() => {
    if (index + 3 >= scrambles.length) {
      const id = setTimeout(() => {
        setScrambles(scrambles.concat(new Scrambo().get(3)));
      }, 1000 / 60);
      return () => clearTimeout(id);
    }
  }, [index, scrambles]);

  const { openToast, closeToast, ...toastProps } = useToast();
  const [modalType, setModalType] = useState<ModalType | null>(null);
  const { openModal: _openModal, closeModal: _closeModal } = useModal();
  const openModal = useCallback(
    (modalType: ModalType) => {
      _openModal();
      setModalType(modalType);
    },
    [_openModal]
  );
  const closeModal = () => {
    _closeModal();
    setModalType(null);
  };

  return (
    <div tw="relative w-full flex flex-col flex-1 dark:bg-gray-800 dark:text-white">
      <div tw="flex space-x-1 px-3 overflow-x-auto items-center">
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
        <SecondaryButton onClick={() => openModal(IMPORT_MODAL)}>
          <FontAwesomeIcon icon={faDownload} /> import
        </SecondaryButton>
        <SecondaryButton onClick={() => openModal(EXPORT_MODAL)}>
          <FontAwesomeIcon icon={faUpload} /> export
        </SecondaryButton>
      </div>
      <Swiper
        slidesOffsetAfter={27 * 2}
        onSlideChange={useCallback(
          ({ activeIndex }) => setIndex(activeIndex),
          []
        )}
        keyboard
        spaceBetween={50}
        navigation
        onSwiper={setControlledSwiper}
        style={useMemo(
          () => ({
            zIndex: 10,
          }),
          []
        )}
      >
        {useMemo(
          () =>
            scrambles.map((scramble, index) => (
              <SwiperSlide key={index}>{scramble}</SwiperSlide>
            )),
          [scrambles]
        )}
      </Swiper>
      <Timer
        usesInspection={usesInspection}
        inputsTimeManually={inputsTimeManually}
        times={times}
        onFinish={useCallback(
          (data) => {
            addTime({
              ...data,
              scramble: scrambles[index],
              date: Temporal.now.instant().epochMilliseconds,
            });
            swiper?.slideNext();
          },
          [addTime, index, scrambles, swiper]
        )}
        onTypingTimerInput={useCallback(
          (secTime) => {
            addTime({
              time: secTime * 1000,
              scramble: scrambles[index],
              date: Temporal.now.instant().epochMilliseconds,
            });
            swiper?.slideNext();
          },
          [addTime, scrambles, index, swiper]
        )}
        variationChooseButton={useMemo(
          () => (
            <PrimaryButton
              tw="absolute top-1.5 left-2 px-5 py-0"
              onTouchEnd={(event) => {
                if (isAwayFromBeginningElement(event)) {
                  return;
                }
                event.stopPropagation();
                openModal(VARIATION_MODAL);
              }}
              onClick={withStopPropagation(() => openModal(VARIATION_MODAL))}
            >
              {variationName}
            </PrimaryButton>
          ),
          [openModal, variationName]
        )}
        statisticsButton={useMemo(
          () => (
            <IconButton
              icon={faInfoCircle}
              title="session list"
              tw="absolute top-1.5 right-2 px-2 py-1 text-lg"
              onTouchEnd={(event) => {
                if (isAwayFromBeginningElement(event)) {
                  return;
                }
                event.stopPropagation();
                openModal(STATISTICS_MODAL);
              }}
              onClick={() => openModal(STATISTICS_MODAL)}
            />
          ),
          [openModal]
        )}
        recordModifier={useMemo(
          () => (
            <RecordModifier
              tw="lg:text-lg"
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
          ),
          [
            changeToDNF,
            closeToast,
            deleteRecord,
            formatMessage,
            imposePenalty,
            insertRecord,
            openToast,
            times,
            undoDNF,
            undoPenalty,
          ]
        )}
      />
      <Session
        times={times}
        sessionIndex={sessionIndex}
        setSessionIndex={setSessionIndex}
        currentVariation={variationName}
        changeSessionName={changeSessionName}
        sessions={sessions}
        addSession={addSession}
        deleteSession={deleteSession}
        recordListComponent={useMemo(
          () => (
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
          ),
          [
            changeToDNF,
            deleteRecord,
            imposePenalty,
            insertRecord,
            times,
            undoDNF,
            undoPenalty,
          ]
        )}
      />
      <Toast {...toastProps} />

      {modalType === VARIATION_MODAL ? (
        <VariationModal onClose={closeModal}>
          <ul
            tw="flex-1 overflow-y-auto grid gap-y-1"
            css="grid-template-columns: max-content minmax(0, 1fr) max-content;"
          >
            {defaultVariations.map((variation) => (
              <li
                tw="contents lg:mr-6 text-lg cursor-pointer"
                key={variation.name}
                onClick={() => {
                  setVariation(variation);
                  closeModal();
                }}
              >
                <span tw="contents hover:text-hover hover:dark:text-hover-dark">
                  <span tw="border-b px-2">
                    {variation.name === variationName && (
                      <FontAwesomeIcon icon={faAngleRight} />
                    )}
                  </span>
                  <span tw="border-b">{variation.name}</span>
                  <span tw="border-b" />
                </span>
              </li>
            ))}
            {userDefinedVariation.map((variation) => (
              <li tw="contents lg:mr-6 text-lg" key={variation.name}>
                <span
                  tw="contents border-b cursor-pointer hover:text-hover hover:dark:text-hover-dark"
                  onClick={() => {
                    setVariation(variation);
                    closeModal();
                  }}
                >
                  <span tw="text-center border-b px-2">
                    {variation.name === variationName && (
                      <FontAwesomeIcon icon={faAngleRight} />
                    )}
                  </span>
                  <span tw="border-b">{variation.name}</span>
                </span>
                <span tw="cursor-pointer border-b hover:dark:text-hover-dark">
                  <IconButton
                    tw="px-3"
                    icon={faTimes}
                    onClick={() => {
                      if (
                        confirm(
                          `「${variation.name}」を削除しますか?${variation.name}のデータもすべて削除されます。`
                        )
                      ) {
                        deleteAllSessionsByVariation(variation);
                        updateUserDefinedVariation((draft) =>
                          draft.filter((item) => item.name !== variation.name)
                        );
                      }
                    }}
                  />
                </span>
              </li>
            ))}
          </ul>
        </VariationModal>
      ) : modalType === STATISTICS_MODAL ? (
        <StatisticsModal sessions={sessions} onClose={closeModal} />
      ) : modalType === IMPORT_MODAL ? (
        <ImportModal
          onClose={closeModal}
          importSessionCollection={importFromUserData}
          setVariation={setVariation}
        />
      ) : modalType === EXPORT_MODAL ? (
        <ExportModal
          onClose={closeModal}
          getSetting={() => ({
            sessions,
            settings: {
              variation: variationName,
              userDefinedVariation,
            },
          })}
        />
      ) : modalType == null ? null : (
        exhaustiveCheck(modalType)
      )}
    </div>
  );
};
