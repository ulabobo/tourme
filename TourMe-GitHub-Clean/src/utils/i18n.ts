import { useAppStore } from '../store/useAppStore';

export type AppLanguage = 'en' | 'ru' | 'uz';
export type StoreLanguageName = 'English' | 'Russian' | 'Uzbek' | 'German';

export interface TranslationDictionary {
  // Top Professional Navbar
  brandSubtitle: string;
  dbSynced: string;
  offlineReady: string;
  walletBtn: string;
  sosBadge: string;

  // Bottom Navigation
  navHome: string;
  navExplore: string;
  navTrip: string;
  navSafety: string;
  navMe: string;

  // Onboarding & Auth (A1-A4)
  welcomeHeroTitle: string;
  welcomeHeroSubtitle: string;
  getStartedBtn: string;
  alreadyHaveAccountBtn: string;
  createAccountTitle: string;
  signInSubtitle: string;
  continueWithApple: string;
  continueWithGoogle: string;
  continueBtn: string;

  // Legal & Consent (Terms of Use, Privacy Policy, Data Request)
  termsCheckboxLabel: string;
  termsLinkText: string;
  privacyLinkText: string;
  dataConsentCheckboxLabel: string;
  gpsCameraConsentLabel: string;
  permissionPromptTitle: string;
  permissionPromptDesc: string;
  grantPermissionsBtn: string;
  termsModalTitle: string;
  privacyModalTitle: string;
  dataModalTitle: string;
  legalAcceptBtn: string;

  // Home & Explore (D1-D7)
  goodMorning: string;
  todayInSamarkand: string;
  safetyHeartbeat: string;
  quickActions: string;
  nextStop: string;
  rideWithYandexGo: string;
  offlineWalkingDirections: string;
  unlockAllScansWithPro: string;
  translatedMenu: string;
  aiSettings: string;
  languageLabel: string;

  // Cloud DB & AppMetrica Telemetry
  cloudDbSectionTitle: string;
  appMetricaSectionTitle: string;
  syncNowBtn: string;
}

export const TRANSLATIONS: Record<AppLanguage, TranslationDictionary> = {
  en: {
    brandSubtitle: 'Silk Road Concierge',
    dbSynced: '● Online',
    offlineReady: '○ Offline',
    walletBtn: 'Wallet',
    sosBadge: '112 SOS',

    navHome: 'Home',
    navExplore: 'Explore',
    navTrip: 'Trip',
    navSafety: 'Safety',
    navMe: 'Me',

    welcomeHeroTitle: 'Uzbekistan,\nwithout the stress.',
    welcomeHeroSubtitle: 'Trains, taxis, cash and safety — in one app.',
    getStartedBtn: 'Get started',
    alreadyHaveAccountBtn: 'I already have an account',
    createAccountTitle: 'Create your\naccount',
    signInSubtitle: 'Save your tickets, hotels and E-Mehmon slips offline.',
    continueWithApple: 'Continue with Apple',
    continueWithGoogle: 'Continue with Google',
    continueBtn: 'Continue',

    termsCheckboxLabel: 'I agree to the',
    termsLinkText: 'Terms of Use',
    privacyLinkText: 'Privacy Policy',
    dataConsentCheckboxLabel:
      'I consent to personal, passport & E-Mehmon data processing (Law O‘RQ-547 & GDPR).',
    gpsCameraConsentLabel:
      'Allow GPS location (Safety Heartbeat & Yandex Go) and Camera (Menu OCR & E-Mehmon).',
    permissionPromptTitle: 'Device & Data Permissions',
    permissionPromptDesc:
      'To provide automatic E-Mehmon compliance, live Yandex Go taxi routing, and Safety Heartbeat protection, please confirm your data permissions:',
    grantPermissionsBtn: 'Confirm & Grant Access',
    termsModalTitle: 'Terms of Use · TourMe Uzbekistan',
    privacyModalTitle: 'Privacy Policy & Data Protection',
    dataModalTitle: 'Personal Data & Device Permissions',
    legalAcceptBtn: 'I Understand & Accept',

    goodMorning: 'Good morning',
    todayInSamarkand: 'Today in\nSamarkand',
    safetyHeartbeat: 'Safety Heartbeat',
    quickActions: 'Quick actions',
    nextStop: 'NEXT STOP · 10:30',
    rideWithYandexGo: 'Ride there with Yandex Go',
    offlineWalkingDirections: 'Offline walking directions',
    unlockAllScansWithPro: 'Unlock all scans with Pro',
    translatedMenu: 'Translated menu',
    aiSettings: 'AI Key',
    languageLabel: 'EN',

    cloudDbSectionTitle: 'Cloud Database & Offline Sync',
    appMetricaSectionTitle: 'Yandex AppMetrica Telemetry',
    syncNowBtn: 'Sync Database Now',
  },
  ru: {
    brandSubtitle: 'Гид по Шелковому пути',
    dbSynced: '● Online',
    offlineReady: '○ Offline',
    walletBtn: 'Кошелек',
    sosBadge: '112 SOS',

    navHome: 'Главная',
    navExplore: 'Карта',
    navTrip: 'Поездка',
    navSafety: 'Защита',
    navMe: 'Профиль',

    welcomeHeroTitle: 'Узбекистан,\nбез лишнего стресса.',
    welcomeHeroSubtitle: 'Поезда, такси, валюта и безопасность — в одном приложении.',
    getStartedBtn: 'Начать путешествие',
    alreadyHaveAccountBtn: 'У меня уже есть аккаунт',
    createAccountTitle: 'Создайте\nаккаунт',
    signInSubtitle: 'Сохраняйте билеты, отели и талоны E-Mehmon офлайн.',
    continueWithApple: 'Войти через Apple',
    continueWithGoogle: 'Войти через Google',
    continueBtn: 'Продолжить',

    termsCheckboxLabel: 'Я принимаю',
    termsLinkText: 'Условия использования',
    privacyLinkText: 'Политику конфиденциальности',
    dataConsentCheckboxLabel:
      'Я даю согласие на обработку персональных и паспортных данных (ЗРУ-547 и GDPR).',
    gpsCameraConsentLabel:
      'Разрешить доступ к GPS (Safety Heartbeat и Yandex Go) и Камере (Сканер меню и E-Mehmon).',
    permissionPromptTitle: 'Разрешения на данные и устройство',
    permissionPromptDesc:
      'Для проверки регистрации E-Mehmon, вызова такси Yandex Go и работы функции безопасности Safety Heartbeat подтвердите доступ:',
    grantPermissionsBtn: 'Подтвердить и разрешить',
    termsModalTitle: 'Условия использования · TourMe Uzbekistan',
    privacyModalTitle: 'Политика конфиденциальности и защиты данных',
    dataModalTitle: 'Обработка персональных данных и доступы',
    legalAcceptBtn: 'Принимаю условия',

    goodMorning: 'Доброе утро',
    todayInSamarkand: 'Сегодня в\nСамарканде',
    safetyHeartbeat: 'Safety Heartbeat · Пульс',
    quickActions: 'Быстрые действия',
    nextStop: 'СЛЕД. ОСТАНОВКА · 10:30',
    rideWithYandexGo: 'Поехать с Yandex Go',
    offlineWalkingDirections: 'Пеший маршрут офлайн',
    unlockAllScansWithPro: 'Открыть все блюда с Pro',
    translatedMenu: 'Перевод меню',
    aiSettings: 'AI Ключ',
    languageLabel: 'RU',

    cloudDbSectionTitle: 'Облачная БД и Офлайн-синхронизация',
    appMetricaSectionTitle: 'Телеметрия Yandex AppMetrica',
    syncNowBtn: 'Синхронизировать БД',
  },
  uz: {
    brandSubtitle: 'Ipak Yo‘li Hamrohingiz',
    dbSynced: '● Online',
    offlineReady: '○ Offline',
    walletBtn: 'Hamyon',
    sosBadge: '112 SOS',

    navHome: 'Asosiy',
    navExplore: 'Xarita',
    navTrip: 'Sayohat',
    navSafety: 'Himoya',
    navMe: 'Profil',

    welcomeHeroTitle: 'O‘zbekiston —\nxavotirsiz sayohat.',
    welcomeHeroSubtitle: 'Poyezdlar, taksi, valyuta va xavfsizlik — bitta ilovada.',
    getStartedBtn: 'Boshlash',
    alreadyHaveAccountBtn: 'Menda akkaunt bor',
    createAccountTitle: 'Akkaunt\nyaratish',
    signInSubtitle: 'Chiptalar, mehmonxona va E-Mehmon kvitansiyalarini oflayn saqlang.',
    continueWithApple: 'Apple orqali davom etish',
    continueWithGoogle: 'Google orqali davom etish',
    continueBtn: 'Davom etish',

    termsCheckboxLabel: 'Men qabul qilaman:',
    termsLinkText: 'Foydalanish shartlari',
    privacyLinkText: 'Maxfiylik siyosati',
    dataConsentCheckboxLabel:
      'Shaxsiy, pasport va E-Mehmon ma’lumotlarim qayta ishlanishiga roziman (O‘RQ-547 va GDPR).',
    gpsCameraConsentLabel:
      'GPS joylashuv (Safety Heartbeat va Yandex Go) hamda Kamera (Menyu skaneri va E-Mehmon) uchun ruxsat beraman.',
    permissionPromptTitle: 'Ma’lumotlar va Qurilma Ruxsatnomalari',
    permissionPromptDesc:
      'E-Mehmon ro‘yxatidan o‘tishni tekshirish, Yandex Go taksi chaqirish va Safety Heartbeat himoyasi ishlashi uchun ruxsatlarni tasdiqlang:',
    grantPermissionsBtn: 'Tasdiqlash va Ruxsat berish',
    termsModalTitle: 'Foydalanish shartlari · TourMe Uzbekistan',
    privacyModalTitle: 'Maxfiylik siyosati va Ma’lumotlar himoyasi',
    dataModalTitle: 'Shaxsiy ma’lumotlar va Qurilma ruxsatlari',
    legalAcceptBtn: 'Tushundim va Qabul qilaman',

    goodMorning: 'Xayrli tong',
    todayInSamarkand: 'Bugun\nSamarqandda',
    safetyHeartbeat: 'Safety Heartbeat · Himoya',
    quickActions: 'Tezkor amallar',
    nextStop: 'KEYINGI MANZIL · 10:30',
    rideWithYandexGo: 'Yandex Go orqali borish',
    offlineWalkingDirections: 'Oflayn piyoda yo‘nalish',
    unlockAllScansWithPro: 'Pro bilan barchasini ochish',
    translatedMenu: 'Tarjima qilingan taomnoma',
    aiSettings: 'AI Kalit',
    languageLabel: 'UZ',

    cloudDbSectionTitle: 'Ma’lumotlar ombori (Cloud DB & Oflayn)',
    appMetricaSectionTitle: 'Yandex AppMetrica Analitika',
    syncNowBtn: 'Bazani sinxronlash',
  },
};

function storeLangToCode(storeLang: StoreLanguageName): AppLanguage {
  if (storeLang === 'Uzbek') return 'uz';
  if (storeLang === 'Russian') return 'ru';
  return 'en';
}

function codeToStoreLang(code: AppLanguage): StoreLanguageName {
  if (code === 'uz') return 'Uzbek';
  if (code === 'ru') return 'Russian';
  return 'English';
}

export function useI18n() {
  const storeLang = useAppStore((s) => s.userProfile.preferences.language);
  const preferences = useAppStore((s) => s.userProfile.preferences);
  const updateUserProfile = useAppStore((s) => s.updateUserProfile);
  const showToast = useAppStore((s) => s.showToast);

  const lang = storeLangToCode(storeLang);

  const setLanguage = (nextLang: AppLanguage) => {
    updateUserProfile({
      preferences: {
        ...preferences,
        language: codeToStoreLang(nextLang),
      },
    });
    const label =
      nextLang === 'uz'
        ? "Til O'zbekchaga o'zgartirildi (UZ)"
        : nextLang === 'ru'
          ? 'Язык изменен на Русский (RU)'
          : 'Language switched to English (EN)';
    showToast(label, 'info');
  };

  const cycleLanguage = () => {
    const order: AppLanguage[] = ['en', 'uz', 'ru'];
    const next = order[(order.indexOf(lang) + 1) % order.length];
    setLanguage(next);
  };

  return {
    lang,
    t: TRANSLATIONS[lang] || TRANSLATIONS.en,
    setLanguage,
    cycleLanguage,
  };
}
