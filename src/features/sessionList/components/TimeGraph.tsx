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
} from 'recharts';
import { calcAo } from '../../../utils/calcAo';
import { useDarkModeState } from '../../../utils/hooks/useDarkMode';
import { zip3 } from '../../../utils/zip3';
import { TimeData } from '../../timer/data/timeData';

export const TimeGraph = ({ times }: { times: TimeData[] }) => {
  const graphData = useMemo(
    () =>
      zip3(times, calcAo(5, times), calcAo(12, times)).map(
        ([{ time, isDNF, penalty }, ao5, ao12], index) => ({
          name: index + 1,
          time: isDNF ? null : Math.floor(time) / 1000 + (penalty ? 2 : 0),
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
