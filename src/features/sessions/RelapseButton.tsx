import BaseButton from '@components/BaseButton';
import { Box } from '@mui/material';
import Loading from '@components/Loading';
import { Timestamp } from 'firebase/firestore';
import { getLocalDayKey } from '@lib/dayjs';
import { logRelapseAndStartSession } from '@services/sessionsService';
import { runSessionTransaction } from '@lib/firebase';
import { useAuthStore } from '@store/useAuthStore';
import { useHistoryStore } from '@store/useHistoryStore';
import { useSessionStore } from '@store/useSessionStore';
import { useStatsStore } from '@store/useStatsStore';
import { useUserSettingsStore } from '@store/useUserSettingsStore';

function RelapseButton() {
  const user = useAuthStore((state) => state.user);

  const targetDuration = useUserSettingsStore(
    (state) => state.settings?.targetDuration
  );

  const session = useSessionStore((state) => state.currentSession);
  const setCurrentSession = useSessionStore((state) => state.setCurrentSession);
  const loading = useSessionStore((state) => state.loading);
  const setLoading = useSessionStore((state) => state.setLoading);

  const updateHistorySession = useHistoryStore((state) => state.updateSession);
  const addToHistory = useHistoryStore((state) => state.addSession);

  const handleRelapse = async () => {
    if (!user || !session?.id || !targetDuration) return;

    try {
      setLoading(true);

      const dayKey = getLocalDayKey(session.createdAt.toDate());

      const gapSummaryForDay = useStatsStore
        .getState()
        .sessionGaps.data.find((d) => d.day === dayKey);

      const dailySessionsForDay = useStatsStore
        .getState()
        .dailySessions.data.find((d) => d.day === dayKey);

      const {
        session: newSession,
        previous,
        gapSummary,
      } = await runSessionTransaction(async (batch) => {
        return logRelapseAndStartSession(
          user.uid,
          session,
          targetDuration,
          batch,
          gapSummaryForDay
        );
      });

      useStatsStore.getState().updateTodaySessionGapSummary(gapSummary);

      const updatedCount = (dailySessionsForDay?.count ?? 0) + 1;
      useStatsStore.getState().updateTodayDailySession({
        day: dayKey,
        count: updatedCount,
        updatedAt: Timestamp.now(),
      });

      updateHistorySession(previous);
      addToHistory(newSession);
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
      data-testid="relapse-button"
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
