import {
  Bar,
  BarChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import { Box, Typography, alpha } from '@mui/material';

import BaseToggleButton from '@components/BaseToggleButton';
import BaseToggleButtonGroup from '@components/BaseToggleButtonGroup';
import dayjs from 'dayjs';
import theme from '@themes/theme';
import { useStatsStore } from '@store/useStatsStore';

export default function DailySessionChart() {
  const { dailySessions, setDailySessionsRange } = useStatsStore();

  const selectedRange = dailySessions.selectedRange;
  const cache = dailySessions.cache[selectedRange];

  const handleRangeChange = (_: any, newValue: number | null) => {
    if (newValue !== null) {
      setDailySessionsRange(newValue);
    }
  };

  const defaultRanges = [7, 30];

  return (
    <Box>
      <Box mt={2} display="flex" justifyContent="space-between">
        <Typography variant="body1" gutterBottom>
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
      <Box height={300}>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={cache?.data || []}
            margin={{ top: 10, right: 0, left: -40, bottom: 0 }}
          >
            <XAxis
              stroke={theme.palette.secondary.main}
              dataKey="day"
              tickFormatter={(value) => dayjs(value).format('MMM DD')}
              tick={{ fontSize: 12 }}
            />
            <YAxis
              stroke={theme.palette.secondary.main}
              allowDecimals={false}
              tick={{ fontSize: 12 }}
            />
            <Tooltip
              cursor={{ fill: 'rgba(0, 0, 0, 0.1)' }}
              contentStyle={{
                backgroundColor: 'rgba(0, 0, 0, 0.1)',
                backdropFilter: 'blur(10px)',
                border: `1px solid ${alpha(theme.palette.secondary.main, 0.5)}`,
                boxShadow: '0 4px 30px rgba(0, 0, 0, 0.2)',
              }}
              labelStyle={{
                textAlign: 'center',
                color: theme.palette.secondary.main,
              }}
              itemStyle={{
                textAlign: 'center',
                color: theme.palette.common.white,
              }}
              labelFormatter={(label) => dayjs(label).format('MMM DD')}
              formatter={(value: number) => [`${value} sessions`]}
            />
            <Bar dataKey="count" fill={theme.palette.primary.main} />
          </BarChart>
        </ResponsiveContainer>
      </Box>
    </Box>
  );
}
