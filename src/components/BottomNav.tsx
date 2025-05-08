import { BottomNavigation, BottomNavigationAction, Box } from '@mui/material';
import { History, Home, Settings, Timeline } from '@mui/icons-material';
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
          '& .MuiBottomNavigationAction-root': {
            color: theme.palette.secondary.dark,
            boxShadow: 'none',
          },
          '& .MuiBottomNavigationAction-root:focus': {
            outline: 'none',
            boxShadow: 'none',
          },
          '& .Mui-selected': {
            color: theme.palette.secondary.main,
            outline: 'none',
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
        <BottomNavigationAction label="Home" value="/" icon={<Home />} />
        <BottomNavigationAction
          label="History"
          value={AppRoutes.HISTORY}
          icon={<History />}
        />
        <BottomNavigationAction
          label="Stats"
          value={AppRoutes.STATS}
          icon={<Timeline />}
        />
        <BottomNavigationAction
          label="Settings"
          value={AppRoutes.SETTINGS}
          icon={<Settings />}
        />
      </BottomNavigation>
    </Box>
  );
}
