import { Box, Typography } from '@mui/material';

import styles from './History.module.css';

function HistoryPage() {
  return (
    <Box className={styles.HistoryContainer}>
      <Typography className={styles.HistoryHeader} variant="h2">
        History
      </Typography>
    </Box>
  );
}

export default HistoryPage;
