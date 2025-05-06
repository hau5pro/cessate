import { BottomNavigation, BottomNavigationAction, Box } from '@mui/material';
import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router';

import { AppRoutes } from '@utils/constants';
import BarChartIcon from '@mui/icons-material/BarChart';
import HomeIcon from '@mui/icons-material/Home';
import SettingsIcon from '@mui/icons-material/Settings';
import theme from '@themes/theme';

export default function BottomNav() {
  const location = useLocation();
  const navigate = useNavigate();
  const [value, setValue] = useState(location.pathname);

  useEffect(() => {
    setValue(location.pathname);
  }, [location.pathname]);

  const handleChange = (_: React.SyntheticEvent, newValue: string) => {
    setValue(newValue);
    navigate(newValue);
  };

  return (
    <Box
      sx={{
        position: 'fixed',
        bottom: 0,
        left: 0,
        right: 0,
        zIndex: 10,
      }}
    >
      <BottomNavigation
        sx={{
          bgcolor: 'transparent',
          backdropFilter: 'blur(10px)',
          '& .MuiBottomNavigationAction-root': {
            color: '#bbb',
            boxShadow: 'none',
          },
          '& .Mui-selected': {
            color: theme.palette.secondary.main,
            '& .MuiSvgIcon-root': {
              color: theme.palette.secondary.main,
            },
          },
          '& .MuiTouchRipple-root': {
            boxShadow: 'none',
          },
        }}
        value={value}
        onChange={handleChange}
        showLabels
      >
        <BottomNavigationAction
          label="History"
          value={AppRoutes.HISTORY}
          icon={<BarChartIcon />}
        />
        <BottomNavigationAction label="Home" value="/" icon={<HomeIcon />} />
        <BottomNavigationAction
          label="Settings"
          value={AppRoutes.SETTINGS}
          icon={<SettingsIcon />}
        />
      </BottomNavigation>
    </Box>
  );
}
