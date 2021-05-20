import { Dispatch, SetStateAction } from 'react';
import { faAngleLeft, faAngleRight } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { SessionData } from './timeData';

export const RecordListHeader = ({
  sessionIndex,
  setSessionIndex,
  changeSessionName,
  resetScroll,
  sessions,
}: {
  sessionIndex: number;
  setSessionIndex: Dispatch<SetStateAction<number>>;
  changeSessionName: (name: string) => void;
  resetScroll: () => void;
  sessions: SessionData[];
}) => {
  return (
    <div className="sticky top-0 bg-white">
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
    </div>
  );
};
