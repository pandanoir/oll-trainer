import {
  ButtonHTMLAttributes,
  Dispatch,
  SetStateAction,
  useMemo,
  useRef,
  useState,
} from 'react';
import {
  ResponsiveContainer,
  LineChart,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  Line,
} from 'recharts';
import {
  faAngleLeft,
  faAngleRight,
  faPlus,
  faChartBar,
  faAngleDown,
  faAngleUp,
  faServer,
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import tw from 'twin.macro';
import { calcAo } from '../../utils/calcAo';
import { RecordListHeader } from './RecordListHeader';
import { TimeData, SessionData } from './timeData';
import { Times } from './Times';
import { IconProp } from '@fortawesome/fontawesome-svg-core';

const IconButton = ({
  icon,
  ...props
}: { icon: IconProp } & ButtonHTMLAttributes<HTMLButtonElement>) => (
  <button {...props}>
    <FontAwesomeIcon icon={icon} />
  </button>
);
const AngleLeftButton = ({
  onClick,
  disabled = false,
}: {
  onClick: () => void;
  disabled?: boolean;
}) => (
  <button
    css={[tw`px-3`, disabled ? tw`text-gray-400` : '']}
    disabled={disabled}
    onClick={onClick}
  >
    <FontAwesomeIcon icon={faAngleLeft} />
  </button>
);
const AngleRightButton = ({
  onClick,
  disabled = false,
}: {
  onClick: () => void;
  disabled?: boolean;
}) => (
  <button
    css={[tw`px-3`, disabled ? tw`text-gray-400` : '']}
    disabled={disabled}
    onClick={onClick}
  >
    <FontAwesomeIcon icon={faAngleRight} />
  </button>
);
const PlusButton = ({ onClick }: { onClick: () => void }) => (
  <button tw="px-1.5 text-white bg-gray-700 rounded" onClick={onClick}>
    <FontAwesomeIcon icon={faPlus} />
  </button>
);
export const Session = ({
  times,
  changeToDNF,
  imposePenalty,
  undoDNF,
  undoPenalty,
  deleteRecord,
  insertRecord,

  sessionIndex,
  setSessionIndex,
  changeSessionName,
  sessions,
  addSession,
}: {
  times: TimeData[];
  changeToDNF: (index: number) => void;
  undoDNF: (index: number) => void;
  imposePenalty: (index: number) => void;
  undoPenalty: (index: number) => void;
  deleteRecord: (index: number) => TimeData;
  insertRecord: (index: number, record: TimeData) => void;

  sessionIndex: number;
  setSessionIndex: Dispatch<SetStateAction<number>>;
  changeSessionName: (name: string) => void;
  sessions: SessionData[];
  addSession: () => void;
}) => {
  const recordListRef = useRef<HTMLDivElement>(null);
  const [opensRecordList, setOpensRecordList] = useState(false);
  const ao5List = useMemo(() => calcAo(5, times), [times]);
  const ao12List = useMemo(() => calcAo(12, times), [times]);

  const [showsGraph, setShowsGraph] = useState(false);

  const resetScroll = () => {
    if (recordListRef.current) {
      recordListRef.current.scrollTo(0, 0);
    }
  };
  return (
    <div
      css={[
        opensRecordList
          ? [tw`h-4/5`, showsGraph ? '' : tw`overflow-y-scroll`]
          : [tw`h-6 overflow-y-hidden`],
        tw`w-full absolute z-30 bottom-0 flex flex-col bg-white border-t-2 border-gray-200`,
        tw`transition-all duration-300`,
      ]}
      ref={recordListRef}
    >
      <RecordListHeader
        left={
          <div>
            <AngleLeftButton
              disabled={sessionIndex <= 0}
              onClick={() => {
                setSessionIndex((index) => index - 1);
                resetScroll();
              }}
            />
            <input
              value={sessions[sessionIndex].name}
              onChange={({ target: { value } }) => changeSessionName(value)}
            />
            <AngleRightButton
              disabled={sessionIndex + 1 >= sessions.length}
              onClick={() => {
                setSessionIndex((index) => index + 1);
                resetScroll();
              }}
            />
            <PlusButton
              onClick={() => {
                addSession();
                if (sessions.length - 1 === sessionIndex) {
                  setSessionIndex(sessions.length);
                }
              }}
            />
          </div>
        }
        right={
          <div>
            {showsGraph ? (
              <IconButton
                onClick={() => setShowsGraph(false)}
                icon={faServer}
              />
            ) : (
              <IconButton
                onClick={() => setShowsGraph(true)}
                icon={faChartBar}
              />
            )}
            <IconButton
              tw="px-2"
              onClick={() => setOpensRecordList((open) => !open)}
              icon={opensRecordList ? faAngleDown : faAngleUp}
            />
          </div>
        }
      />
      <div tw="flex-1">
        {showsGraph ? (
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              width={500}
              height={300}
              data={times.map(({ time, isDNF, penalty }, index) => {
                const ao5 = ao5List[index],
                  ao12 = ao12List[index];
                return {
                  name: index + 1,
                  time: isDNF ? null : time / 1000 + (penalty ? 2 : 0),
                  ao5: typeof ao5 === 'number' ? ao5 / 1000 : null,
                  ao12: typeof ao12 === 'number' ? ao12 / 1000 : null,
                };
              })}
              margin={{
                top: 5,
                right: 30,
                left: 20,
                bottom: 5,
              }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <Legend verticalAlign="top" />
              <XAxis dataKey="name" />
              <YAxis dataKey="time" />
              <Legend />
              <Tooltip />
              <Line
                name="time"
                type="linear"
                dataKey="time"
                stroke="#000"
                dot={false}
              />
              <Line
                name="ao5"
                type="linear"
                dataKey="ao5"
                stroke="#3b82f6"
                dot={false}
                strokeDasharray="4"
              />
              <Line
                name="ao12"
                type="linear"
                dataKey="ao12"
                stroke="#db2777"
                dot={false}
                strokeDasharray="2 2"
              />
            </LineChart>
          </ResponsiveContainer>
        ) : (
          <Times
            times={times}
            changeToDNF={changeToDNF}
            imposePenalty={imposePenalty}
            undoDNF={undoDNF}
            undoPenalty={undoPenalty}
            deleteRecord={deleteRecord}
            insertRecord={insertRecord}
          />
        )}
      </div>
    </div>
  );
};
