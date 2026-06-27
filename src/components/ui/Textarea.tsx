import { forwardRef, type TextareaHTMLAttributes } from 'react';

interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label: string;
  error?: string;
}

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ label, error, id, className = '', ...props }, ref) => {
    const textareaId = id ?? props.name;

    return (
      <div className="flex w-full flex-col gap-1.5">
        <label
          htmlFor={textareaId}
          className="text-base font-medium text-text-primary"
        >
          {label}
        </label>
        <textarea
          ref={ref}
          id={textareaId}
          className={[
            'min-h-24 w-full rounded-xl border-2 border-slate-300 bg-white px-4 py-3',
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

Textarea.displayName = 'Textarea';
