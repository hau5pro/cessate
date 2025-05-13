import { Box, Typography } from '@mui/material';
import { useEffect, useRef } from 'react';

import { CacheUtils } from '@utils/cacheUtils';
import Loading from '@components/Loading';
import SessionCard from '@features/history/SessionCard';
import { motion } from 'framer-motion';
import styles from './History.module.css';
import theme from '@themes/theme';
import { useAuthStore } from '@store/useAuthStore';
import { useHistoryStore } from '@store/useHistoryStore';

const sectionVariants = {
  hidden: { opacity: 0, y: -20, scale: 0.95 },
  visible: (i: number) => ({
    y: 0,
    opacity: 1,
    scale: 1,
    transition: { delay: i * 0.05, duration: 0.3, ease: 'easeOut' },
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

function HistoryPage() {
  const { sessions, hasInitialized, hasMore, loading, loadMore } =
    useHistoryStore();

  const user = useAuthStore((state) => state.user);
  const sentinelRef = useRef<HTMLDivElement | null>(null);

  const isEmpty = hasInitialized && sessions.length === 0;

  useEffect(() => {
    if (!user || !hasMore || loading) return;

    const debounceLoad = CacheUtils.debounce(() => {
      loadMore(user.uid);
    }, CacheUtils.DEBOUNCE_DELAY);

    const observer = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting) {
        debounceLoad();
      }
    });

    const el = sentinelRef.current;
    if (el) observer.observe(el);

    return () => {
      if (el) observer.unobserve(el);
    };
  }, [user, hasMore, loading, loadMore]);

  return (
    <Box className={styles.HistoryContainer}>
      <Box className={styles.HistoryContent}>
        {isEmpty && <NoContent />}
        {!isEmpty &&
          sessions.map((session, index) => (
            <MotionSection index={index}>
              <SessionCard key={session.id} session={session} />
            </MotionSection>
          ))}
        {hasMore && <div ref={sentinelRef} style={{ height: 1 }} />}
        {loading && !isEmpty && <Loading />}
      </Box>
    </Box>
  );
}

function NoContent() {
  return (
    <Box className={styles.EmptyState}>
      <Typography
        variant="h5"
        color={theme.palette.secondary.main}
        sx={{ mt: 4, textAlign: 'center' }}
      >
        No past sessions yet.
      </Typography>
      <Typography
        variant="body2"
        color={theme.palette.secondary.main}
        sx={{ mt: 1, textAlign: 'center', opacity: 0.7 }}
      >
        Start a session to begin your journey.
      </Typography>
    </Box>
  );
}

export default HistoryPage;
