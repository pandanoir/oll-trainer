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
import { useDarkModeState } from '../../utils/hooks/useDarkMode';

export const TimeGraph = ({
  times,
}: {
  times: {
    name: number;
    time: null | number;
    ao5: null | number;
    ao12: null | number;
  }[];
}) => {
  const darkMode = useDarkModeState();
  return (
    <ResponsiveContainer width="100%" height="100%">
      <LineChart
        width={500}
        height={300}
        data={times}
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
        <Tooltip contentStyle={{ background: darkMode ? '#1f2937' : '#fff' }} />
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
