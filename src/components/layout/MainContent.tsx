import type { ReactNode } from 'react';

interface MainContentProps {
  children: ReactNode;
  className?: string;
  /** Ancho máximo interno opcional (formularios); no aplica al shell. */
  constrain?: 'none' | 'form' | 'reading';
}

const constrainClasses = {
  none: 'w-full',
  form: 'w-full max-w-3xl',
  reading: 'w-full max-w-prose',
};

export const MainContent = ({
  children,
  className = '',
  constrain = 'none',
}: MainContentProps) => (
  <div className={['w-full', constrainClasses[constrain], className].join(' ')}>
    {children}
  </div>
);
