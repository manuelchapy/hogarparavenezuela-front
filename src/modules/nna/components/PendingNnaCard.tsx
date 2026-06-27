import { useEffect, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import type { PendingNnaCreate } from '@/api/nnaTypes';
import { useCatalog } from '@/hooks/useCatalog';
import { CATALOG_KEYS } from '@/constants/catalogKeys';

interface PendingNnaCardProps {
  item: PendingNnaCreate;
}

export const PendingNnaCard = ({ item }: PendingNnaCardProps) => {
  const { t } = useTranslation();
  const { getLabel } = useCatalog();
  const nombre = item.payload.datosNna.nombre ?? t('nna.detailUnknownName');
  const edadLabel = getLabel(
    CATALOG_KEYS.EDAD_APARENTE,
    item.payload.datosNna.edadAparente,
  );
  const photoUrl = useMemo(
    () => URL.createObjectURL(item.photoBlob),
    [item.photoBlob],
  );

  useEffect(() => () => URL.revokeObjectURL(photoUrl), [photoUrl]);

  return (
    <article className="rounded-2xl border-2 border-dashed border-accent-500 bg-accent-100/60 p-4 shadow-[var(--shadow-card)]">
      <div className="flex gap-4">
        <img
          src={photoUrl}
          alt={t('nna.cardPhotoAlt', { name: nombre })}
          className="h-20 w-20 shrink-0 rounded-xl object-cover ring-2 ring-accent-400/50"
        />
        <div className="flex min-w-0 flex-1 flex-col gap-2">
          <div className="flex items-start justify-between gap-2">
            <div className="min-w-0">
              <p className="truncate text-lg font-bold text-text-primary">
                {nombre}
              </p>
              <p className="font-mono text-sm font-semibold text-accent-700">
                {item.idOfflineFallback}
              </p>
            </div>
            <span className="shrink-0 rounded-lg bg-accent-500 px-2 py-1 text-xs font-bold text-text-on-accent">
              {t('nna.pendingSyncBadge')}
            </span>
          </div>
          <p className="text-base text-text-secondary">{edadLabel}</p>
          <p className="truncate text-sm text-text-muted">
            {item.payload.hallazgo.lugarExacto}
          </p>
          <p className="text-xs font-medium text-accent-700">
            {t('nna.pendingSyncHint')}
          </p>
        </div>
      </div>
    </article>
  );
};
