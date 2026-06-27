import { useTranslation } from 'react-i18next';
import type { ButtonHTMLAttributes, ReactNode } from 'react';

type ButtonVariant = 'primary' | 'secondary' | 'accent' | 'danger' | 'ghost';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  isLoading?: boolean;
  children: ReactNode;
}

const variantClasses: Record<ButtonVariant, string> = {
  primary:
    'bg-primary-700 text-text-on-primary shadow-[var(--shadow-card)] hover:bg-primary-600 active:bg-primary-800',
  accent:
    'bg-accent-500 text-text-on-accent shadow-[var(--shadow-card)] hover:bg-accent-400 active:bg-accent-600',
  secondary:
    'bg-surface-elevated text-text-primary border-2 border-border-default hover:bg-surface active:bg-surface-muted',
  danger:
    'bg-danger-500 text-text-on-primary hover:bg-red-700 active:bg-red-800',
  ghost: 'bg-transparent text-primary-700 hover:bg-primary-50 active:bg-primary-100',
};

export const Button = ({
  variant = 'primary',
  isLoading = false,
  disabled,
  className = '',
  children,
  ...props
}: ButtonProps) => {
  const { t } = useTranslation();

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
      {isLoading ? t('common.loading') : children}
    </button>
  );
};
