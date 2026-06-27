import { useTranslation } from 'react-i18next';
import { setAppLocale } from '@/i18n';

type LocaleSwitcherVariant = 'default' | 'onDark';

interface LocaleSwitcherProps {
  variant?: LocaleSwitcherVariant;
}

export const LocaleSwitcher = ({ variant = 'default' }: LocaleSwitcherProps) => {
  const { i18n, t } = useTranslation();
  const isEs = i18n.language.startsWith('es');
  const label = isEs ? t('locale.switchToEn') : t('locale.switchToEs');

  const variantClasses =
    variant === 'onDark'
      ? 'border-primary-600/50 bg-primary-900/40 text-primary-100 hover:bg-primary-800/60'
      : 'border-border-default bg-surface-elevated text-text-primary hover:bg-surface';

  return (
    <button
      type="button"
      onClick={() => setAppLocale(isEs ? 'en' : 'es')}
      className={[
        'inline-flex min-h-12 items-center gap-2 rounded-full border-2 px-4 py-2',
        'text-sm font-bold transition-colors',
        variantClasses,
      ].join(' ')}
      aria-label={label}
    >
      <span className="text-base" aria-hidden>
        {isEs ? '🇺🇸' : '🇻🇪'}
      </span>
      {label}
    </button>
  );
};
