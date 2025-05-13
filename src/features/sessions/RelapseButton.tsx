import BaseButton from '@components/BaseButton';
import { Box } from '@mui/material';
import Loading from '@components/Loading';
import { Timestamp } from 'firebase/firestore';
import { getLocalDayKey } from '@lib/dayjs';
import { logRelapseAndStartSession } from '@services/sessionsService';
import { runSessionTransaction } from '@lib/firebase';
import { useAuthStore } from '@store/useAuthStore';
import { useSessionStore } from '@store/useSessionStore';
import { useStatsStore } from '@store/useStatsStore';
import { useUserSettingsStore } from '@store/useUserSettingsStore';

function RelapseButton() {
  const todayKey = getLocalDayKey();
  const user = useAuthStore((state) => state.user);

  const targetDuration = useUserSettingsStore(
    (state) => state.settings?.targetDuration
  );

  const session = useSessionStore((state) => state.currentSession);
  const setCurrentSession = useSessionStore((state) => state.setCurrentSession);
  const loading = useSessionStore((state) => state.loading);
  const setLoading = useSessionStore((state) => state.setLoading);

  const todaysGapSummary = useStatsStore((state) =>
    state.sessionGaps.data.find((d) => d.day === todayKey)
  );
  const updateTodaySessionGapSummary = useStatsStore(
    (state) => state.updateTodaySessionGapSummary
  );
  const todaysDailySessions = useStatsStore((state) =>
    state.dailySessions.data.find((d) => d.day === todayKey)
  );
  const updateTodayDailySession = useStatsStore(
    (state) => state.updateTodayDailySession
  );

  const handleRelapse = async () => {
    if (!user || !session?.id || !targetDuration) return;

    try {
      setLoading(true);

      const { session: newSession, gapSummary } = await runSessionTransaction(
        async (batch) => {
          return logRelapseAndStartSession(
            user.uid,
            session,
            targetDuration,
            batch,
            todaysGapSummary
          );
        }
      );

      updateTodaySessionGapSummary(gapSummary);
      const updatedCount = (todaysDailySessions?.count ?? 0) + 1;
      updateTodayDailySession({
        day: todayKey,
        count: updatedCount,
        updatedAt: Timestamp.now(),
      });

      setCurrentSession(newSession);
    } catch (err) {
      console.error('Relapse failed:', err);
    } finally {
      setLoading(false);
    }
  };

  const spacing = '0.3em';

  return (
    <BaseButton
      sx={{ minHeight: '56px', position: 'relative' }}
      color="secondary"
      onClick={handleRelapse}
      disabled={loading}
    >
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        width="100%"
      >
        <span
          style={{
            fontFamily: 'Roboto, sans-serif',
            letterSpacing: spacing,
            display: 'inline-block',
          }}
        >
          R
          <span
            style={{
              transform: 'rotateY(180deg)',
              display: 'inline-block',
              margin: `0 ${spacing} 0 -${spacing}`,
            }}
          >
            e
          </span>
          lapse
        </span>
      </Box>

      {
        <Box
          sx={{
            position: 'absolute',
            right: 24,
            top: '50%',
            transform: 'translateY(-50%)',
            opacity: loading ? 1 : 0,
            transition: 'opacity 0.2s ease',
            pointerEvents: 'none',
          }}
        >
          <Loading size={30} />
        </Box>
      }
    </BaseButton>
  );
}

export default RelapseButton;
