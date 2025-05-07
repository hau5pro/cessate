import { getCurrentSession, startNewSession } from '@services/sessionsService';

import BaseButton from '@components/BaseButton';
import { useAuthStore } from '@store/useAuthStore';
import { useSessionStore } from '@store/useSessionStore';
import { useUserSettingsStore } from '@store/useUserSettingsStore';

function StartSessionButton() {
  const user = useAuthStore((state) => state.user);
  const settings = useUserSettingsStore((state) => state.settings);
  const setCurrentSession = useSessionStore((state) => state.setCurrentSession);
  const setLoading = useSessionStore((state) => state.setLoading);

  const handleStart = async () => {
    if (!user || !settings?.targetDuration) return;

    try {
      setLoading(true);
      await startNewSession(user.uid, settings.targetDuration);
      const session = await getCurrentSession(user.uid);
      if (session) {
        setCurrentSession({ ...session });
      }
    } catch (err) {
      console.error('Failed to start session:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <BaseButton variant="contained" color="primary" onClick={handleStart}>
      Start Your Journey
    </BaseButton>
  );
}

export default StartSessionButton;
