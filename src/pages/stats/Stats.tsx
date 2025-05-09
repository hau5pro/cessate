import { Box, Typography } from '@mui/material';

import AnimatedCounter from '@components/AnimatedCounter';
import DailySessionChart from '@features/stats/DailySessionsChart';
import SessionGapsChart from '@features/stats/SessionGapsChart';
import { TimelineIcon } from '@components/CustomIcons';
import globalStyles from '@themes/GlobalStyles.module.css';
import styles from './Stats.module.css';
import { useLoadStats } from '@features/stats/useLoadStats';
import { useStatsStore } from '@store/useStatsStore';

function StatsPage() {
  const todaysDailySessions = useStatsStore((s) => s.dailySessions.todayCount);

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
          label="Daily Sessions"
          variant="subtitle1"
        />
        <DailySessionChart />
        <SessionGapsChart />
      </Box>
    </Box>
  );
}

export default StatsPage;
