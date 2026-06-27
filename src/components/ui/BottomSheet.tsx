import { useEffect, type ReactNode } from 'react';
import { useTranslation } from 'react-i18next';

interface BottomSheetProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: ReactNode;
}

export const BottomSheet = ({
  isOpen,
  onClose,
  title,
  children,
}: BottomSheetProps) => {
  const { t } = useTranslation();

  useEffect(() => {
    if (!isOpen) return;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex flex-col justify-end bg-black/50 md:items-center md:justify-center md:p-4"
      role="dialog"
      aria-modal="true"
      aria-label={title}
      onClick={onClose}
    >
      <div
        className={[
          'max-h-[85dvh] w-full overflow-y-auto bg-surface-elevated shadow-2xl',
          'animate-[slideUp_0.25s_ease-out] rounded-t-2xl p-4 pb-8',
          'md:max-h-[min(85dvh,640px)] md:max-w-lg md:animate-none md:rounded-2xl md:p-6',
        ].join(' ')}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-bold text-text-primary">{title}</h2>
          <button
            type="button"
            onClick={onClose}
            className="flex min-h-12 min-w-12 items-center justify-center rounded-full text-2xl text-text-secondary"
            aria-label={t('common.close')}
          >
            ×
          </button>
        </div>
        {children}
      </div>
    </div>
  );
};
