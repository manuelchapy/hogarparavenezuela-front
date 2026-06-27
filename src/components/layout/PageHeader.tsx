import type { ReactNode } from 'react';
import { Link } from 'react-router-dom';
import { LocaleSwitcher } from '@/components/ui/LocaleSwitcher';

interface PageHeaderProps {
  backTo?: string;
  backLabel?: string;
  title: string;
  subtitle?: string;
  badge?: ReactNode;
  trailing?: ReactNode;
  /** Locale en header; en AppShell el sidebar ya lo incluye (lg+). */
  showLocale?: boolean;
  /** Ocultar enlace atrás en lg+ (navegación vía sidebar). */
  hideBackOnDesktop?: boolean;
}

export const PageHeader = ({
  backTo,
  backLabel,
  title,
  subtitle,
  badge,
  trailing,
  showLocale = false,
  hideBackOnDesktop = true,
}: PageHeaderProps) => (
  <header className="shrink-0 border-b border-border-subtle bg-surface-elevated lg:shadow-[var(--shadow-card)]">
    <div className="px-4 py-3 lg:px-8 lg:py-5">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0 flex-1">
          {backTo && backLabel && (
            <Link
              to={backTo}
              className={[
                'inline-flex min-h-10 items-center text-sm font-semibold text-primary-600',
                hideBackOnDesktop ? 'lg:hidden' : '',
              ].join(' ')}
            >
              {backLabel}
            </Link>
          )}
          <div className="mt-1 flex items-start justify-between gap-3">
            <div className="min-w-0">
              <h1 className="text-lg font-bold tracking-tight text-text-primary lg:text-2xl">
                {title}
              </h1>
              {subtitle && (
                <p className="mt-1 text-base text-text-secondary">{subtitle}</p>
              )}
            </div>
            {badge}
          </div>
        </div>
        <div className="flex shrink-0 items-center gap-1">
          {trailing}
          {showLocale && (
            <span className="lg:hidden">
              <LocaleSwitcher />
            </span>
          )}
        </div>
      </div>
    </div>
  </header>
);
