import {
  LOPNNA_LEGAL_BLOCKS,
  type LopnnaLegalVariant,
} from '@/constants/lopnnaLegal';

interface LopnnaLegalNoticeProps {
  variant: LopnnaLegalVariant;
  className?: string;
}

export const LopnnaLegalNotice = ({
  variant,
  className = '',
}: LopnnaLegalNoticeProps) => {
  const block = LOPNNA_LEGAL_BLOCKS[variant];
  const isCompact = variant === 'compact';

  return (
    <aside
      className={[
        'rounded-2xl border-2 border-amber-300 bg-amber-50 p-4 text-amber-950',
        isCompact ? 'text-sm' : 'text-base',
        className,
      ].join(' ')}
      role="note"
      aria-label={block.title}
    >
      <p className="font-semibold leading-snug">{block.title}</p>

      {block.articles && block.articles.length > 0 && (
        <p className="mt-2 text-sm font-medium text-amber-900/90">
          Base normativa: {block.articles.join(' · ')}
        </p>
      )}

      <div className="mt-3 flex flex-col gap-3">
        {block.paragraphs.map((paragraph) => (
          <p key={paragraph.slice(0, 48)} className="leading-relaxed">
            {paragraph}
          </p>
        ))}
      </div>
    </aside>
  );
};
