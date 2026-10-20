export type SubscriptionTier = 'FREE' | 'PRO' | 'VIP';

export type PacingType = 'Relaxed' | 'Balanced' | 'Packed';

export type VisaStatusType = 'VISA_FREE_30_DAYS' | 'EVISA_REQUIRED' | 'VISA_REQUIRED';

export interface EmergencyContact {
  id: string;
  name: string;
  phone: string;
  email?: string;
  relation?: string;
}

export interface ESimPlan {
  id: string;
  title: string;
  subtitle: string;
  dataGb: number;
  days: number;
  priceUsd: number;
  isPopular?: boolean;
  purchasedAt?: string;
  qrPayload?: string;
}

export interface UserProfile {
  name: string;
  email: string;
  phone: string;
  nationality: string;
  passportInfo: {
    maskedNumber: string;
    expiryDate?: string;
  };
  visaStatus: VisaStatusType;
  emergencyContacts: EmergencyContact[];
  medicalInfo: {
    allergies: string;
    bloodType: string;
  };
  tier: SubscriptionTier;
  preferences: {
    interests: string[];
    dietary: string[];
    pacing: PacingType;
    language: 'English' | 'Russian' | 'Uzbek' | 'German';
    notificationsEnabled: boolean;
  };
  esimPlan: ESimPlan | null;
  onboardingCompleted: boolean;
}

export interface SelectedCity {
  id: string;
  name: string;
  daysAllocated: number;
  selected: boolean;
  color: string;
  cardVariant: 'khiva' | 'bukhara' | 'samarkand' | 'tashkent';
  tagline: string;
  dailyCostUsd: number;
  categories: string[];
  lat: number;
  lng: number;
}

export interface ItineraryItem {
  id: string;
  time: string;
  title: string;
  subtitle: string;
  category: 'transport' | 'monument' | 'food' | 'bazaar' | 'hotel' | 'experience';
  actionType: 'wallet' | 'ride' | 'audio' | 'details';
  poiId?: string;
  ticketId?: string;
  lat: number;
  lng: number;
  isCompleted?: boolean;
  isB2BPromoted?: boolean;
}

export interface ItineraryDay {
  dayNumber: number;
  date: string;
  cityId: string;
  cityName: string;
  items: ItineraryItem[];
}

export interface TransportOption {
  id: string;
  type: 'train' | 'flight' | 'transfer' | 'waitlist';
  title: string;
  subtitle: string;
  provider: string;
  fromCity: string;
  toCity: string;
  fromCode: string;
  toCode: string;
  date: string;
  departureTime: string;
  arrivalTime: string;
  durationLabel: string;
  durationMinutes: number;
  priceUsd: number;
  priceUzs: number;
  availability: 'AVAILABLE' | 'SOLD_OUT' | 'WAITLIST_BOT';
  badge?: string;
  seatOrWagon?: string;
  vehicleType?: 'Sedan' | 'Minivan';
  driverDetails?: {
    name: string;
    vehicle: string;
    plate: string;
    phone: string;
  };
  sourceLabel: string;
}

export interface BookedTicket {
  id: string;
  bookingRef: string;
  type: 'train' | 'flight' | 'transfer' | 'monument';
  title: string;
  subtitle: string;
  fromCity: string;
  toCity: string;
  fromCode: string;
  toCode: string;
  date: string;
  departureTime: string;
  arrivalTime?: string;
  provider: string;
  priceUsd: number;
  priceUzs?: number;
  seatOrWagon: string;
  passengerName: string;
  driverDetails?: {
    name: string;
    vehicle: string;
    plate: string;
    phone: string;
  };
  status: 'CONFIRMED' | 'WAITLISTED' | 'CANCELED';
  qrPayload: string;
  isDemoBooking: boolean;
  createdAt: string;
}

export interface TicketHunterWaitlistEntry {
  id: string;
  fromCity: string;
  toCity: string;
  date: string;
  trainName: string;
  status: 'MONITORING_DEMO' | 'SEAT_FOUND_DEMO';
  createdAt: string;
}

export interface BookedHotel {
  id: string;
  name: string;
  city: string;
  category: 'Medrese hotel' | 'Guest house' | 'Yurt camp';
  rating: number;
  subtitle: string;
  address: string;
  lat: number;
  lng: number;
  pricePerNightUsd: number;
  checkInDate: string;
  checkOutDate: string;
  checkInTime: string;
  status: 'BOOKED' | 'SAVED' | 'CANCELED';
  artworkVariant: 'blue-arch' | 'rose-arch' | 'gold-arch';
}

export interface TripPlan {
  selectedCities: SelectedCity[];
  totalDays: number;
  travelDates: {
    startDate: string;
    endDate: string;
  };
  dailyItinerary: ItineraryDay[];
  bookedTickets: BookedTicket[];
  ticketHunterWaitlist: TicketHunterWaitlistEntry[];
  bookedHotels: BookedHotel[];
  pendingCheckoutOption: TransportOption | null;
}

export interface LocationPing {
  id: string;
  timeLabel: string;
  lat: number;
  lng: number;
  accuracy: number;
  battery: number | null;
  status: 'Synced' | 'Queued offline';
  source: 'GPS' | 'FALLBACK_SAMARKAND';
}

export type SosStatus = 'SAFE' | 'WARNING_PROMPT' | 'SOS_DISPATCHED' | 'CANCELED';

export interface SafetyState {
  isHeartbeatActive: boolean;
  intervalMinutes: 5 | 15 | 30;
  trekkingMode: boolean;
  noMovementHours: number;
  highRiskZones: string[];
  lastKnownLocation: {
    lat: number;
    lng: number;
    accuracy: number;
    timestamp: string;
    battery: number | null;
    source: 'GPS' | 'FALLBACK_SAMARKAND';
  } | null;
  locationHistory: LocationPing[];
  sosCountdownActive: boolean;
  sosCountdownSeconds: number;
  sosStatus: SosStatus;
  isTestMode: boolean;
  heartbeatLastUpdated: string | null;
  connectivityStatus: 'ONLINE' | 'OFFLINE';
  permissionStatus: 'PROMPT' | 'GRANTED' | 'DENIED' | 'UNSUPPORTED';
  lastSosOutcome: string | null;
}

export interface EMehmonSlipMetadata {
  fileName: string;
  fileSize: number;
  mimeType: string;
  uploadedAt: string;
  idbKey: string;
  previewDataUrl?: string;
}

export interface EMehmonRecord {
  id: string;
  dateLabel: string; // e.g. "Oct 22"
  isoDate: string;   // e.g. "2026-10-22"
  associatedHotel: string;
  city: string;
  verificationStatus: 'VERIFIED' | 'USER_UPLOADED' | 'MISSING';
  uploadedSlipMetadata: EMehmonSlipMetadata | null;
  uploadedAt: string | null;
  hotelAskedAt?: string | null;
}

export interface B2BListing {
  id: string;
  merchantId: string;
  name: string;
  city: string;
  category: 'Restaurant' | 'Guide' | 'Driver' | 'Craftsman' | 'Experience';
  description: string;
  address: string;
  lat: number;
  lng: number;
  services: string[];
  priceLabel: string;
  priceUzs: number;
  priceUsd: number;
  openingHours: string;
  dietaryTags: string[];
  languages: string[];
  images: string[];
  artworkVariant: 'terracotta' | 'blue-arch' | 'rose-arch' | 'lavender';
  contactInfo: string;
  verificationStatus: 'PENDING_VERIFICATION' | 'DEMO_VERIFIED';
  promoteInAiItinerary: boolean;
  licenseFileName?: string;
  createdAt: string;
  isActive: boolean;
}

export interface MerchantBooking {
  id: string;
  time: string;
  guests: number;
  customerName: string;
  serviceName: string;
  status: 'CONFIRMED' | 'CHECKED_IN' | 'COMPLETED';
}

export interface TouristVoucher {
  id: string;
  code: string;
  holderName: string;
  discountLabel: string;
  tierLabel: string;
  expiresLabel: string;
  isRedeemed: boolean;
  qrPayload: string;
}

export interface POIItem {
  id: string;
  name: string;
  city: string;
  category: 'Monument' | 'Food' | 'Bazaar' | 'ATM' | 'Pharmacy' | 'Historical';
  lat: number;
  lng: number;
  rating: number;
  distanceMeters?: number;
  openStatusLabel: string;
  openingHours: string;
  description: string;
  ticketPriceUzs?: number;
  priceRangeLabel?: string;
  dietaryTags: string[];
  serviceTags: string[];
  hasAudioGuide: boolean;
  audioGuideId?: string;
  artworkVariant: 'blue-arch' | 'terracotta' | 'lavender' | 'rose-arch';
  source: 'CURATED_VERIFIED' | 'MERCHANT_B2B';
  mapX: number; // percentage 10-90 for visual vector map pin placement
  mapY: number; // percentage 10-90
}

export interface ATMPoint {
  id: string;
  name: string;
  bankName: string;
  address: string;
  city: string;
  lat: number;
  lng: number;
  isOnline: boolean;
  cardsSupported: ('Visa' | 'Mastercard' | 'UnionPay')[];
  currencies: ('UZS cash' | 'USD cash')[];
  mapX: number;
  mapY: number;
}

export interface MedicineEquivalent {
  id: string;
  foreignBrand: string;
  activeIngredient: string;
  localEquivalentTitle: string;
  strengthAndForm: string;
  packageSize: string;
  indicativePriceUzs: string;
  pharmacistPhrase: string;
  uzbekPhrase: string;
  russianPhrase: string;
  clinicalNote: string;
  sourceUpdatedDate: string;
}

export interface PharmacyLocation {
  id: string;
  name: string;
  hoursLabel: string;
  isOpen24h: boolean;
  address: string;
  lat: number;
  lng: number;
  defaultDistanceMeters: number;
}

export interface BazaarItem {
  id: string;
  name: string;
  category: 'Spices' | 'Ceramics' | 'Suzani' | 'Dried fruit';
  fairMinUzs: number;
  fairMaxUzs: number;
  touristPriceUzs: number;
  uzbekPhrase: string;
  uzbekMeaning: string;
  russianPhrase: string;
  confidence: string;
  greenBarStartPct: number;
  greenBarWidthPct: number;
}

export interface AudioTrack {
  id: string;
  number: number;
  title: string;
  durationSeconds: number;
  durationLabel: string;
  isFreePreview: boolean;
  transcript: string;
  transcriptRu: string;
  transcriptDe: string;
}

export interface ConciergeMessage {
  id: string;
  sender: 'concierge' | 'user';
  senderName: string;
  text: string;
  timestamp: string;
  voucherCard?: {
    title: string;
    subtitle: string;
    ticketId: string;
  };
}

export interface OfficialUpdateItem {
  id: string;
  source: 'Tourism Committee' | 'Visa (MFA)';
  dateLabel: string;
  title: string;
  summary: string;
  details: string;
}
