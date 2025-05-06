import BaseCard from '@components/BaseCard';
import BottomNav from '@components/BottomNav';
import Loading from '@components/Loading';
import { Outlet } from 'react-router';
import { Typography } from '@mui/material';
import styles from './Layout.module.css';
import { useAuthStore } from '@store/useAuthStore';

function Layout() {
  const loading = useAuthStore((state) => state.loading);

  return (
    <div className={styles.GlobalContainer}>
      <BaseCard
        sx={{
          width: '100%',
          maxWidth: 500,
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          margin: '0.75rem',
        }}
      >
        <header style={{ padding: '1rem', textAlign: 'center' }}>
          <Typography variant="h1">Cessate</Typography>
        </header>
        <main style={{ flex: 1, overflowY: 'auto', padding: '1rem' }}>
          {loading ? <Loading /> : <Outlet />}
        </main>
        <footer className={styles.BottomNavContainer}>
          <BottomNav className={loading ? styles.SlideOut : styles.SlideIn} />
        </footer>
      </BaseCard>
    </div>
  );
}

export default Layout;
