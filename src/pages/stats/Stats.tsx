import { Box, Divider, Typography } from '@mui/material';

import AnimatedCounter from '@components/AnimatedCounter';
import DailySessionChart from '@features/stats/DailySessionsChart';
import SessionGapsChart from '@features/stats/SessionGapsChart';
import { TimelineIcon } from '@components/CustomIcons';
import { formatDuration } from '@services/statsService';
import globalStyles from '@themes/GlobalStyles.module.css';
import { motion } from 'framer-motion';
import styles from './Stats.module.css';
import theme from '@themes/theme';
import { useStatsStore } from '@store/useStatsStore';
import { useUserSettingsStore } from '@store/useUserSettingsStore';

const sectionVariants = {
  hidden: { opacity: 0, x: -20 },
  visible: (i: number) => ({
    opacity: 1,
    x: 0,
    transition: { delay: i * 0.1, duration: 0.4, ease: 'easeOut' },
  }),
};

const MotionSection = ({
  children,
  index,
  className,
}: {
  children: React.ReactNode;
  index: number;
  className?: string;
}) => (
  <motion.div
    className={className}
    variants={sectionVariants}
    initial="hidden"
    animate="visible"
    custom={index}
  >
    {children}
  </motion.div>
);

function StatsPage() {
  const name = useUserSettingsStore((s) => s.settings?.name);
  const todaysDailySessions = useStatsStore((s) => s.dailySessions.todayCount);
  const todaysGapSeconds = useStatsStore((s) => s.sessionGaps.todayGapSeconds);
  const { value: formattedGapValue, unit: formattedGapUnit } =
    formatDuration(todaysGapSeconds);

  return (
    <Box className={styles.StatsContainer}>
      <MotionSection index={0}>
        <Typography className={globalStyles.Header} variant="h2">
          <TimelineIcon
            className={globalStyles.MaterialIcon}
            fontSize="large"
          />
          Stats
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'flex-end',
              flex: 1,
              color: theme.palette.secondary.main,
            }}
          >
            {name}
          </Box>
        </Typography>
      </MotionSection>
      <Box className={styles.StatsContent}>
        <motion.div
          initial={{ opacity: 1 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          <MotionSection index={1}>
            <AnimatedCounter
              value={todaysDailySessions}
              suffix="sessions"
              label="Sessions Today"
              variant="subtitle1"
            />
          </MotionSection>

          <MotionSection index={2}>
            <AnimatedCounter
              value={formattedGapValue}
              suffix={formattedGapUnit}
              label="Time Between Sessions"
              variant="subtitle1"
            />
            <Divider />
          </MotionSection>

          <MotionSection index={3}>
            <DailySessionChart />
            <Divider />
          </MotionSection>

          <MotionSection index={4}>
            <SessionGapsChart />
          </MotionSection>
        </motion.div>
      </Box>
    </Box>
  );
}

export default StatsPage;
