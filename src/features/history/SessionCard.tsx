import { Box, LinearProgress, Typography } from '@mui/material';

import { Session } from '@features/sessions/session';
import { Timestamp } from 'firebase/firestore';
import { dayjs } from '@lib/dayjs';
import styles from './SessionCard.module.css';
import theme from '@themes/theme';

type Props = {
  session: Session;
};

export default function SessionCard({ session }: Props) {
  const createdAt = session.createdAt.toDate();
  const endedAt = session.endedAt
    ? (session.endedAt as Timestamp)?.toDate()
    : null;
  const day = dayjs(createdAt).format('MMM D, YYYY');
  const startTime = dayjs(createdAt).format('h:mm A');
  const durationSeconds = session.duration;
  const percentage = session.percentage;
  const percentColor = session.color ?? theme.palette.secondary.main;

  return (
    <Box className={styles.Card}>
      <Box className={styles.Section}>
        <Typography
          className={styles.CenterText}
          variant="body1"
          color={theme.palette.secondary.main}
        >
          {day}
        </Typography>
        <Typography variant="subtitle2" color={theme.palette.secondary.main}>
          {startTime}
        </Typography>
      </Box>

      <Box className={styles.Section}>
        {percentage !== null ? (
          <Box className={styles.Section}>
            <Typography
              variant="body2"
              sx={{ fontSize: 14 }}
              color={percentColor}
            >
              {`${percentage}%`}
            </Typography>
            <LinearProgress
              variant="determinate"
              value={percentage}
              sx={{
                width: '100px',
                borderRadius: 4,
                backgroundColor: 'rgba(0, 0, 0, 0.1)',
                height: 4,
                '& .MuiLinearProgress-bar': {
                  backgroundColor: percentColor,
                },
              }}
            />
          </Box>
        ) : (
          <Box></Box>
        )}
        <Typography
          variant="body2"
          sx={{ fontSize: 14 }}
          color={theme.palette.primary.main}
        >
          {endedAt
            ? `Lasted ${dayjs.duration(durationSeconds || 0, 'seconds').humanize()}`
            : 'Session in progress'}
        </Typography>
      </Box>
    </Box>
  );
}
