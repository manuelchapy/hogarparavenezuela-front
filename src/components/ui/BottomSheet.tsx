import { useEffect, type ReactNode } from 'react';

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
      className="fixed inset-0 z-50 flex flex-col justify-end bg-black/50"
      role="dialog"
      aria-modal="true"
      aria-label={title}
      onClick={onClose}
    >
      <div
        className="max-h-[85dvh] w-full animate-[slideUp_0.25s_ease-out] overflow-y-auto rounded-t-2xl bg-white p-4 pb-8 shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-bold text-text-primary">{title}</h2>
          <button
            type="button"
            onClick={onClose}
            className="flex min-h-12 min-w-12 items-center justify-center rounded-full text-2xl text-slate-500"
            aria-label="Cerrar"
          >
            ×
          </button>
        </div>
        {children}
      </div>
    </div>
  );
};
