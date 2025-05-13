import { Box, Typography } from '@mui/material';

import BaseCard from '@components/BaseCard';
import BottomNav from '@components/BottomNav';
import HeaderRouteInfo from '@components/HeaderRouteInfo';
import { Outlet } from 'react-router';
import { motion } from 'framer-motion';
import styles from './Layout.module.css';
import theme from '@themes/theme';
import { useAuthStore } from '@store/useAuthStore';

function Layout() {
  const loading = useAuthStore((state) => state.loading);
  const user = useAuthStore((state) => state.user);

  const isLoggedIn = !!user && !loading;

  return (
    <div className={styles.GlobalContainer}>
      <BaseCard
        sx={{
          width: '100%',
          maxWidth: 500,
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          margin: { sm: '0.75rem' },
        }}
      >
        <motion.div
          className={styles.Header}
          initial={false}
          animate={isLoggedIn ? 'compact' : 'large'}
          variants={{
            large: { paddingTop: '1rem', paddingBottom: '1rem', scaleY: 1 },
            compact: {
              paddingTop: '0.8rem',
              paddingBottom: '0.8rem',
              scaleY: 0.9,
            },
          }}
          transition={{ type: 'spring', stiffness: 300, damping: 30 }}
          style={{
            textAlign: 'center',
            originY: 0,
          }}
        >
          <Box className={styles.HeaderContent}>
            <Typography
              variant="h1"
              sx={{
                fontSize: isLoggedIn ? '2rem' : theme.typography.h1.fontSize,
                transition: 'all 0.3s ease',
              }}
            >
              Cessate
            </Typography>
            {isLoggedIn && <HeaderRouteInfo />}
          </Box>
        </motion.div>

        <main style={{ flex: 1, overflowY: 'auto', padding: '0.75rem' }}>
          <Outlet />
        </main>

        <Box sx={{ paddingBottom: theme.spacing(10) }} />
        <footer className={styles.BottomNavContainer}>
          <BottomNav
            className={!user || loading ? styles.SlideOut : styles.SlideIn}
          />
        </footer>
      </BaseCard>
    </div>
  );
}

export default Layout;
