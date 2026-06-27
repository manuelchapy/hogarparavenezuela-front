import { GeoSelect } from '@/components/ui/GeoSelect';
import {
  useUbicacionForm,
  type UbicacionFormValue,
} from '@/hooks/useUbicacionForm';

interface UbicacionSelectorProps {
  value: UbicacionFormValue;
  onChange: (value: UbicacionFormValue) => void;
  errors?: Partial<Record<keyof UbicacionFormValue, string>>;
  includeMunicipalityParish?: boolean;
  disabled?: boolean;
}

export const UbicacionSelector = ({
  value,
  onChange,
  errors,
  includeMunicipalityParish = true,
  disabled = false,
}: UbicacionSelectorProps) => {
  const {
    states,
    cities,
    municipalities,
    parishes,
    statesLoaded,
    loadingStates,
    isCityLoading,
    isMunicipalityLoading,
    isParishLoading,
    setState,
    setCity,
    setMunicipality,
    setParish,
    displayPreview,
    ubicacion,
  } = useUbicacionForm({
    value,
    onChange,
    includeMunicipalityParish,
  });

  return (
    <div className="flex w-full flex-col gap-4">
      <GeoSelect
        label="Estado"
        name="ubicacion-state"
        value={ubicacion.state}
        onChange={setState}
        options={states}
        placeholder="Selecciona un estado"
        error={errors?.state}
        isLoading={loadingStates || !statesLoaded}
        disabled={disabled}
        required
      />

      <GeoSelect
        label="Ciudad"
        name="ubicacion-city"
        value={ubicacion.city}
        onChange={setCity}
        options={cities}
        placeholder={
          ubicacion.state ? 'Selecciona una ciudad' : 'Primero elige un estado'
        }
        error={errors?.city}
        isLoading={isCityLoading}
        disabled={disabled || !ubicacion.state}
        emptyMessage={
          ubicacion.state
            ? 'No hay ciudades en caché. Conéctate para cargar.'
            : 'Selecciona un estado primero'
        }
        required
      />

      {includeMunicipalityParish && (
        <>
          <GeoSelect
            label="Municipio (opcional)"
            name="ubicacion-municipality"
            value={ubicacion.municipality}
            onChange={setMunicipality}
            options={municipalities}
            placeholder="Selecciona un municipio"
            error={errors?.municipality}
            isLoading={isMunicipalityLoading}
            disabled={disabled || !ubicacion.state}
            emptyMessage="Sin municipios disponibles"
          />

          <GeoSelect
            label="Parroquia (opcional)"
            name="ubicacion-parish"
            value={ubicacion.parish}
            onChange={setParish}
            options={parishes}
            placeholder={
              ubicacion.municipality
                ? 'Selecciona una parroquia'
                : 'Primero elige un municipio'
            }
            error={errors?.parish}
            isLoading={isParishLoading}
            disabled={disabled || !ubicacion.municipality}
            emptyMessage={
              ubicacion.municipality
                ? 'No hay parroquias en caché. Conéctate para cargar.'
                : 'Selecciona un municipio primero'
            }
          />
        </>
      )}

      {displayPreview && ubicacion.state && ubicacion.city && (
        <p className="rounded-xl border border-border-subtle bg-primary-50 px-4 py-3 text-base text-text-secondary">
          <span className="font-semibold text-text-primary">Vista previa: </span>
          {displayPreview}
        </p>
      )}
    </div>
  );
};
