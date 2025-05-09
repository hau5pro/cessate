import { Box, Typography } from '@mui/material';

import { Timeline } from '@mui/icons-material';
import globalStyles from '@themes/GlobalStyles.module.css';
import styles from './Stats.module.css';

function StatsPage() {
  return (
    <Box className={styles.StatsContainer}>
      <Typography className={globalStyles.Header} variant="h2">
        <Timeline className={globalStyles.MaterialIcon} fontSize="large" />
        Stats
      </Typography>
    </Box>
  );
}

export default StatsPage;
