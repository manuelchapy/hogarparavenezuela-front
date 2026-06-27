import { useSync } from '@/hooks/useSync';
import { useApiHealth } from '@/hooks/useApiHealth';
import { Button } from '@/components/ui/Button';

export const NetworkStatusBar = () => {
  const {
    isOnline,
    pendingCount,
    isSyncing,
    syncNow,
    syncMessage,
    clearSyncMessage,
  } = useSync();
  const { apiReachable, isChecking } = useApiHealth();

  const statusLabel = (() => {
    if (!isOnline) return 'Sin conexión — modo offline';
    if (apiReachable === false) return 'En línea — servidor no disponible';
    if (apiReachable === true) return 'En línea — conectado al servidor';
    return isChecking ? 'Comprobando servidor…' : 'En línea';
  })();

  const statusTone =
    !isOnline || apiReachable === false
      ? 'bg-warning-500/20 text-amber-950'
      : 'bg-success-500/15 text-green-900';

  const dotTone =
    !isOnline || apiReachable === false ? 'bg-warning-500' : 'bg-success-500';

  return (
    <div className="flex w-full flex-col">
      <div
        className={[
          'flex min-h-10 w-full items-center justify-between gap-2 px-4 py-2 text-sm font-medium',
          statusTone,
        ].join(' ')}
        role="status"
        aria-live="polite"
      >
        <span className="flex min-w-0 items-center gap-2">
          <span
            className={['inline-block h-2.5 w-2.5 shrink-0 rounded-full', dotTone].join(
              ' ',
            )}
            aria-hidden
          />
          <span className="truncate">{statusLabel}</span>
        </span>

        {pendingCount > 0 && (
          <Button
            variant="secondary"
            className="!min-h-10 shrink-0 !px-3 !py-1 text-sm font-semibold"
            isLoading={isSyncing}
            disabled={!isOnline || isSyncing}
            onClick={() => {
              clearSyncMessage();
              void syncNow();
            }}
          >
            {isSyncing ? 'Sincronizando…' : `Sincronizar (${pendingCount})`}
          </Button>
        )}
      </div>

      {syncMessage && (
        <p
          className="border-b border-amber-200 bg-amber-50 px-4 py-2 text-sm font-medium text-amber-950"
          role="alert"
        >
          {syncMessage}
        </p>
      )}
    </div>
  );
};
