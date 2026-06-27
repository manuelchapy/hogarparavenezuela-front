import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { StatusBadge } from '@/components/ui/StatusBadge';
import type { NnaListItem } from '@/api/nnaTypes';
import { ROUTES } from '@/constants/routes';
import { useCatalog } from '@/hooks/useCatalog';
import { CATALOG_KEYS } from '@/constants/catalogKeys';

interface NnaCardProps {
  nna: NnaListItem;
}

export const NnaCard = ({ nna }: NnaCardProps) => {
  const { t } = useTranslation();
  const { getLabel } = useCatalog();
  const nombre = nna.datosNna.nombre ?? t('nna.detailUnknownName');
  const edadLabel = getLabel(
    CATALOG_KEYS.EDAD_APARENTE,
    nna.datosNna.edadAparente,
  );
  const codigo =
    nna.idUnico ?? nna.idOfflineFallback ?? `Ref. ${nna._id.slice(-6)}`;

  return (
    <Link
      to={ROUTES.NNA_DETAIL.replace(':id', nna._id)}
      className="surface-card-interactive block !p-4"
    >
      <div className="flex gap-4">
        <img
          src={nna.fotoUrl}
          alt={t('nna.cardPhotoAlt', { name: nombre })}
          className="h-20 w-20 shrink-0 rounded-xl object-cover ring-2 ring-border-subtle"
          loading="lazy"
        />
        <div className="flex min-w-0 flex-1 flex-col gap-2">
          <div className="flex items-start justify-between gap-2">
            <div className="min-w-0">
              <p className="truncate text-lg font-bold text-text-primary">
                {nombre}
              </p>
              <p className="font-mono text-sm font-semibold text-primary-700">
                {codigo}
              </p>
            </div>
            <StatusBadge statusCode={nna.statusActual} />
          </div>
          <p className="text-base text-text-secondary">{edadLabel}</p>
          <p className="truncate text-sm text-text-muted">
            {nna.hallazgo.lugarExacto}
          </p>
        </div>
      </div>
    </Link>
  );
};
