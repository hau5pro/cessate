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
import { Constants } from '@utils/constants';
import { TimelineIcon } from '@components/CustomIcons';
import dayjs from 'dayjs';
import { getDailySessions } from '@services/statsService';
import globalStyles from '@themes/GlobalStyles.module.css';
import styles from './Stats.module.css';
import theme from '@themes/theme';
import { useAuthStore } from '@store/useAuthStore';
import { useEffect } from 'react';
import { useStatsStore } from '@store/useStatsStore';

function StatsPage() {
  const {
    dailySessions,
    setDailySessionsRange,
    updateDailySessions,
    setLoading,
  } = useStatsStore();
  const user = useAuthStore((state) => state.user);

  const selectedRange = dailySessions.selectedRange;
  const cache = dailySessions.cache[selectedRange];

  const isStale =
    !cache || Date.now() - cache.lastFetched > Constants.ONE_DAY_IN_MS;

  useEffect(() => {
    if (!user?.uid || (!isStale && cache)) return;

    setLoading(true);
    getDailySessions(user.uid, selectedRange).then((data) => {
      updateDailySessions(selectedRange, data);
      setLoading(false);
    });
  }, [user, selectedRange, isStale, cache, setLoading, updateDailySessions]);

  const handleRangeChange = (_: any, newValue: number | null) => {
    if (newValue !== null) {
      setDailySessionsRange(newValue);
    }
  };

  return (
    <Box className={styles.StatsContainer}>
      <Typography className={globalStyles.Header} variant="h2">
        <TimelineIcon className={globalStyles.MaterialIcon} fontSize="large" />
        Stats
      </Typography>

      <Box>
        <Box mt={2} display="flex" justifyContent="space-between">
          <Typography variant="body1" gutterBottom>
            Sessions per Day
          </Typography>
          <BaseToggleButtonGroup
            value={dailySessions.selectedRange}
            onChange={handleRangeChange}
          >
            <BaseToggleButton value={7}>7 Days</BaseToggleButton>
            <BaseToggleButton value={30}>30 Days</BaseToggleButton>
          </BaseToggleButtonGroup>
        </Box>
        <Box height={300}>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={dailySessions.cache[selectedRange]?.data || []}
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
    </Box>
  );
}

export default StatsPage;
