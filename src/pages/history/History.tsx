import { Box, Typography } from '@mui/material';

import { HistoryIcon } from '@components/CustomIcons';
import globalStyles from '@themes/GlobalStyles.module.css';
import styles from './History.module.css';

function HistoryPage() {
  return (
    <Box className={styles.HistoryContainer}>
      <Typography className={globalStyles.Header} variant="h2">
        <HistoryIcon className={globalStyles.MaterialIcon} fontSize="large" />
        History
      </Typography>
    </Box>
  );
}

export default HistoryPage;
