import { CATALOG_KEYS } from '@/constants/catalogKeys';
import { useCatalog } from '@/hooks/useCatalog';

const ACCOUNT_STATUS_STYLES: Record<string, string> = {
  PENDIENTE: 'bg-amber-100 text-amber-950 border-amber-300',
  ACTIVO: 'bg-green-100 text-green-950 border-green-300',
  SUSPENDIDO: 'bg-red-100 text-red-950 border-red-300',
  RECHAZADO: 'bg-slate-200 text-slate-800 border-slate-400',
};

const FALLBACK_STYLE = 'bg-slate-100 text-slate-800 border-slate-300';

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
