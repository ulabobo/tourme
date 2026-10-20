import React, { useEffect, useRef, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  ScreenHeader,
  SilkRoadArchArtwork,
  SilkRoadMapCanvas,
  TouristBottomNav,
} from '../../components/common/UIElements';
import {
  CameraAnalysisService,
  CURATED_POIS,
  RoutingService,
} from '../../services/domainServices';
import { useAppStore } from '../../store/useAppStore';
import { POIItem } from '../../types/domain';
import {
  calculateHaversineMeters,
  formatDistanceLabel,
  SAMARKAND_DEFAULT_COORDS,
} from '../../utils/geo';
import { calculatePlovTimer } from '../../utils/plovTimer';
import { useI18n } from '../../utils/i18n';
import {
  analyzeUzbekMenuImage,
  getStoredGeminiApiKey,
  setStoredGeminiApiKey,
} from '../../services/scanner/aiMenuScannerService';

/**
 * Screen D1 — Home Dashboard
 */
export const ScreenD1Home: React.FC = () => {
  const navigate = useNavigate();
  const safetyState = useAppStore((s) => s.safetyState);
  const setHeartbeatActive = useAppStore((s) => s.setHeartbeatActive);
  const eMehmonRecords = useAppStore((s) => s.eMehmonRecords);
  const setActiveDestination = useAppStore((s) => s.setActiveDestination);
  const showToast = useAppStore((s) => s.showToast);
  const { t, lang } = useI18n();

  const [plovState, setPlovState] = useState(() => calculatePlovTimer(new Date()));

  useEffect(() => {
    const timer = window.setInterval(() => {
      setPlovState(calculatePlovTimer(new Date()));
    }, 30000);
    return () => window.clearInterval(timer);
  }, []);

  const registeredCount = eMehmonRecords.filter(
    (r) => r.verificationStatus !== 'MISSING'
  ).length;
  const totalNights = eMehmonRecords.length;
  const missingRecord = eMehmonRecords.find((r) => r.verificationStatus === 'MISSING');

  const batteryLabel =
    safetyState.lastKnownLocation?.battery !== null &&
    safetyState.lastKnownLocation?.battery !== undefined
      ? `Battery ${safetyState.lastKnownLocation.battery}%`
      : 'Battery N/A';

  return (
    <div className="flex-1 flex flex-col justify-between">
      <div>
        {/* Greeting Header */}
        <div className="pt-2 flex items-start justify-between">
          <div>
            <div className="text-[14px] text-[#6E6A63]">{t.goodMorning}</div>
            <h1 className="text-[34px] leading-[1.08] font-bold tracking-tight text-[#111111] mt-0.5 whitespace-pre-line">
              {lang === 'en' ? 'Today in\nSamarkand' : t.todayInSamarkand}
            </h1>
          </div>

          <button
            type="button"
            aria-label="Open traveler profile"
            onClick={() => navigate('/profile')}
            className="w-12 h-12 rounded-full bg-white flex items-center justify-center shadow-sm active:scale-95 transition-transform"
          >
            <span className="w-4 h-4 rounded-full border-2 border-[#111111]" />
          </button>
        </div>

        {/* Dark Safety Heartbeat Card */}
        <div className="mt-4 bg-[#111111] text-white rounded-[28px] p-4 shadow-sm">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <span
                className={`w-3 h-3 rounded-full ${
                  safetyState.isHeartbeatActive ? 'bg-[#35D084]' : 'bg-[#6E6A63]'
                }`}
              />
              <span className="text-[17px] font-bold">Safety Heartbeat</span>
            </div>

            {/* Toggle Switch */}
            <button
              type="button"
              role="switch"
              aria-checked={safetyState.isHeartbeatActive}
              aria-label="Toggle Safety Heartbeat"
              onClick={() => {
                const next = !safetyState.isHeartbeatActive;
                setHeartbeatActive(next);
                showToast(
                  next
                    ? 'Safety Heartbeat active (watching GPS).'
                    : 'Safety Heartbeat paused.',
                  'info'
                );
              }}
              className={`w-14 h-8 rounded-full p-1 transition-colors flex items-center ${
                safetyState.isHeartbeatActive
                  ? 'bg-[#35D084] justify-end'
                  : 'bg-white/25 justify-start'
              }`}
            >
              <span className="w-6 h-6 rounded-full bg-white shadow-sm" />
            </button>
          </div>

          <div className="mt-1.5 text-[13px] text-white/70">
            Last ping {safetyState.heartbeatLastUpdated || '2 min ago'} · {batteryLabel}
          </div>

          <button
            type="button"
            onClick={() => navigate('/safety')}
            className="mt-3 inline-block bg-white/15 hover:bg-white/25 text-white text-[12px] font-semibold px-3.5 py-1.5 rounded-full transition-colors"
          >
            Every {safetyState.intervalMinutes} min
          </button>
        </div>

        {/* 2-Column Weather & Plov Timer Cards */}
        <div className="mt-3.5 grid grid-cols-2 gap-3">
          <button
            type="button"
            onClick={() =>
              showToast('Samarkand Forecast: 27°C Sunny, UV Index High (7). Carry water!', 'info')
            }
            className="bg-[#EBC878] rounded-[26px] p-4 text-left active:scale-[0.99] transition-transform"
          >
            <div className="text-[13px] font-medium text-[#4A463F]">Samarkand</div>
            <div className="mt-1 text-[42px] leading-tight font-bold text-[#111111]">
              27°
            </div>
            <div className="mt-1 text-[12px] text-[#4A463F]">Sunny · UV high</div>
          </button>

          <button
            type="button"
            onClick={() => navigate('/food')}
            className="rounded-[26px] p-4 text-left active:scale-[0.99] transition-transform"
            style={{
              background: 'linear-gradient(135deg, #F6C396 0%, #F2A379 100%)',
            }}
          >
            <div className="text-[13px] font-medium text-[#4A382B]">Plov Timer</div>
            <div className="mt-1 text-[34px] leading-tight font-bold text-[#111111]">
              42 min
            </div>
            <div className="mt-1.5 text-[12px] text-[#4A382B] truncate">
              {plovState.homeSubtext}
            </div>
          </button>
        </div>

        {/* Next Stop Card */}
        <div className="mt-3.5 bg-[#F6F2EA] rounded-[26px] p-3.5 flex items-center justify-between">
          <div
            onClick={() => navigate('/place/poi-registan')}
            className="flex items-center gap-3.5 cursor-pointer flex-1"
          >
            <SilkRoadArchArtwork
              variant="blue-arch"
              className="w-16 h-16 rounded-2xl shrink-0"
            />
            <div>
              <div className="text-[11px] font-semibold uppercase tracking-wider text-[#6E6A63]">
                NEXT STOP · 10:30
              </div>
              <div className="text-[18px] font-bold text-[#111111] mt-0.5">
                Registan Square
              </div>
              <div className="text-[12px] text-[#6E6A63] mt-0.5">
                12 min · Ride with Yandex Go
              </div>
            </div>
          </div>

          <button
            type="button"
            aria-label="Ride to Registan Square with Yandex Go"
            onClick={() => {
              setActiveDestination({
                name: 'Registan Square',
                subtitle: 'Heart of old Samarkand',
                lat: 39.6547,
                lng: 66.9758,
                distanceMeters: 350,
              });
              navigate('/yandex-go');
            }}
            className="w-10 h-10 rounded-full bg-[#111111] text-white flex items-center justify-center font-bold shrink-0"
          >
            →
          </button>
        </div>

        {/* Quick Actions */}
        <h2 className="mt-4 mb-2.5 text-[17px] font-bold text-[#111111]">
          Quick actions
        </h2>

        <div className="grid grid-cols-4 gap-2.5">
          {[
            { label: 'eSIM', path: '/esim' },
            { label: 'ATM map', path: '/atm-radar' },
            { label: 'E-Mehmon', path: '/e-mehmon' },
            { label: 'AI Scanner', path: '/menu-scanner' },
          ].map((act) => (
            <button
              key={act.label}
              type="button"
              onClick={() => navigate(act.path)}
              className="bg-[#F6F2EA] hover:bg-white rounded-[22px] py-3 px-2 flex flex-col items-center gap-2 transition-colors"
            >
              <span className="w-10 h-10 rounded-full bg-[#EBC878] flex items-center justify-center">
                <span className="w-4 h-4 rounded-full border border-[#111111]" />
              </span>
              <span className="text-[12px] font-semibold text-[#111111]">
                {act.label}
              </span>
            </button>
          ))}
        </div>

        {/* E-Mehmon Alert Banner */}
        <div className="mt-3.5 bg-[#F5E0C3] rounded-[22px] px-4 py-3 flex items-center justify-between">
          <div>
            <div className="text-[13px] font-bold text-[#111111]">
              E-Mehmon: {registeredCount} of {totalNights} nights registered
            </div>
            <div className="text-[12px] text-[#7A4B2A] mt-0.5">
              {missingRecord
                ? `Night of ${missingRecord.dateLabel} is missing`
                : 'All hotel slips verified!'}
            </div>
          </div>
          <button
            type="button"
            onClick={() => navigate('/e-mehmon')}
            className="px-4 py-1.5 rounded-full bg-[#111111] text-white text-[12px] font-semibold shrink-0"
          >
            Fix
          </button>
        </div>
      </div>

      <TouristBottomNav activeTab="Home" />
    </div>
  );
};

/**
 * Screen D2 — Explore map (Dynamic Search, Filters, B2B Listings & Yandex Go)
 */
export const ScreenD2ExploreMap: React.FC = () => {
  const navigate = useNavigate();
  const b2bListings = useAppStore((s) => s.b2bListings);
  const lastKnownLocation = useAppStore((s) => s.safetyState.lastKnownLocation);
  const setActiveDestination = useAppStore((s) => s.setActiveDestination);

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFilters, setSelectedFilters] = useState<string[]>(['All']);
  const [selectedPoiId, setSelectedPoiId] = useState<string>('poi-registan');

  const userLat = lastKnownLocation?.lat ?? SAMARKAND_DEFAULT_COORDS.lat;
  const userLng = lastKnownLocation?.lng ?? SAMARKAND_DEFAULT_COORDS.lng;

  // Convert active B2B listings into Explore POI items so new merchant listings appear immediately
  const b2bPois: POIItem[] = b2bListings
    .filter((b) => b.isActive)
    .map((b, idx) => ({
      id: b.id,
      name: b.name,
      city: b.city,
      category: b.category === 'Restaurant' ? 'Food' : 'Historical',
      lat: b.lat,
      lng: b.lng,
      rating: 4.9,
      distanceMeters: calculateHaversineMeters(userLat, userLng, b.lat, b.lng),
      openStatusLabel: 'Open now',
      openingHours: b.openingHours,
      description: b.description,
      priceRangeLabel: b.priceLabel,
      dietaryTags: b.dietaryTags,
      serviceTags: [
        b.category,
        ...b.dietaryTags,
        b.category === 'Restaurant' ? 'Food' : 'Historical',
      ],
      hasAudioGuide: false,
      artworkVariant: b.artworkVariant,
      source: 'MERCHANT_B2B',
      mapX: 48 + ((idx * 17) % 35),
      mapY: 28 + ((idx * 19) % 30),
    }));

  const allPois: POIItem[] = [
    ...CURATED_POIS.map((p) => ({
      ...p,
      distanceMeters:
        p.id === 'poi-registan'
          ? 350
          : calculateHaversineMeters(userLat, userLng, p.lat, p.lng),
    })),
    ...b2bPois,
  ];

  const filterOptions = [
    'All',
    'Monuments',
    'Food',
    'Bazaar',
    'ATM',
    'Pure Vegan',
    'Halal',
    'Historical',
    'Pharmacy',
  ];

  const handleToggleFilter = (chip: string) => {
    if (chip === 'ATM') {
      navigate('/atm-radar');
      return;
    }
    if (chip === 'All') {
      setSelectedFilters(['All']);
      return;
    }
    setSelectedFilters((prev) => {
      const withoutAll = prev.filter((c) => c !== 'All');
      const next = withoutAll.includes(chip)
        ? withoutAll.filter((c) => c !== chip)
        : [...withoutAll, chip];
      return next.length === 0 ? ['All'] : next;
    });
  };

  const filteredPois = allPois.filter((poi) => {
    const matchesSearch =
      !searchQuery.trim() ||
      poi.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      poi.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      poi.category.toLowerCase().includes(searchQuery.toLowerCase());

    if (selectedFilters.includes('All')) {
      return matchesSearch;
    }

    const matchesFilter = selectedFilters.some((f) => {
      if (f === 'Monuments' || f === 'Historical') {
        return (
          poi.category === 'Monument' ||
          poi.category === 'Historical' ||
          poi.serviceTags.includes('Historical')
        );
      }
      if (f === 'Food') return poi.category === 'Food';
      if (f === 'Bazaar') return poi.category === 'Bazaar';
      if (f === 'Pharmacy') return poi.category === 'Pharmacy';
      if (f === 'Pure Vegan') {
        return (
          poi.dietaryTags.includes('Pure Vegan') ||
          poi.dietaryTags.includes('Vegan')
        );
      }
      if (f === 'Halal') return poi.dietaryTags.includes('Halal');
      return true;
    });

    return matchesSearch && matchesFilter;
  });

  const activePoi =
    filteredPois.find((p) => p.id === selectedPoiId) || filteredPois[0] || allPois[0];

  const handleRideToPoi = (poi: POIItem) => {
    setActiveDestination({
      name: poi.name,
      subtitle: poi.description,
      lat: poi.lat,
      lng: poi.lng,
      distanceMeters: poi.distanceMeters || 350,
    });
    navigate('/yandex-go');
  };

  const handleWalkToPoi = (poi: POIItem) => {
    setActiveDestination({
      name: poi.name,
      subtitle: poi.description,
      lat: poi.lat,
      lng: poi.lng,
      distanceMeters: poi.distanceMeters || 950,
    });
    navigate('/walking');
  };

  return (
    <div className="flex-1 flex flex-col justify-between -mx-5 -mt-1">
      <SilkRoadMapCanvas
        className="w-full h-[460px] px-5 pt-3"
        pins={filteredPois.map((p) => ({
          id: p.id,
          x: p.mapX,
          y: p.mapY,
          label: p.name,
          color: p.source === 'MERCHANT_B2B' ? 'gold' : 'red',
          selected: p.id === activePoi?.id,
        }))}
        onSelectPin={(id) => {
          if (id !== 'user-location') setSelectedPoiId(id);
        }}
      >
        <div className="relative z-20 space-y-2.5">
          <input
            type="search"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search places, food, ATMs..."
            aria-label="Search places, food, ATMs"
            className="w-full px-4 py-3.5 rounded-full bg-white text-[#111111] text-[14px] placeholder-[#8C877E] shadow-sm focus:outline-none"
          />

          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar">
            {filterOptions.map((chip) => {
              const isSelected = selectedFilters.includes(chip);
              return (
                <button
                  key={chip}
                  type="button"
                  onClick={() => handleToggleFilter(chip)}
                  className={`px-3.5 py-1.5 rounded-full text-[13px] font-semibold whitespace-nowrap shadow-sm transition-colors ${
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

      {/* Bottom Floating POI Card + Nav */}
      <div className="px-5 pt-2 pb-1 flex-1 flex flex-col justify-between bg-[#E9E4DC] relative z-20 -mt-6 rounded-t-[28px]">
        {filteredPois.length === 0 ? (
          <div className="bg-[#F6F2EA] rounded-[26px] p-5 text-center my-2">
            <p className="text-[15px] font-bold text-[#111111]">
              No places match "{searchQuery}"
            </p>
            <button
              type="button"
              onClick={() => {
                setSearchQuery('');
                setSelectedFilters(['All']);
              }}
              className="mt-2.5 px-4 py-2 rounded-full bg-[#111111] text-white text-xs font-semibold"
            >
              Clear filters
            </button>
          </div>
        ) : (
          <div>
            {/* Quick POI Switcher Pills if multiple results */}
            {filteredPois.length > 1 && (
              <div className="flex items-center gap-1.5 overflow-x-auto pb-2 no-scrollbar">
                {filteredPois.map((p) => (
                  <button
                    key={p.id}
                    type="button"
                    onClick={() => setSelectedPoiId(p.id)}
                    className={`px-3 py-1 rounded-full text-[11px] font-semibold whitespace-nowrap ${
                      p.id === activePoi.id
                        ? 'bg-[#111111] text-white'
                        : 'bg-[#F6F2EA] text-[#111111]'
                    }`}
                  >
                    {p.name}
                  </button>
                ))}
              </div>
            )}

            {/* Gold POI Card matching D2 - Explore map.png */}
            <div className="bg-[#EBC878] rounded-[28px] p-4 shadow-sm">
              <div
                onClick={() => navigate(`/place/${activePoi.id}`)}
                className="flex items-center gap-3.5 cursor-pointer"
              >
                <SilkRoadArchArtwork
                  variant={activePoi.artworkVariant}
                  className="w-20 h-20 rounded-2xl shrink-0"
                />
                <div>
                  <h3 className="text-[20px] font-bold text-[#111111]">
                    {activePoi.name}
                  </h3>
                  <div className="text-[13px] text-[#4A463F] mt-0.5">
                    ★ {activePoi.rating.toFixed(1)} ·{' '}
                    {formatDistanceLabel(activePoi.distanceMeters || 350)} ·{' '}
                    {activePoi.openStatusLabel}
                  </div>
                  <div className="mt-1.5 flex items-center gap-1.5 flex-wrap">
                    <span className="inline-block bg-white text-[#111111] text-[11px] font-semibold px-3 py-0.5 rounded-full">
                      {activePoi.category}
                    </span>
                    {activePoi.source === 'MERCHANT_B2B' && (
                      <span className="inline-block bg-[#111111] text-white text-[10px] font-semibold px-2.5 py-0.5 rounded-full">
                        Local Partner
                      </span>
                    )}
                  </div>
                </div>
              </div>

              <button
                type="button"
                onClick={() => handleRideToPoi(activePoi)}
                className="mt-3.5 w-full py-3.5 rounded-full bg-[#111111] text-white text-[15px] font-semibold"
              >
                Ride there with Yandex Go
              </button>

              <button
                type="button"
                onClick={() => handleWalkToPoi(activePoi)}
                className="mt-2.5 w-full py-3.5 rounded-full bg-white text-[#111111] text-[15px] font-semibold"
              >
                Offline walking directions
              </button>
            </div>
          </div>
        )}

        <TouristBottomNav activeTab="Explore" />
      </div>
    </div>
  );
};

/**
 * Screen D3 — Place detail (Registan Square or dynamic POI)
 */
export const ScreenD3PlaceDetail: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const b2bListings = useAppStore((s) => s.b2bListings);
  const setActiveDestination = useAppStore((s) => s.setActiveDestination);

  const poiFromCurated = CURATED_POIS.find((p) => p.id === id);
  const poiFromB2B = b2bListings.find((b) => b.id === id);

  const poi: POIItem = poiFromCurated
    ? poiFromCurated
    : poiFromB2B
      ? {
          id: poiFromB2B.id,
          name: poiFromB2B.name,
          city: poiFromB2B.city,
          category: poiFromB2B.category === 'Restaurant' ? 'Food' : 'Monument',
          lat: poiFromB2B.lat,
          lng: poiFromB2B.lng,
          rating: 4.9,
          distanceMeters: 420,
          openStatusLabel: 'Open now',
          openingHours: `Open ${poiFromB2B.openingHours}`,
          description: poiFromB2B.description,
          priceRangeLabel: poiFromB2B.priceLabel,
          dietaryTags: poiFromB2B.dietaryTags,
          serviceTags: [poiFromB2B.category],
          hasAudioGuide: true,
          artworkVariant: poiFromB2B.artworkVariant,
          source: 'MERCHANT_B2B',
          mapX: 50,
          mapY: 50,
        }
      : CURATED_POIS[0];

  const handleRide = () => {
    setActiveDestination({
      name: poi.name,
      subtitle: poi.description,
      lat: poi.lat,
      lng: poi.lng,
      distanceMeters: poi.distanceMeters || 350,
    });
    navigate('/yandex-go');
  };

  const handleWalk = () => {
    setActiveDestination({
      name: poi.name,
      subtitle: poi.description,
      lat: poi.lat,
      lng: poi.lng,
      distanceMeters: poi.distanceMeters || 950,
    });
    navigate('/walking');
  };

  return (
    <div className="flex-1 flex flex-col justify-between">
      <div>
        <ScreenHeader title={poi.name} backTo="/explore" />

        <SilkRoadArchArtwork
          variant={poi.artworkVariant}
          size="hero"
          className="w-full h-52 rounded-[28px] mt-1"
        />

        {/* Metadata Pills */}
        <div className="mt-3.5 flex items-center gap-2 flex-wrap">
          <span className="px-4 py-2 rounded-full bg-[#111111] text-white text-[13px] font-semibold">
            {poi.category}
          </span>
          <span className="px-4 py-2 rounded-full bg-white text-[#111111] text-[13px] font-semibold">
            {poi.openingHours}
          </span>
          <span className="px-3.5 py-2 rounded-full bg-white text-[#111111] text-[13px] font-semibold">
            ★ {poi.rating.toFixed(1)}
          </span>
        </div>

        <p className="mt-3.5 text-[14px] text-[#6E6A63] leading-relaxed">
          {poi.description}
        </p>

        {/* Ticket Info Card */}
        <div className="mt-3.5 bg-[#F6F2EA] rounded-[22px] p-4 flex items-center justify-between">
          <span className="text-[15px] font-semibold text-[#111111]">Ticket</span>
          <span className="text-[14px] text-[#6E6A63]">
            {poi.priceRangeLabel || '130,000 UZS · Skip-the-line'}
          </span>
        </div>

        {/* Action Buttons */}
        <div className="mt-3.5 space-y-2.5">
          <button
            type="button"
            onClick={handleRide}
            className="w-full py-4 rounded-full bg-[#111111] text-white text-[15px] font-semibold"
          >
            Ride there with Yandex Go
          </button>

          <button
            type="button"
            onClick={handleWalk}
            className="w-full py-4 rounded-full bg-white text-[#111111] text-[15px] font-semibold shadow-sm"
          >
            Offline walking directions
          </button>

          <div className="grid grid-cols-2 gap-3 pt-0.5">
            <button
              type="button"
              onClick={() => navigate('/audio-guide')}
              className="py-3.5 rounded-full bg-[#EBC878] text-[#111111] text-[15px] font-semibold"
            >
              Audio guide
            </button>
            <button
              type="button"
              onClick={() => navigate('/tickets')}
              className="py-3.5 rounded-full bg-[#EBC878] text-[#111111] text-[15px] font-semibold"
            >
              Buy ticket
            </button>
          </div>
        </div>
      </div>

      <TouristBottomNav activeTab="Explore" />
    </div>
  );
};

/**
 * Screen D4 — Yandex Go link (Deep Link & Web Fallback + Fare Estimate)
 */
export const ScreenD4YandexGoLink: React.FC = () => {
  const navigate = useNavigate();
  const lastKnownLocation = useAppStore((s) => s.safetyState.lastKnownLocation);
  const activeDestination = useAppStore((s) => s.activeDestination);
  const setPendingCheckoutOption = useAppStore((s) => s.setPendingCheckoutOption);
  const showToast = useAppStore((s) => s.showToast);

  const userLat = lastKnownLocation?.lat ?? SAMARKAND_DEFAULT_COORDS.lat;
  const userLng = lastKnownLocation?.lng ?? SAMARKAND_DEFAULT_COORDS.lng;

  const routeInfo = RoutingService.getYandexRoute(
    userLat,
    userLng,
    activeDestination.lat,
    activeDestination.lng,
    activeDestination.name
  );

  const [showFallbackInfo, setShowFallbackInfo] = useState(false);

  const handleOpenYandexGo = () => {
    setShowFallbackInfo(true);
    showToast(
      `Prepared Yandex Go route to ${activeDestination.name} (Est. ${routeInfo.fare.formattedRangeUzs}).`,
      'success'
    );
  };

  const handleCopyLink = async () => {
    try {
      if (navigator.clipboard && navigator.clipboard.writeText) {
        await navigator.clipboard.writeText(routeInfo.deepLink);
      }
      showToast('Copied Yandex Go deep link to clipboard!', 'success');
    } catch {
      showToast('Deep link ready: ' + routeInfo.deepLink.slice(0, 48) + '...', 'info');
    }
  };

  const handleBookVipTransfer = () => {
    setPendingCheckoutOption({
      id: `tr-vip-${Date.now().toString(36)}`,
      type: 'transfer',
      title: `VIP Transfer to ${activeDestination.name}`,
      subtitle: 'Verified English-speaking driver · Door-to-door',
      provider: 'Silk Road VIP Chauffeur',
      fromCity: 'Current Location',
      toCity: activeDestination.name,
      fromCode: 'YOU',
      toCode: 'DST',
      date: 'Today · Instant',
      departureTime: 'In 10 min',
      arrivalTime: `+${routeInfo.fare.estimatedMinutes} min`,
      durationLabel: `${routeInfo.fare.estimatedMinutes} min`,
      durationMinutes: routeInfo.fare.estimatedMinutes,
      priceUsd: 18,
      priceUzs: 230400,
      availability: 'AVAILABLE',
      seatOrWagon: 'VIP Sedan (A/C)',
      sourceLabel: 'Local VIP Fleet',
    });
    navigate('/planner/checkout');
  };

  return (
    <div className="flex-1 flex flex-col justify-between">
      <div>
        <ScreenHeader title="Yandex Go link" />

        {/* FROM Card */}
        <div className="mt-1 bg-[#F6F2EA] rounded-[22px] p-4">
          <div className="text-[12px] font-medium text-[#6E6A63]">
            FROM · You{' '}
            {lastKnownLocation?.source === 'GPS'
              ? '(Live GPS)'
              : '(Samarkand reference)'}
          </div>
          <div
            data-testid="yandex-from-coords"
            className="mt-1 text-[18px] font-semibold text-[#111111]"
          >
            {userLat.toFixed(4)}, {userLng.toFixed(4)}
          </div>
        </div>

        {/* TO Card */}
        <div className="mt-2.5 bg-[#F6F2EA] rounded-[22px] p-4 flex items-center justify-between">
          <div>
            <div className="text-[12px] font-medium text-[#6E6A63]">
              TO · {activeDestination.name}
            </div>
            <div
              data-testid="yandex-to-coords"
              className="mt-1 text-[18px] font-semibold text-[#111111]"
            >
              {activeDestination.lat.toFixed(4)}, {activeDestination.lng.toFixed(4)}
            </div>
          </div>
          <div className="text-right">
            <div className="text-[11px] font-semibold text-[#2E9E6B]">
              Est. {routeInfo.fare.formattedRangeUzs}
            </div>
            <div className="text-[11px] text-[#6E6A63]">
              {formatDistanceLabel(routeInfo.fare.distanceMeters)} · ~
              {routeInfo.fare.estimatedMinutes} min
            </div>
          </div>
        </div>

        {/* Dark Live Deep Link Box */}
        <div className="mt-3 bg-[#111111] text-white rounded-[26px] p-5 font-mono text-[13px] leading-relaxed">
          <div className="flex items-center gap-2 text-[#35D084] text-[11px] font-sans font-bold tracking-wider uppercase mb-2">
            <span className="w-2.5 h-2.5 rounded-full bg-[#35D084]" />
            <span>LIVE DEEP LINK</span>
          </div>
          <div data-testid="yandex-deeplink-text" className="whitespace-pre-line break-all">
            {routeInfo.displayDeepLink}
          </div>
        </div>

        {showFallbackInfo && (
          <div className="mt-2.5 bg-[#DDEFE3] text-[#111111] rounded-2xl p-3 text-xs space-y-1">
            <div className="font-bold text-[#2E9E6B]">
              ✓ Deep link & Web Fallback Ready
            </div>
            <p className="text-[#4A5D50]">
              {routeInfo.fare.tariffNote}
            </p>
            <div className="flex gap-3 pt-1">
              <a
                href={routeInfo.webFallbackUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="underline font-semibold text-[#111111]"
              >
                Open AppMetrica Web Fallback ↗
              </a>
              <a
                href={routeInfo.yandexMapsWebUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="underline font-semibold text-[#111111]"
              >
                Open Yandex Maps Web ↗
              </a>
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="mt-3.5 space-y-2.5">
          <button
            type="button"
            onClick={handleOpenYandexGo}
            className="w-full py-4 rounded-full bg-[#111111] text-white text-[15px] font-semibold"
          >
            Open Yandex Go
          </button>

          <button
            type="button"
            onClick={handleCopyLink}
            className="w-full py-3.5 rounded-full bg-white text-[#111111] text-[15px] font-semibold shadow-sm"
          >
            Copy link
          </button>
        </div>

        {/* Fallback VIP Card */}
        <div className="mt-3.5 bg-[#EBC878] rounded-[26px] p-4">
          <div className="text-[16px] font-bold text-[#111111]">
            Yandex Go not installed?
          </div>
          <p className="mt-1 text-[12px] text-[#4A463F]">
            We offer to install it — or book a pre-paid VIP transfer.
          </p>
          <button
            type="button"
            onClick={handleBookVipTransfer}
            className="mt-3 w-full py-3 rounded-full bg-[#111111] text-white text-[14px] font-semibold"
          >
            Book VIP transfer · $18
          </button>
        </div>
      </div>

      <TouristBottomNav activeTab="Explore" />
    </div>
  );
};

/**
 * Screen D5 — Food & Plov Timer
 */
export const ScreenD5FoodPlovTimer: React.FC = () => {
  const navigate = useNavigate();
  const b2bListings = useAppStore((s) => s.b2bListings);
  const setActiveDestination = useAppStore((s) => s.setActiveDestination);

  const [plovState, setPlovState] = useState(() => calculatePlovTimer(new Date()));
  const [selectedDietary, setSelectedDietary] = useState<string[]>(['Vegetarian']);

  useEffect(() => {
    const timer = window.setInterval(() => {
      setPlovState(calculatePlovTimer(new Date()));
    }, 30000);
    return () => window.clearInterval(timer);
  }, []);

  const dietaryChips = [
    'Vegetarian',
    'Vegan',
    'Halal',
    'Gluten-free',
    'Hygiene-verified',
  ];

  const toggleDietary = (tag: string) => {
    setSelectedDietary((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    );
  };

  const baseRestaurants = [
    {
      id: 'rest-green-garden',
      name: 'Green Garden Cafe',
      badge: 'Vegetarian',
      subtitle: 'No meat broth · Vegetarian',
      tags: ['Vegetarian', 'Vegan', 'Gluten-free', 'Hygiene-verified'],
      artworkVariant: 'lavender' as const,
      lat: 39.6562,
      lng: 66.9731,
    },
    {
      id: 'rest-halal-plov',
      name: 'Halal Plov House',
      badge: 'Halal',
      subtitle: 'Halal · Hygiene-verified',
      tags: ['Halal', 'Hygiene-verified', 'Gluten-free'],
      artworkVariant: 'rose-arch' as const,
      lat: 39.6589,
      lng: 66.9772,
    },
    ...b2bListings
      .filter((b) => b.isActive && b.category === 'Restaurant')
      .map((b) => ({
        id: b.id,
        name: b.name,
        badge: b.dietaryTags[0] || 'Local Partner',
        subtitle: `${b.priceLabel} · ${b.dietaryTags.join(' · ') || 'Hygiene-verified'}`,
        tags: b.dietaryTags.length > 0 ? b.dietaryTags : ['Halal', 'Hygiene-verified', 'Vegetarian'],
        artworkVariant: 'terracotta' as const,
        lat: b.lat,
        lng: b.lng,
      })),
  ];

  // Show both signature cards when default Vegetarian is active, or filter when multiple specific tags are toggled
  const displayedRestaurants =
    selectedDietary.length <= 1
      ? baseRestaurants
      : baseRestaurants.filter((r) =>
          selectedDietary.some((tag) => r.tags.includes(tag))
        );

  const handleRideToRestaurant = (name: string, lat: number, lng: number) => {
    setActiveDestination({
      name,
      subtitle: 'Samarkand verified dining',
      lat,
      lng,
      distanceMeters: 480,
    });
    navigate('/yandex-go');
  };

  return (
    <div className="flex-1 flex flex-col justify-between">
      <div>
        <ScreenHeader title="Food" backTo="/home" />

        {/* Peach Plov Timer Card */}
        <div
          onClick={() =>
            handleRideToRestaurant('Besh Qozon Plov Center', 39.6589, 66.9772)
          }
          className="mt-1 rounded-[28px] p-5 cursor-pointer shadow-sm"
          style={{
            background: 'linear-gradient(135deg, #F6C396 0%, #F19E76 100%)',
          }}
        >
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-semibold uppercase tracking-wider text-[#4A382B]">
              PLOV TIMER ({plovState.tashkentTimeFormatted})
            </span>
            <span className="bg-[#DDEFE3] text-[#2E9E6B] text-[12px] font-semibold px-3 py-1 rounded-full">
              {plovState.badgeText}
            </span>
          </div>

          <h2 className="mt-2 text-[20px] font-bold text-[#111111]">
            Besh Qozon Plov Center
          </h2>

          <div className="mt-1.5 flex items-baseline gap-1.5 flex-wrap">
            <span
              data-testid="plov-countdown-value"
              className="text-[38px] leading-none font-bold text-[#111111]"
            >
              1h 48m
            </span>
            <span className="text-[14px] text-[#4A382B]">
              {plovState.foodScreenSuffix}
            </span>
          </div>

          {/* Progress Bar */}
          <div className="mt-4 w-full h-2 bg-white/45 rounded-full overflow-hidden">
            <div
              style={{ width: `${plovState.progressPercent}%` }}
              className="h-full bg-[#111111] rounded-full"
            />
          </div>
        </div>

        {/* Dietary Filter Chips */}
        <div className="mt-4 flex flex-wrap gap-2">
          {dietaryChips.map((chip) => {
            const isSelected = selectedDietary.includes(chip);
            return (
              <button
                key={chip}
                type="button"
                onClick={() => toggleDietary(chip)}
                className={`px-4 py-2 rounded-full text-[13px] font-semibold transition-colors ${
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

        {/* Restaurant Cards */}
        <div className="mt-3.5 space-y-3">
          {displayedRestaurants.map((rest) => (
            <div
              key={rest.id}
              className="bg-[#F6F2EA] rounded-[24px] p-3.5 flex items-center justify-between"
            >
              <div className="flex items-center gap-3.5">
                <SilkRoadArchArtwork
                  variant={rest.artworkVariant}
                  className="w-20 h-20 rounded-2xl shrink-0"
                />
                <div>
                  <h3 className="text-[17px] font-bold text-[#111111]">
                    {rest.name}
                  </h3>
                  <span className="mt-1 inline-block bg-[#DDEFE3] text-[#2E9E6B] text-[11px] font-semibold px-3 py-0.5 rounded-full">
                    {rest.badge}
                  </span>
                  <div className="mt-1 text-[12px] text-[#6E6A63]">
                    {rest.subtitle}
                  </div>
                </div>
              </div>

              <button
                type="button"
                onClick={() =>
                  handleRideToRestaurant(rest.name, rest.lat, rest.lng)
                }
                className="px-4 py-2.5 rounded-full bg-[#111111] text-white text-[13px] font-semibold shrink-0"
              >
                Ride
              </button>
            </div>
          ))}
        </div>

        <button
          type="button"
          onClick={() => navigate('/menu-scanner')}
          className="mt-4 w-full py-4 rounded-full bg-[#EBC878] text-[#111111] text-[15px] font-semibold shadow-sm"
        >
          Scan a menu with AI
        </button>
      </div>

      <TouristBottomNav activeTab="Explore" />
    </div>
  );
};

/**
 * Screen D6 — AI Menu Scanner (Camera getUserMedia + File Upload Fallback + PRO Entitled Translation)
 */
export const ScreenD6AIMenuScanner: React.FC = () => {
  const navigate = useNavigate();
  const tier = useAppStore((s) => s.userProfile.tier);
  const showToast = useAppStore((s) => s.showToast);

  const [cameraActive, setCameraActive] = useState(false);
  const [uploadedPreviewUrl, setUploadedPreviewUrl] = useState<string | null>(null);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const [showAiKeyModal, setShowAiKeyModal] = useState(false);
  const [geminiApiKey, setGeminiApiKey] = useState(() => getStoredGeminiApiKey());
  const [scanEngineLabel, setScanEngineLabel] = useState<string>('Cyrillic Menu OCR');
  const [customDishes, setCustomDishes] = useState<
    | {
        id: string;
        name: string;
        priceUsd: string;
        description: string;
        tags: string[];
      }[]
    | null
  >(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const defaultMenuAnalysis = CameraAnalysisService.getMenuTranslations(tier);
  const displayedDishes = customDishes
    ? tier === 'FREE'
      ? customDishes.slice(0, 2)
      : customDishes
    : defaultMenuAnalysis.dishes;
  const totalDishesCount = customDishes
    ? customDishes.length
    : defaultMenuAnalysis.totalDishesCount;

  useEffect(() => {
    return () => {
      if (videoRef.current && videoRef.current.srcObject) {
        const stream = videoRef.current.srcObject as MediaStream;
        stream.getTracks().forEach((t) => t.stop());
      }
    };
  }, []);

  const handleToggleCamera = async () => {
    setCameraError(null);
    if (cameraActive) {
      if (videoRef.current && videoRef.current.srcObject) {
        const stream = videoRef.current.srcObject as MediaStream;
        stream.getTracks().forEach((t) => t.stop());
      }
      setCameraActive(false);
      return;
    }

    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      setCameraError('Browser camera API unavailable — use Upload Menu Photo or inspect the sample Cyrillic menu below.');
      return;
    }

    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'environment' },
      });
      setCameraActive(true);
      setTimeout(() => {
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
      }, 50);
    } catch {
      setCameraError('Camera permission denied — using local menu OCR fallback.');
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith('image/')) {
      showToast('Please select a valid image file (JPG/PNG).', 'error');
      return;
    }
    const reader = new FileReader();
    reader.onload = () => {
      setUploadedPreviewUrl(reader.result as string);
    };
    reader.readAsDataURL(file);

    const scanResult = await analyzeUzbekMenuImage(file);
    setScanEngineLabel(
      scanResult.source === 'GEMINI_VISION_API'
        ? `Gemini Vision (${scanResult.modelUsed})`
        : scanResult.modelUsed
    );
    setCustomDishes(
      scanResult.items.map((item) => ({
        id: item.id,
        name: item.uzbekName,
        priceUsd: `$${item.priceUsd.toFixed(2)}`,
        description: item.englishDescription,
        tags: [item.dietaryWarning],
      }))
    );
    showToast(
      `Scanned "${file.name}" via ${
        scanResult.source === 'GEMINI_VISION_API' ? 'Gemini Vision AI' : 'Offline OCR'
      }!`,
      'success'
    );
  };

  return (
    <div className="flex-1 flex flex-col justify-between text-white">
      <div>
        <ScreenHeader
          title="AI Menu Scanner"
          dark
          rightElement={
            <div className="flex gap-1.5">
              <button
                type="button"
                data-testid="open-gemini-key-modal-btn"
                onClick={() => setShowAiKeyModal((v) => !v)}
                className="px-2.5 py-1.5 rounded-full bg-white/15 text-white text-[11px] font-semibold"
              >
                {geminiApiKey ? '⚡ Gemini Ready' : '🔑 AI Key'}
              </button>
              <button
                type="button"
                onClick={handleToggleCamera}
                className="px-3 py-1.5 rounded-full bg-white/15 text-white text-[11px] font-semibold"
              >
                {cameraActive ? 'Stop Cam' : 'Live Cam'}
              </button>
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="px-3 py-1.5 rounded-full bg-[#EBC878] text-[#111111] text-[11px] font-semibold"
              >
                Upload Photo
              </button>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleFileUpload}
                className="hidden"
                aria-label="Upload menu photo"
              />
            </div>
          }
        />

        {showAiKeyModal && (
          <div className="mb-3 bg-[#24211D] border border-white/15 rounded-2xl p-3.5 text-xs space-y-2">
            <div className="font-bold text-[#EBC878]">
              Google Gemini Vision API Key (Optional)
            </div>
            <p className="text-white/70 text-[11px]">
              Paste a Gemini API key to analyze uploaded menu photos with live{' '}
              <code>gemini-2.5-flash</code> Vision AI, or leave blank to use the built-in offline OCR engine.
            </p>
            <div className="flex gap-2">
              <input
                type="password"
                value={geminiApiKey}
                onChange={(e) => setGeminiApiKey(e.target.value)}
                placeholder="AIzaSy..."
                aria-label="Gemini Vision API Key"
                className="flex-1 px-3 py-2 rounded-xl bg-black/40 text-white border border-white/20 text-xs"
              />
              <button
                type="button"
                onClick={() => {
                  setStoredGeminiApiKey(geminiApiKey);
                  setShowAiKeyModal(false);
                  showToast(
                    geminiApiKey.trim()
                      ? 'Gemini Vision API key saved!'
                      : 'Switched to Offline Culinary OCR engine.',
                    'success'
                  );
                }}
                className="px-3.5 py-2 rounded-xl bg-[#EBC878] text-[#111111] font-bold"
              >
                Save
              </button>
            </div>
          </div>
        )}

        {/* Camera Viewfinder with Corner Brackets matching D6 - AI Menu Scanner.png */}
        <div className="mt-2 relative bg-[#2C2823] rounded-[30px] p-7 h-[320px] flex flex-col justify-center overflow-hidden">
          {cameraActive && (
            <video
              ref={videoRef}
              autoPlay
              playsInline
              muted
              className="absolute inset-0 w-full h-full object-cover opacity-50"
            />
          )}
          {uploadedPreviewUrl && !cameraActive && (
            <img
              src={uploadedPreviewUrl}
              alt="Uploaded menu preview"
              className="absolute inset-0 w-full h-full object-cover opacity-35"
            />
          )}

          {/* White Corner Brackets */}
          <div className="absolute top-5 left-5 w-7 h-7 border-t-[3px] border-l-[3px] border-white rounded-tl-sm" />
          <div className="absolute top-5 right-5 w-7 h-7 border-t-[3px] border-r-[3px] border-white rounded-tr-sm" />
          <div className="absolute bottom-5 left-5 w-7 h-7 border-b-[3px] border-l-[3px] border-white rounded-bl-sm" />
          <div className="absolute bottom-5 right-5 w-7 h-7 border-b-[3px] border-r-[3px] border-white rounded-br-sm" />

          {/* Cyrillic Menu Lines */}
          <div className="relative z-10 space-y-5 pl-2 text-[19px] text-white/75 font-medium">
            <div>Шашлык — 45 000</div>
            <div>Самса — 12 000</div>
            <div>Норин — 38 000</div>
            <div>Халим — 30 000</div>
          </div>

          {cameraError && (
            <div className="relative z-10 mt-3 text-[11px] text-[#EBC878]">
              {cameraError}
            </div>
          )}
        </div>
      </div>

      {/* Translated Menu Bottom Card */}
      <div className="mt-4 bg-[#F6F2EA] text-[#111111] rounded-[30px] p-5">
        <div className="flex items-center justify-between mb-3">
          <div>
            <h2 className="text-[20px] font-bold">Translated menu</h2>
            <div className="text-[11px] text-[#6E6A63]">{scanEngineLabel}</div>
          </div>
          <span className="bg-[#EBC878] text-[#111111] text-[11px] font-bold px-3 py-1 rounded-full">
            PRO
          </span>
        </div>

        <div className="space-y-2.5">
          {displayedDishes.map((dish) => (
            <div
              key={dish.id}
              className="bg-white rounded-2xl px-4 py-3 flex items-center justify-between"
            >
              <div>
                <div className="text-[15px] font-bold text-[#111111]">
                  {dish.name}{' '}
                  <span className="text-[12px] font-normal text-[#6E6A63]">
                    ({dish.priceUsd})
                  </span>
                </div>
                <div className="text-[12px] text-[#6E6A63]">
                  {dish.description.split('(')[0].trim()}
                </div>
              </div>
              <span className="bg-[#EFCAC3] text-[#8E3B30] text-[11px] font-semibold px-3 py-1 rounded-full shrink-0">
                {dish.tags[0]}
              </span>
            </div>
          ))}
        </div>

        {tier === 'FREE' ? (
          <button
            type="button"
            onClick={() => navigate('/plans')}
            className="mt-4 w-full py-4 rounded-full bg-[#EBC878] text-[#111111] text-[15px] font-semibold"
          >
            Unlock all scans with Pro
          </button>
        ) : (
          <div className="mt-3 text-center text-[12px] font-semibold text-[#2E9E6B]">
            ✓ All {totalDishesCount} dishes unlocked with your {tier} Pass
          </div>
        )}
      </div>
    </div>
  );
};

/**
 * Screen D7 — Offline walking
 */
export const ScreenD7OfflineWalking: React.FC = () => {
  const navigate = useNavigate();
  const activeDestination = useAppStore((s) => s.activeDestination);

  const walkingRoute = RoutingService.getOfflineWalkingSteps(
    activeDestination.name || 'Registan Square',
    activeDestination.distanceMeters || 950
  );

  return (
    <div className="flex-1 flex flex-col justify-between -mx-5 -mt-1">
      <SilkRoadMapCanvas
        className="w-full h-[430px] px-5 pt-2"
        routeLine={{ x1: 78, y1: 268, x2: 280, y2: 418 }}
        pins={[
          {
            id: 'dest-pin',
            x: 77,
            y: 22,
            label: walkingRoute.destinationName,
            color: 'red',
          },
        ]}
      >
        <div className="relative z-20">
          <ScreenHeader title="Walking · offline" />
        </div>
      </SilkRoadMapCanvas>

      <div className="bg-[#E9E4DC] rounded-t-[30px] -mt-5 pt-5 px-5 pb-1 relative z-20 flex-1 flex flex-col justify-between">
        <div>
          <div className="flex items-start justify-between">
            <div>
              <h2 className="text-[24px] font-bold text-[#111111]">
                {walkingRoute.destinationName}
              </h2>
              <div className="text-[14px] text-[#6E6A63] mt-0.5">
                {walkingRoute.summaryLabel}
              </div>
            </div>
            <span className="bg-[#DDEFE3] text-[#2E9E6B] text-[12px] font-semibold px-3.5 py-1.5 rounded-full">
              Works offline
            </span>
          </div>

          <div className="mt-4 space-y-3">
            {walkingRoute.steps.map((step, idx) => (
              <div key={step} className="flex items-center gap-3.5">
                <span className="w-7 h-7 rounded-full bg-[#111111] text-white text-[13px] font-bold flex items-center justify-center shrink-0">
                  {idx + 1}
                </span>
                <span className="text-[15px] font-medium text-[#111111]">
                  {step}
                </span>
              </div>
            ))}
          </div>

          <button
            type="button"
            onClick={() => navigate('/yandex-go')}
            className="mt-5 w-full py-4 rounded-full bg-[#111111] text-white text-[15px] font-semibold"
          >
            Ride with Yandex Go instead
          </button>
        </div>

        <TouristBottomNav activeTab="Explore" />
      </div>
    </div>
  );
};
