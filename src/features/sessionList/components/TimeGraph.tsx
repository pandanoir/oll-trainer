import { useMemo } from 'react';
import {
  ResponsiveContainer,
  LineChart,
  CartesianGrid,
  Legend,
  XAxis,
  YAxis,
  Tooltip,
  Line,
  Bar,
  BarChart,
} from 'recharts';
import { calcAo } from '../../../utils/calcAo';
import { calcRecord } from '../../../utils/calcRecord';
import { useDarkModeState } from '../../../utils/hooks/useDarkMode';
import { zip3 } from '../../../utils/zip3';
import { TimeData } from '../../timer/data/timeData';

export const TimeGraph = ({ times }: { times: TimeData[] }) => {
  const graphData = useMemo(
    () =>
      zip3(times, calcAo(5, times), calcAo(12, times)).map(
        ([{ time, isDNF, penalty }, ao5, ao12], index) => ({
          name: index + 1,
          time:
            isDNF === true
              ? null
              : Math.floor(time) / 1000 + (penalty === true ? 2 : 0),
          ao5: typeof ao5 === 'number' ? Math.floor(ao5) / 1000 : null,
          ao12: typeof ao12 === 'number' ? Math.floor(ao12) / 1000 : null,
        })
      ),
    [times]
  );

  const darkMode = useDarkModeState();
  return (
    <ResponsiveContainer width="100%" height="100%">
      <LineChart
        width={500}
        height={300}
        data={graphData}
        margin={{
          top: 5,
          right: 30,
          left: 20,
          bottom: 5,
        }}
      >
        <CartesianGrid strokeDasharray="3 3" />
        <Legend verticalAlign="top" />
        <XAxis dataKey="name" stroke={darkMode ? '#fff' : '#000'} />
        <YAxis dataKey="time" stroke={darkMode ? '#fff' : '#000'} />
        <Legend />
        <Tooltip
          contentStyle={{ background: darkMode ? '#1f2937' : '#fff' }}
          formatter={(value: number) => value.toFixed(3)}
        />
        <Line
          name="time"
          type="linear"
          dataKey="time"
          stroke={darkMode ? '#fff' : '#000'}
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
  );
};

export const TimeHistogram = ({
  times,
}: {
  times: Pick<TimeData, 'time' | 'isDNF' | 'penalty'>[];
}) => {
  const histogramData = useMemo(() => {
    const sortedTimes = times
      .map(calcRecord)
      .filter((x): x is Exclude<typeof x, '__dnf__'> => x !== '__dnf__')
      .map((msec) => msec)
      .sort((a, b) => a - b);
    const range = sortedTimes[sortedTimes.length - 1] - sortedTimes[0];

    // 4分割以上20分割未満になるように調整する
    const calcStep = (range: number) => {
      const step = Math.pow(10, Math.floor(Math.log10(range))) / 10;
      if (range / (step * 50) >= 4) {
        return step * 50;
      }
      if (range / (step * 10) >= 4) {
        return step * 10;
      }
      if (range / (step * 5) >= 4) {
        return step * 5;
      }
      if (range / step >= 5) {
        return step;
      }
      return step / 2;
    };
    if (range === 0) {
      return [
        { step: Math.ceil(sortedTimes[0]) / 1000, count: sortedTimes.length },
      ];
    }
    const step = calcStep(range);
    const histogram = [];
    const max = sortedTimes[sortedTimes.length - 1];
    for (
      let curStep = Math.ceil(sortedTimes[0] / step) * step, i = 0;
      i < sortedTimes.length && curStep <= Math.ceil(max / step) * step;
      curStep += step
    ) {
      let count = 0;
      while (i < sortedTimes.length && sortedTimes[i] <= curStep) {
        count++;
        i++;
      }
      histogram.push({ step: `~${curStep / 1000}`, count });
    }

    return histogram;
  }, [times]);
  const darkMode = useDarkModeState();

  return (
    <ResponsiveContainer width="100%" height="100%">
      <BarChart
        width={500}
        height={300}
        data={histogramData}
        margin={{
          top: 5,
          right: 30,
          left: 20,
          bottom: 5,
        }}
      >
        <Legend />
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="step" stroke={darkMode ? '#fff' : '#000'} />
        <YAxis dataKey="count" stroke={darkMode ? '#fff' : '#000'} />
        <Tooltip
          contentStyle={{ background: darkMode ? '#1f2937' : '#fff' }}
          formatter={(value: number) => value.toFixed(3)}
          cursor={darkMode ? { fill: '#555' } : true}
        />
        <Legend />
        <Bar dataKey="count" fill="#8884d8" />
      </BarChart>
    </ResponsiveContainer>
  );
};
