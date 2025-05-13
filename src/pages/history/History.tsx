import { Box, Typography } from '@mui/material';
import { useEffect, useRef } from 'react';

import { CacheUtils } from '@utils/cacheUtils';
import { HistoryIcon } from '@components/CustomIcons';
import Loading from '@components/Loading';
import SessionCard from '@features/history/SessionCard';
import globalStyles from '@themes/GlobalStyles.module.css';
import styles from './History.module.css';
import theme from '@themes/theme';
import { useAuthStore } from '@store/useAuthStore';
import { useHistoryStore } from '@store/useHistoryStore';

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
      <Typography className={globalStyles.Header} variant="h2">
        <HistoryIcon className={globalStyles.MaterialIcon} fontSize="large" />
        History
      </Typography>

      <Box className={styles.HistoryContent}>
        {isEmpty && <NoContent />}
        {!isEmpty &&
          sessions.map((session) => (
            <SessionCard key={session.id} session={session} />
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
