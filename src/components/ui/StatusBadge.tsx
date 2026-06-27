import { CATALOG_KEYS } from '@/constants/catalogKeys';
import { useCatalog } from '@/hooks/useCatalog';

const STATUS_STYLES: Record<string, string> = {
  EN_SITIO: 'bg-amber-100 text-amber-950 border-amber-300',
  EN_TRANSITO: 'bg-blue-100 text-blue-950 border-blue-300',
  RESGUARDADO: 'bg-green-100 text-green-950 border-green-300',
  ENTREGADO_AUTORIDAD: 'bg-violet-100 text-violet-950 border-violet-300',
};

const FALLBACK_STYLE = 'bg-slate-100 text-slate-800 border-slate-300';

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
