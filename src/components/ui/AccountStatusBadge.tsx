import { CATALOG_KEYS } from '@/constants/catalogKeys';
import { useCatalog } from '@/hooks/useCatalog';

const ACCOUNT_STATUS_STYLES: Record<string, string> = {
  PENDIENTE:
    'bg-account-pending-bg text-account-pending-text border-account-pending-border',
  ACTIVO:
    'bg-account-active-bg text-account-active-text border-account-active-border',
  SUSPENDIDO:
    'bg-account-suspended-bg text-account-suspended-text border-account-suspended-border',
  RECHAZADO:
    'bg-account-rejected-bg text-account-rejected-text border-account-rejected-border',
};

const FALLBACK_STYLE =
  'bg-status-fallback-bg text-status-fallback-text border-status-fallback-border';

interface AccountStatusBadgeProps {
  statusCode: string;
  className?: string;
}

export const AccountStatusBadge = ({
  statusCode,
  className = '',
}: AccountStatusBadgeProps) => {
  const { getLabel, isReady } = useCatalog();
  const label = isReady
    ? getLabel(CATALOG_KEYS.ACCOUNT_STATUS, statusCode)
    : statusCode.replace(/_/g, ' ');
  const style = ACCOUNT_STATUS_STYLES[statusCode] ?? FALLBACK_STYLE;

  return (
    <span
      className={[
        'inline-flex min-h-8 items-center rounded-lg border px-3 py-1',
        'text-sm font-semibold',
        style,
        className,
      ].join(' ')}
    >
      {label}
    </span>
  );
};
