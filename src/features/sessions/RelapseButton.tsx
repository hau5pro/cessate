import {
  endCurrentSession,
  getCurrentSession,
  startNewSession,
} from '@services/sessionsService';

import BaseButton from '@components/BaseButton';
import { Box } from '@mui/material';
import Loading from '@components/Loading';
import { useAuthStore } from '@store/useAuthStore';
import { useSessionStore } from '@store/useSessionStore';
import { useUserSettingsStore } from '@store/useUserSettingsStore';

function RelapseButton() {
  const user = useAuthStore((state) => state.user);
  const session = useSessionStore((state) => state.currentSession);
  const setCurrentSession = useSessionStore((state) => state.setCurrentSession);
  const loading = useSessionStore((state) => state.loading);
  const setLoading = useSessionStore((state) => state.setLoading);
  const targetDuration = useUserSettingsStore(
    (state) => state.settings?.targetDuration
  );

  const handleRelapse = async () => {
    if (!user || !session?.id || !targetDuration) return;

    try {
      setLoading(true);

      await endCurrentSession(user.uid, session.id);
      await startNewSession(user.uid, targetDuration);
      const newSession = await getCurrentSession(user.uid);

      if (newSession) {
        setCurrentSession(newSession);
      }
    } catch (err) {
      console.error('Relapse failed:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <BaseButton
      sx={{ minHeight: '56px' }}
      color="secondary"
      onClick={handleRelapse}
      disabled={loading}
    >
      {loading ? (
        <Box
          display="flex"
          justifyContent="center"
          alignItems="center"
          width="100%"
        >
          <Loading size={30} />
        </Box>
      ) : (
        <>
          R
          <span
            style={{ transform: 'rotateY(180deg)', display: 'inline-block' }}
          >
            e
          </span>
          lapse
        </>
      )}
    </BaseButton>
  );
}

export default RelapseButton;
