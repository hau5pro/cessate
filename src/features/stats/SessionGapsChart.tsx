import { Box, Typography } from '@mui/material';
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

  const rawData =
    cache?.data.map((gap) => ({
      day: gap.startedAt,
      hours: +(gap.seconds / 3600).toFixed(2),
    })) ?? [];

  const maxHours = Math.max(...rawData.map((d) => d.hours), 0);
  let unit: 'minutes' | 'hours' | 'days' = 'hours';

  if (maxHours < 1) {
    unit = 'minutes';
  } else if (maxHours > 24) {
    unit = 'days';
  }

  const displayData = rawData.length
    ? rawData.map((d) => ({
        day: d.day,
        value:
          unit === 'minutes'
            ? +(d.hours * 60).toFixed(0)
            : unit === 'days'
              ? +(d.hours / 24).toFixed(2)
              : d.hours,
      }))
    : [{ day: dayjs().format('YYYY-MM-DD'), value: 0 }];

  const yDomain: [number, number] =
    unit === 'minutes'
      ? [0, Math.ceil(maxHours * 60 + 10)]
      : unit === 'days'
        ? [0, maxHours / 24 + 0.5]
        : [0, maxHours + 0.1];

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

      <Box height={300} sx={{ pointerEvents: 'none' }}>
        <ResponsiveContainer width="100%" height="100%">
          <LineChart
            data={displayData}
            margin={{ top: 10, right: 0, left: 0, bottom: 0 }}
          >
            <XAxis
              dataKey="day"
              stroke={theme.palette.secondary.main}
              tickFormatter={(value) => dayjs(value).format('MMM DD')}
              tick={{ fontSize: 12 }}
            />
            <YAxis
              domain={yDomain}
              stroke={theme.palette.secondary.main}
              tick={{ fontSize: 12 }}
              allowDecimals
              tickFormatter={(v) =>
                unit === 'minutes' ? `${v}` : v.toFixed(1)
              }
              label={{
                value:
                  unit === 'minutes'
                    ? 'Minutes'
                    : unit === 'days'
                      ? 'Days'
                      : 'Hours',
                angle: -90,
                position: 'insideLeft',
                style: {
                  fill: theme.palette.secondary.main,
                  fontSize: 12,
                },
              }}
            />
            <Tooltip cursor={false} content={() => null} />
            <Line
              type="monotone"
              dataKey="value"
              stroke={theme.palette.primary.main}
              strokeWidth={2}
              dot={{ r: 3 }}
              activeDot={{ r: 5 }}
              isAnimationActive={false}
            />
          </LineChart>
        </ResponsiveContainer>
      </Box>
    </Box>
  );
}
