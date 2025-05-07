import { Box, LinearProgress, Typography } from '@mui/material';
import { useEffect, useState } from 'react';

import { Timestamp } from 'firebase/firestore';
import dayjs from 'dayjs';
import duration from 'dayjs/plugin/duration';
import { useSessionStore } from '@store/useSessionStore';

dayjs.extend(duration);

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
  const timeLeft = dayjs.duration(targetEnd.diff(now));
  const timePassed = dayjs.duration(now.diff(createdAt));
  const percent = Math.min(
    100,
    (timePassed.asSeconds() / session.targetDuration) * 100
  );

  return (
    <Box textAlign="center" p={2}>
      <Typography variant="h4">Current Session</Typography>

      <Typography variant="body1" mt={2}>
        ⏱ Time remaining: {timeLeft.format('HH:mm:ss')}
      </Typography>

      <Typography variant="body2" mt={1}>
        💪 You've abstained for {timePassed.days()}d {timePassed.hours()}h{' '}
        {timePassed.minutes()}m
      </Typography>

      <LinearProgress
        variant="determinate"
        value={percent}
        sx={{ mt: 2, height: 10, borderRadius: 5 }}
      />

      <Typography variant="caption" display="block" mt={1}>
        {Math.floor(percent)}% of your target completed
      </Typography>
    </Box>
  );
}

export default CurrentSessionView;
