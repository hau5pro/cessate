import { Box, Typography } from '@mui/material';

import { HistoryIcon } from '@components/CustomIcons';
import SessionCard from '@features/history/SessionCard';
import globalStyles from '@themes/GlobalStyles.module.css';
import styles from './History.module.css';
import theme from '@themes/theme';
import { useHistoryStore } from '@store/useHistoryStore';

function HistoryPage() {
  const { sessions, hasInitialized } = useHistoryStore();

  const isEmpty = hasInitialized && sessions.length === 0;

  return (
    <Box className={styles.HistoryContainer}>
      <Typography className={globalStyles.Header} variant="h2">
        <HistoryIcon className={globalStyles.MaterialIcon} fontSize="large" />
        History
      </Typography>
      <Box className={styles.HistoryContent}>
        {isEmpty && <NoContent />}{' '}
        {!isEmpty &&
          sessions.map((session) => (
            <SessionCard key={session.id} session={session} />
          ))}
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
