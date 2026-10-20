import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ScreenHeader, SilkRoadArchArtwork } from '../../components/common/UIElements';
import {
  LegalAndDataModals,
  LegalModalType,
} from '../../components/dialogs/LegalAndDataModals';
import { AppMetricaService } from '../../services/analytics/appMetricaService';
import { CloudDatabaseService } from '../../services/database/cloudDbService';
import { OFFICIAL_UPDATES } from '../../services/domainServices';
import { useAppStore } from '../../store/useAppStore';
import { useI18n } from '../../utils/i18n';
import { aboutYouSchema, signInSchema } from '../../utils/validation';

const INTEREST_OPTIONS = [
  'History',
  'Gastronomy',
  'Nature',
  'Photography',
  'Crafts',
  'Wellness',
];

const NATIONALITY_OPTIONS = [
  'Germany',
  'United Kingdom',
  'France',
  'United States',
  'Japan',
  'Canada',
  'Australia',
  'India',
  'Italy',
  'Spain',
  'Switzerland',
];

/**
 * Screen A1 — Welcome
 */
export const ScreenA1Welcome: React.FC = () => {
  const navigate = useNavigate();
  const showToast = useAppStore((s) => s.showToast);
  const { lang, t } = useI18n();
  const [legalModal, setLegalModal] = useState<LegalModalType>(null);

  return (
    <div className="flex-1 flex flex-col justify-between pt-1 pb-1">
      <div>
        <SilkRoadArchArtwork
          variant="blue-arch"
          size="hero"
          badgeText="Uzbekistan Travel Companion"
          className="w-full h-[350px] rounded-[32px] shadow-sm"
        />

        <h1 className="mt-6 text-[35px] leading-[1.08] font-bold tracking-tight text-[#111111] whitespace-pre-line">
          {lang === 'en' ? (
            <>
              Uzbekistan,
              <br />
              without the stress.
            </>
          ) : (
            t.welcomeHeroTitle
          )}
        </h1>

        <p className="mt-3 text-[15px] text-[#6E6A63]">{t.welcomeHeroSubtitle}</p>
      </div>

      <div className="mt-6 flex flex-col gap-2.5">
        <button
          type="button"
          aria-label="Get started"
          onClick={() => navigate('/onboarding/sign-in')}
          className="w-full py-4 rounded-full bg-[#111111] text-white text-[16px] font-semibold shadow-sm active:scale-[0.99] transition-transform"
        >
          {t.getStartedBtn}
        </button>

        <button
          type="button"
          aria-label="I already have an account"
          onClick={() => {
            showToast('Welcome back, Anna Becker! Loaded your saved profile.', 'success');
            navigate('/onboarding/about-you');
          }}
          className="w-full py-4 rounded-full bg-white text-[#111111] text-[16px] font-semibold shadow-sm active:scale-[0.99] transition-transform"
        >
          {t.alreadyHaveAccountBtn}
        </button>

        <div className="pt-1 flex items-center justify-center gap-3 text-[11px] text-[#6E6A63]">
          <button
            type="button"
            onClick={() => setLegalModal('terms')}
            className="underline hover:text-[#111111]"
          >
            {t.termsLinkText}
          </button>
          <span>·</span>
          <button
            type="button"
            onClick={() => setLegalModal('privacy')}
            className="underline hover:text-[#111111]"
          >
            {t.privacyLinkText}
          </button>
          <span>·</span>
          <button
            type="button"
            onClick={() => setLegalModal('permissions')}
            className="underline hover:text-[#111111]"
          >
            O‘RQ-547 Data
          </button>
        </div>
      </div>

      <LegalAndDataModals
        activeModal={legalModal}
        onClose={() => setLegalModal(null)}
      />
    </div>
  );
};

/**
 * Screen A2 — Sign in / Create your account (with Terms of Use, Privacy Policy & Data Permissions)
 */
export const ScreenA2SignIn: React.FC = () => {
  const navigate = useNavigate();
  const userProfile = useAppStore((s) => s.userProfile);
  const updateUserProfile = useAppStore((s) => s.updateUserProfile);
  const showToast = useAppStore((s) => s.showToast);
  const { lang, t } = useI18n();

  const [authMode, setAuthMode] = useState<'signup' | 'signin'>('signup');
  const [email, setEmail] = useState(userProfile.email || 'you@example.com');
  const [phone, setPhone] = useState(userProfile.phone || '+49 000 000 00 00');
  const [acceptedTerms, setAcceptedTerms] = useState(true);
  const [acceptedDataConsent, setAcceptedDataConsent] = useState(true);
  const [legalModal, setLegalModal] = useState<LegalModalType>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const persistAuthAndConsent = (userEmail: string, userPhone: string, method: string) => {
    void CloudDatabaseService.upsertRecord('consents', {
      id: 'primary-user-consent',
      email: userEmail,
      auth_method: method,
      terms_of_use_accepted: acceptedTerms,
      privacy_policy_accepted: acceptedTerms,
      personal_data_processing_accepted: acceptedDataConsent,
      policy_version: '2026.10-v2',
      accepted_at: new Date().toISOString(),
    });
    AppMetricaService.trackEvent('user_authenticated', {
      method,
      authMode,
      lang,
    });
  };

  const handleOAuthLogin = (provider: 'Apple' | 'Google') => {
    if (!acceptedTerms || !acceptedDataConsent) {
      setErrorMsg(
        lang === 'uz'
          ? 'Davom etish uchun Foydalanish shartlari va Shaxsiy ma’lumotlar siyosatini tasdiqlang.'
          : lang === 'ru'
            ? 'Пожалуйста, примите Условия использования и Политику обработки данных.'
            : 'Please accept the Terms of Use, Privacy Policy, and Data Consent to continue.'
      );
      return;
    }
    const oauthEmail =
      provider === 'Apple' ? 'anna.becker@icloud.com' : 'anna.becker@gmail.com';
    updateUserProfile({
      name: 'Anna Becker',
      email: oauthEmail,
    });
    persistAuthAndConsent(oauthEmail, phone, provider);
    showToast(`Signed in with ${provider} (Cloud DB synced)`, 'success');
    navigate('/onboarding/about-you');
  };

  const handleContinue = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    if (!acceptedTerms || !acceptedDataConsent) {
      setErrorMsg(
        lang === 'uz'
          ? 'Davom etish uchun Foydalanish shartlari va Shaxsiy ma’lumotlar siyosatini tasdiqlang.'
          : lang === 'ru'
            ? 'Пожалуйста, примите Условия использования и Политику обработки данных.'
            : 'Please accept the Terms of Use, Privacy Policy, and Data Consent to continue.'
      );
      return;
    }
    const parsed = signInSchema.safeParse({ email, phone });
    if (!parsed.success) {
      setErrorMsg(parsed.error.errors[0]?.message || 'Please check your email and phone.');
      return;
    }
    updateUserProfile({ email, phone });
    persistAuthAndConsent(email, phone, 'email_phone');
    showToast('Account details & legal consent saved.', 'success');
    navigate('/onboarding/about-you');
  };

  return (
    <form onSubmit={handleContinue} className="flex-1 flex flex-col justify-between">
      <div>
        <ScreenHeader
          title="Welcome"
          backTo="/onboarding/welcome"
          rightElement={
            <div className="flex bg-white rounded-full p-0.5 text-[11px] font-bold shadow-xs">
              <button
                type="button"
                onClick={() => setAuthMode('signup')}
                className={`px-2.5 py-1 rounded-full ${
                  authMode === 'signup' ? 'bg-[#111111] text-white' : 'text-[#6E6A63]'
                }`}
              >
                Sign Up
              </button>
              <button
                type="button"
                onClick={() => setAuthMode('signin')}
                className={`px-2.5 py-1 rounded-full ${
                  authMode === 'signin' ? 'bg-[#111111] text-white' : 'text-[#6E6A63]'
                }`}
              >
                Sign In
              </button>
            </div>
          }
        />

        <h2 className="mt-2 text-[32px] leading-[1.08] font-bold tracking-tight text-[#111111]">
          Create your
          <br />
          account
        </h2>

        <div className="mt-4 flex flex-col gap-2.5">
          <button
            type="button"
            onClick={() => handleOAuthLogin('Apple')}
            className="w-full py-3.5 rounded-full bg-[#111111] text-white text-[15px] font-semibold"
          >
            {t.continueWithApple}
          </button>

          <button
            type="button"
            onClick={() => handleOAuthLogin('Google')}
            className="w-full py-3.5 rounded-full bg-white text-[#111111] text-[15px] font-semibold shadow-sm"
          >
            {t.continueWithGoogle}
          </button>
        </div>

        <div className="my-3.5 text-center text-[13px] text-[#6E6A63]">or use email</div>

        <div className="space-y-3">
          <div>
            <label
              htmlFor="signin-email"
              className="block text-[12px] font-medium text-[#6E6A63] mb-1 ml-1"
            >
              Email
            </label>
            <input
              id="signin-email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              className="w-full px-4 py-3 rounded-2xl bg-white text-[#111111] text-[14px] placeholder-[#8C877E] focus:outline-none focus:ring-2 focus:ring-[#111111]"
            />
          </div>

          <div>
            <label
              htmlFor="signin-phone"
              className="block text-[12px] font-medium text-[#6E6A63] mb-1 ml-1"
            >
              Phone (for 112 SOS & E-Mehmon alerts)
            </label>
            <input
              id="signin-phone"
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="+49 000 000 00 00"
              className="w-full px-4 py-3 rounded-2xl bg-white text-[#111111] text-[14px] placeholder-[#8C877E] focus:outline-none focus:ring-2 focus:ring-[#111111]"
            />
          </div>
        </div>

        {/* Legal Terms of Use, Privacy Policy & Personal Data Consent Box */}
        <div className="mt-3.5 bg-[#F6F2EA] rounded-2xl p-3 space-y-2 border border-black/5">
          <label className="flex items-start gap-2.5 text-[12px] text-[#111111] cursor-pointer leading-snug">
            <input
              type="checkbox"
              checked={acceptedTerms}
              onChange={(e) => setAcceptedTerms(e.target.checked)}
              aria-label="Accept Terms of Use and Privacy Policy"
              className="mt-0.5 w-4 h-4 accent-[#111111] rounded shrink-0"
            />
            <span>
              {t.termsCheckboxLabel}{' '}
              <button
                type="button"
                onClick={() => setLegalModal('terms')}
                className="font-bold underline text-[#111111]"
              >
                {t.termsLinkText}
              </button>{' '}
              &{' '}
              <button
                type="button"
                onClick={() => setLegalModal('privacy')}
                className="font-bold underline text-[#111111]"
              >
                {t.privacyLinkText}
              </button>
              .
            </span>
          </label>

          <label className="flex items-start gap-2.5 text-[12px] text-[#111111] cursor-pointer leading-snug">
            <input
              type="checkbox"
              checked={acceptedDataConsent}
              onChange={(e) => setAcceptedDataConsent(e.target.checked)}
              aria-label="Consent to Personal Data Processing"
              className="mt-0.5 w-4 h-4 accent-[#111111] rounded shrink-0"
            />
            <span>{t.dataConsentCheckboxLabel}</span>
          </label>

          <button
            type="button"
            onClick={() => setLegalModal('permissions')}
            className="w-full pt-1 text-left text-[11px] font-semibold text-[#2E9E6B] hover:underline flex items-center justify-between"
          >
            <span>🛡 {t.permissionPromptTitle} (GPS · Camera · Passport)</span>
            <span>Configure →</span>
          </button>
        </div>

        {errorMsg && (
          <p role="alert" className="mt-2 text-[12px] text-[#D9534F] font-medium">
            {errorMsg}
          </p>
        )}
      </div>

      <div className="mt-4">
        <button
          type="submit"
          aria-label="Continue"
          className="w-full py-4 rounded-full bg-[#EBC878] text-[#111111] text-[16px] font-semibold shadow-sm active:scale-[0.99] transition-transform"
        >
          Continue
        </button>
      </div>

      <LegalAndDataModals
        activeModal={legalModal}
        onClose={() => setLegalModal(null)}
        onAcceptAll={() => {
          setAcceptedTerms(true);
          setAcceptedDataConsent(true);
        }}
      />
    </form>
  );
};

/**
 * Screen A3 — About you (Nationality, Dates, Interests)
 */
export const ScreenA3AboutYou: React.FC = () => {
  const navigate = useNavigate();
  const nationality = useAppStore((s) => s.userProfile.nationality);
  const interests = useAppStore((s) => s.userProfile.preferences.interests);
  const travelDates = useAppStore((s) => s.tripPlan.travelDates);
  const setNationality = useAppStore((s) => s.setNationality);
  const setTravelDates = useAppStore((s) => s.setTravelDates);
  const toggleInterest = useAppStore((s) => s.toggleInterest);
  const showToast = useAppStore((s) => s.showToast);

  const [startDate, setStartDate] = useState(travelDates.startDate || '2026-10-22');
  const [endDate, setEndDate] = useState(travelDates.endDate || '2026-10-29');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const validateAndProceed = (targetPath: string) => {
    setErrorMsg(null);
    const result = aboutYouSchema.safeParse({
      nationality,
      startDate,
      endDate,
      interests,
    });
    if (!result.success) {
      setErrorMsg(result.error.errors[0]?.message || 'Please check your trip dates.');
      return;
    }
    setTravelDates(startDate, endDate);
    showToast(`Profile updated for ${nationality}.`, 'success');
    navigate(targetPath);
  };

  return (
    <div className="flex-1 flex flex-col justify-between">
      <div>
        <ScreenHeader title="About you" backTo="/onboarding/sign-in" />

        <h2 className="mt-3 text-[36px] leading-[1.08] font-bold tracking-tight text-[#111111]">
          Tell us about
          <br />
          your trip
        </h2>

        <div className="mt-6 space-y-4">
          <div>
            <label
              htmlFor="nationality-select"
              className="block text-[13px] font-medium text-[#6E6A63] mb-1.5 ml-1"
            >
              Nationality
            </label>
            <select
              id="nationality-select"
              value={nationality}
              onChange={(e) => setNationality(e.target.value)}
              className="w-full px-4 py-3.5 rounded-2xl bg-white text-[#111111] text-[15px] font-medium focus:outline-none focus:ring-2 focus:ring-[#111111]"
            >
              {NATIONALITY_OPTIONS.map((nat) => (
                <option key={nat} value={nat}>
                  {nat}
                </option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label
                htmlFor="arrive-date"
                className="block text-[13px] font-medium text-[#6E6A63] mb-1.5 ml-1"
              >
                Arrive
              </label>
              <input
                id="arrive-date"
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="w-full px-3.5 py-3.5 rounded-2xl bg-white text-[#111111] text-[14px] font-medium focus:outline-none focus:ring-2 focus:ring-[#111111]"
              />
            </div>

            <div>
              <label
                htmlFor="leave-date"
                className="block text-[13px] font-medium text-[#6E6A63] mb-1.5 ml-1"
              >
                Leave
              </label>
              <input
                id="leave-date"
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="w-full px-3.5 py-3.5 rounded-2xl bg-white text-[#111111] text-[14px] font-medium focus:outline-none focus:ring-2 focus:ring-[#111111]"
              />
            </div>
          </div>

          <div className="pt-1">
            <span className="block text-[13px] font-medium text-[#6E6A63] mb-2.5 ml-1">
              Interests
            </span>
            <div className="flex flex-wrap gap-2.5">
              {INTEREST_OPTIONS.map((interest) => {
                const isSelected = interests.includes(interest);
                return (
                  <button
                    key={interest}
                    type="button"
                    onClick={() => toggleInterest(interest)}
                    className={`px-4 py-2.5 rounded-full text-[14px] font-semibold transition-colors ${
                      isSelected
                        ? 'bg-[#111111] text-white'
                        : 'bg-white text-[#111111] hover:bg-black/5'
                    }`}
                  >
                    {interest}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {errorMsg && (
          <p role="alert" className="mt-3 text-[13px] text-[#D9534F] font-medium">
            {errorMsg}
          </p>
        )}
      </div>

      <div className="mt-8 flex flex-col gap-3">
        <button
          type="button"
          onClick={() => validateAndProceed('/onboarding/visa')}
          className="w-full py-4 rounded-full bg-[#111111] text-white text-[16px] font-semibold"
        >
          Check visa & customs
        </button>

        <button
          type="button"
          onClick={() => validateAndProceed('/planner/cities')}
          className="w-full py-4 rounded-full bg-white text-[#111111] text-[16px] font-semibold"
        >
          Skip — build my trip
        </button>
      </div>
    </div>
  );
};

/**
 * Screen A4 — Visa & Customs
 */
export const ScreenA4VisaCustoms: React.FC = () => {
  const navigate = useNavigate();
  const nationality = useAppStore((s) => s.userProfile.nationality);
  const visaStatus = useAppStore((s) => s.userProfile.visaStatus);
  const showToast = useAppStore((s) => s.showToast);
  const [selectedRuleModal, setSelectedRuleModal] = useState<string | null>(null);

  const customsRules = [
    {
      title: 'Drones need prior permission',
      detail:
        'Importing or flying consumer drones in Uzbekistan requires prior special authorization from Uzaviatsiya and the Cabinet of Ministers.',
    },
    {
      title: 'Bring prescriptions for medicines',
      detail:
        'Keep original doctor prescriptions for strong painkillers, sedatives, or ADHD/sleeping medications when passing customs.',
    },
    {
      title: 'Cultural items need an export certificate',
      detail:
        'Handcrafted suzani, carpets, or ceramics older than 50 years require a Ministry of Culture export certificate before departure.',
    },
    {
      title: 'Declare large amounts of cash',
      detail:
        'Foreign currency exceeding the equivalent of 100,000,000 UZS (~$7,800 USD) must be declared at customs on arrival and departure.',
    },
  ];

  const isVisaFree = visaStatus === 'VISA_FREE_30_DAYS';

  return (
    <div className="flex-1 flex flex-col justify-between">
      <div>
        <ScreenHeader title="Visa & Customs" backTo="/onboarding/about-you" />

        {/* Gold Nationality Route Card */}
        <div className="mt-2 bg-[#EBC878] rounded-[26px] p-5">
          <div className="text-[24px] font-bold tracking-tight text-[#111111]">
            {nationality} → Uzbekistan
          </div>
          <div className="text-[13px] text-[#4A463F] mt-0.5">
            Based on your nationality
          </div>
        </div>

        {/* Mint Visa Status Card */}
        <div className="mt-3 bg-[#DDEFE3] rounded-[26px] p-5">
          <span className="inline-block bg-[#2E9E6B] text-white text-[12px] font-semibold px-3.5 py-1 rounded-full">
            {isVisaFree ? 'Visa-free' : 'e-Visa eligible'}
          </span>
          <div className="mt-2.5 text-[22px] font-bold text-[#111111]">
            {isVisaFree ? 'Stay up to 30 days' : 'Apply online in 3 days'}
          </div>
          <div className="text-[13px] text-[#4A5D50] mt-0.5">
            {isVisaFree
              ? 'No e-Visa needed for this passport'
              : 'Official e-Visa fee: $20 USD (single entry)'}
          </div>
        </div>

        <button
          type="button"
          onClick={() =>
            showToast(
              'Official portal: e-visa.gov.uz (Informational link verified · Demo mode)',
              'info'
            )
          }
          className="mt-3 w-full py-3.5 rounded-full bg-white text-[#111111] text-[15px] font-semibold shadow-sm"
        >
          Open e-Visa portal
        </button>

        {/* Customs Rules */}
        <h3 className="mt-5 mb-2.5 text-[18px] font-semibold text-[#111111]">
          Customs rules
        </h3>

        <div className="space-y-2.5">
          {customsRules.map((rule) => (
            <button
              key={rule.title}
              type="button"
              onClick={() =>
                setSelectedRuleModal(
                  selectedRuleModal === rule.title ? null : rule.title
                )
              }
              className="w-full text-left bg-[#F6F2EA] rounded-2xl px-4 py-3.5 flex flex-col gap-1 hover:bg-white transition-colors"
            >
              <div className="flex items-center gap-3">
                <span className="w-2.5 h-2.5 rounded-full bg-[#D9534F] shrink-0" />
                <span className="text-[14px] font-medium text-[#111111]">
                  {rule.title}
                </span>
              </div>
              {selectedRuleModal === rule.title && (
                <p className="text-[12px] text-[#6E6A63] pl-5 pt-1">
                  {rule.detail}
                </p>
              )}
            </button>
          ))}
        </div>
      </div>

      <div className="mt-4 flex flex-col gap-2.5">
        <button
          type="button"
          onClick={() => navigate('/official-updates')}
          className="w-full py-3.5 rounded-full bg-white text-[#111111] text-[15px] font-semibold shadow-sm"
        >
          Official updates (live)
        </button>

        <button
          type="button"
          onClick={() => navigate('/planner/cities')}
          className="w-full py-4 rounded-full bg-[#111111] text-white text-[16px] font-semibold"
        >
          Plan my trip
        </button>
      </div>
    </div>
  );
};

/**
 * Screen A5 — Official updates
 */
export const ScreenA5OfficialUpdates: React.FC = () => {
  const navigate = useNavigate();
  const [activeFilter, setActiveFilter] = useState<'All' | 'Tourism Committee' | 'Visa (MFA)'>('All');
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const filteredUpdates = OFFICIAL_UPDATES.filter(
    (item) => activeFilter === 'All' || item.source === activeFilter
  );

  return (
    <div className="flex-1 flex flex-col justify-between">
      <div>
        <ScreenHeader title="Official updates" />

        <div className="mt-1">
          <span className="inline-block bg-[#DDEFE3] text-[#2E9E6B] text-[12px] font-semibold px-3.5 py-1.5 rounded-full">
            Live · synced 5 min ago
          </span>
        </div>

        {/* Filter Chips */}
        <div className="mt-3.5 flex items-center gap-2 overflow-x-auto pb-1">
          {(['All', 'Tourism Committee', 'Visa (MFA)'] as const).map((tab) => {
            const isActive = activeFilter === tab;
            return (
              <button
                key={tab}
                type="button"
                onClick={() => setActiveFilter(tab)}
                className={`px-4 py-2 rounded-full text-[13px] font-semibold whitespace-nowrap transition-colors ${
                  isActive
                    ? 'bg-[#111111] text-white'
                    : 'bg-white text-[#111111]'
                }`}
              >
                {tab}
              </button>
            );
          })}
        </div>

        {/* Bulletin Cards */}
        <div className="mt-4 space-y-3">
          {filteredUpdates.map((upd) => {
            const isExpanded = expandedId === upd.id;
            return (
              <div
                key={upd.id}
                onClick={() => setExpandedId(isExpanded ? null : upd.id)}
                className="bg-[#F6F2EA] rounded-[24px] p-4 cursor-pointer hover:bg-white/80 transition-colors"
              >
                <div className="flex items-center justify-between">
                  <span className="bg-[#EBC878] text-[#111111] text-[11px] font-semibold px-3 py-1 rounded-full">
                    {upd.source}
                  </span>
                  <span className="text-[12px] text-[#6E6A63]">{upd.dateLabel}</span>
                </div>
                <h3 className="mt-2.5 text-[16px] font-bold text-[#111111] leading-snug">
                  {upd.title}
                </h3>
                <p className="mt-1 text-[13px] text-[#6E6A63]">{upd.summary}</p>
                {isExpanded && (
                  <p className="mt-2 pt-2 border-t border-black/10 text-[12px] text-[#111111]">
                    {upd.details}
                  </p>
                )}
              </div>
            );
          })}
        </div>
      </div>

      <div className="mt-6">
        <button
          type="button"
          onClick={() => navigate(-1)}
          className="w-full py-4 rounded-full bg-[#111111] text-white text-[16px] font-semibold"
        >
          Done
        </button>
      </div>
    </div>
  );
};
