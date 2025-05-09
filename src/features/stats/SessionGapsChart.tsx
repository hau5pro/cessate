import { Box, Typography, alpha } from '@mui/material';
import {
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';

import BaseToggleButton from '@components/BaseToggleButton';
import BaseToggleButtonGroup from '@components/BaseToggleButtonGroup';
import dayjs from 'dayjs';
import theme from '@themes/theme';
import { useStatsStore } from '@store/useStatsStore';

export default function SessionGapsChart() {
  const { sessionGaps, setSessionGapsRange } = useStatsStore();

  const selectedRange = sessionGaps.selectedRange;
  const cache = sessionGaps.cache[selectedRange];

  const handleRangeChange = (_: any, newValue: number | null) => {
    if (newValue !== null) {
      setSessionGapsRange(newValue);
    }
  };

  const defaultRanges = [7, 30];

  // Format the data to display hours
  const data =
    cache?.data.map((gap) => ({
      day: gap.startedAt,
      hours: +(gap.seconds / 3600).toFixed(2),
    })) ?? [];

  return (
    <Box mt={4}>
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        mb={1}
      >
        <Typography variant="body1">Time Between Sessions</Typography>
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
          <LineChart
            data={data}
            margin={{ top: 10, right: 0, left: -40, bottom: 0 }}
          >
            <XAxis
              dataKey="day"
              stroke={theme.palette.secondary.main}
              tickFormatter={(value) => dayjs(value).format('MMM DD')}
              tick={{ fontSize: 12 }}
            />
            <YAxis
              stroke={theme.palette.secondary.main}
              tick={{ fontSize: 12 }}
              label={{
                value: 'Hours',
                angle: -90,
                position: 'insideLeft',
                fill: theme.palette.secondary.main,
              }}
            />
            <Tooltip
              cursor={{ fill: alpha(theme.palette.secondary.main, 0.1) }}
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
              formatter={(value: number) => [`${value} hrs`]}
            />
            <Line
              type="monotone"
              dataKey="hours"
              stroke={theme.palette.primary.main}
              strokeWidth={2}
              dot={{ r: 3 }}
              activeDot={{ r: 5 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </Box>
    </Box>
  );
}
