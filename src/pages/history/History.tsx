import { Box, Typography } from '@mui/material';

import { History } from '@mui/icons-material';
import globalStyles from '@/App.module.css';
import styles from './History.module.css';

function HistoryPage() {
  return (
    <Box className={styles.HistoryContainer}>
      <Typography className={globalStyles.Header} variant="h2">
        <History className={globalStyles.MaterialIcon} fontSize="large" />
        History
      </Typography>
    </Box>
  );
}

export default HistoryPage;
