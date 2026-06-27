import type { ReactNode } from 'react';

type AlertTone = 'success' | 'warning' | 'error' | 'info';

interface AlertBannerProps {
  tone?: AlertTone;
  children: ReactNode;
  className?: string;
}

const toneClasses: Record<AlertTone, string> = {
  success: 'bg-feedback-success-bg text-feedback-success-text border-feedback-success-border',
  warning: 'bg-feedback-warning-bg text-feedback-warning-text border-feedback-warning-border',
  error: 'bg-feedback-error-bg text-feedback-error-text border-feedback-error-border',
  info: 'bg-feedback-info-bg text-feedback-info-text border-feedback-info-border',
};

export const AlertBanner = ({
  tone = 'info',
  children,
  className = '',
}: AlertBannerProps) => (
  <p
    className={[
      'rounded-xl border px-4 py-3 text-base leading-relaxed',
      toneClasses[tone],
      className,
    ].join(' ')}
    role="alert"
  >
    {children}
  </p>
);
