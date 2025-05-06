import { Box, Typography } from '@mui/material';

import styles from './Home.module.css';
import { useUserSettingsStore } from '@store/useUserSettingsStore';

function HomePage() {
  const settings = useUserSettingsStore((state) => state.settings);
  return (
    <Box className={styles.HomeContainer}>
      <Typography variant="h2" textAlign={'center'}>
        {settings?.name ? `Welcome back, ${settings.name}!` : 'Welcome back!'}
      </Typography>
    </Box>
  );
}

export default HomePage;
