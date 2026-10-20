import React, { useState } from 'react';
import { AppMetricaService } from '../../services/analytics/appMetricaService';
import { CloudDatabaseService } from '../../services/database/cloudDbService';
import { useAppStore } from '../../store/useAppStore';
import { useI18n } from '../../utils/i18n';

export type LegalModalType = 'terms' | 'privacy' | 'permissions' | null;

interface LegalModalProps {
  activeModal: LegalModalType;
  onClose: () => void;
  onAcceptAll?: () => void;
}

export const LegalAndDataModals: React.FC<LegalModalProps> = ({
  activeModal,
  onClose,
  onAcceptAll,
}) => {
  const { lang, t } = useI18n();
  const showToast = useAppStore((s) => s.showToast);

  const [permPassport, setPermPassport] = useState(true);
  const [permGps, setPermGps] = useState(true);
  const [permCamera, setPermCamera] = useState(true);
  const [permAnalytics, setPermAnalytics] = useState(true);

  if (!activeModal) return null;

  const handleConfirmSave = () => {
    void CloudDatabaseService.upsertRecord('consents', {
      id: 'primary-user-consent',
      terms_of_use_accepted: true,
      privacy_policy_accepted: true,
      personal_data_processing_accepted: permPassport,
      gps_tracking_consent: permGps,
      camera_ocr_consent: permCamera,
      appmetrica_consent: permAnalytics,
      policy_version: '2026.10-v2',
      accepted_at: new Date().toISOString(),
    });

    AppMetricaService.trackEvent('user_legal_consent_saved', {
      modal: activeModal,
      permPassport,
      permGps,
      permCamera,
      permAnalytics,
      lang,
    });

    if (onAcceptAll) onAcceptAll();
    showToast(
      lang === 'uz'
        ? 'Huquqiy shartlar va ma’lumotlar ruxsatnomasi saqlandi!'
        : lang === 'ru'
          ? 'Условия и разрешения на данные сохранены!'
          : 'Legal terms & data permissions saved to database!',
      'success'
    );
    onClose();
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={
        activeModal === 'terms'
          ? t.termsModalTitle
          : activeModal === 'privacy'
            ? t.privacyModalTitle
            : t.dataModalTitle
      }
      className="fixed inset-0 z-50 bg-black/65 backdrop-blur-xs flex items-end sm:items-center justify-center p-3"
    >
      <div className="w-full max-w-[385px] bg-[#F6F2EA] text-[#111111] rounded-[30px] p-5 shadow-2xl border border-black/10 max-h-[82vh] flex flex-col justify-between">
        <div className="overflow-y-auto pr-1 space-y-3">
          <div className="flex items-start justify-between gap-2">
            <div>
              <span className="inline-block bg-[#EBC878] text-[#111111] text-[10px] font-bold uppercase px-2.5 py-0.5 rounded-full">
                O‘RQ-547 · GDPR · TourMe Legal
              </span>
              <h3 className="mt-1.5 text-[19px] font-bold leading-snug">
                {activeModal === 'terms'
                  ? t.termsModalTitle
                  : activeModal === 'privacy'
                    ? t.privacyModalTitle
                    : t.permissionPromptTitle}
              </h3>
            </div>
            <button
              type="button"
              onClick={onClose}
              aria-label="Close legal modal"
              className="w-8 h-8 rounded-full bg-white text-[#111111] font-bold text-sm flex items-center justify-center shadow-xs shrink-0"
            >
              ✕
            </button>
          </div>

          {activeModal === 'terms' && (
            <div className="text-[13px] text-[#3E3B36] space-y-2.5 leading-relaxed">
              <p>
                <strong>1. Service Scope:</strong> Uzbekistan Travel Companion (TourMe) provides
                rail/transfer itinerary planning, E-Mehmon registration tracking, Yandex Go deep-link
                routing, AI menu translation, and Safety Heartbeat monitoring across Uzbekistan.
              </p>
              <p>
                <strong>2. E-Mehmon & Border Compliance:</strong> Under Uzbekistan Tourism
                Regulations, foreign visitors must be registered via E-Mehmon for every night of stay.
                User-uploaded receipts are stored offline in your Encrypted Wallet and distinguished
                from official hotel API verifications.
              </p>
              <p>
                <strong>3. Emergency SOS & Dead Man’s Switch:</strong> The 112 Tourist Police dispatch
                and Dead Man’s Switch require active GPS permission. Test Mode simulations do not
                contact real emergency authorities.
              </p>
              <p>
                <strong>4. Bookings & Vouchers:</strong> Transport tickets, hotel reservations, and
                B2B merchant vouchers generate deterministic QR codes accessible offline.
              </p>
            </div>
          )}

          {activeModal === 'privacy' && (
            <div className="text-[13px] text-[#3E3B36] space-y-2.5 leading-relaxed">
              <p>
                <strong>1. Law O‘RQ-547 & GDPR Compliance:</strong> Your personal data is processed
                strictly in accordance with the Law of the Republic of Uzbekistan No. O‘RQ-547 “On
                Personal Data” and EU GDPR principles.
              </p>
              <p>
                <strong>2. Passport & Medical Data Masking:</strong> Full passport numbers and payment
                card credentials are never stored in plaintext browser storage. Emergency medical info
                (blood type, allergies, emergency contact) is only shared if an SOS alert is triggered.
              </p>
              <p>
                <strong>3. Local-First & Cloud Database Storage:</strong> Offline Wallet tickets and
                E-Mehmon receipt images are stored in your device’s IndexedDB and synchronized with
                Supabase Cloud Database when online.
              </p>
              <p>
                <strong>4. Yandex AppMetrica & Deep Links:</strong> Anonymous route telemetry and
                Yandex Go deep-link handoffs use AppMetrica attribution solely to improve navigation
                reliability.
              </p>
            </div>
          )}

          {activeModal === 'permissions' && (
            <div className="space-y-2.5">
              <p className="text-[12px] text-[#6E6A63] leading-snug">
                {t.permissionPromptDesc}
              </p>

              {[
                {
                  id: 'passport',
                  title:
                    lang === 'uz'
                      ? 'Shaxsiy, Fuqarolik va E-Mehmon ma’lumotlari'
                      : lang === 'ru'
                        ? 'Персональные, визовые и E-Mehmon данные'
                        : 'Personal, Visa & E-Mehmon Data',
                  desc:
                    lang === 'uz'
                      ? '30 kunlik vizasiz rejim va mehmonxona registratsiyasini hisoblash uchun'
                      : lang === 'ru'
                        ? 'Для расчета безвизового режима и контроля регистрации в отелях'
                        : 'Required to calculate 30-day visa-free status & nightly hotel compliance',
                  checked: permPassport,
                  toggle: () => setPermPassport((v) => !v),
                },
                {
                  id: 'gps',
                  title:
                    lang === 'uz'
                      ? 'GPS Geomalumot (Safety Heartbeat & Yandex Go)'
                      : lang === 'ru'
                        ? 'GPS Геолокация (Safety Heartbeat и Yandex Go)'
                        : 'GPS Geolocation (Safety Heartbeat & Yandex Go)',
                  desc:
                    lang === 'uz'
                      ? 'Yandex Go taksi chaqirish va tog‘/cho‘l hududlarida SOS himoyasi uchun'
                      : lang === 'ru'
                        ? 'Для точной подачи такси и защиты в горах Чимгана / Айдаркуле'
                        : 'Used for 1-tap Yandex Go rides, ATM radar & Dead Man’s Switch safety pings',
                  checked: permGps,
                  toggle: () => setPermGps((v) => !v),
                },
                {
                  id: 'camera',
                  title:
                    lang === 'uz'
                      ? 'Kamera va Oflayn Fayl Xotirasi (IndexedDB)'
                      : lang === 'ru'
                        ? 'Камера и Офлайн-хранилище (IndexedDB)'
                        : 'Camera & Offline Storage (IndexedDB)',
                  desc:
                    lang === 'uz'
                      ? 'AI Menyu Skaneri va E-Mehmon kvitansiyalarini skanerlash uchun'
                      : lang === 'ru'
                        ? 'Для AI-перевода меню и загрузки квитанций E-Mehmon'
                        : 'Used for AI Menu OCR translation and saving E-Mehmon slips offline',
                  checked: permCamera,
                  toggle: () => setPermCamera((v) => !v),
                },
                {
                  id: 'analytics',
                  title: 'Yandex AppMetrica & Cloud DB Sync',
                  desc:
                    lang === 'uz'
                      ? 'Marshrut xatoliklarini tahlil qilish va bulutli zaxira nusxasi'
                      : lang === 'ru'
                        ? 'Аналитика маршрутов и резервное копирование билетов в облако'
                        : 'Synchronize bookings to Cloud DB & log AppMetrica route telemetry',
                  checked: permAnalytics,
                  toggle: () => setPermAnalytics((v) => !v),
                },
              ].map((item) => (
                <label
                  key={item.id}
                  className="bg-white rounded-2xl p-3 flex items-start justify-between gap-3 cursor-pointer border border-black/5"
                >
                  <div>
                    <div className="text-[13px] font-bold text-[#111111]">
                      {item.title}
                    </div>
                    <div className="text-[11px] text-[#6E6A63] mt-0.5 leading-snug">
                      {item.desc}
                    </div>
                  </div>
                  <input
                    type="checkbox"
                    checked={item.checked}
                    onChange={item.toggle}
                    className="mt-1 w-4 h-4 accent-[#111111] rounded shrink-0"
                  />
                </label>
              ))}
            </div>
          )}
        </div>

        <div className="pt-3 mt-2 border-t border-black/10 flex gap-2">
          <button
            type="button"
            onClick={handleConfirmSave}
            className="flex-1 py-3.5 rounded-full bg-[#111111] text-white text-[14px] font-semibold"
          >
            {activeModal === 'permissions' ? t.grantPermissionsBtn : t.legalAcceptBtn}
          </button>
        </div>
      </div>
    </div>
  );
};
