import { Box, Divider } from '@mui/material';

import CurrentSessionView from '@features/sessions/CurrentSessionView';
import QuoteDisplay from '@features/quotes/QuoteDisplay';
import RelapseButton from '@features/sessions/RelapseButton';
import StartSessionButton from '@features/sessions/StartSessionButton';
import styles from './Home.module.css';
import { useSessionStore } from '@store/useSessionStore';

function HomePage() {
  const session = useSessionStore((state) => state.currentSession);

  return (
    <Box className={styles.HomeContainer}>
      <CurrentSessionView />
      <Divider className={styles.Divider} />
      <QuoteDisplay />
      <Box className={styles.ButtonContainer}>
        {!session ? <StartSessionButton /> : <RelapseButton />}
      </Box>
    </Box>
  );
}

export default HomePage;
