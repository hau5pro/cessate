import { Box, Divider } from '@mui/material';

import AnimatedCounter from '@components/AnimatedCounter';
import DailySessionChart from '@features/stats/DailySessionsChart';
import SessionGapsChart from '@features/stats/SessionGapsChart';
import { formatDuration } from '@services/statsService';
import { motion } from 'framer-motion';
import styles from './Stats.module.css';
import { useStatsStore } from '@store/useStatsStore';

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
  const todaysDailySessions = useStatsStore((s) => s.dailySessions.todayCount);
  const todaysGapSeconds = useStatsStore((s) => s.sessionGaps.todayGapSeconds);
  const { value: formattedGapValue, unit: formattedGapUnit } =
    formatDuration(todaysGapSeconds);

  return (
    <Box className={styles.StatsContainer}>
      <Box className={styles.StatsContent}>
        <motion.div
          initial={{ opacity: 1 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          <MotionSection index={0}>
            <AnimatedCounter
              value={todaysDailySessions}
              suffix="sessions"
              label="Sessions Today"
              variant="subtitle1"
              duration={250}
              delay={0}
            />
          </MotionSection>

          <MotionSection index={1}>
            <AnimatedCounter
              value={formattedGapValue}
              suffix={formattedGapUnit}
              label="Time Between Sessions"
              variant="subtitle1"
              duration={250}
              delay={250}
            />
            <Divider />
          </MotionSection>

          <MotionSection index={2}>
            <DailySessionChart />
            <Divider />
          </MotionSection>

          <MotionSection index={3}>
            <SessionGapsChart />
          </MotionSection>
        </motion.div>
      </Box>
    </Box>
  );
}

export default StatsPage;
