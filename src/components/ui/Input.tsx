import { forwardRef, type InputHTMLAttributes } from 'react';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, id, className = '', ...props }, ref) => {
    const inputId = id ?? props.name;

    return (
      <div className="flex w-full flex-col gap-1.5">
        <label
          htmlFor={inputId}
          className="text-base font-medium text-text-primary"
        >
          {label}
        </label>
        <input
          ref={ref}
          id={inputId}
          className={[
            'min-h-12 w-full rounded-xl border-2 border-slate-300 bg-white px-4 py-3',
            'text-base text-text-primary placeholder:text-slate-400',
            'focus:border-primary-600 focus:outline-none focus:ring-2 focus:ring-primary-100',
            error ? 'border-danger-500' : '',
            className,
          ].join(' ')}
          {...props}
        />
        {error && (
          <p className="text-sm font-medium text-danger-500" role="alert">
            {error}
          </p>
        )}
      </div>
    );
  },
);

Input.displayName = 'Input';
