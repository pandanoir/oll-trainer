import {
  faAngleRight,
  faLock,
  faTimes,
  faUnlock,
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { VFC } from 'react';
import 'twin.macro';

import { IconButton } from '../../../components/common/IconButton';
import { calcAverage } from '../../../utils/calcAverage';
import { calcRecord } from '../../../utils/calcRecord';
import { findIndexOfMin } from '../../../utils/findIndexOfMin';
import { showTime } from '../../../utils/showTime';
import { SessionData, DNF } from '../../timer/data/timeData';
import { useLockSession, useUnlockSession } from '../hooks/useSessions';

export const SessionListItem: VFC<{
  session: SessionData;
  onDeleteButtonClick: () => void;
  sessionIndex: number;
  onClick: () => void;
  selected: boolean;
}> = ({
  session: { times, name, isLocked },
  sessionIndex,
  onDeleteButtonClick,
  onClick,
  selected,
}) => {
  const timesWithoutDNF = times
    .map(calcRecord)
    .filter((x): x is Exclude<typeof x, typeof DNF> => x !== DNF);
  const lockSession = useLockSession(),
    unlockSession = useUnlockSession();

  const bestTime =
    timesWithoutDNF.length > 0
      ? showTime(timesWithoutDNF[findIndexOfMin(timesWithoutDNF)])
      : '-';
  const averageTime =
    timesWithoutDNF.length > 0 ? showTime(calcAverage(timesWithoutDNF)) : '-';
  return (
    <li tw="px-3 pb-1 pt-3 lg:mr-6 text-lg flex justify-between items-center border-b space-x-3">
      <button
        tw="text-left flex-1 overflow-hidden whitespace-nowrap cursor-pointer hover:text-hover hover:dark:text-hover-dark"
        onClick={onClick}
      >
        <span tw="w-3 inline-block">
          {selected && <FontAwesomeIcon icon={faAngleRight} />}
        </span>
        {name}
      </button>
      <span tw="grid grid-rows-4 md:flex md:space-x-2 text-sm md:text-base">
        {isLocked ? (
          <IconButton
            icon={faLock}
            tw="px-1"
            title="unlock session"
            onClick={() => unlockSession(sessionIndex)}
          />
        ) : (
          <IconButton
            icon={faUnlock}
            tw="px-1"
            title="lock session"
            onClick={() => lockSession(sessionIndex)}
          />
        )}
        <span>
          {times.length} <span tw="text-sm">SOLVES</span>
        </span>
        <span>
          <span tw="text-sm">BEST</span>:{' '}
          <span tw="text-blue-600 dark:text-blue-400">{bestTime}</span>
        </span>
        <span>
          <span tw="text-sm">AVG</span>:{' '}
          <span tw="text-red-700 dark:text-red-500">{averageTime}</span>
        </span>
      </span>
      <span>
        <IconButton
          title="delete session"
          icon={faTimes}
          onClick={onDeleteButtonClick}
        />
      </span>
    </li>
  );
};
