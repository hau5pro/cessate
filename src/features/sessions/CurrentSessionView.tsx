import { AnimatePresence, motion } from 'framer-motion';
import { Box, Typography } from '@mui/material';
import { useEffect, useState } from 'react';

import { ColorUtils } from '@utils/colorUtils';
import Progress from '@components/Progress';
import { Timestamp } from 'firebase/firestore';
import { dayjs } from '@lib/dayjs';
import duration from 'dayjs/plugin/duration';
import theme from '@themes/theme';
import { useSessionStore } from '@store/useSessionStore';

dayjs.extend(duration);

const slideDownVariants = {
  hidden: { opacity: 0, y: -20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: 'easeOut' },
  },
  exit: { opacity: 0, y: -20, transition: { duration: 0.3 } },
};

function CurrentSessionView() {
  const session = useSessionStore((state) => state.currentSession);
  const [now, setNow] = useState(dayjs());

  useEffect(() => {
    const interval = setInterval(() => setNow(dayjs()), 1000);
    return () => clearInterval(interval);
  }, []);

  if (!session || !session.createdAt) return null;

  const createdAt = (session.createdAt as Timestamp).toDate();
  const targetEnd = dayjs(createdAt).add(session.targetDuration, 'second');
  const timeLeft = dayjs.duration(Math.max(targetEnd.diff(now), 0));
  const timePassed = dayjs.duration(Math.max(now.diff(createdAt), 0));

  const passedSeconds = timePassed.asSeconds();
  const duration = session.targetDuration;
  const percent =
    duration > 0
      ? Math.min(100, Math.max(0, (passedSeconds / duration) * 100))
      : 0;

  const normalizedPercent = percent / 100;

  return (
    <AnimatePresence>
      <motion.div
        key="current-session"
        initial="hidden"
        animate="visible"
        exit="exit"
        variants={slideDownVariants}
      >
        <Box
          textAlign="center"
          p={1}
          sx={{
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            gap: 0.5,
            flexGrow: 1,
          }}
        >
          <Typography variant="h3" color="secondary" mt={1}>
            You've abstained for
          </Typography>
          <Typography
            variant="h2"
            color={theme.palette.common.white}
            sx={{ fontSize: '3rem' }}
          >
            {timePassed.days()}d {timePassed.hours()}h {timePassed.minutes()}m
          </Typography>

          <Typography variant="body1" color="secondary" mt={2}>
            Time remaining
          </Typography>
          <Typography variant="subtitle1">
            {timeLeft.format('HH:mm:ss')}
          </Typography>

          <Box
            textAlign="center"
            p={2}
            sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}
          >
            <Progress
              percent={percent}
              width={'60%'}
              animate={true}
              sx={{ alignSelf: 'center' }}
            />
            <Typography variant="body2" display="block" mt={1}>
              <span
                style={{
                  color: ColorUtils.interpolateColor(normalizedPercent),
                }}
              >
                {Math.floor(percent)}%
              </span>{' '}
              of your target completed{timeLeft.asSeconds() === 0 ? '!' : ''}
            </Typography>
          </Box>
        </Box>
      </motion.div>
    </AnimatePresence>
  );
}

export default CurrentSessionView;
