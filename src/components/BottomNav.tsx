import { BottomNavigation, BottomNavigationAction, Box } from '@mui/material';
import {
  HistoryIcon,
  HomeIcon,
  SettingsIcon,
  TimelineIcon,
} from './CustomIcons';
import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router';

import { AppRoutes } from '@utils/constants';
import theme from '@themes/theme';

interface BottomNavProps {
  className?: string;
}

export default function BottomNav({ className }: BottomNavProps) {
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
      className={className}
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
          height: '4.5rem',
          paddingBottom: `calc(env(safe-area-inset-bottom, 0px) + 16px)`,
          '& .MuiBottomNavigationAction-root': {
            color: theme.palette.secondary.dark,
            boxShadow: 'none',
            transition: 'color 0.3s ease',
          },
          '& .MuiBottomNavigationAction-root:focus, & .MuiBottomNavigationAction-root:focus-visible':
            {
              outline: 'none',
              boxShadow: 'none',
              color: theme.palette.secondary.dark,
            },
          '& .Mui-selected': {
            color: theme.palette.secondary.main,
            outline: 'none',
            '& .MuiSvgIcon-root': {
              color: theme.palette.secondary.main,
            },
          },
          '& .MuiTouchRipple-root, & .MuiTouchRipple-child': {
            display: 'none',
          },
        }}
        value={value}
        onChange={handleChange}
        showLabels
      >
        <BottomNavigationAction label="Home" value="/" icon={<HomeIcon />} />
        <BottomNavigationAction
          label="History"
          value={AppRoutes.HISTORY}
          icon={<HistoryIcon />}
        />
        <BottomNavigationAction
          label="Stats"
          value={AppRoutes.STATS}
          icon={<TimelineIcon />}
        />
        <BottomNavigationAction
          label="Settings"
          value={AppRoutes.SETTINGS}
          icon={<SettingsIcon />}
        />
      </BottomNavigation>
    </Box>
  );
}
