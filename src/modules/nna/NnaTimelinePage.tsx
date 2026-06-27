import { useEffect } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Textarea } from '@/components/ui/Textarea';
import { GeoSelect } from '@/components/ui/GeoSelect';
import { CATALOG_KEYS } from '@/constants/catalogKeys';
import { ROUTES } from '@/constants/routes';
import { useCatalog } from '@/hooks/useCatalog';
import { useNnaDetail } from '@/hooks/useNnaDetail';
import { useNnaTimeline } from '@/hooks/useNnaTimeline';
import { CatalogSelect } from '@/components/ui/CatalogSelect';
import { LopnnaLegalNotice } from '@/components/ui/LopnnaLegalNotice';

const TIMELINE_ALLOWED = ['TRASLADO', 'ATENCION_MEDICA', 'INGRESO_REFUGIO'] as const;

export const NnaTimelinePage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { getItems } = useCatalog();
  const { nna, load, setNna } = useNnaDetail(id);

  const timelineOptions = getItems(CATALOG_KEYS.TIMELINE_EVENTS)
    .filter((item) =>
      TIMELINE_ALLOWED.includes(item.code as (typeof TIMELINE_ALLOWED)[number]),
    )
    .map((item) => ({ id: item.code, name: item.label }));

  const { form, onSubmit, submitError, offlineQueued, requiresEntidad, isSubmitting } =
    useNnaTimeline(id ?? '', (updated) => {
      setNna(updated);
      navigate(ROUTES.NNA_DETAIL.replace(':id', updated._id), {
        state: { message: 'Hito registrado en el timeline' },
      });
    });

  const { register, watch, setValue } = form;

  useEffect(() => {
    void load();
  }, [load]);

  return (
    <div className="flex flex-1 flex-col">
      <header className="border-b border-slate-200 bg-white px-4 py-5">
        <Link
          to={id ? ROUTES.NNA_DETAIL.replace(':id', id) : ROUTES.NNA_LIST}
          className="text-sm font-medium text-primary-700"
        >
          ← Volver a la ficha
        </Link>
        <h1 className="mt-2 text-xl font-bold text-text-primary">
          Agregar hito
        </h1>
        {nna && (
          <p className="mt-1 text-base text-text-secondary">{nna.idUnico}</p>
        )}
      </header>

      <form
        onSubmit={onSubmit}
        className="flex flex-1 flex-col gap-4 overflow-y-auto p-4"
        noValidate
      >
        <p className="rounded-xl bg-blue-50 px-4 py-3 text-base text-blue-950">
          Solo agrega eventos al timeline. No se recrea el formulario de registro.
        </p>

        <LopnnaLegalNotice variant="timeline" />

        <GeoSelect
          label="Tipo de evento *"
          name="tipoEvent"
          value={watch('tipoEvent')}
          onChange={(v) =>
            setValue(
              'tipoEvent',
              v as 'TRASLADO' | 'ATENCION_MEDICA' | 'INGRESO_REFUGIO',
            )
          }
          options={timelineOptions}
          placeholder="Selecciona el tipo de hito"
        />

        <Input
          label="Ubicación / centro *"
          {...register('ubicacionNombre')}
          error={form.formState.errors.ubicacionNombre?.message}
        />

        {requiresEntidad && (
          <Input
            label="ID entidad de atención *"
            placeholder="ObjectId de entidad autorizada"
            {...register('entidadAtencionId')}
            error={form.formState.errors.entidadAtencionId?.message}
          />
        )}

        <CatalogSelect
          catalogKey={CATALOG_KEYS.ESTADO_SALUD}
          label="Estado de salud *"
          value={watch('estadoSalud')}
          onChange={(v) =>
            setValue(
              'estadoSalud',
              v as 'ESTABLE' | 'REQUIERE_ATENCION_URGENTE' | 'CON_LESIONES_VISIBLES',
            )
          }
          name="estadoSalud"
        />

        <Textarea
          label="Observaciones"
          rows={3}
          {...register('observaciones')}
        />

        {offlineQueued && (
          <p className="rounded-xl bg-amber-50 px-4 py-3 text-base text-amber-950">
            Hito guardado offline. Se sincronizará al reconectar.
          </p>
        )}

        {submitError && (
          <p className="text-sm font-medium text-danger-500" role="alert">
            {submitError}
          </p>
        )}
      </form>

      <div className="sticky bottom-0 border-t border-slate-200 bg-white p-4 pb-[max(1rem,env(safe-area-inset-bottom))]">
        <Button
          type="button"
          className="w-full"
          isLoading={isSubmitting}
          onClick={onSubmit}
        >
          Guardar hito
        </Button>
      </div>
    </div>
  );
};
