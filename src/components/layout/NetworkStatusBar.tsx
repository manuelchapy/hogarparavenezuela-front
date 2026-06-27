import { useTranslation } from 'react-i18next';
import { useSync } from '@/hooks/useSync';
import { Button } from '@/components/ui/Button';

const useNetworkStatus = () => {
  const { t } = useTranslation();
  const {
    isOnline,
    apiReachable,
    pendingCount,
    isSyncing,
    syncNow,
    syncMessage,
    clearSyncMessage,
  } = useSync();

  const isDegraded = !isOnline || apiReachable === false;

  const statusLabel = (() => {
    if (!isOnline) return t('network.offline');
    if (apiReachable === false) return t('network.onlineServerDown');
    if (apiReachable === true) return t('network.onlineConnected');
    return t('network.online');
  })();

  return {
    isOnline,
    isDegraded,
    statusLabel,
    pendingCount,
    isSyncing,
    syncNow,
    syncMessage,
    clearSyncMessage,
  };
};

/** Fila compacta de red — integrada en AppTopBar (móvil). */
export const NetworkStatusInline = () => {
  const { t } = useTranslation();
  const {
    isOnline,
    isDegraded,
    statusLabel,
    pendingCount,
    isSyncing,
    syncNow,
    clearSyncMessage,
  } = useNetworkStatus();

  const dotTone = isDegraded ? 'bg-network-offline-dot' : 'bg-network-online-dot';

  return (
    <div
      className="flex min-h-9 items-center justify-between gap-2 border-t border-primary-900/30 px-4 py-1.5"
      role="status"
      aria-live="polite"
    >
      <span className="flex min-w-0 items-center gap-2 text-xs font-medium text-primary-100">
        <span
          className={['inline-block h-2 w-2 shrink-0 rounded-full', dotTone].join(' ')}
          aria-hidden
        />
        <span className="truncate">{statusLabel}</span>
      </span>

      {pendingCount > 0 && (
        <Button
          variant="secondary"
          className="shrink-0 !min-h-9 !px-2.5 !py-1 text-xs font-semibold"
          isLoading={isSyncing}
          disabled={!isOnline || isSyncing}
          onClick={() => {
            clearSyncMessage();
            void syncNow();
          }}
        >
          {isSyncing
            ? t('network.syncing')
            : t('network.syncCount', { count: pendingCount })}
        </Button>
      )}
    </div>
  );
};

/** Barra de red completa — escritorio (lg+). */
export const NetworkStatusBar = () => {
  const { t } = useTranslation();
  const {
    isOnline,
    isDegraded,
    statusLabel,
    pendingCount,
    isSyncing,
    syncNow,
    syncMessage,
    clearSyncMessage,
  } = useNetworkStatus();

  const statusTone = isDegraded
    ? 'bg-network-offline-bg text-network-offline-text'
    : 'bg-network-online-bg text-network-online-text';

  const dotTone = isDegraded
    ? 'bg-network-offline-dot'
    : 'bg-network-online-dot';

  return (
    <div className="hidden w-full shrink-0 flex-col lg:flex">
      <div
        className={[
          'flex min-h-12 w-full items-center justify-between gap-2 px-6 py-2 text-sm font-medium',
          statusTone,
        ].join(' ')}
        role="status"
        aria-live="polite"
      >
        <span className="flex min-w-0 items-center gap-2">
          <span
            className={['inline-block h-2.5 w-2.5 shrink-0 rounded-full', dotTone].join(' ')}
            aria-hidden
          />
          <span className="truncate">{statusLabel}</span>
        </span>

        {pendingCount > 0 && (
          <Button
            variant="secondary"
            className="shrink-0 !min-h-12 !px-3 !py-2 text-sm font-semibold"
            isLoading={isSyncing}
            disabled={!isOnline || isSyncing}
            onClick={() => {
              clearSyncMessage();
              void syncNow();
            }}
          >
            {isSyncing
              ? t('network.syncing')
              : t('network.syncCount', { count: pendingCount })}
          </Button>
        )}
      </div>

      {syncMessage && (
        <p
          className="border-b border-feedback-warning-border bg-feedback-warning-bg px-6 py-2 text-sm font-medium text-feedback-warning-text"
          role="alert"
        >
          {syncMessage}
        </p>
      )}
    </div>
  );
};

/** Toast de sync en móvil (debajo del top bar). */
export const NetworkSyncToast = () => {
  const { syncMessage } = useNetworkStatus();

  if (!syncMessage) return null;

  return (
    <p
      className="border-b border-feedback-warning-border bg-feedback-warning-bg px-4 py-2 text-xs font-medium text-feedback-warning-text lg:hidden"
      role="alert"
    >
      {syncMessage}
    </p>
  );
};
