import type { SelectHTMLAttributes } from 'react';
import type { CatalogKey } from '@/constants/catalogKeys';
import { useCatalog } from '@/hooks/useCatalog';

interface CatalogSelectProps
  extends Omit<SelectHTMLAttributes<HTMLSelectElement>, 'onChange'> {
  catalogKey: CatalogKey;
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  error?: string;
}

export const CatalogSelect = ({
  catalogKey,
  label,
  value,
  onChange,
  placeholder = 'Seleccionar...',
  error,
  disabled,
  className = '',
  ...props
}: CatalogSelectProps) => {
  const { getOptions, isReady, isLoading } = useCatalog();
  const options = getOptions(catalogKey);
  const selectId = props.id ?? props.name ?? catalogKey;

  return (
    <div className="flex w-full flex-col gap-1.5">
      <label
        htmlFor={selectId}
        className="text-base font-semibold text-text-primary"
      >
        {label}
      </label>
      <select
        id={selectId}
        value={value}
        disabled={disabled || isLoading || !isReady}
        onChange={(event) => onChange(event.target.value)}
        className={[
          'form-field appearance-none',
          error ? 'border-danger-500 focus:border-danger-500 focus:ring-red-100' : '',
          className,
        ].join(' ')}
        {...props}
      >
        <option value="">{isReady ? placeholder : 'Cargando catálogo...'}</option>
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      {error && (
        <p className="text-sm font-medium text-danger-500" role="alert">
          {error}
        </p>
      )}
    </div>
  );
};
