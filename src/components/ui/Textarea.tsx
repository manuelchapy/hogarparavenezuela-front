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
          className="text-base font-semibold text-text-primary"
        >
          {label}
        </label>
        <textarea
          ref={ref}
          id={textareaId}
          className={[
            'form-field min-h-24 resize-y',
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

Textarea.displayName = 'Textarea';
