import './Layout.css';

import { Outlet } from 'react-router';

function Layout() {
  return (
    <div className="global-container">
      <Outlet />
    </div>
  );
}

export default Layout;
