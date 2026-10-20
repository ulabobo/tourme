import { beforeEach, describe, expect, it } from 'vitest';
import {
  CameraAnalysisService,
  HotelService,
  ItineraryService,
  PharmacyService,
  PriceEstimationService,
  TransportService,
} from '../services/domainServices';
import { useAppStore } from '../store/useAppStore';
import {
  buildYandexGoLinks,
  calculateHaversineMeters,
  estimateUzbekistanTaxiFare,
  REGISTAN_SQUARE_COORDS,
  SAMARKAND_DEFAULT_COORDS,
} from '../utils/geo';
import { calculatePlovTimer } from '../utils/plovTimer';
import { generateDeterministicQrMatrix } from '../utils/qrSvg';
import { aboutYouSchema, merchantRegisterSchema } from '../utils/validation';
import { analyzeUzbekMenuImage } from '../services/scanner/aiMenuScannerService';
import { TRANSLATIONS } from '../utils/i18n';

describe('Uzbekistan Travel Companion — Unit & Integration Suite', () => {
  beforeEach(() => {
    localStorage.clear();
    useAppStore.getState().resetDemoData();
  });

  it('1. initializes global Zustand store with Anna Becker profile and 4 Silk Road cities', () => {
    const state = useAppStore.getState();
    expect(state.userProfile.name).toBe('Anna Becker');
    expect(state.userProfile.nationality).toBe('Germany');
    expect(state.userProfile.visaStatus).toBe('VISA_FREE_30_DAYS');
    expect(state.userProfile.tier).toBe('FREE');
    expect(state.tripPlan.totalDays).toBe(8);
    expect(state.tripPlan.selectedCities).toHaveLength(4);
  });

  it('2. calculates trip duration and prevents deselecting the last remaining city', () => {
    const store = useAppStore.getState();
    store.toggleCitySelection('khiva');
    expect(useAppStore.getState().tripPlan.totalDays).toBe(7);

    store.toggleCitySelection('tashkent');
    store.toggleCitySelection('bukhara');
    // Only Samarkand remains selected; attempting to deselect Samarkand must be prevented
    store.toggleCitySelection('samarkand');
    const remainingSelected = useAppStore
      .getState()
      .tripPlan.selectedCities.filter((c) => c.selected);
    expect(remainingSelected.length).toBe(1);
    expect(remainingSelected[0].id).toBe('samarkand');

    // Increment total trip days
    store.setTotalTripDays(10);
    expect(useAppStore.getState().tripPlan.totalDays).toBe(10);
  });

  it('3. validates travel dates and prevents departure before arrival', () => {
    const invalidResult = aboutYouSchema.safeParse({
      nationality: 'Germany',
      startDate: '2026-10-29',
      endDate: '2026-10-22',
      interests: ['History'],
    });
    expect(invalidResult.success).toBe(false);

    const validResult = aboutYouSchema.safeParse({
      nationality: 'Germany',
      startDate: '2026-10-22',
      endDate: '2026-10-29',
      interests: ['History', 'Gastronomy'],
    });
    expect(validResult.success).toBe(true);
  });

  it('4. returns sold-out Afrosiyob and verified fallbacks (Ticket Hunter, Flight, Sedan/Minivan)', () => {
    const options = TransportService.checkAvailability(
      'Tashkent',
      'Samarkand',
      'Fri, Oct 24',
      'Recommended'
    );
    expect(options[0].title).toContain('Afrosiyob');
    expect(options[0].availability).toBe('SOLD_OUT');
    expect(options.some((o) => o.type === 'waitlist')).toBe(true);
    expect(options.some((o) => o.type === 'flight' && o.priceUsd === 62)).toBe(true);
    expect(options.some((o) => o.vehicleType === 'Sedan')).toBe(true);
    expect(options.some((o) => o.vehicleType === 'Minivan')).toBe(true);

    // Join waitlist
    const entry = useAppStore
      .getState()
      .joinTicketHunterWaitlist('Tashkent', 'Samarkand', 'Fri, Oct 24');
    expect(entry.status).toBe('MONITORING_DEMO');
    expect(useAppStore.getState().tripPlan.ticketHunterWaitlist.length).toBe(1);
  });

  it('5. creates transport & monument bookings with deterministic QR matrices for Offline Wallet', () => {
    const options = TransportService.checkAvailability('Tashkent', 'Samarkand', 'Fri, Oct 24');
    const flight = options.find((o) => o.type === 'flight')!;

    const ticket = useAppStore.getState().completeTransportBooking(flight, 'Apple Pay');
    expect(ticket.status).toBe('CONFIRMED');
    expect(ticket.isDemoBooking).toBe(true);
    expect(useAppStore.getState().tripPlan.bookedTickets[0].id).toBe(ticket.id);

    const qrMatrix = generateDeterministicQrMatrix(ticket.qrPayload);
    expect(qrMatrix.length).toBe(11);
    expect(qrMatrix[0].length).toBe(11);
    // Finder pattern corners must be true
    expect(qrMatrix[0][0]).toBe(true);
  });

  it('6. saves hotel bookings with verified coordinates and updates active navigation destination', () => {
    const hotels = HotelService.searchHotels('Samarkand', null, 'Silk Road');
    expect(hotels.length).toBeGreaterThan(0);

    const booked = useAppStore.getState().selectAndBookHotel('hotel-silk-road-guest');
    expect(booked).not.toBeNull();
    expect(booked?.lat).toBeCloseTo(39.6584, 3);
    expect(useAppStore.getState().activeDestination.name).toBe('Silk Road Guest House');
  });

  it('7. calculates Haversine distance, UZS taxi fare estimates, and Yandex Go deep links with web fallback', () => {
    const dist = calculateHaversineMeters(
      SAMARKAND_DEFAULT_COORDS.lat,
      SAMARKAND_DEFAULT_COORDS.lng,
      REGISTAN_SQUARE_COORDS.lat,
      REGISTAN_SQUARE_COORDS.lng
    );
    expect(dist).toBeGreaterThan(1000);
    expect(dist).toBeLessThan(2000);

    const fare = estimateUzbekistanTaxiFare(
      SAMARKAND_DEFAULT_COORDS.lat,
      SAMARKAND_DEFAULT_COORDS.lng,
      REGISTAN_SQUARE_COORDS.lat,
      REGISTAN_SQUARE_COORDS.lng
    );
    expect(fare.minUzs).toBeGreaterThanOrEqual(10000);
    expect(fare.formattedRangeUzs).toContain('UZS');

    const links = buildYandexGoLinks(
      SAMARKAND_DEFAULT_COORDS.lat,
      SAMARKAND_DEFAULT_COORDS.lng,
      REGISTAN_SQUARE_COORDS.lat,
      REGISTAN_SQUARE_COORDS.lng
    );
    expect(links.deepLink).toContain('yandextaxi://route?start-lat=39.6542&start-lon=66.9597');
    expect(links.deepLink).toContain('end-lat=39.6547&end-lon=66.9758');
    expect(links.webFallbackUrl).toContain('https://3.redirect.appmetrica.yandex.com/route?');
  });

  it('8. manages Safety Heartbeat, 10-second SOS test countdown, cancellation, and simulated dispatch', () => {
    const store = useAppStore.getState();
    store.setHeartbeatActive(false);
    expect(useAppStore.getState().safetyState.isHeartbeatActive).toBe(false);
    store.setHeartbeatActive(true);
    expect(useAppStore.getState().safetyState.isHeartbeatActive).toBe(true);

    // Start 10s SOS test warning
    store.startSosWarningCountdown(true, 10);
    expect(useAppStore.getState().safetyState.sosStatus).toBe('WARNING_PROMPT');
    expect(useAppStore.getState().safetyState.sosCountdownSeconds).toBe(10);

    store.tickSosCountdown();
    expect(useAppStore.getState().safetyState.sosCountdownSeconds).toBe(9);

    // Cancel prevents dispatch
    store.cancelSosAlarm();
    expect(useAppStore.getState().safetyState.sosStatus).toBe('SAFE');
    expect(useAppStore.getState().safetyState.sosCountdownActive).toBe(false);

    // Let countdown expire to trigger simulated dispatch
    store.startSosWarningCountdown(true, 1);
    store.tickSosCountdown();
    expect(useAppStore.getState().safetyState.sosStatus).toBe('SOS_DISPATCHED');
    expect(useAppStore.getState().safetyState.lastSosOutcome).toContain('no real 112 call');
  });

  it('9. derives Plov Timer status accurately across Asia/Tashkent schedule windows', () => {
    // 09:00 Tashkent (04:00 UTC) -> Cooking now
    const cookingTime = new Date('2026-10-20T04:00:00Z');
    expect(calculatePlovTimer(cookingTime).status).toBe('Cooking now');

    // 12:30 Tashkent (07:30 UTC) -> Ready & Serving
    const servingTime = new Date('2026-10-20T07:30:00Z');
    expect(calculatePlovTimer(servingTime).status).toBe('Ready & Serving');

    // 18:00 Tashkent (13:00 UTC) -> Sold Out for Today
    const soldOutTime = new Date('2026-10-20T13:00:00Z');
    expect(calculatePlovTimer(soldOutTime).status).toBe('Sold Out for Today');
  });

  it('10. enforces FREE, PRO, and VIP subscription entitlements across AI Scanner and Audio Guides', () => {
    expect(CameraAnalysisService.getMenuTranslations('FREE').isLimitedPreview).toBe(true);
    expect(CameraAnalysisService.getMenuTranslations('FREE').dishes).toHaveLength(3);

    useAppStore.getState().setSubscriptionTier('PRO');
    expect(useAppStore.getState().userProfile.tier).toBe('PRO');
    expect(CameraAnalysisService.getMenuTranslations('PRO').isLimitedPreview).toBe(false);
    expect(CameraAnalysisService.getMenuTranslations('PRO').dishes).toHaveLength(4);
  });

  it('11. updates E-Mehmon nightly registration status when a hotel receipt slip is uploaded', () => {
    const beforeMissing = useAppStore
      .getState()
      .eMehmonRecords.filter((r) => r.verificationStatus === 'MISSING');
    expect(beforeMissing).toHaveLength(1);
    expect(beforeMissing[0].dateLabel).toBe('Oct 22');

    useAppStore.getState().uploadEMehmonSlip('emehmon-oct-22', {
      fileName: 'tashkent-hotel-slip.png',
      fileSize: 24500,
      mimeType: 'image/png',
      uploadedAt: '2026-10-22T20:00:00Z',
      idbKey: 'slip-oct-22',
    });

    const afterMissing = useAppStore
      .getState()
      .eMehmonRecords.filter((r) => r.verificationStatus === 'MISSING');
    expect(afterMissing).toHaveLength(0);
  });

  it('12. maps Tylenol, Imodium, Ibuprofen, Pepto-Bismol, and Claritin to local equivalents with safety notes', () => {
    for (const brand of ['Tylenol', 'Imodium', 'Ibuprofen', 'Pepto-Bismol', 'Claritin']) {
      const matches = PharmacyService.searchMedicines(brand);
      expect(matches.length).toBeGreaterThan(0);
      expect(matches[0].clinicalNote.length).toBeGreaterThan(15);
    }
  });

  it('13. validates and creates B2B merchant listings and propagates them to AI itineraries & voucher redemption', () => {
    const validation = merchantRegisterSchema.safeParse({
      name: 'Samarkand Silk Artisans',
      city: 'Samarkand',
      category: 'Craftsman',
      languages: ['English', 'Uzbek'],
    });
    expect(validation.success).toBe(true);

    const created = useAppStore.getState().createB2BListing({
      name: 'Samarkand Silk Artisans',
      city: 'Samarkand',
      category: 'Craftsman',
      languages: ['English', 'Uzbek'],
    });

    expect(useAppStore.getState().b2bListings[0].id).toBe(created.id);
    const day1Items = useAppStore.getState().tripPlan.dailyItinerary[0].items;
    expect(day1Items.some((i) => i.title === 'Samarkand Silk Artisans')).toBe(true);

    // Redeem voucher
    const initialRedeemed = useAppStore.getState().merchantState.vouchersRedeemed;
    useAppStore.getState().redeemTouristVoucher();
    expect(useAppStore.getState().merchantState.vouchersRedeemed).toBe(initialRedeemed + 1);
  });

  it('14. searches bazaar fair-price items and analyzes scanned craft photos', () => {
    const ceramics = PriceEstimationService.searchBazaarItems('Ceramics', '');
    expect(ceramics.length).toBe(1);
    expect(ceramics[0].name).toContain('Ceramic plate');

    const detected = PriceEstimationService.analyzeScannedBazaarImage('suzani-embroidery.jpg');
    expect(detected.category).toBe('Suzani');
  });

  it('15. regenerates daily itineraries when pacing changes', () => {
    const days = ItineraryService.generateItinerary(
      useAppStore.getState().tripPlan.selectedCities,
      '2026-10-22',
      'Packed',
      useAppStore.getState().b2bListings
    );
    expect(days.length).toBe(8);
    expect(days[0].items.length).toBeGreaterThanOrEqual(4);
  });

  it('16. supports multi-language i18n (EN/RU/UZ) and AI Menu Scanner analysis', async () => {
    expect(TRANSLATIONS.uz.todayInSamarkand).toContain('Samarqandda');
    expect(TRANSLATIONS.ru.todayInSamarkand).toContain('Самарканде');
    expect(TRANSLATIONS.en.todayInSamarkand).toContain('Samarkand');

    const mockFile = new File(['dummy-image'], 'samarkand-plov-menu.jpg', {
      type: 'image/jpeg',
    });
    const scanResult = await analyzeUzbekMenuImage(mockFile);
    expect(scanResult.items.length).toBe(4);
    expect(scanResult.items[0].uzbekName).toContain('Osh');
  });
});
