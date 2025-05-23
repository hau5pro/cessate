import { Box, Typography } from '@mui/material';
import {
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import { useEffect, useState } from 'react';

import BaseToggleButton from '@components/BaseToggleButton';
import BaseToggleButtonGroup from '@components/BaseToggleButtonGroup';
import { dayjs } from '@lib/dayjs';
import theme from '@themes/theme';
import { transformSessionGaps } from '@services/statsService';
import { useStatsStore } from '@store/useStatsStore';

export default function SessionGapsChart() {
  const { sessionGaps, setSessionGapsRange } = useStatsStore();
  const [showChart, setShowChart] = useState(false);

  const selectedRange = sessionGaps.selectedRange;
  const fullData = sessionGaps.data;

  const sliced = fullData.slice(-selectedRange);
  const transformed = transformSessionGaps(sliced);

  const { data: displayData, unit, domain: yDomain } = transformed;

  const handleRangeChange = (_: any, newValue: number | null) => {
    if (newValue !== null) {
      setSessionGapsRange(newValue);
    }
  };

  const defaultRanges = [7, 30];
  const animationDelay = 400;

  useEffect(() => {
    setShowChart(false);
    const timer = setTimeout(() => setShowChart(true), animationDelay);
    return () => clearTimeout(timer);
  }, [selectedRange]);

  return (
    <Box mt={4}>
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        mb={1}
      >
        <Typography variant="body2" sx={{ margin: 'auto 0' }}>
          Time Between Sessions
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

      <Box
        sx={{
          height: { xs: 200, sm: 300 },
          minHeight: { xs: 200, sm: 300 },
          pointerEvents: 'none',
        }}
      >
        {showChart && (
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              key={selectedRange}
              data={displayData}
              margin={{ top: 10, right: 16, left: 0, bottom: 0 }}
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
                domain={yDomain}
                stroke={theme.palette.secondary.main}
                tick={{ fontSize: 10 }}
                allowDecimals
                tickFormatter={(v) =>
                  unit === 'minutes' ? `${v}` : v.toFixed(1)
                }
                label={{
                  value: unit.charAt(0).toUpperCase() + unit.slice(1),
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
              <Line
                type="monotone"
                dataKey="value"
                stroke={theme.palette.primary.main}
                strokeWidth={2}
                dot={{ r: 3, fill: theme.palette.primary.main }}
                activeDot={{ r: 5, fill: theme.palette.primary.main }}
                isAnimationActive
                animationBegin={0}
                animationDuration={800}
              />
            </LineChart>
          </ResponsiveContainer>
        )}
      </Box>
    </Box>
  );
}
