import type { ReactNode } from 'react';

interface PageFrameProps {
  children: ReactNode;
  header?: ReactNode;
  /** Barra fija bajo el header (p. ej. StepProgress). */
  toolbar?: ReactNode;
  className?: string;
  scrollClassName?: string;
}

/**
 * Escritorio: header/toolbar fijos + scroll.
 * Móvil: header/toolbar scrollean con el contenido (más área útil).
 */
export const PageFrame = ({
  children,
  header,
  toolbar,
  className = '',
  scrollClassName = '',
}: PageFrameProps) => (
  <div className={['flex min-h-0 flex-1 flex-col overflow-hidden', className].join(' ')}>
    {header && <div className="hidden shrink-0 lg:block">{header}</div>}
    {toolbar && <div className="hidden shrink-0 lg:block">{toolbar}</div>}
    <div
      className={[
        'min-h-0 flex-1 overflow-x-hidden overflow-y-auto',
        scrollClassName,
      ].join(' ')}
    >
      {header && <div className="shrink-0 lg:hidden">{header}</div>}
      {toolbar && <div className="shrink-0 lg:hidden">{toolbar}</div>}
      {children}
    </div>
  </div>
);
