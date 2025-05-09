import { Box, Divider, Typography } from '@mui/material';

import AnimatedCounter from '@components/AnimatedCounter';
import DailySessionChart from '@features/stats/DailySessionsChart';
import SessionGapsChart from '@features/stats/SessionGapsChart';
import { TimelineIcon } from '@components/CustomIcons';
import { formatDuration } from '@services/statsService';
import globalStyles from '@themes/GlobalStyles.module.css';
import styles from './Stats.module.css';
import { useLoadStats } from '@features/stats/useLoadStats';
import { useStatsStore } from '@store/useStatsStore';

function StatsPage() {
  const todaysDailySessions = useStatsStore((s) => s.dailySessions.todayCount);
  const todaysGapSeconds = useStatsStore((s) => s.sessionGaps.todayGapSeconds);
  const { value: formattedGapValue, unit: formattedGapUnit } =
    formatDuration(todaysGapSeconds);

  console.log(
    'todaysGapSeconds',
    todaysGapSeconds,
    formattedGapValue,
    formattedGapUnit
  );
  useLoadStats();

  return (
    <Box className={styles.StatsContainer}>
      <Typography className={globalStyles.Header} variant="h2">
        <TimelineIcon className={globalStyles.MaterialIcon} fontSize="large" />
        Stats
      </Typography>
      <Box className={styles.StatsContent}>
        <AnimatedCounter
          value={todaysDailySessions}
          suffix="days"
          label="Sessions Today"
          variant="subtitle1"
        />
        <Divider />
        <AnimatedCounter
          value={formattedGapValue}
          suffix={formattedGapUnit}
          label={`Time Between Sessions`}
          variant="subtitle1"
        />
        <Divider />
        <DailySessionChart />
        <Divider />
        <SessionGapsChart />
      </Box>
    </Box>
  );
}

export default StatsPage;
