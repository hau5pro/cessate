import { AnimatePresence, motion } from 'framer-motion';
import { Box, Typography } from '@mui/material';
import {
  HistoryIcon,
  HomeIcon,
  SettingsIcon,
  TimelineIcon,
} from './CustomIcons';

import theme from '@themes/theme';
import { useLocation } from 'react-router';

const routeMeta: Record<string, { label: string; icon: React.ReactNode }> = {
  '': { label: 'Home', icon: <HomeIcon fontSize="small" /> },
  history: { label: 'History', icon: <HistoryIcon fontSize="small" /> },
  stats: { label: 'Stats', icon: <TimelineIcon fontSize="small" /> },
  settings: { label: 'Settings', icon: <SettingsIcon fontSize="small" /> },
};

function HeaderRouteInfo() {
  const { pathname } = useLocation();
  const segment = pathname.split('/').filter(Boolean)[0] ?? '';
  const meta = routeMeta[segment];

  return (
    <AnimatePresence mode="wait">
      {meta && (
        <motion.div
          key={segment}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.25, ease: 'easeOut' }}
        >
          <Box
            display="flex"
            alignItems="center"
            gap={1}
            justifyContent="center"
            color={theme.palette.secondary.main}
          >
            {meta.icon}
            <Typography variant="body1" fontWeight={300}>
              {meta.label}
            </Typography>
          </Box>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export default HeaderRouteInfo;
