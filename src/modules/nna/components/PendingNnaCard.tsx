import { useEffect, useMemo } from 'react';
import type { PendingNnaCreate } from '@/api/nnaTypes';
import { useCatalog } from '@/hooks/useCatalog';
import { CATALOG_KEYS } from '@/constants/catalogKeys';

interface PendingNnaCardProps {
  item: PendingNnaCreate;
}

export const PendingNnaCard = ({ item }: PendingNnaCardProps) => {
  const { getLabel } = useCatalog();
  const nombre = item.payload.datosNna.nombre ?? 'Desconocido/No recuerda';
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
    <article className="rounded-2xl border-2 border-dashed border-amber-400 bg-amber-50 p-4 shadow-sm">
      <div className="flex gap-4">
        <img
          src={photoUrl}
          alt={`Foto de ${nombre}`}
          className="h-20 w-20 shrink-0 rounded-xl object-cover"
        />
        <div className="flex min-w-0 flex-1 flex-col gap-2">
          <div className="flex items-start justify-between gap-2">
            <div className="min-w-0">
              <p className="truncate text-lg font-bold text-text-primary">
                {nombre}
              </p>
              <p className="text-sm font-medium text-amber-900">
                {item.idOfflineFallback}
              </p>
            </div>
            <span className="shrink-0 rounded-lg bg-amber-200 px-2 py-1 text-xs font-semibold text-amber-950">
              Pendiente sync
            </span>
          </div>
          <p className="text-base text-text-secondary">{edadLabel}</p>
          <p className="truncate text-sm text-text-secondary">
            {item.payload.hallazgo.lugarExacto}
          </p>
          <p className="text-xs text-amber-900">
            Guardado localmente. Pulsa «Sincronizar» arriba cuando el servidor
            esté activo.
          </p>
        </div>
      </div>
    </article>
  );
};
