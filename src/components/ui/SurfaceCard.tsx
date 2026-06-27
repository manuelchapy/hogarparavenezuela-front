import type { ReactNode } from 'react';

interface SurfaceCardProps {
  title?: string;
  description?: string;
  children?: ReactNode;
  className?: string;
  accent?: boolean;
}

export const SurfaceCard = ({
  title,
  description,
  children,
  className = '',
  accent = false,
}: SurfaceCardProps) => (
  <div
    className={[
      accent
        ? 'rounded-2xl border border-feedback-warning-border bg-feedback-warning-bg p-5 shadow-[var(--shadow-card)]'
        : 'surface-card',
      className,
    ].join(' ')}
  >
    {title && (
      <h2
        className={[
          'text-lg font-bold',
          accent ? 'text-feedback-warning-text' : 'text-text-primary',
        ].join(' ')}
      >
        {title}
      </h2>
    )}
    {description && (
      <p
        className={[
          'mt-1 text-base',
          accent ? 'text-feedback-warning-text' : 'text-text-secondary',
        ].join(' ')}
      >
        {description}
      </p>
    )}
    {children && <div className={title || description ? 'mt-4' : ''}>{children}</div>}
  </div>
);
