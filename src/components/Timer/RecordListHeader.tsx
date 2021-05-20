import { Dispatch, SetStateAction } from 'react';
import {
  faAngleDown,
  faAngleLeft,
  faAngleRight,
  faAngleUp,
  faPlus,
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { SessionData } from './timeData';

export const RecordListHeader = ({
  sessionIndex,
  setSessionIndex,
  changeSessionName,
  resetScroll,
  sessions,
  open,
  onOpenButtonClick,
  addSession,
}: {
  sessionIndex: number;
  setSessionIndex: Dispatch<SetStateAction<number>>;
  changeSessionName: (name: string) => void;
  resetScroll: () => void;
  sessions: SessionData[];
  open: boolean;
  onOpenButtonClick: () => void;
  addSession: () => void;
}) => {
  return (
    <div className="sticky top-0 bg-white flex justify-between">
      <div>
        <button
          className={`px-3 ${sessionIndex > 0 ? '' : 'text-gray-400'}`}
          disabled={sessionIndex <= 0}
          onClick={() => {
            setSessionIndex((index) => index - 1);
            resetScroll();
          }}
        >
          <FontAwesomeIcon icon={faAngleLeft} />
        </button>
        <input
          value={sessions[sessionIndex].name}
          onChange={({ target: { value } }) => changeSessionName(value)}
        />
        <button
          className={`px-3 ${
            sessionIndex + 1 < sessions.length ? '' : 'text-gray-400'
          }`}
          disabled={sessionIndex + 1 >= sessions.length}
          onClick={() => {
            setSessionIndex((index) => index + 1);
            resetScroll();
          }}
        >
          <FontAwesomeIcon icon={faAngleRight} />
        </button>
        <button
          className="px-2 text-white bg-gray-400 rounded"
          onClick={addSession}
        >
          <FontAwesomeIcon icon={faPlus} />
        </button>
      </div>
      <div>
        <button className="px-2" onClick={onOpenButtonClick}>
          <FontAwesomeIcon icon={open ? faAngleDown : faAngleUp} />
        </button>
      </div>
    </div>
  );
};
