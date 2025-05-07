import { Box, Typography } from '@mui/material';

import BaseButton from '@components/BaseButton';
import CurrentSessionView from '@features/sessions/CurrentSessionView';
import StartSessionButton from '@features/sessions/StartSessionButton';
import styles from './Home.module.css';
import { useSessionStore } from '@store/useSessionStore';
import { useUserSettingsStore } from '@store/useUserSettingsStore';

function HomePage() {
  const settings = useUserSettingsStore((state) => state.settings);
  const session = useSessionStore((state) => state.currentSession);

  return (
    <Box className={styles.HomeContainer}>
      <Typography variant="h2" textAlign={'center'}>
        {settings?.name ? `Welcome back, ${settings.name}!` : 'Welcome back!'}
      </Typography>
      {session && <CurrentSessionView />}
      {!session ? <StartSessionButton /> : <RelapseButton />}
    </Box>
  );
}

function RelapseButton() {
  return (
    <BaseButton variant="contained" color="secondary">
      R<span className={styles.Reverse}>e</span>lapse
    </BaseButton>
  );
}

export default HomePage;
