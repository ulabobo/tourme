import React, { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAppStore } from '../../store/useAppStore';
import { GeolocationService } from '../../services/domainServices';
import { AppMetricaService } from '../../services/analytics/appMetricaService';
import { CloudDatabaseService } from '../../services/database/cloudDbService';
import { FloatingAudioBar } from './UIElements';
import { AppLanguage, useI18n } from '../../utils/i18n';

export const PhoneShell: React.FC<{
  children: React.ReactNode;
}> = ({ children }) => {
  const location = useLocation();
  const navigate = useNavigate();

  const isHeartbeatActive = useAppStore((s) => s.safetyState.isHeartbeatActive);
  const sosCountdownActive = useAppStore((s) => s.safetyState.sosCountdownActive);
  const sosStatus = useAppStore((s) => s.safetyState.sosStatus);
  const connectivityStatus = useAppStore((s) => s.safetyState.connectivityStatus);
  const recordLocationPing = useAppStore((s) => s.recordLocationPing);
  const setConnectivityStatus = useAppStore((s) => s.setConnectivityStatus);
  const tickSosCountdown = useAppStore((s) => s.tickSosCountdown);
  const audioPlaying = useAppStore((s) => s.audioPlayer.isPlaying);
  const seekAudio = useAppStore((s) => s.seekAudio);
  const toasts = useAppStore((s) => s.toasts);
  const dismissToast = useAppStore((s) => s.dismissToast);
  const userProfile = useAppStore((s) => s.userProfile);
  const tier = userProfile.tier;
  const { lang, setLanguage, t } = useI18n();

  // Determine screen background variant based on route
  const isDarkScreen =
    location.pathname === '/menu-scanner' || location.pathname === '/merchant/scan';
  const isRedAlertScreen = location.pathname === '/safety/are-you-safe';

  // Initialize AppMetrica & track screen views + sync profile to Cloud Database
  useEffect(() => {
    AppMetricaService.init();
  }, []);

  useEffect(() => {
    AppMetricaService.trackEvent('screen_view', {
      path: location.pathname,
      language: lang,
      tier,
    });
    void CloudDatabaseService.upsertRecord('profiles', {
      id: 'primary-traveler-profile',
      full_name: userProfile.name,
      email: userProfile.email,
      nationality: userProfile.nationality,
      visa_status: userProfile.visaStatus,
      tier: userProfile.tier,
      preferred_language: userProfile.preferences.language,
    });
  }, [location.pathname, lang, tier, userProfile]);

  // Online/offline browser listeners
  useEffect(() => {
    const handleOnline = () => setConnectivityStatus('ONLINE');
    const handleOffline = () => setConnectivityStatus('OFFLINE');
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, [setConnectivityStatus]);

  // Geolocation watcher lifecycle
  useEffect(() => {
    if (!isHeartbeatActive) {
      GeolocationService.stopWatching();
      return;
    }

    GeolocationService.startWatching(
      (pos) => {
        recordLocationPing(pos);
      },
      () => {
        // Permission denied or unavailable in headless test: keep labeled Samarkand fallback
      }
    );

    return () => {
      GeolocationService.stopWatching();
    };
  }, [isHeartbeatActive, recordLocationPing]);

  // SOS countdown timer effect
  useEffect(() => {
    if (!sosCountdownActive) return;
    const timer = window.setInterval(() => {
      tickSosCountdown();
    }, 1000);
    return () => window.clearInterval(timer);
  }, [sosCountdownActive, tickSosCountdown]);

  // Navigate automatically to F4 SOS Sent if countdown finishes while on F3
  useEffect(() => {
    if (
      sosStatus === 'SOS_DISPATCHED' &&
      location.pathname === '/safety/are-you-safe'
    ) {
      navigate('/safety/sos-sent');
    }
  }, [sosStatus, location.pathname, navigate]);

  // Audio player progress timer
  useEffect(() => {
    if (!audioPlaying) return;
    const timer = window.setInterval(() => {
      seekAudio(1, true);
    }, 1000);
    return () => window.clearInterval(timer);
  }, [audioPlaying, seekAudio]);

  // Auto-dismiss toasts after 3.2 seconds
  useEffect(() => {
    if (toasts.length === 0) return;
    const timer = window.setTimeout(() => {
      dismissToast(toasts[0].id);
    }, 3200);
    return () => window.clearTimeout(timer);
  }, [toasts, dismissToast]);

  const shellBg = isRedAlertScreen
    ? 'bg-[#C2412D] text-white'
    : isDarkScreen
      ? 'bg-[#161513] text-white'
      : 'bg-[#E9E4DC] text-[#111111]';

  const languages: { code: AppLanguage; label: string }[] = [
    { code: 'en', label: 'EN' },
    { code: 'ru', label: 'RU' },
    { code: 'uz', label: 'UZ' },
  ];

  return (
    <div className="min-h-screen w-full bg-[#D5CFC4] flex flex-col items-center justify-start py-0 sm:py-3 px-0 sm:px-4">
      {/* Main iPhone 390x844 Viewport Container */}
      <div
        style={{
          backgroundColor: isRedAlertScreen
            ? '#C2412D'
            : isDarkScreen
              ? '#161513'
              : '#E9E4DC',
          color: isRedAlertScreen || isDarkScreen ? '#FFFFFF' : '#111111',
        }}
        className={`relative w-full max-w-[410px] min-h-[844px] sm:rounded-[40px] shadow-2xl flex flex-col overflow-hidden border border-black/10 ${shellBg}`}
      >
        {/* Professional Production App Navbar */}
        <header
          aria-label="Application header"
          className={`px-4 pt-3 pb-2.5 flex items-center justify-between select-none shrink-0 z-20 border-b ${
            isRedAlertScreen
              ? 'bg-[#A93220]/90 border-white/15 text-white'
              : isDarkScreen
                ? 'bg-[#1F1D1A]/95 border-white/10 text-white'
                : 'bg-[#F6F2EA]/90 border-black/[0.06] text-[#111111]'
          } backdrop-blur-md`}
        >
          {/* Left: Brand Identity + Tier Badge */}
          <button
            type="button"
            onClick={() => navigate('/home')}
            className="flex items-center gap-2.5 text-left group"
          >
            <div className="w-8 h-8 rounded-xl bg-[#111111] flex items-center justify-center shadow-sm shrink-0">
              <span className="w-3.5 h-3.5 rounded-t-full bg-[#EBC878] block" />
            </div>
            <div className="leading-tight">
              <div className="flex items-center gap-1.5">
                <span className="text-[14px] font-extrabold tracking-tight">
                  TourMe
                </span>
                <span
                  className={`text-[9px] font-bold px-1.5 py-0.5 rounded-md uppercase ${
                    tier === 'VIP'
                      ? 'bg-[#111111] text-[#EBC878]'
                      : tier === 'PRO'
                        ? 'bg-[#EBC878] text-[#111111]'
                        : 'bg-black/10 text-current'
                  }`}
                >
                  {tier}
                </span>
              </div>
              <div className="text-[10px] opacity-65 font-medium truncate max-w-[115px]">
                {t.brandSubtitle}
              </div>
            </div>
          </button>

          {/* Right: 3-Language Switcher (EN | RU | UZ) + Cloud Sync Status + Wallet */}
          <div className="flex items-center gap-1.5">
            {/* Segmented Language Pill */}
            <div
              role="group"
              aria-label="Language selector"
              className={`flex items-center rounded-full p-0.5 text-[10px] font-bold ${
                isRedAlertScreen || isDarkScreen
                  ? 'bg-white/15 text-white'
                  : 'bg-[#E9E4DC] text-[#111111]'
              }`}
            >
              {languages.map((item) => {
                const active = lang === item.code;
                return (
                  <button
                    key={item.code}
                    type="button"
                    data-testid={`lang-btn-${item.code}`}
                    onClick={() => setLanguage(item.code)}
                    className={`px-2 py-1 rounded-full transition-all ${
                      active
                        ? 'bg-[#111111] text-[#EBC878] shadow-sm'
                        : 'opacity-70 hover:opacity-100'
                    }`}
                  >
                    {item.label}
                  </button>
                );
              })}
            </div>

            {/* Online / Offline Cloud DB Status Toggle */}
            <button
              type="button"
              onClick={() =>
                setConnectivityStatus(
                  connectivityStatus === 'ONLINE' ? 'OFFLINE' : 'ONLINE'
                )
              }
              className={`px-2.5 py-1 rounded-full text-[10px] font-bold transition-colors ${
                connectivityStatus === 'ONLINE'
                  ? 'bg-[#DDEFE3] text-[#1F7A4C]'
                  : 'bg-[#D9534F] text-white'
              }`}
              title="Cloud Database & Offline Wallet Mode"
            >
              {connectivityStatus === 'ONLINE' ? '● Online' : '○ Offline'}
            </button>

            {/* Quick Offline Wallet QR Button */}
            <button
              type="button"
              aria-label="Quick open Offline Wallet"
              onClick={() => navigate('/wallet')}
              className={`w-7 h-7 rounded-full flex items-center justify-center text-[11px] font-bold transition-transform active:scale-95 ${
                isRedAlertScreen || isDarkScreen
                  ? 'bg-white/15 text-white'
                  : 'bg-[#111111] text-white'
              }`}
              title={t.walletBtn}
            >
              QR
            </button>
          </div>
        </header>

        {/* Floating Toast Notification Banner (does not shift layout) */}
        {toasts.length > 0 && (
          <div
            role="status"
            aria-live="polite"
            className="absolute top-[58px] left-5 right-5 z-40 pointer-events-auto"
          >
            {toasts.slice(-1).map((toastItem) => (
              <div
                key={toastItem.id}
                onClick={() => dismissToast(toastItem.id)}
                className="bg-[#111111]/95 text-white text-[12px] font-medium px-3.5 py-2 rounded-2xl shadow-lg flex items-center justify-between cursor-pointer border border-white/15 backdrop-blur-sm"
              >
                <span className="truncate">{toastItem.message}</span>
                <span className="text-white/60 ml-2 text-xs shrink-0">✕</span>
              </div>
            ))}
          </div>
        )}

        {/* Main Screen Content Area */}
        <main className="flex-1 flex flex-col px-5 pt-2 pb-2 overflow-y-auto">
          <FloatingAudioBar />
          {children}
        </main>

        {/* Subtle Home Indicator Bar */}
        <footer className="py-2 flex justify-center shrink-0">
          <div
            className={`w-28 h-1 rounded-full opacity-40 ${
              isDarkScreen || isRedAlertScreen ? 'bg-white' : 'bg-[#111111]'
            }`}
          />
        </footer>
      </div>
    </div>
  );
};
