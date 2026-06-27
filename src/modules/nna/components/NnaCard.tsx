import { Link } from 'react-router-dom';
import { StatusBadge } from '@/components/ui/StatusBadge';
import type { NnaListItem } from '@/api/nnaTypes';
import { ROUTES } from '@/constants/routes';
import { useCatalog } from '@/hooks/useCatalog';
import { CATALOG_KEYS } from '@/constants/catalogKeys';

interface NnaCardProps {
  nna: NnaListItem;
}

export const NnaCard = ({ nna }: NnaCardProps) => {
  const { getLabel } = useCatalog();
  const nombre = nna.datosNna.nombre ?? 'Desconocido/No recuerda';
  const edadLabel = getLabel(
    CATALOG_KEYS.EDAD_APARENTE,
    nna.datosNna.edadAparente,
  );
  const codigo =
    nna.idUnico ?? nna.idOfflineFallback ?? `Ref. ${nna._id.slice(-6)}`;

  return (
    <Link
      to={ROUTES.NNA_DETAIL.replace(':id', nna._id)}
      className="block rounded-2xl border-2 border-slate-200 bg-white p-4 shadow-sm active:bg-slate-50"
    >
      <div className="flex gap-4">
        <img
          src={nna.fotoUrl}
          alt={`Foto de ${nombre}`}
          className="h-20 w-20 shrink-0 rounded-xl object-cover"
          loading="lazy"
        />
        <div className="flex min-w-0 flex-1 flex-col gap-2">
          <div className="flex items-start justify-between gap-2">
            <div className="min-w-0">
              <p className="truncate text-lg font-bold text-text-primary">
                {nombre}
              </p>
              <p className="text-sm font-medium text-primary-700">
                {codigo}
              </p>
            </div>
            <StatusBadge statusCode={nna.statusActual} />
          </div>
          <p className="text-base text-text-secondary">{edadLabel}</p>
          <p className="truncate text-sm text-text-secondary">
            {nna.hallazgo.lugarExacto}
          </p>
        </div>
      </div>
    </Link>
  );
};
