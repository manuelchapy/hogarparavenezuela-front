import { CATALOG_KEYS } from '@/constants/catalogKeys';
import { useCatalog } from '@/hooks/useCatalog';

const STATUS_STYLES: Record<string, string> = {
  EN_SITIO:
    'bg-status-site-bg text-status-site-text border-status-site-border',
  EN_TRANSITO:
    'bg-status-transit-bg text-status-transit-text border-status-transit-border',
  RESGUARDADO:
    'bg-status-sheltered-bg text-status-sheltered-text border-status-sheltered-border',
  ENTREGADO_AUTORIDAD:
    'bg-status-delivered-bg text-status-delivered-text border-status-delivered-border',
};

const FALLBACK_STYLE =
  'bg-status-fallback-bg text-status-fallback-text border-status-fallback-border';

interface StatusBadgeProps {
  statusCode: string;
  className?: string;
}

export const StatusBadge = ({ statusCode, className = '' }: StatusBadgeProps) => {
  const { getLabel, isReady } = useCatalog();
  const label = isReady
    ? getLabel(CATALOG_KEYS.NNA_STATUS, statusCode)
    : statusCode;
  const style = STATUS_STYLES[statusCode] ?? FALLBACK_STYLE;

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
