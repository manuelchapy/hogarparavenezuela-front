import { useTranslation } from 'react-i18next';
import type {
  LopnnaLegalBlock,
  LopnnaLegalVariant,
} from '@/constants/lopnnaLegal';

interface LopnnaLegalNoticeProps {
  variant: LopnnaLegalVariant;
  className?: string;
  /** Colapsado por defecto — útil en flujos urgentes (registro NNA). */
  collapsible?: boolean;
  defaultOpen?: boolean;
}

const LegalBody = ({
  block,
  showNormativeBase,
}: {
  block: LopnnaLegalBlock;
  showNormativeBase: boolean;
}) => {
  const { t } = useTranslation();

  return (
    <>
      {showNormativeBase && block.articles && block.articles.length > 0 && (
        <p className="text-sm font-medium opacity-90">
          {t('legalNotice.normativeBase')} {block.articles.join(' · ')}
        </p>
      )}

      <div className="flex flex-col gap-3">
        {block.paragraphs.map((paragraph) => (
          <p key={paragraph.slice(0, 48)} className="leading-relaxed">
            {paragraph}
          </p>
        ))}
      </div>
    </>
  );
};

export const LopnnaLegalNotice = ({
  variant,
  className = '',
  collapsible = false,
  defaultOpen = false,
}: LopnnaLegalNoticeProps) => {
  const { t } = useTranslation();
  const block = t(`legalNotice.${variant}`, {
    returnObjects: true,
  }) as LopnnaLegalBlock;
  const isCompact = variant === 'compact';

  const shellClass = [
    'rounded-2xl border-2 border-feedback-warning-border bg-feedback-warning-bg text-feedback-warning-text',
    isCompact ? 'text-sm' : 'text-base',
    className,
  ].join(' ');

  if (collapsible) {
    return (
      <details
        className={[shellClass, 'group p-0'].join(' ')}
        open={defaultOpen || undefined}
        role="note"
        aria-label={block.title}
      >
        <summary
          className={[
            'flex min-h-12 cursor-pointer list-none items-center justify-between gap-3 px-4 py-3',
            'font-semibold leading-snug marker:content-none',
            '[&::-webkit-details-marker]:hidden',
          ].join(' ')}
        >
          <span className="min-w-0 flex-1">{block.title}</span>
          <span className="flex shrink-0 items-center gap-1 text-sm font-medium opacity-90">
            <span className="hidden sm:inline">{t('legalNotice.expandHint')}</span>
            <span
              className="inline-block transition-transform group-open:rotate-180"
              aria-hidden
            >
              ▼
            </span>
          </span>
        </summary>

        <div className="flex flex-col gap-3 border-t border-feedback-warning-border/40 px-4 pb-4 pt-3">
          <LegalBody block={block} showNormativeBase />
        </div>
      </details>
    );
  }

  return (
    <aside className={[shellClass, 'p-4'].join(' ')} role="note" aria-label={block.title}>
      <p className="font-semibold leading-snug">{block.title}</p>
      <div className="mt-3 flex flex-col gap-3">
        <LegalBody block={block} showNormativeBase />
      </div>
    </aside>
  );
};
