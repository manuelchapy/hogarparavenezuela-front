import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/Button';
import { ROUTES } from '@/constants/routes';

/** Vista derecha en escritorio cuando no hay ficha seleccionada (/nna). */
export const NnaListEmptyPage = () => {
  const { t } = useTranslation();

  return (
    <div className="hidden min-h-0 flex-1 flex-col items-center justify-center gap-4 overflow-y-auto p-10 text-center xl:flex">
      <p className="max-w-md text-xl font-bold text-text-primary">
        {t('layout.nnaSelectRecord')}
      </p>
      <p className="max-w-md text-base text-text-secondary">
        {t('layout.nnaSelectRecordHint')}
      </p>
      <Link to={ROUTES.NNA_REGISTER}>
        <Button variant="accent">{t('nna.register')}</Button>
      </Link>
    </div>
  );
};
