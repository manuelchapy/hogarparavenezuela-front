import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { AuthUser } from '@/api/authTypes';
import { ACCOUNT_STATUS } from '@/constants/roles';
import { STORAGE_KEYS } from '@/constants/routes';
import { refreshProfile } from '@/services/authService';

interface AuthState {
  user: AuthUser | null;
  token: string | null;
  isAuthenticated: boolean;
  isHydrating: boolean;
  setAuth: (user: AuthUser, token: string) => void;
  setUser: (user: AuthUser) => void;
  clearAuth: () => void;
  hydrateSession: () => Promise<void>;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      token: null,
      isAuthenticated: false,
      isHydrating: false,

      setAuth: (user, token) => {
        localStorage.setItem(STORAGE_KEYS.AUTH_TOKEN, token);
        set({ user, token, isAuthenticated: true });
      },

      setUser: (user) => {
        set({ user, isAuthenticated: Boolean(get().token) });
      },

      clearAuth: () => {
        localStorage.removeItem(STORAGE_KEYS.AUTH_TOKEN);
        set({ user: null, token: null, isAuthenticated: false });
      },

      hydrateSession: async () => {
        const token = localStorage.getItem(STORAGE_KEYS.AUTH_TOKEN);
        if (!token) return;

        set({ isHydrating: true });
        try {
          const user = await refreshProfile();
          set({ user, token, isAuthenticated: true });
        } catch {
          get().clearAuth();
        } finally {
          set({ isHydrating: false });
        }
      },
    }),
    {
      name: 'hpv-auth-store',
      partialize: (state) => ({
        user: state.user,
        token: state.token,
        isAuthenticated: state.isAuthenticated,
      }),
    },
  ),
);

export const isActiveAccount = (user: AuthUser | null): boolean =>
  user?.estadoCuenta === ACCOUNT_STATUS.ACTIVO && user.activo;
