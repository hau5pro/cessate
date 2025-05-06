import './Layout.css';

import BaseCard from '@components/BaseCard';
import BottomNav from '@components/BottomNav';
import { Outlet } from 'react-router';

function Layout() {
  return (
    <div className="global-container">
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
          <h1>Cessate</h1>
        </header>
        <main style={{ flex: 1, overflowY: 'auto', padding: '1rem' }}>
          <Outlet />
        </main>
        <footer>
          <BottomNav />
        </footer>
      </BaseCard>
    </div>
  );
}

export default Layout;
