import type { ReactNode } from 'react';
import { MobileActionPortal } from '@/components/layout/MobileActionFooter';

interface ActionBarProps {
  children: ReactNode;
  className?: string;
}

/** Acciones al final del contenido — visible solo en lg+. */
export const DesktopActionBar = ({
  children,
  className = '',
}: ActionBarProps) => (
  <div
    className={[
      'mt-4 hidden flex-col gap-2 lg:flex lg:flex-row lg:justify-end lg:gap-3',
      className,
    ].join(' ')}
  >
    {children}
  </div>
);

/** Dock móvil en el footer del shell, pegado al AppBottomNav. */
export const StickyActionBar = ({
  children,
  className = '',
}: ActionBarProps) => (
  <MobileActionPortal className={className}>{children}</MobileActionPortal>
);

/** Espacio al final del scroll para no tapar contenido con AppBottomNav (sin action bar). */
export const MobileBottomNavSpacer = () => (
  <div
    className="pointer-events-none shrink-0 lg:hidden"
    style={{ height: 'var(--app-bottom-nav-h)' }}
    aria-hidden
  />
);

/** Reserva espacio al final del scroll para no tapar contenido con el dock móvil. */
export const MobileActionScrollSpacer = () => (
  <div
    className="pointer-events-none shrink-0 lg:hidden"
    style={{ height: 'var(--app-mobile-footer-stack)' }}
    aria-hidden
  />
);

/** Desktop inline + dock móvil pegado al bottom nav. */
export const ResponsiveActionBar = ({
  children,
  className = '',
  desktopClassName = '',
}: ActionBarProps & { desktopClassName?: string }) => (
  <>
    <DesktopActionBar className={desktopClassName}>{children}</DesktopActionBar>
    <MobileActionScrollSpacer />
    <StickyActionBar className={className}>{children}</StickyActionBar>
  </>
);
