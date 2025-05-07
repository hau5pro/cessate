import { Box } from '@mui/material';
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
      {session && <CurrentSessionView />}
      <QuoteDisplay />
      {!session ? <StartSessionButton /> : <RelapseButton />}
    </Box>
  );
}

export default HomePage;
