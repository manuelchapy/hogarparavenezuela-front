import { Controller } from 'react-hook-form';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Textarea } from '@/components/ui/Textarea';
import { CatalogSelect } from '@/components/ui/CatalogSelect';
import { PhotoCaptureInput } from '@/components/ui/PhotoCaptureInput';
import { UbicacionSelector } from '@/components/ui/UbicacionSelector';
import { CATALOG_KEYS } from '@/constants/catalogKeys';
import { ROUTES } from '@/constants/routes';
import { LopnnaLegalNotice } from '@/components/ui/LopnnaLegalNotice';
import { useNnaRegister } from '@/hooks/useNnaRegister';

const STEP_LABELS = ['Foto', 'Datos', 'Hallazgo', 'Evento'];

export const NnaRegisterPage = () => {
  const {
    form,
    step,
    nextStep,
    prevStep,
    onSubmit,
    submitError,
    isAdolescente,
    captureGps,
    isGpsLoading,
    isSubmitting,
    photoFile,
    setPhotoFile,
    photoError,
    setPhotoError,
  } = useNnaRegister();

  const { register, watch, setValue, formState: { errors }, control } = form;
  const vozDelNna = watch('vozDelNna');
  const useGps = watch('useGps');
  const gpsLng = watch('gpsLng');
  const gpsLat = watch('gpsLat');

  return (
    <div className="flex flex-1 flex-col">
      <header className="border-b border-slate-200 bg-white px-4 py-5">
        <Link to={ROUTES.NNA_LIST} className="text-sm font-medium text-primary-700">
          ← Volver al listado
        </Link>
        <h1 className="mt-2 text-xl font-bold text-text-primary">
          Registrar NNA
        </h1>
        <div className="mt-3 flex gap-2">
          {STEP_LABELS.map((label, index) => (
            <span
              key={label}
              className={[
                'rounded-lg px-2 py-1 text-xs font-semibold',
                index === step
                  ? 'bg-primary-700 text-white'
                  : index < step
                    ? 'bg-primary-100 text-primary-800'
                    : 'bg-slate-100 text-slate-500',
              ].join(' ')}
            >
              {label}
            </span>
          ))}
        </div>
      </header>

      <form
        onSubmit={onSubmit}
        className="flex flex-1 flex-col gap-4 overflow-y-auto p-4"
        noValidate
      >
        {step === 0 && (
          <>
            <LopnnaLegalNotice variant="registration" />
          <PhotoCaptureInput
            value={photoFile}
            onChange={(file) => {
              setPhotoFile(file);
              if (file) setPhotoError(null);
            }}
            error={photoError ?? undefined}
          />
          </>
        )}

        {step === 1 && (
          <>
            <Input
              label="Nombre (opcional)"
              placeholder="Desconocido/No recuerda"
              {...register('nombre')}
            />
            <Input
              label="Nombre de padres (opcional)"
              {...register('nombrePadres')}
            />
            <CatalogSelect
              catalogKey={CATALOG_KEYS.SEXO_NNA}
              label="Sexo *"
              value={watch('sexo')}
              onChange={(v) => setValue('sexo', v as 'F' | 'M' | 'DESCONOCIDO')}
              error={errors.sexo?.message}
              name="sexo"
            />
            <CatalogSelect
              catalogKey={CATALOG_KEYS.EDAD_APARENTE}
              label="Edad aparente *"
              value={watch('edadAparente')}
              onChange={(v) =>
                setValue(
                  'edadAparente',
                  v as 'LACTANTE' | 'PREESCOLAR' | 'ESCOLAR' | 'ADOLESCENTE',
                )
              }
              error={errors.edadAparente?.message}
              name="edadAparente"
            />
            <Textarea
              label="Rasgos identificativos *"
              rows={4}
              placeholder="Cicatriz, ropa, señas particulares..."
              error={errors.rasgosIdentificativos?.message}
              {...register('rasgosIdentificativos')}
            />

            {isAdolescente && (
              <div className="rounded-2xl border-2 border-amber-200 bg-amber-50 p-4">
                <p className="mb-3 text-base font-semibold text-amber-950">
                  Voz del NNA (Art. 80 LOPNNA) *
                </p>
                <label className="flex min-h-12 items-center gap-3 text-base">
                  <input
                    type="checkbox"
                    className="h-5 w-5"
                    checked={vozDelNna?.fueEscuchado ?? false}
                    onChange={(e) =>
                      setValue('vozDelNna', {
                        fueEscuchado: e.target.checked,
                        manifestacion: '',
                        justificacionNoEscucha: '',
                      })
                    }
                  />
                  ¿Fue escuchado el NNA?
                </label>
                {vozDelNna?.fueEscuchado ? (
                  <Textarea
                    label="Manifestación del NNA"
                    className="mt-3"
                    {...register('vozDelNna.manifestacion')}
                  />
                ) : (
                  vozDelNna && (
                    <Textarea
                      label="Justificación de no escucha"
                      className="mt-3"
                      {...register('vozDelNna.justificacionNoEscucha')}
                    />
                  )
                )}
                {errors.vozDelNna?.message && (
                  <p className="mt-2 text-sm text-danger-500">
                    {String(errors.vozDelNna.message)}
                  </p>
                )}
              </div>
            )}
          </>
        )}

        {step === 2 && (
          <>
            <Input
              label="Lugar exacto del hallazgo *"
              {...register('lugarExacto')}
              error={errors.lugarExacto?.message}
            />
            <Input
              label="Fecha y hora del hallazgo *"
              type="datetime-local"
              {...register('fechaHora')}
              error={errors.fechaHora?.message}
            />
            <div className="flex flex-col gap-2">
              <Button
                type="button"
                variant="secondary"
                isLoading={isGpsLoading}
                onClick={captureGps}
              >
                Obtener GPS del hallazgo
              </Button>
              {useGps && gpsLng !== undefined && gpsLat !== undefined && (
                <p className="text-sm text-text-secondary">
                  GPS: {gpsLat.toFixed(5)}, {gpsLng.toFixed(5)}
                </p>
              )}
            </div>
            <Controller
              name="ubicacion"
              control={control}
              render={({ field }) => (
                <UbicacionSelector
                  value={field.value}
                  onChange={field.onChange}
                  errors={{
                    state: errors.ubicacion?.state?.message,
                    city: errors.ubicacion?.city?.message,
                  }}
                />
              )}
            />
          </>
        )}

        {step === 3 && (
          <>
            <Input
              label="Sitio del evento inicial *"
              placeholder="Sitio de hallazgo — Av. Principal"
              {...register('ubicacionNombre')}
              error={errors.ubicacionNombre?.message}
            />
            <CatalogSelect
              catalogKey={CATALOG_KEYS.ESTADO_SALUD}
              label="Estado de salud aparente *"
              value={watch('estadoSalud')}
              onChange={(v) =>
                setValue(
                  'estadoSalud',
                  v as 'ESTABLE' | 'REQUIERE_ATENCION_URGENTE' | 'CON_LESIONES_VISIBLES',
                )
              }
              error={errors.estadoSalud?.message}
              name="estadoSalud"
            />
            <Textarea
              label="Observaciones"
              rows={3}
              {...register('observaciones')}
            />
            <div className="rounded-2xl bg-slate-100 p-4 text-base text-text-secondary">
              Al registrar se subirá la foto y se creará la ficha. Sin conexión,
              se guardará localmente para sincronizar después.
            </div>
          </>
        )}

        {submitError && (
          <p className="text-sm font-medium text-danger-500" role="alert">
            {submitError}
          </p>
        )}
      </form>

      <div className="sticky bottom-0 flex gap-2 border-t border-slate-200 bg-white p-4 pb-[max(1rem,env(safe-area-inset-bottom))]">
        {step > 0 && (
          <Button type="button" variant="secondary" className="flex-1" onClick={prevStep}>
            Atrás
          </Button>
        )}
        {step < 3 ? (
          <Button type="button" className="flex-1" onClick={() => void nextStep()}>
            Siguiente
          </Button>
        ) : (
          <Button
            type="button"
            className="flex-1"
            isLoading={isSubmitting}
            onClick={onSubmit}
          >
            Registrar NNA
          </Button>
        )}
      </div>
    </div>
  );
};
