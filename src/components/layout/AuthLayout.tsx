import type { ReactNode } from 'react';
import { LocaleSwitcher } from '@/components/ui/LocaleSwitcher';

interface AuthLayoutProps {
  brand: ReactNode;
  children: ReactNode;
  /** Sticky footer — solo móvil (< lg). En escritorio el CTA va dentro de `children`. */
  mobileFooter?: ReactNode;
  showLocale?: boolean;
}

export const AuthLayout = ({
  brand,
  children,
  mobileFooter,
  showLocale = true,
}: AuthLayoutProps) => (
  <div className="flex min-h-dvh w-full flex-col lg:min-h-dvh lg:flex-row">
    <aside className="auth-hero flex shrink-0 flex-col px-5 pb-8 pt-[max(1rem,env(safe-area-inset-top))] lg:w-[min(420px,38vw)] lg:min-h-dvh lg:justify-between lg:px-10 lg:py-10">
      {showLocale && (
        <div className="mb-6 flex justify-end lg:mb-0">
          <LocaleSwitcher variant="onDark" />
        </div>
      )}
      <div className="flex flex-1 flex-col justify-center lg:py-8">{brand}</div>
    </aside>

    <div className="flex min-h-0 min-w-0 flex-1 flex-col bg-surface">
      <div className="flex flex-1 flex-col overflow-y-auto px-5 py-6 lg:px-10 lg:py-10 xl:px-14">
        <div className="w-full lg:max-w-4xl xl:max-w-5xl">{children}</div>
      </div>
      {mobileFooter && (
        <div className="shrink-0 border-t border-border-subtle bg-surface-elevated p-4 pb-[max(1rem,env(safe-area-inset-bottom))] lg:hidden">
          {mobileFooter}
        </div>
      )}
    </div>
  </div>
);
