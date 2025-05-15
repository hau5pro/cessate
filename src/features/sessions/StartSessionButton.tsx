import BaseButton from '@components/BaseButton';
import { runSessionTransaction } from '@lib/firebase';
import { startNewSession } from '@services/sessionsService';
import { useAuthStore } from '@store/useAuthStore';
import { useHistoryStore } from '@store/useHistoryStore';
import { useSessionStore } from '@store/useSessionStore';
import { useUserSettingsStore } from '@store/useUserSettingsStore';

function StartSessionButton() {
  const user = useAuthStore((state) => state.user);
  const settings = useUserSettingsStore((state) => state.settings);
  const setCurrentSession = useSessionStore((state) => state.setCurrentSession);
  const setLoading = useSessionStore((state) => state.setLoading);
  const addToHistory = useHistoryStore((state) => state.addSession);

  const handleStart = async () => {
    if (!user || !settings?.targetDuration) return;

    try {
      setLoading(true);

      const session = await runSessionTransaction(async (batch) => {
        return startNewSession(user.uid, settings.targetDuration, batch);
      });

      setCurrentSession({ ...session });
      addToHistory(session);
    } catch (err) {
      console.error('Failed to start session:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <BaseButton
      variant="contained"
      color="primary"
      onClick={handleStart}
      data-testid="start-button"
    >
      Start Your Journey
    </BaseButton>
  );
}

export default StartSessionButton;
