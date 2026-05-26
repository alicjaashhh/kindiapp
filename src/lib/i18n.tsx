import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

type Lang = 'ru' | 'en';

const dict = {
  ru: {
    home: 'Главная', development: 'Развитие', shop: 'Магазин', articles: 'Статьи', account: 'Аккаунт',
    save: 'Сохранить', cancel: 'Отмена', edit: 'Редактировать', logout: 'Выйти',
    food: 'Еда', sleep: 'Сон', skills: 'Скилы месяца', growth: 'Скачки роста', teeth: 'Прорезывание зубов', vaccines: 'Вакцинации',
    today: 'Сегодня', recommendations: 'Рекомендации', behavior: 'Поведение', teethShort: 'Зубы', weightHeight: 'Рост/вес',
    premium: 'Premium', settings: 'Настройки', language: 'Язык', region: 'Регион',
    parentProfile: 'Профиль родителя', babyProfile: 'Профиль ребёнка',
    name: 'Имя', birth: 'Дата рождения', gender: 'Пол', weight: 'Вес (г)', height: 'Рост (см)',
    boy: 'Мальчик', girl: 'Девочка',
  },
  en: {
    home: 'Home', development: 'Development', shop: 'Shop', articles: 'Articles', account: 'Account',
    save: 'Save', cancel: 'Cancel', edit: 'Edit', logout: 'Sign out',
    food: 'Food', sleep: 'Sleep', skills: 'Skills of the month', growth: 'Growth spurts', teeth: 'Teething', vaccines: 'Vaccinations',
    today: 'Today', recommendations: 'Recommendations', behavior: 'Behavior', teethShort: 'Teeth', weightHeight: 'Weight/Height',
    premium: 'Premium', settings: 'Settings', language: 'Language', region: 'Region',
    parentProfile: 'Parent profile', babyProfile: 'Baby profile',
    name: 'Name', birth: 'Birth date', gender: 'Gender', weight: 'Weight (g)', height: 'Height (cm)',
    boy: 'Boy', girl: 'Girl',
  },
} as const;

type Key = keyof typeof dict['ru'];

interface Ctx { lang: Lang; setLang: (l: Lang) => void; t: (k: Key) => string; region: string; setRegion: (r: string) => void; }
const I18nCtx = createContext<Ctx>({ lang: 'ru', setLang: () => {}, t: (k) => k, region: 'cis', setRegion: () => {} });

const regionToLang = (r: string): Lang => (r === 'cis' ? 'ru' : 'en');

export const I18nProvider = ({ children }: { children: ReactNode }) => {
  const [region, setRegionState] = useState<string>(() => localStorage.getItem('kindi_region') || 'cis');
  const [lang, setLangState] = useState<Lang>(() => regionToLang(localStorage.getItem('kindi_region') || 'cis'));

  useEffect(() => {
    const onStorage = () => {
      const r = localStorage.getItem('kindi_region') || 'cis';
      setRegionState(r); setLangState(regionToLang(r));
    };
    window.addEventListener('storage', onStorage);
    window.addEventListener('kindi-lang-change', onStorage);
    return () => { window.removeEventListener('storage', onStorage); window.removeEventListener('kindi-lang-change', onStorage); };
  }, []);

  const setRegion = (r: string) => {
    localStorage.setItem('kindi_region', r);
    setRegionState(r); setLangState(regionToLang(r));
    window.dispatchEvent(new Event('kindi-lang-change'));
  };
  const setLang = (l: Lang) => setLangState(l);
  const t = (k: Key) => dict[lang][k] || k;

  return <I18nCtx.Provider value={{ lang, setLang, t, region, setRegion }}>{children}</I18nCtx.Provider>;
};

export const useI18n = () => useContext(I18nCtx);
