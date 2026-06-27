import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import es from '@/i18n/locales/es.json';
import en from '@/i18n/locales/en.json';
import esLegalNotice from '@/i18n/locales/legalNotice.es.json';
import enLegalNotice from '@/i18n/locales/legalNotice.en.json';

const STORAGE_KEY = 'hpv_locale';

const getStoredLocale = (): string => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored === 'en' || stored === 'es') return stored;
  } catch {
    /* ignore */
  }
  return 'es';
};

void i18n.use(initReactI18next).init({
  resources: {
    es: { translation: { ...es, legalNotice: esLegalNotice } },
    en: { translation: { ...en, legalNotice: enLegalNotice } },
  },
  lng: getStoredLocale(),
  fallbackLng: 'es',
  interpolation: { escapeValue: false },
  returnObjects: true,
});

export const setAppLocale = (locale: 'es' | 'en'): void => {
  localStorage.setItem(STORAGE_KEY, locale);
  void i18n.changeLanguage(locale);
};

export default i18n;
