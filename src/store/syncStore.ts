import { create } from 'zustand';
import { getPendingCount, processPendingMutations } from '@/services/syncService';

interface SyncState {
  pendingCount: number;
  isSyncing: boolean;
  lastSyncAt: number | null;
  syncMessage: string | null;
  refreshPendingCount: () => Promise<void>;
  syncNow: () => Promise<{ synced: number; failed: number }>;
  clearSyncMessage: () => void;
}

export const useSyncStore = create<SyncState>((set, get) => ({
  pendingCount: 0,
  isSyncing: false,
  lastSyncAt: null,
  syncMessage: null,
  clearSyncMessage: () => set({ syncMessage: null }),
  refreshPendingCount: async () => {
    const count = await getPendingCount();
    set({ pendingCount: count });
  },
  syncNow: async () => {
    if (!navigator.onLine || get().isSyncing) {
      set({
        syncMessage: !navigator.onLine
          ? 'Sin internet — no se puede sincronizar aún.'
          : null,
      });
      return { synced: 0, failed: 0 };
    }
    set({ isSyncing: true, syncMessage: null });
    try {
      const result = await processPendingMutations();
      const count = await getPendingCount();
      let syncMessage: string | null = null;

      if (result.synced > 0 && result.failed === 0) {
        syncMessage = `${result.synced} registro(s) sincronizado(s) correctamente.`;
      } else if (result.synced > 0 && result.failed > 0) {
        syncMessage = `${result.synced} sincronizado(s), ${result.failed} con error. Revisa que el backend esté activo en el puerto 4000.`;
      } else if (result.failed > 0) {
        syncMessage =
          'No se pudo sincronizar. Inicia el backend (npm run dev en hogarparavenezuela-back) y vuelve a pulsar «Sincronizar».';
      } else if (get().pendingCount > 0 && count === 0) {
        syncMessage = 'Cola vacía.';
      }

      set({ pendingCount: count, lastSyncAt: Date.now(), syncMessage });
      return result;
    } finally {
      set({ isSyncing: false });
    }
  },
}));
