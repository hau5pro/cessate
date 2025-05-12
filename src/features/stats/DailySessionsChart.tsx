import {
  Bar,
  BarChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import { Box, Typography } from '@mui/material';

import BaseToggleButton from '@components/BaseToggleButton';
import BaseToggleButtonGroup from '@components/BaseToggleButtonGroup';
import { dayjs } from '@lib/dayjs';
import theme from '@themes/theme';
import { useStatsStore } from '@store/useStatsStore';

export default function DailySessionChart() {
  const { dailySessions, setDailySessionsRange } = useStatsStore();

  const selectedRange = dailySessions.selectedRange;
  const fullData = dailySessions.data;

  const filteredData = fullData.slice(-selectedRange); // last N days

  const handleRangeChange = (_: any, newValue: number | null) => {
    if (newValue !== null) {
      setDailySessionsRange(newValue);
    }
  };

  const defaultRanges = [7, 30];

  return (
    <Box>
      <Box mt={2} display="flex" justifyContent="space-between">
        <Typography variant="body2" sx={{ margin: 'auto 0' }} gutterBottom>
          Sessions per Day
        </Typography>
        <BaseToggleButtonGroup
          value={selectedRange}
          onChange={handleRangeChange}
        >
          {defaultRanges.map((range) => (
            <BaseToggleButton key={range} value={range}>
              {range} D
            </BaseToggleButton>
          ))}
        </BaseToggleButtonGroup>
      </Box>

      <Box height={300} minHeight={300} sx={{ pointerEvents: 'none' }}>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={filteredData}
            margin={{ top: 10, right: 0, left: 0, bottom: 0 }}
          >
            <XAxis
              dataKey="day"
              stroke={theme.palette.secondary.main}
              tickFormatter={(value) =>
                dayjs.utc(value).local().format('MMM DD')
              }
              tick={{ fontSize: 10 }}
            />
            <YAxis
              stroke={theme.palette.secondary.main}
              tick={{ fontSize: 10 }}
              allowDecimals={false}
              label={{
                value: 'Sessions',
                angle: -90,
                position: 'insideLeft',
                offset: 8,
                style: {
                  fill: theme.palette.secondary.main,
                  fontSize: 12,
                },
              }}
            />
            <Tooltip cursor={false} content={() => null} />
            <Bar dataKey="count" fill={theme.palette.primary.main} />
          </BarChart>
        </ResponsiveContainer>
      </Box>
    </Box>
  );
}
