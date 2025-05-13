import { Box, Divider } from '@mui/material';
import { motion, useAnimation } from 'framer-motion';
import { useEffect, useState } from 'react';

import CurrentSessionView from '@features/sessions/CurrentSessionView';
import QuoteDisplay from '@features/quotes/QuoteDisplay';
import RelapseButton from '@features/sessions/RelapseButton';
import StartSessionButton from '@features/sessions/StartSessionButton';
import styles from './Home.module.css';
import { useSessionStore } from '@store/useSessionStore';

function HomePage() {
  const session = useSessionStore((state) => state.currentSession);
  const loading = useSessionStore((state) => state.loading);
  const hasInitialized = useSessionStore((state) => state.hasInitialized);

  const topControls = useAnimation();
  const bottomControls = useAnimation();
  const quoteControls = useAnimation();

  const [hasRendered, setHasRendered] = useState(false);

  useEffect(() => {
    if (hasInitialized) setHasRendered(true);
  }, [hasInitialized]);

  useEffect(() => {
    let mounted = true;

    if (!hasRendered) return;

    const startAnimations = () => {
      if (!mounted) return;
      topControls.start({ y: 0, opacity: 1 });

      setTimeout(() => {
        if (!mounted) return;
        bottomControls.start({ y: 0, opacity: 1 });
      }, 200);

      setTimeout(() => {
        if (!mounted) return;
        quoteControls.start({ opacity: 1 });
      }, 1000);
    };

    // wait a tick to ensure DOM is committed
    const timeoutId = setTimeout(() => {
      requestAnimationFrame(startAnimations);
    }, 0);

    return () => {
      mounted = false;
      clearTimeout(timeoutId);
    };
  }, [hasRendered]);

  if (!hasInitialized) return null;

  return (
    <Box className={styles.HomeContainer}>
      <Box className={styles.ScrollContainer}>
        <motion.div
          initial={{ y: -20, opacity: 0 }}
          animate={topControls}
          transition={{ duration: 0.5, ease: 'easeOut' }}
        >
          <CurrentSessionView />
        </motion.div>

        <Divider />

        <QuoteDisplay controls={quoteControls} />
      </Box>

      <Box className={styles.ButtonContainer}>
        <motion.div
          initial={{ y: 40, opacity: 0 }}
          animate={bottomControls}
          transition={{ duration: 0.5, ease: 'easeOut' }}
          style={{ width: '100%' }}
        >
          {!loading && !session ? <StartSessionButton /> : <RelapseButton />}
        </motion.div>
      </Box>
    </Box>
  );
}

export default HomePage;
