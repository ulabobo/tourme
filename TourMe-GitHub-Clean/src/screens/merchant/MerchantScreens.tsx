import React, { useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  MerchantBottomNav,
  QrMatrixSvg,
  ScreenHeader,
  SilkRoadArchArtwork,
} from '../../components/common/UIElements';
import { PersistenceService } from '../../services/persistence/idbService';
import { useAppStore } from '../../store/useAppStore';
import { B2BListing } from '../../types/domain';
import { merchantRegisterSchema } from '../../utils/validation';

/**
 * Screen H1 — Merchant home
 */
export const ScreenH1MerchantHome: React.FC = () => {
  const navigate = useNavigate();
  const merchantState = useAppStore((s) => s.merchantState);
  const boostMerchantVisibility = useAppStore((s) => s.boostMerchantVisibility);
  const showToast = useAppStore((s) => s.showToast);

  return (
    <div className="flex-1 flex flex-col justify-between">
      <div>
        <div className="pt-2">
          <span className="inline-block bg-[#111111] text-white text-[11px] font-bold uppercase tracking-wider px-3.5 py-1 rounded-full">
            MERCHANT
          </span>
        </div>

        <div className="mt-2 flex items-center justify-between">
          <h1 className="text-[32px] font-bold tracking-tight text-[#111111] truncate pr-2">
            {merchantState.businessName}
          </h1>
          <button
            type="button"
            onClick={() => navigate('/home')}
            className="px-4 py-2 rounded-full bg-white text-[#111111] text-[13px] font-semibold shadow-sm shrink-0"
          >
            Tourist view
          </button>
        </div>

        {/* 3 KPI Cards */}
        <div className="mt-4 grid grid-cols-3 gap-2.5">
          <div className="bg-[#EBC878] rounded-[24px] p-3.5">
            <div className="text-[28px] font-bold text-[#111111]">
              {merchantState.bookingsToday}
            </div>
            <div className="mt-1 text-[11px] text-[#4A463F] leading-tight">
              Bookings
              <br />
              today
            </div>
          </div>

          <div className="bg-[#F6F2EA] rounded-[24px] p-3.5">
            <div
              data-testid="merchant-vouchers-redeemed"
              className="text-[28px] font-bold text-[#111111]"
            >
              {merchantState.vouchersRedeemed}
            </div>
            <div className="mt-1 text-[11px] text-[#6E6A63] leading-tight">
              Vouchers
              <br />
              redeemed
            </div>
          </div>

          <div className="bg-[#F6F2EA] rounded-[24px] p-3.5">
            <div className="text-[28px] font-bold text-[#111111]">
              {merchantState.aiItineraryViews}
            </div>
            <div className="mt-1 text-[11px] text-[#6E6A63] leading-tight">
              AI itinerary
              <br />
              views
            </div>
          </div>
        </div>

        {/* Scan Tourist Voucher CTA */}
        <button
          type="button"
          onClick={() => navigate('/merchant/scan')}
          className="mt-4 w-full py-4 rounded-full bg-[#111111] text-white text-[15px] font-semibold"
        >
          Scan tourist voucher
        </button>

        {/* Next Bookings */}
        <h2 className="mt-4 mb-2 text-[17px] font-bold text-[#111111]">
          Next bookings
        </h2>

        <div className="space-y-2">
          {merchantState.upcomingBookings.map((bk) => (
            <button
              key={bk.id}
              type="button"
              onClick={() =>
                showToast(
                  `Booking ${bk.time}: ${bk.guests} guests (${bk.customerName}) — ${bk.serviceName}`,
                  'info'
                )
              }
              className="w-full bg-[#F6F2EA] rounded-2xl px-4 py-3 flex items-center gap-3.5 text-left hover:bg-white transition-colors"
            >
              <span className="bg-[#EBC878] text-[#111111] text-[12px] font-bold px-3 py-1 rounded-full">
                {bk.time}
              </span>
              <span className="text-[14px] font-semibold text-[#111111]">
                {bk.guests} guests · {bk.customerName}
              </span>
            </button>
          ))}
        </div>

        <button
          type="button"
          onClick={() => navigate('/merchant/listings')}
          className="mt-3.5 w-full py-3.5 rounded-full bg-white text-[#111111] text-[15px] font-semibold shadow-sm"
        >
          Manage listings
        </button>

        {/* Promote in AI Itineraries Gold Card */}
        <div className="mt-3.5 bg-[#EBC878] rounded-[26px] p-4">
          <h3 className="text-[16px] font-bold text-[#111111]">
            Promote in AI itineraries
          </h3>
          <p className="mt-0.5 text-[12px] text-[#4A463F]">
            Tourists near you see your listing in their daily plan.
          </p>
          <button
            type="button"
            onClick={() => {
              boostMerchantVisibility();
              showToast(
                merchantState.isBoosted
                  ? 'AI itinerary boost paused.'
                  : 'Boosted in nearby tourist AI itineraries! (+45 views)',
                'success'
              );
            }}
            className="mt-2.5 px-5 py-2 rounded-full bg-[#111111] text-white text-[13px] font-semibold"
          >
            {merchantState.isBoosted ? '✓ Boost Active' : 'Boost'}
          </button>
        </div>
      </div>

      <MerchantBottomNav activeTab="Home" />
    </div>
  );
};

/**
 * Screen H2 — Services (Listings & Bookings)
 */
export const ScreenH2MerchantListings: React.FC = () => {
  const navigate = useNavigate();
  const b2bListings = useAppStore((s) => s.b2bListings);
  const merchantBookings = useAppStore((s) => s.merchantState.upcomingBookings);
  const toggleB2BPromoteInAi = useAppStore((s) => s.toggleB2BPromoteInAi);
  const toggleB2BListingActive = useAppStore((s) => s.toggleB2BListingActive);
  const deleteB2BListing = useAppStore((s) => s.deleteB2BListing);
  const showToast = useAppStore((s) => s.showToast);

  const [activeTab, setActiveTab] = useState<'Listings' | 'Bookings'>('Listings');
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);

  return (
    <div className="flex-1 flex flex-col justify-between">
      <div>
        <h1 className="pt-2 text-[34px] font-bold tracking-tight text-[#111111]">
          Services
        </h1>

        {/* Segmented Control: Listings | Bookings */}
        <div className="mt-3 bg-white rounded-full p-1 flex items-center justify-between">
          {(['Listings', 'Bookings'] as const).map((tab) => {
            const isSelected = activeTab === tab;
            return (
              <button
                key={tab}
                type="button"
                onClick={() => setActiveTab(tab)}
                className={`flex-1 py-2.5 rounded-full text-[14px] font-semibold transition-colors ${
                  isSelected
                    ? 'bg-[#111111] text-white'
                    : 'text-[#111111]'
                }`}
              >
                {tab}
              </button>
            );
          })}
        </div>

        {activeTab === 'Listings' ? (
          <div className="mt-3.5 space-y-3">
            {b2bListings.map((listing) => (
              <div
                key={listing.id}
                className="bg-[#F6F2EA] rounded-[24px] p-4 space-y-2.5"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3.5">
                    <SilkRoadArchArtwork
                      variant={listing.artworkVariant}
                      className="w-20 h-20 rounded-2xl shrink-0"
                    />
                    <div>
                      <h3 className="text-[17px] font-bold text-[#111111]">
                        {listing.name}
                      </h3>
                      <div className="text-[13px] text-[#6E6A63] mt-0.5">
                        {listing.priceLabel} ·{' '}
                        <button
                          type="button"
                          onClick={() => {
                            toggleB2BListingActive(listing.id);
                            showToast(
                              `${listing.name} is now ${
                                !listing.isActive ? 'Active' : 'Paused'
                              }.`,
                              'info'
                            );
                          }}
                          className="underline font-medium"
                        >
                          {listing.isActive ? 'Active' : 'Paused'}
                        </button>
                      </div>
                      {listing.verificationStatus === 'PENDING_VERIFICATION' && (
                        <span className="mt-1 inline-block bg-[#F5E6BE] text-[#785C12] text-[10px] font-semibold px-2.5 py-0.5 rounded-full">
                          Pending Official Verification (Visible in Local Demo)
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Delete / Archive Confirmation */}
                  {confirmDeleteId === listing.id ? (
                    <button
                      type="button"
                      onClick={() => {
                        deleteB2BListing(listing.id);
                        setConfirmDeleteId(null);
                        showToast(`Removed "${listing.name}".`, 'info');
                      }}
                      className="px-2.5 py-1 rounded-full bg-[#D9534F] text-white text-[11px] font-bold"
                    >
                      Confirm
                    </button>
                  ) : (
                    <button
                      type="button"
                      aria-label={`Delete ${listing.name}`}
                      onClick={() => setConfirmDeleteId(listing.id)}
                      className="text-xs text-[#6E6A63] hover:text-[#D9534F] px-1"
                    >
                      ✕
                    </button>
                  )}
                </div>

                <div className="flex items-center justify-between pt-1">
                  <span className="text-[13px] font-semibold text-[#111111]">
                    Promote in AI itinerary
                  </span>

                  <button
                    type="button"
                    role="switch"
                    aria-checked={listing.promoteInAiItinerary}
                    aria-label={`Promote ${listing.name} in AI itinerary`}
                    onClick={() => {
                      toggleB2BPromoteInAi(listing.id);
                      showToast(
                        !listing.promoteInAiItinerary
                          ? `"${listing.name}" is now promoted in tourist AI itineraries & Explore!`
                          : `Paused AI promotion for "${listing.name}".`,
                        'success'
                      );
                    }}
                    className={`w-14 h-8 rounded-full p-1 transition-colors flex items-center ${
                      listing.promoteInAiItinerary
                        ? 'bg-[#2E9E6B] justify-end'
                        : 'bg-[#CBC5BA] justify-start'
                    }`}
                  >
                    <span className="w-6 h-6 rounded-full bg-white shadow-sm" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="mt-3.5 space-y-2.5">
            {merchantBookings.map((bk) => (
              <div
                key={bk.id}
                className="bg-[#F6F2EA] rounded-[22px] p-4 flex items-center justify-between"
              >
                <div>
                  <div className="text-[15px] font-bold text-[#111111]">
                    {bk.time} · {bk.customerName} ({bk.guests} guests)
                  </div>
                  <div className="text-[12px] text-[#6E6A63] mt-0.5">
                    {bk.serviceName}
                  </div>
                </div>
                <span className="bg-[#DDEFE3] text-[#2E9E6B] text-[11px] font-semibold px-3 py-1 rounded-full">
                  {bk.status}
                </span>
              </div>
            ))}
          </div>
        )}

        <button
          type="button"
          onClick={() => navigate('/merchant/register')}
          className="mt-4 w-full py-4 rounded-full bg-[#EBC878] text-[#111111] text-[15px] font-semibold shadow-sm"
        >
          + Add service
        </button>
      </div>

      <MerchantBottomNav activeTab="Listings" />
    </div>
  );
};

/**
 * Screen H3 — Scan voucher
 */
export const ScreenH3MerchantScanVoucher: React.FC = () => {
  const merchantState = useAppStore((s) => s.merchantState);
  const redeemTouristVoucher = useAppStore((s) => s.redeemTouristVoucher);
  const nextTouristVoucher = useAppStore((s) => s.nextTouristVoucher);
  const showToast = useAppStore((s) => s.showToast);

  const currentVoucher =
    merchantState.vouchers[merchantState.activeVoucherIndex] ||
    merchantState.vouchers[0];

  const handleRedeem = () => {
    if (currentVoucher.isRedeemed) {
      showToast('This voucher has already been redeemed.', 'warning');
      return;
    }
    redeemTouristVoucher(currentVoucher.id);
    showToast(
      `Redeemed voucher for ${currentVoucher.holderName} (${currentVoucher.discountLabel})!`,
      'success'
    );
  };

  return (
    <div className="flex-1 flex flex-col justify-between text-white">
      <div>
        <ScreenHeader title="Scan voucher" backTo="/merchant" dark />

        {/* QR Viewfinder matching H3 - Scan voucher.png */}
        <div className="mt-2 relative bg-[#2C2823] rounded-[30px] p-7 h-[320px] flex items-center justify-center">
          {/* Corner Brackets */}
          <div className="absolute top-5 left-5 w-7 h-7 border-t-[3px] border-l-[3px] border-white rounded-tl-sm" />
          <div className="absolute top-5 right-5 w-7 h-7 border-t-[3px] border-r-[3px] border-white rounded-tr-sm" />
          <div className="absolute bottom-5 left-5 w-7 h-7 border-b-[3px] border-l-[3px] border-white rounded-bl-sm" />
          <div className="absolute bottom-5 right-5 w-7 h-7 border-b-[3px] border-r-[3px] border-white rounded-br-sm" />

          <QrMatrixSvg payload={currentVoucher.qrPayload} size={135} />
        </div>
      </div>

      {/* Bottom Voucher Card */}
      <div className="mt-4 bg-[#F6F2EA] text-[#111111] rounded-[30px] p-5">
        <span
          className={`inline-block text-[12px] font-semibold px-3.5 py-1 rounded-full ${
            currentVoucher.isRedeemed
              ? 'bg-[#F5E6BE] text-[#785C12]'
              : 'bg-[#DDEFE3] text-[#2E9E6B]'
          }`}
        >
          {currentVoucher.isRedeemed ? '✓ Redeemed' : '✓ Valid voucher'}
        </span>

        <h2 className="mt-3 text-[24px] font-bold text-[#111111]">
          {currentVoucher.holderName} · {currentVoucher.discountLabel}
        </h2>
        <div className="mt-1 text-[13px] text-[#6E6A63]">
          {currentVoucher.tierLabel} · {currentVoucher.expiresLabel}
        </div>

        <div className="mt-4 space-y-2.5">
          <button
            type="button"
            onClick={handleRedeem}
            className="w-full py-4 rounded-full bg-[#EBC878] text-[#111111] text-[15px] font-semibold"
          >
            {currentVoucher.isRedeemed ? 'Already Redeemed' : 'Redeem voucher'}
          </button>

          <button
            type="button"
            onClick={() => {
              nextTouristVoucher();
              showToast('Scanned next tourist voucher.', 'info');
            }}
            className="w-full py-4 rounded-full bg-white text-[#111111] text-[15px] font-semibold shadow-sm"
          >
            Scan next
          </button>
        </div>
      </div>
    </div>
  );
};

/**
 * Screen H4 — Join as a merchant (Merchant Register / Create B2B Service)
 */
export const ScreenH4MerchantRegister: React.FC = () => {
  const navigate = useNavigate();
  const createB2BListing = useAppStore((s) => s.createB2BListing);
  const showToast = useAppStore((s) => s.showToast);

  const [businessName, setBusinessName] = useState('Plov House');
  const [city, setCity] = useState('Samarkand');
  const [category, setCategory] = useState<B2BListing['category']>('Restaurant');
  const [languages, setLanguages] = useState<string[]>([
    'English',
    'Russian',
    'Uzbek',
  ]);
  const [licenseFileName, setLicenseFileName] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const toggleLanguage = (lang: string) => {
    setLanguages((prev) =>
      prev.includes(lang)
        ? prev.length > 1
          ? prev.filter((l) => l !== lang)
          : prev
        : [...prev, lang]
    );
  };

  const handleLicenseUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setLicenseFileName(file.name);
    await PersistenceService.saveFile({
      key: `license-${Date.now()}`,
      fileName: file.name,
      mimeType: file.type || 'application/pdf',
      fileSize: file.size,
      dataUrl: 'local-license-reference',
      savedAt: new Date().toISOString(),
    });
    showToast(`Attached business licence "${file.name}".`, 'success');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    const parsed = merchantRegisterSchema.safeParse({
      name: businessName,
      city,
      category,
      languages,
    });

    if (!parsed.success) {
      setErrorMsg(
        parsed.error.errors[0]?.message || 'Please complete all business fields.'
      );
      return;
    }

    const created = createB2BListing({
      name: businessName,
      city,
      category,
      languages,
      licenseFileName: licenseFileName || undefined,
    });

    showToast(
      `Submitted "${created.name}" (${created.category})! Now live in Explore Map, Food & AI Itineraries.`,
      'success'
    );
    navigate('/merchant/listings');
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="flex-1 flex flex-col justify-between"
    >
      <div>
        <ScreenHeader title="Join as a merchant" backTo="/merchant" />

        <h2 className="mt-2 text-[34px] leading-[1.08] font-bold tracking-tight text-[#111111]">
          Tell us about
          <br />
          your business
        </h2>

        <div className="mt-5 space-y-4">
          <div>
            <label
              htmlFor="merchant-business-name"
              className="block text-[13px] font-medium text-[#6E6A63] mb-1.5 ml-1"
            >
              Business name
            </label>
            <input
              id="merchant-business-name"
              type="text"
              value={businessName}
              onChange={(e) => setBusinessName(e.target.value)}
              placeholder="Plov House"
              className="w-full px-4 py-3.5 rounded-2xl bg-white text-[#111111] text-[15px] placeholder-[#8C877E] focus:outline-none focus:ring-2 focus:ring-[#111111]"
            />
          </div>

          <div>
            <label
              htmlFor="merchant-city"
              className="block text-[13px] font-medium text-[#6E6A63] mb-1.5 ml-1"
            >
              City
            </label>
            <input
              id="merchant-city"
              type="text"
              value={city}
              onChange={(e) => setCity(e.target.value)}
              placeholder="Samarkand"
              className="w-full px-4 py-3.5 rounded-2xl bg-white text-[#111111] text-[15px] placeholder-[#8C877E] focus:outline-none focus:ring-2 focus:ring-[#111111]"
            />
          </div>

          {/* Type Chips */}
          <div>
            <span className="block text-[13px] font-medium text-[#6E6A63] mb-2 ml-1">
              Type
            </span>
            <div className="flex flex-wrap gap-2">
              {(['Restaurant', 'Guide', 'Driver', 'Craftsman'] as const).map(
                (type) => {
                  const isSelected = category === type;
                  return (
                    <button
                      key={type}
                      type="button"
                      onClick={() => setCategory(type)}
                      className={`px-4 py-2.5 rounded-full text-[13px] font-semibold transition-colors ${
                        isSelected
                          ? 'bg-[#111111] text-white'
                          : 'bg-white text-[#111111]'
                      }`}
                    >
                      {type}
                    </button>
                  );
                }
              )}
            </div>
          </div>

          {/* Languages Chips */}
          <div>
            <span className="block text-[13px] font-medium text-[#6E6A63] mb-2 ml-1">
              Languages
            </span>
            <div className="flex flex-wrap gap-2">
              {(['English', 'Russian', 'Uzbek'] as const).map((lang) => {
                const isSelected = languages.includes(lang);
                return (
                  <button
                    key={lang}
                    type="button"
                    onClick={() => toggleLanguage(lang)}
                    className={`px-4 py-2.5 rounded-full text-[13px] font-semibold transition-colors ${
                      isSelected
                        ? 'bg-[#111111] text-white'
                        : 'bg-white text-[#111111]'
                    }`}
                  >
                    {lang}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Upload Business Licence Card */}
          <div className="bg-[#F6F2EA] rounded-[22px] p-4 flex items-center justify-between">
            <div>
              <div className="text-[14px] font-semibold text-[#111111]">
                Upload business licence
              </div>
              {licenseFileName && (
                <div className="text-[11px] text-[#2E9E6B] font-medium mt-0.5">
                  ✓ {licenseFileName}
                </div>
              )}
            </div>
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="px-4 py-1.5 rounded-full bg-white text-[#111111] text-[13px] font-semibold shadow-sm"
            >
              Upload
            </button>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*,application/pdf"
              onChange={handleLicenseUpload}
              className="hidden"
              aria-label="Upload business licence"
            />
          </div>

          <p className="text-[12px] text-[#6E6A63] leading-snug">
            We verify every merchant before they appear in AI itineraries.
          </p>

          {errorMsg && (
            <p role="alert" className="text-[13px] text-[#D9534F] font-medium">
              {errorMsg}
            </p>
          )}
        </div>
      </div>

      <div className="mt-5">
        <button
          type="submit"
          data-testid="merchant-submit-btn"
          className="w-full py-4 rounded-full bg-[#111111] text-white text-[15px] font-semibold"
        >
          Submit for verification
        </button>
      </div>
    </form>
  );
};
