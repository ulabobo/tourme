import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ScreenHeader,
  TouristBottomNav,
} from '../../components/common/UIElements';
import { PaymentService } from '../../services/domainServices';
import { useAppStore } from '../../store/useAppStore';
import { SubscriptionTier } from '../../types/domain';
import {
  LegalAndDataModals,
  LegalModalType,
} from '../../components/dialogs/LegalAndDataModals';
import {
  APPMETRICA_COUNTER_ID,
  AppMetricaService,
} from '../../services/analytics/appMetricaService';
import { CloudDatabaseService } from '../../services/database/cloudDbService';
import { useI18n } from '../../utils/i18n';

/**
 * Screen G1 — Plans (Subscription Paywall)
 */
export const ScreenG1Plans: React.FC = () => {
  const navigate = useNavigate();
  const currentTier = useAppStore((s) => s.userProfile.tier);
  const setSubscriptionTier = useAppStore((s) => s.setSubscriptionTier);
  const showToast = useAppStore((s) => s.showToast);

  const [isProcessing, setIsProcessing] = useState(false);

  const handleSelectPlan = async (tier: SubscriptionTier, priceUsd: number) => {
    setIsProcessing(true);
    if (priceUsd > 0) {
      await PaymentService.processDemoPayment({
        amountUsd: priceUsd,
        method: 'Apple Pay',
        description: `${tier} Subscription`,
      });
    }
    setSubscriptionTier(tier);
    setIsProcessing(false);
    showToast(
      tier === 'PRO'
        ? 'Upgraded to Silk Road Pass (PRO — $9.99 Demo Checkout)! Premium Audio Guides & AI Scanners unlocked.'
        : tier === 'VIP'
          ? 'Upgraded to VIP Concierge ($39.99 Demo Checkout)! 24/7 Dilnoza Concierge & PRO features unlocked.'
          : 'Switched back to Free tier.',
      'success'
    );
    if (tier === 'VIP') {
      navigate('/concierge');
    }
  };

  return (
    <div className="flex-1 flex flex-col justify-between">
      <div>
        <ScreenHeader
          title="Plans"
          rightElement={
            currentTier !== 'FREE' ? (
              <span className="bg-[#DDEFE3] text-[#2E9E6B] text-[11px] font-bold px-3 py-1 rounded-full">
                Active: {currentTier}
              </span>
            ) : undefined
          }
        />

        <h2 className="mt-1 text-[34px] font-bold tracking-tight text-[#111111]">
          Travel smarter
        </h2>

        {/* Free Card */}
        <div
          onClick={() => handleSelectPlan('FREE', 0)}
          role="button"
          tabIndex={0}
          onKeyDown={(e) => e.key === 'Enter' && handleSelectPlan('FREE', 0)}
          className={`mt-3 bg-[#F6F2EA] rounded-[24px] p-4 cursor-pointer transition-all ${
            currentTier === 'FREE' ? 'ring-2 ring-[#111111]/25' : ''
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-[20px] font-bold text-[#111111]">Free</span>
            <span className="text-[22px] font-bold text-[#111111]">$0</span>
          </div>
          <p className="mt-1.5 text-[12px] text-[#6E6A63] leading-relaxed">
            Itinerary · Fair prices · Yandex Go links
            <br />
            E-Mehmon tracker · SOS heartbeat
          </p>
        </div>

        {/* Silk Road Pass (PRO) Gold Card */}
        <div
          className={`mt-3 bg-[#EBC878] rounded-[26px] p-5 transition-all ${
            currentTier === 'PRO' ? 'ring-2 ring-[#111111]' : ''
          }`}
        >
          <span className="inline-block bg-white text-[#111111] text-[11px] font-bold px-3 py-1 rounded-full">
            Most popular
          </span>

          <div className="mt-2.5 flex items-baseline justify-between">
            <span className="text-[20px] font-bold text-[#111111]">
              Silk Road Pass
            </span>
            <span className="text-[17px] font-bold text-[#111111]">
              $9.99 / trip
            </span>
          </div>

          <ul className="mt-2.5 space-y-1 text-[13px] text-[#3B362E]">
            <li>Offline audio-guides, all cities</li>
            <li>AI re-planner & menu / bazaar scanner</li>
            <li>Restaurant & craft vouchers</li>
          </ul>
        </div>

        {/* VIP Concierge Dark Card */}
        <div
          className={`mt-3 bg-[#111111] text-white rounded-[26px] p-5 transition-all ${
            currentTier === 'VIP' ? 'ring-2 ring-[#EBC878]' : ''
          }`}
        >
          <div className="flex items-baseline justify-between">
            <span className="text-[20px] font-bold">VIP Concierge</span>
            <span className="text-[17px] font-bold">$39.99 / trip</span>
          </div>

          <ul className="mt-2.5 space-y-1 text-[13px] text-white/80">
            <li>Live human assistant, 24/7</li>
            <li>Priority Afrosiyob ticket concierge</li>
            <li>Fast-track SOS assistance</li>
          </ul>
        </div>
      </div>

      {/* Purchase CTAs */}
      <div className="mt-4 space-y-2.5">
        <button
          type="button"
          disabled={isProcessing}
          data-testid="upgrade-pro-btn"
          onClick={() => handleSelectPlan('PRO', 9.99)}
          className="w-full py-4 rounded-full bg-[#EBC878] text-[#111111] text-[15px] font-semibold shadow-sm active:scale-[0.99] transition-transform"
        >
          {currentTier === 'PRO'
            ? '✓ Silk Road Pass Active'
            : 'Get Silk Road Pass · $9.99'}
        </button>

        <button
          type="button"
          disabled={isProcessing}
          data-testid="upgrade-vip-btn"
          onClick={() => handleSelectPlan('VIP', 39.99)}
          className="w-full py-4 rounded-full bg-[#111111] text-white text-[15px] font-semibold active:scale-[0.99] transition-transform"
        >
          {currentTier === 'VIP'
            ? 'Open VIP Concierge Chat →'
            : 'Get VIP Concierge · $39.99'}
        </button>
      </div>
    </div>
  );
};

/**
 * Screen G2 — VIP Concierge
 */
export const ScreenG2VipConcierge: React.FC = () => {
  const navigate = useNavigate();
  const messages = useAppStore((s) => s.conciergeMessages);
  const sendConciergeMessage = useAppStore((s) => s.sendConciergeMessage);
  const tier = useAppStore((s) => s.userProfile.tier);
  const showToast = useAppStore((s) => s.showToast);

  const [inputText, setInputText] = useState('');

  const handleSend = (text: string) => {
    const trimmed = text.trim();
    if (!trimmed) return;
    sendConciergeMessage(trimmed);
    setInputText('');
    showToast('Dilnoza replied and updated your Offline Wallet.', 'success');
  };

  return (
    <div className="flex-1 flex flex-col justify-between">
      <div>
        <ScreenHeader
          title="Concierge"
          rightElement={
            <div className="flex items-center gap-2">
              <span className="bg-[#111111] text-white text-[11px] font-bold px-3 py-1 rounded-full">
                {tier === 'VIP' ? 'VIP' : 'VIP Preview'}
              </span>
              <span className="flex items-center gap-1 text-[12px] font-semibold text-[#2E9E6B]">
                <span className="w-2.5 h-2.5 rounded-full bg-[#2E9E6B]" />
                <span>Online</span>
              </span>
            </div>
          }
        />

        {/* Chat History */}
        <div className="mt-3 space-y-3 max-h-[430px] overflow-y-auto pr-1">
          {messages.map((msg) => {
            const isUser = msg.sender === 'user';
            return (
              <div key={msg.id} className="space-y-2">
                <div
                  className={`max-w-[82%] rounded-[22px] p-4 text-[14px] leading-snug ${
                    isUser
                      ? 'ml-auto bg-[#111111] text-white'
                      : 'bg-white text-[#111111] shadow-sm'
                  }`}
                >
                  {msg.text}
                </div>

                {msg.voucherCard && (
                  <button
                    type="button"
                    onClick={() => navigate('/wallet')}
                    className="w-[72%] text-left bg-[#EBC878] rounded-[22px] p-4 block shadow-sm hover:opacity-95 transition-opacity"
                  >
                    <div className="text-[15px] font-bold text-[#111111]">
                      {msg.voucherCard.title}
                    </div>
                    <div className="text-[12px] text-[#4A463F] mt-0.5">
                      {msg.voucherCard.subtitle}
                    </div>
                  </button>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Quick Prompts & Input */}
      <div className="mt-4 space-y-3">
        <div className="flex flex-wrap gap-2">
          {(
            [
              'Book a table',
              'Call a driver',
              'Train ticket',
              'Resolve a dispute',
            ] as const
          ).map((prompt) => (
            <button
              key={prompt}
              type="button"
              onClick={() => handleSend(prompt)}
              className="px-4 py-2 rounded-full bg-white text-[#111111] text-[13px] font-semibold shadow-sm hover:bg-[#F6F2EA] transition-colors"
            >
              {prompt}
            </button>
          ))}
        </div>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSend(inputText);
          }}
          className="bg-white rounded-full pl-4 pr-1.5 py-1.5 flex items-center justify-between shadow-sm"
        >
          <input
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder="Message your concierge..."
            aria-label="Message your concierge"
            className="flex-1 bg-transparent text-[14px] text-[#111111] placeholder-[#8C877E] focus:outline-none"
          />
          <button
            type="submit"
            aria-label="Send message to concierge"
            className="w-10 h-10 rounded-full bg-[#111111] text-white font-bold flex items-center justify-center shrink-0"
          >
            ↑
          </button>
        </form>
      </div>
    </div>
  );
};

/**
 * Screen G3 — Profile ("Me" Tab)
 */
export const ScreenG3Profile: React.FC = () => {
  const navigate = useNavigate();
  const userProfile = useAppStore((s) => s.userProfile);
  const updatePreferences = useAppStore((s) => s.updatePreferences);
  const showToast = useAppStore((s) => s.showToast);
  const { t } = useI18n();
  const [legalModal, setLegalModal] = useState<LegalModalType>(null);

  const dbStatus = CloudDatabaseService.getSyncStatus();
  const recentEventsCount = AppMetricaService.getRecentEvents().length;

  const cycleLanguage = () => {
    const langs: ('English' | 'Russian' | 'Uzbek' | 'German')[] = [
      'English',
      'Russian',
      'Uzbek',
      'German',
    ];
    const next =
      langs[(langs.indexOf(userProfile.preferences.language) + 1) % langs.length];
    updatePreferences({ language: next });
    showToast(`App language set to ${next}`, 'info');
  };

  const toggleNotifications = () => {
    const next = !userProfile.preferences.notificationsEnabled;
    updatePreferences({ notificationsEnabled: next });
    showToast(
      next
        ? 'Push & Plov/Safety notifications enabled.'
        : 'Notifications muted.',
      'info'
    );
  };

  const planTitle =
    userProfile.tier === 'VIP'
      ? 'VIP Concierge'
      : userProfile.tier === 'PRO'
        ? 'Silk Road Pass (PRO)'
        : 'Free plan';

  return (
    <div className="flex-1 flex flex-col justify-between">
      <div>
        {/* User Header */}
        <div className="pt-2 flex items-center gap-4">
          <div
            className="w-16 h-16 rounded-full shrink-0"
            style={{
              background: 'linear-gradient(135deg, #F5C396 0%, #EE9B72 100%)',
            }}
          />
          <div>
            <h1 className="text-[24px] font-bold text-[#111111]">
              {userProfile.name}
            </h1>
            <div className="text-[13px] text-[#6E6A63]">
              {userProfile.nationality} · Trip Oct 22–29
            </div>
          </div>
        </div>

        {/* Gold Plan Card */}
        <div className="mt-4 bg-[#EBC878] rounded-[26px] p-4 flex items-center justify-between">
          <div>
            <div
              data-testid="profile-plan-title"
              className="text-[18px] font-bold text-[#111111]"
            >
              {planTitle}
            </div>
            <div className="text-[13px] text-[#4A463F] mt-0.5">
              {userProfile.tier === 'FREE'
                ? 'Unlock audio-guides & AI tools'
                : 'All premium tools & offline guides active'}
            </div>
          </div>

          <button
            type="button"
            onClick={() => navigate('/plans')}
            className="px-4 py-2 rounded-full bg-[#111111] text-white text-[13px] font-semibold"
          >
            {userProfile.tier === 'FREE' ? 'Upgrade' : 'Plans'}
          </button>
        </div>

        {/* Settings / Menu Rows */}
        <div className="mt-3.5 space-y-2">
          <button
            type="button"
            onClick={() => navigate('/emergency-profile')}
            className="w-full bg-[#F6F2EA] rounded-2xl px-4 py-3.5 flex items-center justify-between text-left hover:bg-white transition-colors"
          >
            <span className="text-[14px] font-semibold text-[#111111]">
              Emergency profile
            </span>
            <span className="text-[#6E6A63]">›</span>
          </button>

          <button
            type="button"
            onClick={() => navigate('/wallet')}
            className="w-full bg-[#F6F2EA] rounded-2xl px-4 py-3.5 flex items-center justify-between text-left hover:bg-white transition-colors"
          >
            <span className="text-[14px] font-semibold text-[#111111]">
              Offline wallet
            </span>
            <span className="text-[#6E6A63]">›</span>
          </button>

          <button
            type="button"
            onClick={() => navigate('/official-updates')}
            className="w-full bg-[#F6F2EA] rounded-2xl px-4 py-3.5 flex items-center justify-between text-left hover:bg-white transition-colors"
          >
            <span className="text-[14px] font-semibold text-[#111111]">
              Official updates
            </span>
            <span className="text-[#6E6A63]">›</span>
          </button>

          <button
            type="button"
            onClick={cycleLanguage}
            className="w-full bg-[#F6F2EA] rounded-2xl px-4 py-3.5 flex items-center justify-between text-left hover:bg-white transition-colors"
          >
            <span className="text-[14px] font-semibold text-[#111111]">
              Language · {userProfile.preferences.language}
            </span>
            <span className="text-[#6E6A63]">›</span>
          </button>

          <button
            type="button"
            onClick={toggleNotifications}
            className="w-full bg-[#F6F2EA] rounded-2xl px-4 py-3.5 flex items-center justify-between text-left hover:bg-white transition-colors"
          >
            <span className="text-[14px] font-semibold text-[#111111]">
              Notifications ({userProfile.preferences.notificationsEnabled ? 'On' : 'Off'})
            </span>
            <span className="text-[#6E6A63]">›</span>
          </button>

          <button
            type="button"
            onClick={() => navigate('/concierge')}
            className="w-full bg-[#F6F2EA] rounded-2xl px-4 py-3.5 flex items-center justify-between text-left hover:bg-white transition-colors"
          >
            <span className="text-[14px] font-semibold text-[#111111]">
              Help & support (Live Concierge)
            </span>
            <span className="text-[#6E6A63]">›</span>
          </button>

          {/* Legal Terms, Privacy & O'RQ-547 Data Permissions Row */}
          <button
            type="button"
            onClick={() => setLegalModal('permissions')}
            className="w-full bg-[#F6F2EA] rounded-2xl px-4 py-3.5 flex items-center justify-between text-left hover:bg-white transition-colors"
          >
            <span className="text-[14px] font-semibold text-[#111111]">
              Terms, Privacy & Data Permissions (O‘RQ-547)
            </span>
            <span className="text-[#2E9E6B] text-xs font-bold">Verified ›</span>
          </button>
        </div>

        {/* Cloud Database & Yandex AppMetrica Telemetry Status Card */}
        <div className="mt-3 bg-[#F6F2EA] rounded-[22px] p-3.5 border border-black/5">
          <div className="flex items-center justify-between text-[12px]">
            <span className="font-bold text-[#111111]">{t.cloudDbSectionTitle}</span>
            <span className="bg-[#DDEFE3] text-[#1F7A4C] px-2 py-0.5 rounded-full text-[10px] font-bold">
              {dbStatus.provider === 'SUPABASE_CLOUD' ? 'Supabase Cloud' : 'IndexedDB Synced'}
            </span>
          </div>
          <div className="mt-1 flex items-center justify-between text-[11px] text-[#6E6A63]">
            <span>
              AppMetrica #{APPMETRICA_COUNTER_ID} · {recentEventsCount} events logged
            </span>
            <button
              type="button"
              onClick={() => {
                void CloudDatabaseService.upsertRecord('profiles', {
                  id: 'primary-traveler-profile',
                  full_name: userProfile.name,
                  nationality: userProfile.nationality,
                  tier: userProfile.tier,
                });
                AppMetricaService.trackEvent('manual_cloud_db_sync', {
                  tier: userProfile.tier,
                });
                showToast('Cloud Database & AppMetrica telemetry synchronized!', 'success');
              }}
              className="underline font-semibold text-[#111111]"
            >
              {t.syncNowBtn}
            </button>
          </div>
        </div>

        {/* Dark B2B Merchant Portal Card */}
        <div className="mt-3 bg-[#111111] text-white rounded-[26px] p-4">
          <h3 className="text-[17px] font-bold">Own a local business?</h3>
          <p className="mt-1 text-[12px] text-white/75 leading-snug">
            Restaurants, guides, drivers and craftsmen can reach tourists here.
          </p>
          <button
            type="button"
            onClick={() => navigate('/merchant')}
            className="mt-3 w-full py-3 rounded-full bg-[#EBC878] text-[#111111] text-[14px] font-semibold"
          >
            Open merchant portal
          </button>
        </div>
      </div>

      <LegalAndDataModals
        activeModal={legalModal}
        onClose={() => setLegalModal(null)}
      />

      <TouristBottomNav activeTab="Me" />
    </div>
  );
};
