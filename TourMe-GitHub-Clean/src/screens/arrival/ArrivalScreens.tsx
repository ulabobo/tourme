import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ScreenHeader,
  SilkRoadMapCanvas,
  TouristBottomNav,
} from '../../components/common/UIElements';
import { CURATED_ATMS, ESIM_PLANS } from '../../services/domainServices';
import { useAppStore } from '../../store/useAppStore';
import {
  calculateHaversineMeters,
  formatDistanceLabel,
  SAMARKAND_DEFAULT_COORDS,
} from '../../utils/geo';

/**
 * Screen C1 — eSIM
 */
export const ScreenC1ESim: React.FC = () => {
  const navigate = useNavigate();
  const purchaseESim = useAppStore((s) => s.purchaseESim);
  const showToast = useAppStore((s) => s.showToast);

  const [selectedPlanId, setSelectedPlanId] = useState<string>('esim-10gb');
  const selectedPlan =
    ESIM_PLANS.find((p) => p.id === selectedPlanId) || ESIM_PLANS[1];

  const handleBuy = () => {
    purchaseESim(selectedPlan);
    showToast(
      `Activated ${selectedPlan.title} eSIM ($${selectedPlan.priceUsd})! QR saved in Offline Wallet.`,
      'success'
    );
    navigate('/arrival');
  };

  return (
    <div className="flex-1 flex flex-col justify-between">
      <div>
        <ScreenHeader title="eSIM" backTo="/planner/summary" />

        <h2 className="mt-2 text-[34px] leading-[1.08] font-bold tracking-tight text-[#111111]">
          Stay online
          <br />
          from landing
        </h2>

        {/* Plan Cards */}
        <div className="mt-5 space-y-3">
          {ESIM_PLANS.map((plan) => {
            const isSelected = plan.id === selectedPlanId;
            return (
              <button
                key={plan.id}
                type="button"
                onClick={() => setSelectedPlanId(plan.id)}
                className={`w-full rounded-[24px] p-5 flex items-center justify-between text-left transition-all ${
                  isSelected
                    ? 'bg-[#EBC878] ring-2 ring-[#111111]/25'
                    : 'bg-[#F6F2EA] hover:bg-white'
                }`}
              >
                <div>
                  <div className="text-[18px] font-bold text-[#111111]">
                    {plan.title}
                  </div>
                  <div className="text-[13px] text-[#57524A] mt-0.5">
                    {plan.subtitle}
                  </div>
                </div>
                <div className="text-[26px] font-bold text-[#111111]">
                  ${plan.priceUsd % 1 === 0 ? plan.priceUsd : plan.priceUsd.toFixed(2)}
                </div>
              </button>
            );
          })}
        </div>

        {/* How it works */}
        <h3 className="mt-5 mb-2.5 text-[18px] font-bold text-[#111111]">
          How it works
        </h3>

        <div className="grid grid-cols-3 gap-2.5">
          {[
            { num: '1', text: 'Buy in the app' },
            { num: '2', text: 'Scan the QR code' },
            { num: '3', text: 'Switch on at landing' },
          ].map((step) => (
            <div
              key={step.num}
              className="bg-[#F6F2EA] rounded-[20px] p-3.5 flex flex-col justify-between"
            >
              <span className="w-7 h-7 rounded-full bg-[#111111] text-white text-[13px] font-bold flex items-center justify-center">
                {step.num}
              </span>
              <p className="mt-3 text-[12px] font-medium text-[#111111] leading-snug">
                {step.text}
              </p>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-5 flex flex-col gap-2.5">
        <button
          type="button"
          onClick={handleBuy}
          className="w-full py-4 rounded-full bg-[#111111] text-white text-[16px] font-semibold"
        >
          Buy eSIM · ${selectedPlan.priceUsd % 1 === 0 ? selectedPlan.priceUsd : selectedPlan.priceUsd.toFixed(2)}
        </button>

        <button
          type="button"
          onClick={() => navigate('/arrival')}
          className="w-full py-4 rounded-full bg-white text-[#111111] text-[16px] font-semibold shadow-sm"
        >
          Install later
        </button>
      </div>
    </div>
  );
};

/**
 * Screen C2 — Arrival transfer
 */
export const ScreenC2ArrivalTransfer: React.FC = () => {
  const navigate = useNavigate();
  const bookedHotels = useAppStore((s) => s.tripPlan.bookedHotels);
  const setActiveDestination = useAppStore((s) => s.setActiveDestination);
  const setPendingCheckoutOption = useAppStore((s) => s.setPendingCheckoutOption);
  const showToast = useAppStore((s) => s.showToast);

  const primaryHotel = bookedHotels[0] || {
    id: 'hotel-registan-medrese',
    name: 'Registan Medrese Boutique',
    address: 'Registan St 14, Old Town, Samarkand',
    lat: 39.6551,
    lng: 66.9769,
    checkInTime: '14:00',
  };

  const handleTakeMeToHotel = () => {
    setActiveDestination({
      name: primaryHotel.name,
      subtitle: primaryHotel.address,
      lat: primaryHotel.lat,
      lng: primaryHotel.lng,
      distanceMeters: 620,
    });
    showToast(`Set Yandex Go destination to ${primaryHotel.name}`, 'info');
    navigate('/yandex-go');
  };

  const handleBookVipTransfer = () => {
    setPendingCheckoutOption({
      id: 'tr-airport-vip',
      type: 'transfer',
      title: 'Pre-paid VIP Airport Transfer',
      subtitle: 'Tashkent / Samarkand Airport → Your Hotel',
      provider: 'VIP Meet & Greet Transfer',
      fromCity: 'Tashkent Airport',
      toCity: primaryHotel.name,
      fromCode: 'TAS',
      toCode: 'HTL',
      date: 'Arrival Day',
      departureTime: 'Meet at Gate',
      arrivalTime: '+25m',
      durationLabel: '25m',
      durationMinutes: 25,
      priceUsd: 18,
      priceUzs: 230400,
      availability: 'AVAILABLE',
      seatOrWagon: 'VIP Sedan · Name Sign at Exit',
      driverDetails: {
        name: 'Azizbek Umarov',
        vehicle: 'Chevrolet Malibu 2 Black',
        plate: '01 V 770 AA',
        phone: '+998 90 998 11 22',
      },
      sourceLabel: 'Official Airport VIP Desk',
    });
    navigate('/planner/checkout');
  };

  return (
    <div className="flex-1 flex flex-col justify-between">
      <div>
        <ScreenHeader title="Arrival" backTo="/esim" />

        {/* Route Map Preview */}
        <SilkRoadMapCanvas
          className="w-full h-44 rounded-[26px] mt-1"
          routeLine={{ x1: 88, y1: 295, x2: 305, y2: 110 }}
          pins={[{ id: 'hotel-pin', x: 78, y: 26, label: primaryHotel.name, color: 'red' }]}
        />

        <div className="mt-3 text-[15px] font-medium text-[#111111]">
          Tashkent Airport → your hotel
        </div>

        {/* Fair Price Indicator Card */}
        <div className="mt-2.5 bg-[#EBC878] rounded-[26px] p-5">
          <div className="text-[11px] font-semibold uppercase tracking-wider text-[#4A463F]">
            FAIR PRICE INDICATOR
          </div>
          <div className="mt-1 text-[28px] font-bold tracking-tight text-[#111111]">
            25,000 – 35,000 UZS
          </div>
          <span className="mt-2 inline-block bg-[#EFCAC3] text-[#8E3B30] text-[12px] font-semibold px-3.5 py-1 rounded-full">
            Do not pay $30 to street touts
          </span>
        </div>

        {/* Ride Actions */}
        <div className="mt-3.5 space-y-2.5">
          <button
            type="button"
            onClick={handleTakeMeToHotel}
            className="w-full py-4 rounded-full bg-[#111111] text-white text-[16px] font-semibold"
          >
            Ride with Yandex Go
          </button>

          <button
            type="button"
            onClick={handleBookVipTransfer}
            className="w-full py-4 rounded-full bg-white text-[#111111] text-[16px] font-semibold shadow-sm"
          >
            Pre-paid VIP transfer · $18
          </button>
        </div>

        <p className="mt-2.5 text-[12px] text-[#6E6A63] leading-snug">
          No Yandex Go? We offer to install it, or you can book the VIP transfer.
        </p>

        {/* Your Hotel Card */}
        <div
          onClick={handleTakeMeToHotel}
          role="button"
          tabIndex={0}
          onKeyDown={(e) => e.key === 'Enter' && handleTakeMeToHotel()}
          className="mt-3 bg-[#F6F2EA] rounded-[22px] p-4 cursor-pointer hover:bg-white transition-colors flex items-center justify-between"
        >
          <div>
            <div className="text-[12px] text-[#6E6A63]">Your hotel</div>
            <div className="text-[17px] font-bold text-[#111111] mt-0.5">
              {primaryHotel.name}
            </div>
            <div className="text-[12px] text-[#6E6A63] mt-0.5">
              Check-in from {primaryHotel.checkInTime} · Tap for hotel route
            </div>
          </div>
          <span className="text-xs font-semibold bg-white px-3 py-1.5 rounded-full">
            Navigate →
          </span>
        </div>
      </div>

      <div className="mt-4">
        <button
          type="button"
          onClick={() => navigate('/home')}
          className="w-full py-4 rounded-full bg-white text-[#111111] text-[16px] font-semibold shadow-sm"
        >
          Go to home
        </button>
      </div>
    </div>
  );
};

/**
 * Screen C3 — ATM & currency radar
 */
export const ScreenC3AtmRadar: React.FC = () => {
  const navigate = useNavigate();
  const lastKnownLocation = useAppStore((s) => s.safetyState.lastKnownLocation);
  const setActiveDestination = useAppStore((s) => s.setActiveDestination);

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFilters, setSelectedFilters] = useState<string[]>([
    'Online',
    'Visa',
    'UZS cash',
  ]);
  const [selectedAtmId, setSelectedAtmId] = useState<string>(CURATED_ATMS[0].id);

  const userLat = lastKnownLocation?.lat ?? SAMARKAND_DEFAULT_COORDS.lat;
  const userLng = lastKnownLocation?.lng ?? SAMARKAND_DEFAULT_COORDS.lng;

  const toggleFilter = (chip: string) => {
    setSelectedFilters((prev) =>
      prev.includes(chip) ? prev.filter((c) => c !== chip) : [...prev, chip]
    );
  };

  // Compute GPS Haversine distance & filter ATMs
  const atmsWithDistance = CURATED_ATMS.map((atm) => ({
    ...atm,
    distanceMeters: calculateHaversineMeters(userLat, userLng, atm.lat, atm.lng),
  })).sort((a, b) => a.distanceMeters - b.distanceMeters);

  const filteredAtms = atmsWithDistance.filter((atm) => {
    const matchesSearch =
      !searchQuery.trim() ||
      atm.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      atm.address.toLowerCase().includes(searchQuery.toLowerCase()) ||
      atm.bankName.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesOnline = !selectedFilters.includes('Online') || atm.isOnline;
    const matchesVisa =
      !selectedFilters.includes('Visa') || atm.cardsSupported.includes('Visa');
    const matchesMastercard =
      !selectedFilters.includes('Mastercard') ||
      atm.cardsSupported.includes('Mastercard');
    const matchesUnionPay =
      !selectedFilters.includes('UnionPay') ||
      atm.cardsSupported.includes('UnionPay');
    const matchesUzs =
      !selectedFilters.includes('UZS cash') ||
      atm.currencies.includes('UZS cash');
    const matchesUsd =
      !selectedFilters.includes('USD cash') ||
      atm.currencies.includes('USD cash');

    return (
      matchesSearch &&
      matchesOnline &&
      matchesVisa &&
      matchesMastercard &&
      matchesUnionPay &&
      matchesUzs &&
      matchesUsd
    );
  });

  const activeAtm =
    filteredAtms.find((a) => a.id === selectedAtmId) ||
    filteredAtms[0] ||
    atmsWithDistance[0];

  const secondaryAtm =
    filteredAtms.find((a) => a.id !== activeAtm?.id) || atmsWithDistance[1];

  const handleNavigateToAtm = (mode: 'ride' | 'walk', atm = activeAtm) => {
    if (!atm) return;
    setActiveDestination({
      name: atm.name,
      subtitle: `${atm.bankName} · ${atm.address}`,
      lat: atm.lat,
      lng: atm.lng,
      distanceMeters: atm.distanceMeters,
    });
    navigate(mode === 'ride' ? '/yandex-go' : '/walking');
  };

  return (
    <div className="flex-1 flex flex-col justify-between -mx-5 -mt-1">
      {/* Map with floating Search & Filter Chips */}
      <SilkRoadMapCanvas
        className="w-full h-[420px] px-5 pt-3"
        pins={filteredAtms.map((atm) => ({
          id: atm.id,
          x: atm.mapX,
          y: atm.mapY,
          label: atm.name,
          color: 'red',
          selected: atm.id === activeAtm?.id,
        }))}
        onSelectPin={(id) => {
          if (id !== 'user-location') setSelectedAtmId(id);
        }}
      >
        <div className="relative z-20 space-y-2.5">
          <input
            type="search"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search ATM or address"
            aria-label="Search ATM or address"
            className="w-full px-4 py-3.5 rounded-full bg-white text-[#111111] text-[14px] placeholder-[#8C877E] shadow-sm focus:outline-none"
          />

          <div className="flex flex-wrap gap-1.5">
            {(
              [
                'Online',
                'Visa',
                'Mastercard',
                'UnionPay',
                'UZS cash',
                'USD cash',
              ] as const
            ).map((chip) => {
              const isSelected = selectedFilters.includes(chip);
              return (
                <button
                  key={chip}
                  type="button"
                  onClick={() => toggleFilter(chip)}
                  className={`px-3.5 py-1.5 rounded-full text-[13px] font-semibold shadow-sm transition-colors ${
                    isSelected
                      ? 'bg-[#111111] text-white'
                      : 'bg-white text-[#111111]'
                  }`}
                >
                  {chip}
                </button>
              );
            })}
          </div>
        </div>
      </SilkRoadMapCanvas>

      {/* Bottom Sheet Card */}
      <div className="bg-[#E9E4DC] rounded-t-[30px] -mt-5 pt-3 px-5 pb-1 relative z-20 flex-1 flex flex-col justify-between">
        <div>
          <div className="w-14 h-1.5 bg-[#C5BGB0] bg-black/15 rounded-full mx-auto mb-3" />

          {filteredAtms.length === 0 ? (
            <div className="bg-[#F6F2EA] rounded-2xl p-4 text-center">
              <p className="text-[14px] font-semibold text-[#111111]">
                No ATMs match all active filters.
              </p>
              <button
                type="button"
                onClick={() => {
                  setSelectedFilters(['Online']);
                  setSearchQuery('');
                }}
                className="mt-2 px-4 py-1.5 rounded-full bg-[#111111] text-white text-xs font-semibold"
              >
                Reset ATM filters
              </button>
            </div>
          ) : (
            <>
              <div className="text-[22px] font-bold text-[#111111]">
                Nearest ATM · {formatDistanceLabel(activeAtm.distanceMeters)}
              </div>

              <div className="mt-2">
                <span
                  className={`inline-block text-[12px] font-semibold px-3.5 py-1 rounded-full ${
                    activeAtm.isOnline
                      ? 'bg-[#DDEFE3] text-[#2E9E6B]'
                      : 'bg-[#EFCAC3] text-[#8E3B30]'
                  }`}
                >
                  {activeAtm.isOnline ? 'Online' : 'Offline'}
                </span>
              </div>

              <div className="mt-2 text-[13px] text-[#6E6A63]">
                {activeAtm.cardsSupported.join(' · ')} ·{' '}
                {activeAtm.currencies.map((c) => c.replace(' cash', '')).join(' & ')}
              </div>

              <div className="mt-3.5 grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => handleNavigateToAtm('ride', activeAtm)}
                  className="py-3.5 rounded-full bg-[#111111] text-white text-[15px] font-semibold"
                >
                  Ride there
                </button>
                <button
                  type="button"
                  onClick={() => handleNavigateToAtm('walk', activeAtm)}
                  className="py-3.5 rounded-full bg-white text-[#111111] text-[15px] font-semibold shadow-sm"
                >
                  Walk offline
                </button>
              </div>

              {secondaryAtm && (
                <button
                  type="button"
                  onClick={() => setSelectedAtmId(secondaryAtm.id)}
                  className="mt-3 w-full bg-[#F6F2EA] rounded-2xl px-4 py-3.5 flex items-center justify-between text-left hover:bg-white transition-colors"
                >
                  <span className="text-[14px] font-semibold text-[#111111]">
                    {secondaryAtm.name} · {formatDistanceLabel(secondaryAtm.distanceMeters)}
                  </span>
                  <span className="text-[12px] font-semibold text-[#2E9E6B]">
                    {secondaryAtm.isOnline ? 'Online' : 'Check'} ·{' '}
                    {secondaryAtm.currencies.includes('USD cash') ? 'USD' : 'UZS'}
                  </span>
                </button>
              )}
            </>
          )}
        </div>

        <TouristBottomNav activeTab="Explore" />
      </div>
    </div>
  );
};
