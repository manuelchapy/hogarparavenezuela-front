import type { ButtonHTMLAttributes, ReactNode } from 'react';

type ButtonVariant = 'primary' | 'secondary' | 'danger' | 'ghost';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  isLoading?: boolean;
  children: ReactNode;
}

const variantClasses: Record<ButtonVariant, string> = {
  primary:
    'bg-primary-700 text-white hover:bg-primary-800 active:bg-primary-900',
  secondary:
    'bg-white text-text-primary border-2 border-slate-300 hover:bg-slate-50',
  danger: 'bg-danger-500 text-white hover:bg-red-700 active:bg-red-800',
  ghost: 'bg-transparent text-primary-700 hover:bg-primary-50',
};

export const Button = ({
  variant = 'primary',
  isLoading = false,
  disabled,
  className = '',
  children,
  ...props
}: ButtonProps) => {
  return (
    <button
      type="button"
      disabled={disabled || isLoading}
      className={[
        'inline-flex min-h-12 min-w-12 items-center justify-center rounded-xl px-5 py-3',
        'text-base font-semibold transition-colors',
        'disabled:cursor-not-allowed disabled:opacity-50',
        'focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-600',
        variantClasses[variant],
        className,
      ].join(' ')}
      {...props}
    >
      {isLoading ? 'Cargando...' : children}
    </button>
  );
};
