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
import { transformSessionGaps } from '@services/statsService';
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

  const raw = cache?.data ?? [];
  const {
    data: displayData,
    unit,
    domain: yDomain,
  } = transformSessionGaps(
    raw.map((gap) => ({
      day: gap.startedAt,
      seconds: gap.seconds,
    }))
  );

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
                value: unit.charAt(0).toUpperCase() + unit.slice(1),
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
