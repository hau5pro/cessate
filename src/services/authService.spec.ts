import { Mock, describe, expect, it, vi } from 'vitest';

vi.mock('@lib/firebase', () => ({
  auth: {
    signOut: vi.fn(),
  },
  googleProvider: {},
}));

vi.mock('firebase/auth', () => ({
  signInWithPopup: vi.fn(),
}));

const setUser = vi.fn();
const setLoading = vi.fn();

vi.mock('@store/useAuthStore', () => ({
  useAuthStore: {
    getState: vi.fn(() => ({
      setUser,
      setLoading,
    })),
  },
}));

vi.mock('@store/resetAllStores', () => ({
  resetAllStores: vi.fn(),
}));

describe('authService', () => {
  it('sets user and loading state on successful Google sign-in', async () => {
    const mockUser = { uid: 'abc123', email: 'test@cessate.com' };

    const { signInWithPopup } = await import('firebase/auth');
    const { useAuthStore } = await import('@store/useAuthStore');
    (signInWithPopup as Mock).mockResolvedValue({ user: mockUser });

    const { signInWithGoogle } = await import('./authService');
    await signInWithGoogle();

    expect(signInWithPopup).toHaveBeenCalled();
    const store = useAuthStore.getState();
    expect(store.setUser).toHaveBeenCalledWith(mockUser);
    expect(store.setLoading).toHaveBeenCalledWith(false);
  });
  it('resets all stores on sign-out', async () => {
    const { auth } = await import('@lib/firebase');
    const { resetAllStores } = await import('@store/resetAllStores');
    const { signOut } = await import('./authService');

    await signOut();

    expect(auth.signOut).toHaveBeenCalled();
    expect(resetAllStores).toHaveBeenCalled();
  });
});
