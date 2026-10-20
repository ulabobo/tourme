import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ScreenHeader, SilkRoadArchArtwork } from '../../components/common/UIElements';
import {
  HotelService,
  PaymentService,
  TransportService,
} from '../../services/domainServices';
import { useAppStore } from '../../store/useAppStore';
import { PacingType, TransportOption } from '../../types/domain';

/**
 * Screen B1 — Step 1 of 4: Choose cities
 */
export const ScreenB1ChooseCities: React.FC = () => {
  const navigate = useNavigate();
  const selectedCities = useAppStore((s) => s.tripPlan.selectedCities);
  const toggleCitySelection = useAppStore((s) => s.toggleCitySelection);
  const applyAiCitySuggestion = useAppStore((s) => s.applyAiCitySuggestion);
  const showToast = useAppStore((s) => s.showToast);

  const [activeFilter, setActiveFilter] = useState<string>('All');
  const filterTabs = ['All', 'History', 'Gastronomy', 'Nature', 'Photography'];

  const khiva = selectedCities.find((c) => c.id === 'khiva')!;
  const bukhara = selectedCities.find((c) => c.id === 'bukhara')!;
  const samarkand = selectedCities.find((c) => c.id === 'samarkand')!;
  const tashkent = selectedCities.find((c) => c.id === 'tashkent')!;

  return (
    <div className="flex-1 flex flex-col justify-between">
      <div>
        <ScreenHeader title="Step 1 of 4" backTo="/onboarding/visa" />

        <h2 className="mt-2 text-[34px] leading-[1.08] font-bold tracking-tight text-[#111111]">
          Where do you
          <br />
          want to go?
        </h2>

        {/* Filter Chips */}
        <div className="mt-4 flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar">
          {filterTabs.map((tab) => {
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

        {/* AI Suggestion Pill */}
        <button
          type="button"
          onClick={() => {
            applyAiCitySuggestion();
            showToast('Applied AI route: Tashkent, Samarkand, Bukhara & Khiva.', 'success');
          }}
          className="mt-3 inline-block bg-[#EBC878] text-[#111111] text-[12px] font-semibold px-4 py-2 rounded-full shadow-sm active:scale-95 transition-transform"
        >
          AI suggests: Samarkand · Bukhara · Khiva
        </button>

        {/* Stacked Pastel City Cards matching B1 - Choose cities.png */}
        <div className="mt-4 relative flex flex-col">
          {/* Card 1: Khiva (Pink/Coral) */}
          <div
            onClick={() => toggleCitySelection('khiva')}
            role="button"
            tabIndex={0}
            aria-pressed={khiva?.selected}
            onKeyDown={(e) => e.key === 'Enter' && toggleCitySelection('khiva')}
            className={`rounded-t-[28px] p-5 pb-9 cursor-pointer transition-all flex items-start justify-between ${
              khiva?.selected ? 'ring-2 ring-[#111111]/20' : 'opacity-60'
            }`}
            style={{
              background: 'linear-gradient(135deg, #F79CA9 0%, #F7B19D 100%)',
            }}
          >
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-[24px] font-bold text-[#111111]">Khiva</h3>
                {khiva?.selected && (
                  <span className="text-[11px] font-bold bg-black/15 text-[#111111] px-2 py-0.5 rounded-full">
                    ✓ Selected
                  </span>
                )}
              </div>
              <p className="text-[13px] text-[#3B3230] mt-0.5">
                2 days inside a walled city
              </p>
            </div>
            <SilkRoadArchArtwork
              variant="blue-arch"
              className="w-36 h-16 rounded-2xl shrink-0"
            />
          </div>

          {/* Card 2: Bukhara (Lavender) */}
          <div
            onClick={() => toggleCitySelection('bukhara')}
            role="button"
            tabIndex={0}
            aria-pressed={bukhara?.selected}
            onKeyDown={(e) => e.key === 'Enter' && toggleCitySelection('bukhara')}
            className={`-mt-5 rounded-t-[28px] p-5 pb-9 cursor-pointer transition-all flex items-start justify-between ${
              bukhara?.selected ? 'ring-2 ring-[#111111]/20' : 'opacity-60'
            }`}
            style={{
              background: 'linear-gradient(135deg, #A3B5F6 0%, #C2A6F2 100%)',
            }}
          >
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-[24px] font-bold text-[#111111]">Bukhara</h3>
                {bukhara?.selected && (
                  <span className="text-[11px] font-bold bg-black/15 text-[#111111] px-2 py-0.5 rounded-full">
                    ✓ Selected
                  </span>
                )}
              </div>
              <p className="text-[13px] text-[#32344A] mt-0.5">
                4 days of bazaars & pools
              </p>
            </div>
            <SilkRoadArchArtwork
              variant="blue-arch"
              className="w-36 h-16 rounded-2xl shrink-0"
            />
          </div>

          {/* Card 3: Samarkand (Terracotta Hero) */}
          <div
            onClick={() => toggleCitySelection('samarkand')}
            role="button"
            tabIndex={0}
            aria-pressed={samarkand?.selected}
            onKeyDown={(e) => e.key === 'Enter' && toggleCitySelection('samarkand')}
            className={`-mt-5 rounded-[28px] p-5 cursor-pointer transition-all flex items-stretch justify-between shadow-md ${
              samarkand?.selected ? 'ring-2 ring-[#111111]/30' : 'opacity-65'
            }`}
            style={{
              background: 'linear-gradient(135deg, #F6C396 0%, #F1A47A 100%)',
            }}
          >
            <div className="flex flex-col justify-between pr-3">
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-[24px] font-bold text-[#111111]">Samarkand</h3>
                </div>
                <p className="text-[13px] text-[#4A382B] mt-1 leading-snug">
                  5 days of domes,
                  <br />
                  blue tiles & plov
                </p>
              </div>

              <div className="mt-16 inline-block bg-[#F6F2EA] text-[#111111] text-[13px] font-semibold px-3.5 py-2 rounded-full self-start">
                from $65 / day
              </div>
            </div>

            <SilkRoadArchArtwork
              variant="blue-arch"
              size="hero"
              className="w-36 h-48 rounded-[22px] shrink-0"
            />
          </div>

          {/* Optional Tashkent Arrival Hub toggle pill */}
          <div className="mt-2.5 flex items-center justify-between bg-[#F6F2EA] rounded-2xl px-4 py-2.5 text-xs">
            <span className="font-medium text-[#111111]">
              Include Tashkent arrival stop ({tashkent?.daysAllocated || 1}d)
            </span>
            <button
              type="button"
              onClick={() => toggleCitySelection('tashkent')}
              className={`px-3 py-1 rounded-full font-semibold ${
                tashkent?.selected
                  ? 'bg-[#111111] text-white'
                  : 'bg-white text-[#111111]'
              }`}
            >
              {tashkent?.selected ? 'Included' : 'Add Tashkent'}
            </button>
          </div>
        </div>
      </div>

      <div className="mt-4">
        <button
          type="button"
          onClick={() => navigate('/planner/days')}
          className="w-full py-4 rounded-full bg-[#111111] text-white text-[16px] font-semibold"
        >
          Continue
        </button>
      </div>
    </div>
  );
};

/**
 * Screen B2 — Step 2 of 4: Days & pacing
 */
export const ScreenB2DaysPacing: React.FC = () => {
  const navigate = useNavigate();
  const selectedCities = useAppStore((s) => s.tripPlan.selectedCities);
  const totalDays = useAppStore((s) => s.tripPlan.totalDays);
  const pacing = useAppStore((s) => s.userProfile.preferences.pacing);
  const setTotalTripDays = useAppStore((s) => s.setTotalTripDays);
  const setCityDaysAllocated = useAppStore((s) => s.setCityDaysAllocated);
  const setPacing = useAppStore((s) => s.setPacing);

  const activeCities = selectedCities.filter((c) => c.selected);

  return (
    <div className="flex-1 flex flex-col justify-between">
      <div>
        <ScreenHeader title="Step 2 of 4" backTo="/planner/cities" />

        {/* Progress Bar */}
        <div className="w-full h-1.5 bg-[#D5CFC4] rounded-full overflow-hidden mt-1">
          <div className="w-1/2 h-full bg-[#111111] rounded-full" />
        </div>

        <h2 className="mt-4 text-[32px] font-bold tracking-tight text-[#111111]">
          How many days?
        </h2>

        {/* Total Days Counter Card */}
        <div className="mt-3 bg-[#F6F2EA] rounded-[26px] p-5 flex items-center justify-between">
          <button
            type="button"
            aria-label="Decrease total trip days"
            onClick={() => setTotalTripDays(totalDays - 1)}
            disabled={totalDays <= 1}
            className="w-14 h-14 rounded-full bg-white text-[#111111] text-2xl font-bold flex items-center justify-center shadow-sm disabled:opacity-40 active:scale-95 transition-transform"
          >
            −
          </button>

          <div className="text-center">
            <div
              data-testid="total-days-value"
              className="text-[52px] leading-none font-bold text-[#111111]"
            >
              {totalDays}
            </div>
            <div className="text-[13px] text-[#6E6A63] mt-1">days in Uzbekistan</div>
          </div>

          <button
            type="button"
            aria-label="Increase total trip days"
            onClick={() => setTotalTripDays(totalDays + 1)}
            className="w-14 h-14 rounded-full bg-[#111111] text-white text-2xl font-bold flex items-center justify-center shadow-sm active:scale-95 transition-transform"
          >
            +
          </button>
        </div>

        {/* AI Split by City */}
        <h3 className="mt-5 text-[17px] font-bold text-[#111111]">AI split by city</h3>

        {/* Proportional Color Bar */}
        <div className="mt-2 flex items-center gap-1.5 h-3.5 w-full">
          {activeCities.map((city) => (
            <div
              key={city.id}
              style={{
                flexGrow: Math.max(1, city.daysAllocated),
                backgroundColor: city.color,
              }}
              className="h-full rounded-full transition-all duration-200"
            />
          ))}
        </div>

        {/* City Rows with interactive +/- */}
        <div className="mt-3 space-y-2">
          {activeCities.map((city) => (
            <div
              key={city.id}
              className="bg-[#F6F2EA] rounded-2xl px-4 py-3 flex items-center justify-between"
            >
              <div className="flex items-center gap-3">
                <span
                  className="w-3.5 h-3.5 rounded-full shrink-0"
                  style={{ backgroundColor: city.color }}
                />
                <span className="text-[15px] font-medium text-[#111111]">
                  {city.name}
                </span>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  aria-label={`Decrease days in ${city.name}`}
                  onClick={() =>
                    setCityDaysAllocated(city.id, Math.max(1, city.daysAllocated - 1))
                  }
                  className="w-6 h-6 rounded-full bg-white text-[#111111] text-xs font-bold flex items-center justify-center"
                >
                  −
                </button>
                <span className="text-[15px] font-bold text-[#111111] min-w-[54px] text-right">
                  {city.daysAllocated} {city.daysAllocated === 1 ? 'day' : 'days'}
                </span>
                <button
                  type="button"
                  aria-label={`Increase days in ${city.name}`}
                  onClick={() => setCityDaysAllocated(city.id, city.daysAllocated + 1)}
                  className="w-6 h-6 rounded-full bg-[#111111] text-white text-xs font-bold flex items-center justify-center"
                >
                  +
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Pacing */}
        <div className="mt-4">
          <span className="block text-[13px] font-medium text-[#6E6A63] mb-2">
            Pacing
          </span>
          <div className="flex items-center gap-2.5">
            {(['Relaxed', 'Balanced', 'Packed'] as PacingType[]).map((p) => {
              const isSelected = pacing === p;
              return (
                <button
                  key={p}
                  type="button"
                  onClick={() => setPacing(p)}
                  className={`px-5 py-2.5 rounded-full text-[14px] font-semibold transition-colors ${
                    isSelected
                      ? 'bg-[#111111] text-white'
                      : 'bg-white text-[#111111]'
                  }`}
                >
                  {p}
                </button>
              );
            })}
          </div>
        </div>

        {/* Soft Gold AI Note */}
        <div className="mt-4 bg-[#F5E6BE] rounded-2xl p-4 text-[13px] text-[#111111] leading-snug">
          AI note: Bukhara and Samarkand need 3 days each — Khiva works as a short stop.
        </div>
      </div>

      <div className="mt-4">
        <button
          type="button"
          onClick={() => navigate('/planner/transport')}
          className="w-full py-4 rounded-full bg-[#111111] text-white text-[16px] font-semibold"
        >
          Continue to transport
        </button>
      </div>
    </div>
  );
};

/**
 * Screen B3 — Step 3 of 4: Transport fallback (Afrosiyob sold out & 3 verified ways)
 */
export const ScreenB3TransportFallback: React.FC = () => {
  const navigate = useNavigate();
  const setPendingCheckoutOption = useAppStore((s) => s.setPendingCheckoutOption);
  const joinTicketHunterWaitlist = useAppStore((s) => s.joinTicketHunterWaitlist);
  const waitlistEntries = useAppStore((s) => s.tripPlan.ticketHunterWaitlist);
  const showToast = useAppStore((s) => s.showToast);

  const [routeIndex, setRouteIndex] = useState(0);
  const routes = [
    { from: 'Tashkent', to: 'Samarkand', date: 'Fri, Oct 24' },
    { from: 'Samarkand', to: 'Bukhara', date: 'Mon, Oct 27' },
    { from: 'Bukhara', to: 'Khiva', date: 'Wed, Oct 29' },
  ];
  const currentRoute = routes[routeIndex];

  const [sortBy, setSortBy] = useState<'Recommended' | 'Fastest' | 'Cheapest'>('Recommended');
  const [showAlternativesModal, setShowAlternativesModal] = useState(false);

  const options = TransportService.checkAvailability(
    currentRoute.from,
    currentRoute.to,
    currentRoute.date,
    sortBy
  );

  const soldOutTrain = options.find((o) => o.availability === 'SOLD_OUT')!;
  const waitlistOption = options.find((o) => o.type === 'waitlist')!;
  const flightOption = options.find((o) => o.type === 'flight')!;
  const transferOptions = options.filter((o) => o.type === 'transfer');

  const isOnWaitlist = waitlistEntries.some(
    (w) => w.fromCity === currentRoute.from && w.toCity === currentRoute.to
  );

  const handleBookOption = (opt: TransportOption) => {
    setPendingCheckoutOption(opt);
    navigate('/planner/checkout');
  };

  const handleJoinWaitlist = () => {
    joinTicketHunterWaitlist(currentRoute.from, currentRoute.to, currentRoute.date);
    showToast(
      `Ticket Hunter Bot activated for ${currentRoute.from} → ${currentRoute.to} (${currentRoute.date}) [Local Demo Monitor].`,
      'success'
    );
  };

  return (
    <div className="flex-1 flex flex-col justify-between">
      <div>
        <ScreenHeader title="Step 3 of 4" backTo="/planner/days" />

        {/* Route & Date Pills */}
        <div className="mt-1 flex items-center gap-2.5 flex-wrap">
          <button
            type="button"
            onClick={() => setRouteIndex((i) => (i + 1) % routes.length)}
            className="bg-[#EBC878] text-[#111111] text-[13px] font-semibold px-4 py-2 rounded-full"
          >
            {currentRoute.from} → {currentRoute.to}
          </button>
          <span className="bg-white text-[#111111] text-[13px] font-semibold px-4 py-2 rounded-full">
            {currentRoute.date}
          </span>
        </div>

        <h2 className="mt-4 text-[34px] leading-[1.08] font-bold tracking-tight text-[#111111]">
          Afrosiyob
          <br />
          is full
        </h2>
        <p className="mt-1.5 text-[14px] text-[#6E6A63]">
          3 verified ways to reach {currentRoute.to}
        </p>

        {/* Sort Tabs */}
        <div className="mt-3.5 flex items-center gap-2">
          {(['Recommended', 'Fastest', 'Cheapest'] as const).map((tab) => {
            const isActive = sortBy === tab;
            return (
              <button
                key={tab}
                type="button"
                onClick={() => setSortBy(tab)}
                className={`px-4 py-2 rounded-full text-[13px] font-semibold transition-colors ${
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

        {/* Sold-Out Train Card + View Alternatives Button */}
        <div className="mt-3.5 bg-[#DDD8CE] rounded-[24px] p-4 flex items-center justify-between">
          <div>
            <div className="text-[17px] font-bold text-[#6E6A63]">
              {soldOutTrain.title}
            </div>
            <div className="text-[13px] text-[#6E6A63] mt-0.5">
              {soldOutTrain.subtitle}
            </div>
            <button
              type="button"
              onClick={() => setShowAlternativesModal(true)}
              className="mt-1.5 text-[12px] font-semibold text-[#111111] underline"
            >
              View Alternatives (Sedan / Minivan / Bot)
            </button>
          </div>
          <span className="bg-[#EFCAC3] text-[#8E3B30] text-[12px] font-semibold px-3.5 py-1.5 rounded-full">
            Sold out
          </span>
        </div>

        {/* Fallback Card 1: Ticket Hunter Bot */}
        <div className="mt-3 bg-[#EBC878] rounded-[26px] p-4">
          <div className="flex items-center gap-3.5">
            <SilkRoadArchArtwork
              variant="blue-arch"
              className="w-20 h-20 rounded-2xl shrink-0"
            />
            <div>
              <span className="inline-block bg-white text-[#111111] text-[11px] font-semibold px-3 py-1 rounded-full">
                Best match
              </span>
              <h3 className="mt-1.5 text-[18px] font-bold text-[#111111]">
                {waitlistOption.title}
              </h3>
              <p className="text-[13px] text-[#4A463F]">
                {waitlistOption.subtitle}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={handleJoinWaitlist}
            className="mt-3.5 w-full py-3.5 rounded-full bg-[#111111] text-white text-[15px] font-semibold"
          >
            {isOnWaitlist ? '✓ Waitlist Active (Monitoring)' : 'Join waitlist'}
          </button>
        </div>

        {/* Fallback Card 2: Domestic Flight */}
        <div className="mt-3 bg-[#EBC878] rounded-[26px] p-4">
          <div className="flex items-center gap-3.5">
            <SilkRoadArchArtwork
              variant="lavender"
              className="w-20 h-20 rounded-2xl shrink-0"
            />
            <div>
              <h3 className="text-[18px] font-bold text-[#111111]">
                {flightOption.title}
              </h3>
              <p className="text-[13px] text-[#4A463F] mt-0.5">
                {flightOption.subtitle}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={() => handleBookOption(flightOption)}
            className="mt-3.5 w-full py-3.5 rounded-full bg-[#111111] text-white text-[15px] font-semibold"
          >
            ${flightOption.priceUsd} · Book
          </button>
        </div>

        {/* Fallback Card 3: Private Transfer */}
        <div className="mt-3 bg-[#EBC878] rounded-[26px] p-4">
          <div className="flex items-center gap-3.5">
            <SilkRoadArchArtwork
              variant="rose-arch"
              className="w-20 h-20 rounded-2xl shrink-0"
            />
            <div>
              <h3 className="text-[18px] font-bold text-[#111111]">
                {transferOptions[0].title}
              </h3>
              <p className="text-[13px] text-[#4A463F] mt-0.5">
                {transferOptions[0].subtitle}
              </p>
            </div>
          </div>

          <div className="mt-3.5 flex gap-2">
            <button
              type="button"
              onClick={() => handleBookOption(transferOptions[0])}
              className="flex-1 py-3.5 rounded-full bg-[#111111] text-white text-[14px] font-semibold"
            >
              Sedan ${transferOptions[0].priceUsd} · Book
            </button>
            <button
              type="button"
              onClick={() => setShowAlternativesModal(true)}
              className="px-4 py-3.5 rounded-full bg-white text-[#111111] text-[13px] font-semibold"
            >
              Minivan
            </button>
          </div>
        </div>
      </div>

      {/* Alternatives Modal (Private Sedan, Minivan & Ticket Hunter Bot) */}
      {showAlternativesModal && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label="Sold-out Train Alternatives"
          className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4"
        >
          <div className="bg-[#F6F2EA] text-[#111111] w-full max-w-[370px] rounded-[28px] p-5 shadow-2xl space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-[18px] font-bold">Sold-Out Alternatives</h3>
              <button
                type="button"
                onClick={() => setShowAlternativesModal(false)}
                className="w-8 h-8 rounded-full bg-white font-bold"
              >
                ✕
              </button>
            </div>
            <p className="text-[12px] text-[#6E6A63]">
              Afrosiyob 08:00 is sold out on {currentRoute.date}. Select a door-to-door transfer or activate the Ticket Hunter Bot:
            </p>
            {transferOptions.map((tr) => (
              <div key={tr.id} className="bg-white rounded-2xl p-3.5 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-[15px]">
                    {tr.vehicleType} Transfer ({tr.durationLabel})
                  </span>
                  <span className="font-bold text-[15px]">${tr.priceUsd}</span>
                </div>
                <p className="text-[12px] text-[#6E6A63]">
                  Driver: {tr.driverDetails?.name} · {tr.driverDetails?.vehicle} ({tr.driverDetails?.plate})
                </p>
                <button
                  type="button"
                  onClick={() => {
                    setShowAlternativesModal(false);
                    handleBookOption(tr);
                  }}
                  className="w-full py-2.5 rounded-full bg-[#111111] text-white text-[13px] font-semibold"
                >
                  Book {tr.vehicleType} · ${tr.priceUsd}
                </button>
              </div>
            ))}
            <button
              type="button"
              onClick={() => {
                handleJoinWaitlist();
                setShowAlternativesModal(false);
              }}
              className="w-full py-3 rounded-full bg-[#EBC878] text-[#111111] text-[14px] font-semibold"
            >
              Activate Ticket Hunter Bot (Free)
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

/**
 * Screen B4 — Checkout
 */
export const ScreenB4Checkout: React.FC = () => {
  const navigate = useNavigate();
  const pendingOption = useAppStore((s) => s.tripPlan.pendingCheckoutOption);
  const userProfile = useAppStore((s) => s.userProfile);
  const updateUserProfile = useAppStore((s) => s.updateUserProfile);
  const completeTransportBooking = useAppStore((s) => s.completeTransportBooking);
  const showToast = useAppStore((s) => s.showToast);

  const [paymentMethod, setPaymentMethod] = useState<
    'Apple Pay' | 'Google Pay' | 'Credit / debit card'
  >('Apple Pay');
  const [isEditingPassenger, setIsEditingPassenger] = useState(false);
  const [passengerName, setPassengerName] = useState(userProfile.name || 'Anna Becker');
  const [isProcessing, setIsProcessing] = useState(false);

  const option: TransportOption = pendingOption || {
    id: 'tr-flight-TAS-SKD',
    type: 'flight',
    title: 'Domestic flight',
    subtitle: 'Uzbekistan Airways · 1h 05m',
    provider: 'Uzbekistan Airways',
    fromCity: 'Tashkent',
    toCity: 'Samarkand',
    fromCode: 'TAS',
    toCode: 'SKD',
    date: 'Fri, Oct 24',
    departureTime: '08:40',
    arrivalTime: '09:45',
    durationLabel: '1h 05m',
    durationMinutes: 65,
    priceUsd: 62,
    priceUzs: 793600,
    availability: 'AVAILABLE',
    seatOrWagon: 'Seat 14A',
    sourceLabel: 'Demo Airline Inventory',
  };

  const handleCompletePayment = async () => {
    setIsProcessing(true);
    if (passengerName.trim()) {
      updateUserProfile({ name: passengerName.trim() });
    }
    const res = await PaymentService.processDemoPayment({
      amountUsd: option.priceUsd,
      method: paymentMethod,
      description: `${option.fromCity} → ${option.toCity}`,
    });
    const ticket = completeTransportBooking(option, paymentMethod);
    setIsProcessing(false);
    showToast(
      `Booked ${ticket.title} (${ticket.bookingRef})! Saved QR to Offline Wallet. [${res.notice}]`,
      'success'
    );
    navigate('/planner/hotels');
  };

  return (
    <div className="flex-1 flex flex-col justify-between">
      <div>
        <ScreenHeader title="Checkout" backTo="/planner/transport" />

        {/* Gold Ticket Summary Card */}
        <div className="mt-2 bg-[#EBC878] rounded-[26px] p-5">
          <span className="inline-block bg-white text-[#111111] text-[12px] font-semibold px-3.5 py-1 rounded-full">
            {option.provider.split('(')[0].trim()}
          </span>

          <div className="mt-3 text-[24px] font-bold tracking-tight text-[#111111]">
            {option.fromCity} → {option.toCity}
          </div>

          <div className="mt-1 text-[13px] text-[#4A463F]">
            {option.date} · {option.departureTime} → {option.arrivalTime} · 1 passenger
          </div>

          <div className="mt-2.5 text-[16px] font-bold text-[#111111]">
            Ticket ${option.priceUsd}
          </div>
        </div>

        {/* Passenger Card */}
        <div className="mt-3.5 bg-[#F6F2EA] rounded-[22px] p-4 flex items-center justify-between">
          <div>
            <div className="text-[11px] font-semibold uppercase tracking-wider text-[#6E6A63]">
              PASSENGER
            </div>
            {isEditingPassenger ? (
              <input
                type="text"
                aria-label="Passenger full name"
                value={passengerName}
                onChange={(e) => setPassengerName(e.target.value)}
                className="mt-1 px-3 py-1.5 rounded-xl bg-white text-[#111111] text-[14px] font-semibold border border-black/20"
              />
            ) : (
              <div className="mt-0.5 text-[15px] font-semibold text-[#111111]">
                {passengerName} · as in passport
              </div>
            )}
          </div>

          <button
            type="button"
            onClick={() => {
              if (isEditingPassenger && passengerName.trim()) {
                updateUserProfile({ name: passengerName.trim() });
                showToast('Passenger name updated.', 'success');
              }
              setIsEditingPassenger((v) => !v);
            }}
            className="px-4 py-1.5 rounded-full bg-white text-[#111111] text-[13px] font-semibold shadow-sm"
          >
            {isEditingPassenger ? 'Save' : 'Edit'}
          </button>
        </div>

        {/* Pay With */}
        <h3 className="mt-5 mb-2.5 text-[18px] font-bold text-[#111111]">Pay with</h3>

        <div className="space-y-2.5">
          {(['Apple Pay', 'Google Pay', 'Credit / debit card'] as const).map((method) => {
            const isSelected = paymentMethod === method;
            return (
              <button
                key={method}
                type="button"
                onClick={() => setPaymentMethod(method)}
                className={`w-full px-4 py-4 rounded-2xl bg-white flex items-center justify-between text-left transition-all ${
                  isSelected
                    ? 'border-2 border-[#111111]'
                    : 'border border-transparent'
                }`}
              >
                <span className="text-[15px] font-semibold text-[#111111]">
                  {method}
                </span>
                <span
                  className={`w-5 h-5 rounded-full border flex items-center justify-center ${
                    isSelected
                      ? 'border-[#111111] bg-[#111111]'
                      : 'border-[#8C877E]'
                  }`}
                />
              </button>
            );
          })}
        </div>

        {/* Total */}
        <div className="mt-5">
          <div className="text-[13px] text-[#6E6A63]">Total</div>
          <div className="text-[40px] leading-tight font-bold text-[#111111]">
            ${option.priceUsd}
          </div>
        </div>
      </div>

      <div className="mt-4">
        <button
          type="button"
          disabled={isProcessing}
          onClick={handleCompletePayment}
          className="w-full py-4 rounded-full bg-[#111111] text-white text-[16px] font-semibold"
        >
          {isProcessing
            ? 'Processing Demo Booking...'
            : `Pay $${option.priceUsd} with ${paymentMethod}`}
        </button>
        <p className="mt-2.5 text-[12px] text-[#6E6A63] text-center">
          Your QR ticket is saved to the Offline Wallet.
        </p>
      </div>
    </div>
  );
};

/**
 * Screen B5 — Step 4 of 4: Hotels
 */
export const ScreenB5Hotels: React.FC = () => {
  const navigate = useNavigate();
  const selectAndBookHotel = useAppStore((s) => s.selectAndBookHotel);
  const showToast = useAppStore((s) => s.showToast);

  const [selectedCity, setSelectedCity] = useState<string>('Samarkand');
  const [selectedCategory, setSelectedCategory] = useState<string>('Medrese hotel');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const filteredHotels = HotelService.searchHotels(
    selectedCity === 'All' ? '' : selectedCity,
    selectedCategory === 'All' ? null : null, // Show both Samarkand cards by default like B5 PNG unless filtered by search
    searchQuery
  );

  const displayedHotels =
    searchQuery.trim().length > 0
      ? filteredHotels
      : HotelService.searchHotels(selectedCity, null, '');

  const handleBookHotel = (hotelId: string) => {
    const booked = selectAndBookHotel(hotelId);
    if (booked) {
      showToast(
        `Saved ${booked.name} (${booked.lat.toFixed(4)}, ${booked.lng.toFixed(4)}) to your trip!`,
        'success'
      );
    }
    navigate('/planner/summary');
  };

  return (
    <div className="flex-1 flex flex-col justify-between">
      <div>
        <ScreenHeader title="Step 4 of 4" backTo="/planner/checkout" />

        {/* City Pill & Stay Count */}
        <div className="mt-1 flex items-center gap-2.5">
          <select
            aria-label="Filter hotels by city"
            value={selectedCity}
            onChange={(e) => setSelectedCity(e.target.value)}
            className="bg-[#EBC878] text-[#111111] text-[13px] font-semibold px-4 py-2 rounded-full focus:outline-none cursor-pointer"
          >
            <option value="Samarkand">Samarkand ▾</option>
            <option value="Bukhara">Bukhara ▾</option>
            <option value="All">All Cities ▾</option>
          </select>

          <span className="bg-white text-[#111111] text-[13px] font-semibold px-4 py-2 rounded-full">
            128 stays
          </span>
        </div>

        {/* Search Input */}
        <div className="mt-3">
          <input
            type="search"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search stays..."
            aria-label="Search stays"
            className="w-full px-4 py-3.5 rounded-full bg-white text-[#111111] text-[14px] placeholder-[#8C877E] focus:outline-none focus:ring-2 focus:ring-[#111111]"
          />
        </div>

        {/* Category Filter Chips */}
        <div className="mt-3 flex items-center gap-2 overflow-x-auto pb-1">
          {(['Medrese hotel', 'Guest house', 'Yurt camp'] as const).map((cat) => {
            const isSelected = selectedCategory === cat;
            return (
              <button
                key={cat}
                type="button"
                onClick={() => setSelectedCategory(cat)}
                className={`px-4 py-2 rounded-full text-[13px] font-semibold whitespace-nowrap transition-colors ${
                  isSelected
                    ? 'bg-[#111111] text-white'
                    : 'bg-white text-[#111111]'
                }`}
              >
                {cat}
              </button>
            );
          })}
        </div>

        {/* Hotel Cards */}
        <div className="mt-3.5 space-y-3.5">
          {displayedHotels.slice(0, 3).map((hotel) => (
            <div
              key={hotel.id}
              className="bg-[#EBC878] rounded-[28px] p-4 shadow-sm"
            >
              <SilkRoadArchArtwork
                variant={hotel.artworkVariant}
                size="card"
                rating={hotel.rating}
                className="w-full h-28 rounded-[20px]"
              />

              <h3 className="mt-3 text-[19px] font-bold text-[#111111]">
                {hotel.name}
              </h3>
              <p className="text-[13px] text-[#4A463F] mt-0.5">
                {hotel.subtitle}
              </p>

              <button
                type="button"
                onClick={() => handleBookHotel(hotel.id)}
                className="mt-3 w-full py-3.5 rounded-full bg-[#111111] text-white text-[15px] font-semibold"
              >
                Book · ${hotel.pricePerNightUsd} / night
              </button>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-4">
        <button
          type="button"
          onClick={() => navigate('/planner/summary')}
          className="w-full py-3.5 rounded-full bg-white text-[#111111] text-[15px] font-semibold shadow-sm"
        >
          Skip for now
        </button>
      </div>
    </div>
  );
};

/**
 * Screen B6 — Trip summary ("Your trip is ready")
 */
export const ScreenB6TripSummary: React.FC = () => {
  const navigate = useNavigate();
  const selectedCities = useAppStore((s) => s.tripPlan.selectedCities);
  const bookedTickets = useAppStore((s) => s.tripPlan.bookedTickets);
  const bookedHotels = useAppStore((s) => s.tripPlan.bookedHotels);
  const esimPlan = useAppStore((s) => s.userProfile.esimPlan);
  const updateUserProfile = useAppStore((s) => s.updateUserProfile);

  const activeCities = selectedCities.filter((c) => c.selected);

  return (
    <div className="flex-1 flex flex-col justify-between">
      <div>
        <ScreenHeader title="Your trip" backTo="/planner/hotels" />

        <h2 className="mt-2 text-[36px] leading-[1.08] font-bold tracking-tight text-[#111111]">
          Your trip
          <br />
          is ready
        </h2>

        {/* Gold Timeline Card */}
        <div className="mt-4 bg-[#EBC878] rounded-[26px] px-4 py-5">
          <div className="relative flex items-center justify-between">
            {/* Horizontal connecting line */}
            <div className="absolute left-6 right-6 top-[28px] h-[2px] bg-[#111111]/30 pointer-events-none" />

            {activeCities.map((city) => (
              <div
                key={city.id}
                className="relative z-10 flex flex-col items-center text-center"
              >
                <span className="text-[11px] font-medium text-[#4A463F] mb-1.5">
                  {city.daysAllocated} {city.daysAllocated === 1 ? 'day' : 'days'}
                </span>
                <span className="w-4 h-4 rounded-full bg-[#111111]" />
                <span className="mt-1.5 text-[12px] font-semibold text-[#111111]">
                  {city.name}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Status Checklist Rows */}
        <div className="mt-4 space-y-2.5">
          <button
            type="button"
            onClick={() => navigate('/wallet')}
            className="w-full bg-[#F6F2EA] rounded-[22px] p-4 flex items-center justify-between text-left"
          >
            <div>
              <div className="text-[16px] font-bold text-[#111111]">Transport</div>
              <div className="text-[13px] text-[#6E6A63] mt-0.5">
                {bookedTickets[0]?.fromCity || 'Tashkent'} →{' '}
                {bookedTickets[0]?.toCity || 'Samarkand'} booked
              </div>
            </div>
            <span className="bg-[#DDEFE3] text-[#2E9E6B] text-[12px] font-semibold px-3.5 py-1.5 rounded-full">
              Booked
            </span>
          </button>

          <button
            type="button"
            onClick={() => navigate('/planner/hotels')}
            className="w-full bg-[#F6F2EA] rounded-[22px] p-4 flex items-center justify-between text-left"
          >
            <div>
              <div className="text-[16px] font-bold text-[#111111]">Hotels</div>
              <div className="text-[13px] text-[#6E6A63] mt-0.5">
                {bookedHotels.length} of 4 booked
              </div>
            </div>
            <span className="bg-[#F5E6BE] text-[#785C12] text-[12px] font-semibold px-3.5 py-1.5 rounded-full">
              Pick more
            </span>
          </button>

          <button
            type="button"
            onClick={() => navigate('/e-mehmon')}
            className="w-full bg-[#F6F2EA] rounded-[22px] p-4 flex items-center justify-between text-left"
          >
            <div>
              <div className="text-[16px] font-bold text-[#111111]">E-Mehmon</div>
              <div className="text-[13px] text-[#6E6A63] mt-0.5">
                Auto-tracking your nights
              </div>
            </div>
            <span className="bg-[#DDEFE3] text-[#2E9E6B] text-[12px] font-semibold px-3.5 py-1.5 rounded-full">
              On
            </span>
          </button>

          <button
            type="button"
            onClick={() => navigate('/esim')}
            className="w-full bg-[#F6F2EA] rounded-[22px] p-4 flex items-center justify-between text-left"
          >
            <div>
              <div className="text-[16px] font-bold text-[#111111]">eSIM</div>
              <div className="text-[13px] text-[#6E6A63] mt-0.5">
                Stay online from landing
              </div>
            </div>
            <span
              className={`text-[12px] font-semibold px-3.5 py-1.5 rounded-full ${
                esimPlan
                  ? 'bg-[#DDEFE3] text-[#2E9E6B]'
                  : 'bg-[#EFCAC3] text-[#8E3B30]'
              }`}
            >
              {esimPlan ? `${esimPlan.dataGb} GB Active` : 'Not yet'}
            </span>
          </button>
        </div>
      </div>

      <div className="mt-5 flex flex-col gap-2.5">
        <button
          type="button"
          onClick={() => navigate('/esim')}
          className="w-full py-4 rounded-full bg-[#111111] text-white text-[16px] font-semibold"
        >
          Get eSIM
        </button>

        <button
          type="button"
          onClick={() => {
            updateUserProfile({ onboardingCompleted: true });
            navigate('/trip');
          }}
          className="w-full py-4 rounded-full bg-white text-[#111111] text-[16px] font-semibold shadow-sm"
        >
          Open my trip
        </button>
      </div>
    </div>
  );
};
