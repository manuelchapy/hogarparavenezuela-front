import { useEffect, useLayoutEffect, useRef, useState, type ReactNode } from 'react';
import { createPortal } from 'react-dom';
import { AppBottomNav } from '@/components/layout/AppBottomNav';

export const MOBILE_ACTION_ROOT_ID = 'mobile-action-root';

const syncFooterMetrics = (footer: HTMLElement) => {
  const nav = footer.querySelector<HTMLElement>('[data-app-bottom-nav]');
  const actionRoot = footer.querySelector<HTMLElement>(`#${MOBILE_ACTION_ROOT_ID}`);

  const footerHeight = footer.offsetHeight;
  const navHeight = nav?.offsetHeight ?? footerHeight;
  const actionHeight = actionRoot?.offsetHeight ?? 0;

  document.documentElement.style.setProperty(
    '--app-mobile-footer-stack',
    `${footerHeight}px`,
  );
  document.documentElement.style.setProperty('--app-bottom-nav-h', `${navHeight}px`);
  document.documentElement.style.setProperty('--app-mobile-action-h', `${actionHeight}px`);
};

/** Footer móvil: dock de acciones + menú inferior, siempre contiguos en el DOM. */
export const AppMobileFooter = () => {
  const footerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const footer = footerRef.current;
    if (!footer) return;

    const update = () => syncFooterMetrics(footer);
    update();

    const observer = new ResizeObserver(update);
    observer.observe(footer);

    const actionRoot = footer.querySelector(`#${MOBILE_ACTION_ROOT_ID}`);
    if (actionRoot) observer.observe(actionRoot);

    return () => observer.disconnect();
  }, []);

  return (
    <div ref={footerRef} className="flex shrink-0 flex-col lg:hidden">
      <div
        id={MOBILE_ACTION_ROOT_ID}
        className="empty:hidden [&:not(:empty)]:border-t [&:not(:empty)]:border-border-subtle [&:not(:empty)]:bg-surface-elevated"
      />
      <AppBottomNav />
    </div>
  );
};

interface MobileActionPortalProps {
  children: ReactNode;
  className?: string;
}

/** Renderiza acciones móviles en el footer del shell, encima del bottom nav. */
export const MobileActionPortal = ({
  children,
  className = '',
}: MobileActionPortalProps) => {
  const [root, setRoot] = useState<HTMLElement | null>(null);

  useLayoutEffect(() => {
    setRoot(document.getElementById(MOBILE_ACTION_ROOT_ID));
  }, []);

  if (!root) return null;

  return createPortal(
    <div className={['flex flex-col gap-2 p-3', className].join(' ')}>{children}</div>,
    root,
  );
};
