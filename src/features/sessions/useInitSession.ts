import { getCurrentSession } from '@services/sessionsService';
import { useAuthStore } from '@store/useAuthStore';
import { useEffect } from 'react';
import { useSessionStore } from '@store/useSessionStore';

export const useInitSession = () => {
  const user = useAuthStore((state) => state.user);
  const hasInitialized = useSessionStore((state) => state.hasInitialized);
  const setSession = useSessionStore((state) => state.setCurrentSession);
  const setLoading = useSessionStore((state) => state.setLoading);
  const setHasInitialized = useSessionStore((state) => state.setHasInitialized);

  useEffect(() => {
    const loadSession = async () => {
      if (!user || hasInitialized) return;

      setLoading(true);
      try {
        const active = await getCurrentSession(user.uid);
        if (active) {
          setSession(active);
        }
      } catch (err) {
        console.error('Failed to load session:', err);
      } finally {
        setHasInitialized(true);
        setLoading(false);
      }
    };

    loadSession();
  }, [user, hasInitialized, setSession, setLoading, setHasInitialized]);
};
