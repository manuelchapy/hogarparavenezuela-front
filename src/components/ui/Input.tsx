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
          className="text-base font-semibold text-text-primary"
        >
          {label}
        </label>
        <input
          ref={ref}
          id={inputId}
          className={[
            'form-field',
            error ? 'border-danger-500 focus:border-danger-500 focus:ring-red-100' : '',
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
