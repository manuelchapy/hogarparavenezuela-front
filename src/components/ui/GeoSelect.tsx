import type { SelectHTMLAttributes } from 'react';

interface GeoSelectOption {
  id: string;
  name: string;
}

interface GeoSelectProps
  extends Omit<SelectHTMLAttributes<HTMLSelectElement>, 'onChange'> {
  label: string;
  value: string;
  onChange: (value: string) => void;
  options: GeoSelectOption[];
  placeholder?: string;
  error?: string;
  isLoading?: boolean;
  emptyMessage?: string;
}

export const GeoSelect = ({
  label,
  value,
  onChange,
  options,
  placeholder = 'Seleccionar...',
  error,
  isLoading = false,
  emptyMessage = 'Sin opciones disponibles',
  disabled,
  className = '',
  id,
  name,
  ...props
}: GeoSelectProps) => {
  const selectId = id ?? name ?? label.toLowerCase().replace(/\s+/g, '-');

  return (
    <div className="flex w-full flex-col gap-1.5">
      <label
        htmlFor={selectId}
        className="text-base font-medium text-text-primary"
      >
        {label}
      </label>
      <select
        id={selectId}
        name={name}
        value={value}
        disabled={disabled || isLoading}
        onChange={(event) => onChange(event.target.value)}
        className={[
          'min-h-12 w-full appearance-none rounded-xl border-2 border-slate-300 bg-white px-4 py-3',
          'text-base text-text-primary',
          'focus:border-primary-600 focus:outline-none focus:ring-2 focus:ring-primary-100',
          error ? 'border-danger-500' : '',
          className,
        ].join(' ')}
        {...props}
      >
        <option value="">
          {isLoading
            ? 'Cargando...'
            : options.length > 0
              ? placeholder
              : emptyMessage}
        </option>
        {options.map((option) => (
          <option key={option.id} value={option.id}>
            {option.name}
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
