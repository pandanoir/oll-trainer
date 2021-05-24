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
  <IconButton
    css={[tw`px-3 py-1 text-lg`, disabled ? tw`text-gray-400` : '']}
    disabled={disabled}
    onClick={onClick}
    icon={faAngleLeft}
  />
);
const AngleRightButton = ({
  onClick,
  disabled = false,
}: {
  onClick: () => void;
  disabled?: boolean;
}) => (
  <IconButton
    css={[tw`px-3 py-1 text-lg`, disabled ? tw`text-gray-400` : '']}
    disabled={disabled}
    onClick={onClick}
    icon={faAngleRight}
  />
);
const PlusButton = ({ onClick }: { onClick: () => void }) => (
  <IconButton
    tw="px-1.5 text-lg text-white bg-gray-700 rounded"
    onClick={onClick}
    icon={faPlus}
  />
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
      css={[tw`w-full absolute z-30 bottom-0 flex flex-col overflow-hidden`]}
      ref={recordListRef}
    >
      <div
        css={[
          tw`bg-white w-full`,
          opensRecordList
            ? [
                tw`h-96 border-t-2 border-gray-200`,
                showsGraph ? '' : tw`overflow-x-hidden overflow-y-auto`,
              ]
            : tw`h-0 overflow-hidden`,
          tw`transition-height duration-300`,
        ]}
      >
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
              tw="w-36"
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
                tw="px-2 py-1 text-lg"
                onClick={() => setShowsGraph(false)}
                icon={faServer}
              />
            ) : (
              <IconButton
                tw="px-2 py-1 text-lg"
                onClick={() => setShowsGraph(true)}
                icon={faChartBar}
              />
            )}
            <IconButton
              css={[
                tw`px-2 py-1 text-lg`,
                tw`transform transition-all duration-300`,
                opensRecordList ? tw`-rotate-180` : tw`rotate-0`,
              ]}
              onClick={() => setOpensRecordList((open) => !open)}
              icon={faAngleUp}
            />
          </div>
        }
      />
    </div>
  );
};
