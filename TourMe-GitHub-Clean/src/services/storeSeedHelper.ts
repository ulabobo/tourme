import {
  AUDIO_GUIDE_TRACKS,
  ConciergeService,
  CURATED_HOTELS,
  INITIAL_B2B_LISTINGS,
  INITIAL_CITIES,
  ItineraryService,
} from './domainServices';
import {
  BookedTicket,
  ConciergeMessage,
  EMehmonRecord,
  LocationPing,
  MerchantBooking,
  TouristVoucher,
  VisaStatusType,
} from '../types/domain';
import { REGISTAN_SQUARE_COORDS } from '../utils/geo';

export {
  AUDIO_GUIDE_TRACKS,
  ConciergeService,
  CURATED_HOTELS,
  INITIAL_B2B_LISTINGS,
  INITIAL_CITIES,
  ItineraryService,
};

export const POI_REGISTAN_FALLBACK_COORDS = REGISTAN_SQUARE_COORDS;

export function resolveVisaStatusByNationality(nationality: string): VisaStatusType {
  const n = nationality.trim().toLowerCase();
  const visaFreeList = [
    'germany',
    'france',
    'united kingdom',
    'uk',
    'italy',
    'spain',
    'japan',
    'south korea',
    'australia',
    'canada',
    'switzerland',
    'netherlands',
    'austria',
    'belgium',
    'singapore',
    'uae',
    'turkey',
  ];
  if (visaFreeList.some((c) => n.includes(c))) {
    return 'VISA_FREE_30_DAYS';
  }
  return 'EVISA_REQUIRED';
}

export const INITIAL_BOOKED_TICKETS: BookedTicket[] = [
  {
    id: 'ticket-tas-skd-initial',
    bookingRef: 'HY-1042-SKD',
    type: 'flight',
    title: 'TAS → SKD',
    subtitle: 'Fri, Oct 24 · 08:40 · Seat 14A',
    fromCity: 'Tashkent',
    toCity: 'Samarkand',
    fromCode: 'TAS',
    toCode: 'SKD',
    date: 'Fri, Oct 24',
    departureTime: '08:40',
    arrivalTime: '09:45',
    provider: 'Uzbekistan Airways',
    priceUsd: 62,
    priceUzs: 793600,
    seatOrWagon: 'Seat 14A',
    passengerName: 'Anna Becker',
    status: 'CONFIRMED',
    qrPayload: 'UZ-TICKET-TAS-SKD-20261024-0840-14A-ANNA-BECKER',
    isDemoBooking: true,
    createdAt: '2026-10-20T08:00:00Z',
  },
  {
    id: 'ticket-registan-skip',
    bookingRef: 'REG-8821-SKD',
    type: 'monument',
    title: 'Registan Square · Skip-the-line',
    subtitle: 'Oct 25 · 10:30',
    fromCity: 'Samarkand',
    toCity: 'Registan Square',
    fromCode: 'REG',
    toCode: 'SKD',
    date: 'Oct 25',
    departureTime: '10:30',
    provider: 'Samarkand Heritage Pass',
    priceUsd: 10.5,
    priceUzs: 130000,
    seatOrWagon: 'Fast-Track Gate B',
    passengerName: 'Anna Becker',
    status: 'CONFIRMED',
    qrPayload: 'UZ-MONUMENT-REGISTAN-SKIP-20261025-1030-ANNA-BECKER',
    isDemoBooking: true,
    createdAt: '2026-10-20T08:05:00Z',
  },
];

export const INITIAL_LOCATION_HISTORY: LocationPing[] = [
  {
    id: 'ping-1015',
    timeLabel: '10:15',
    lat: 39.654,
    lng: 66.959,
    accuracy: 12,
    battery: 78,
    status: 'Synced',
    source: 'FALLBACK_SAMARKAND',
  },
  {
    id: 'ping-1000',
    timeLabel: '10:00',
    lat: 39.651,
    lng: 66.955,
    accuracy: 14,
    battery: 80,
    status: 'Synced',
    source: 'FALLBACK_SAMARKAND',
  },
  {
    id: 'ping-0945',
    timeLabel: '09:45',
    lat: 39.648,
    lng: 66.951,
    accuracy: 18,
    battery: 81,
    status: 'Queued offline',
    source: 'FALLBACK_SAMARKAND',
  },
];

export const INITIAL_EMEHMON_RECORDS: EMehmonRecord[] = [
  {
    id: 'emehmon-oct-22',
    dateLabel: 'Oct 22',
    isoDate: '2026-10-22',
    associatedHotel: 'Tashkent Hotel',
    city: 'Tashkent',
    verificationStatus: 'MISSING',
    uploadedSlipMetadata: null,
    uploadedAt: null,
  },
  {
    id: 'emehmon-oct-23',
    dateLabel: 'Oct 23',
    isoDate: '2026-10-23',
    associatedHotel: 'Registan Medrese Boutique',
    city: 'Samarkand',
    verificationStatus: 'VERIFIED',
    uploadedSlipMetadata: null,
    uploadedAt: '2026-10-23T14:20:00Z',
  },
  {
    id: 'emehmon-oct-24',
    dateLabel: 'Oct 24',
    isoDate: '2026-10-24',
    associatedHotel: 'Registan Medrese Boutique',
    city: 'Samarkand',
    verificationStatus: 'VERIFIED',
    uploadedSlipMetadata: null,
    uploadedAt: '2026-10-24T10:00:00Z',
  },
  {
    id: 'emehmon-oct-25',
    dateLabel: 'Oct 25',
    isoDate: '2026-10-25',
    associatedHotel: 'Registan Medrese Boutique',
    city: 'Samarkand',
    verificationStatus: 'VERIFIED',
    uploadedSlipMetadata: null,
    uploadedAt: '2026-10-25T10:00:00Z',
  },
  {
    id: 'emehmon-oct-26',
    dateLabel: 'Oct 26',
    isoDate: '2026-10-26',
    associatedHotel: 'Bukhara Guest House',
    city: 'Bukhara',
    verificationStatus: 'VERIFIED',
    uploadedSlipMetadata: null,
    uploadedAt: '2026-10-26T15:00:00Z',
  },
  {
    id: 'emehmon-oct-27',
    dateLabel: 'Oct 27',
    isoDate: '2026-10-27',
    associatedHotel: 'Bukhara Guest House',
    city: 'Bukhara',
    verificationStatus: 'VERIFIED',
    uploadedSlipMetadata: null,
    uploadedAt: '2026-10-27T10:00:00Z',
  },
  {
    id: 'emehmon-oct-28',
    dateLabel: 'Oct 28',
    isoDate: '2026-10-28',
    associatedHotel: 'Bukhara Guest House',
    city: 'Bukhara',
    verificationStatus: 'VERIFIED',
    uploadedSlipMetadata: null,
    uploadedAt: '2026-10-28T10:00:00Z',
  },
];

export const INITIAL_CONCIERGE_MESSAGES: ConciergeMessage[] = [
  {
    id: 'cmsg-1',
    sender: 'concierge',
    senderName: 'Dilnoza',
    text: 'Hi Anna! I’m Dilnoza, your concierge. How can I help?',
    timestamp: '19:42',
  },
  {
    id: 'cmsg-2',
    sender: 'user',
    senderName: 'Anna Becker',
    text: 'Can you book a table for 4 tonight near Registan?',
    timestamp: '19:43',
  },
  {
    id: 'cmsg-3',
    sender: 'concierge',
    senderName: 'Dilnoza',
    text: 'Done — 20:00 on a rooftop terrace. I’m sending your QR voucher now.',
    timestamp: '19:44',
    voucherCard: {
      title: 'Table for 4 · 20:00',
      subtitle: 'Voucher QR in Wallet',
      ticketId: 'ticket-registan-skip',
    },
  },
];

export const INITIAL_MERCHANT_BOOKINGS: MerchantBooking[] = [
  {
    id: 'mb-1',
    time: '19:00',
    guests: 4,
    customerName: 'Anna K.',
    serviceName: 'Plov set lunch & evening table',
    status: 'CONFIRMED',
  },
  {
    id: 'mb-2',
    time: '19:30',
    guests: 2,
    customerName: 'Tom R.',
    serviceName: 'Plov set lunch',
    status: 'CONFIRMED',
  },
  {
    id: 'mb-3',
    time: '20:00',
    guests: 6,
    customerName: 'Group tour',
    serviceName: 'Private old-town tour + dinner',
    status: 'CONFIRMED',
  },
];

export const INITIAL_TOURIST_VOUCHERS: TouristVoucher[] = [
  {
    id: 'vouch-anna',
    code: 'SRP-ANNA-15',
    holderName: 'Anna K.',
    discountLabel: '15% off',
    tierLabel: 'Silk Road Pass',
    expiresLabel: 'expires Oct 29',
    isRedeemed: false,
    qrPayload: 'UZ-VOUCHER-SILK-ROAD-PASS-ANNA-K-15PCT-OCT29',
  },
  {
    id: 'vouch-tom',
    code: 'SRP-TOM-20',
    holderName: 'Tom R.',
    discountLabel: '20% off',
    tierLabel: 'VIP Concierge',
    expiresLabel: 'expires Nov 02',
    isRedeemed: false,
    qrPayload: 'UZ-VOUCHER-VIP-TOM-R-20PCT-NOV02',
  },
  {
    id: 'vouch-lukas',
    code: 'SRP-LUKAS-10',
    holderName: 'Lukas M.',
    discountLabel: 'Free Tea & Dessert',
    tierLabel: 'Silk Road Pass',
    expiresLabel: 'expires Oct 31',
    isRedeemed: false,
    qrPayload: 'UZ-VOUCHER-SILK-ROAD-PASS-LUKAS-M-OCT31',
  },
];
