import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import {
  AUDIO_GUIDE_TRACKS,
  ConciergeService,
  CURATED_HOTELS,
  INITIAL_B2B_LISTINGS,
  INITIAL_BOOKED_TICKETS,
  INITIAL_CITIES,
  INITIAL_CONCIERGE_MESSAGES,
  INITIAL_EMEHMON_RECORDS,
  INITIAL_LOCATION_HISTORY,
  INITIAL_MERCHANT_BOOKINGS,
  INITIAL_TOURIST_VOUCHERS,
  ItineraryService,
  POI_REGISTAN_FALLBACK_COORDS,
  resolveVisaStatusByNationality,
} from '../services/storeSeedHelper';
import {
  B2BListing,
  BookedHotel,
  BookedTicket,
  ConciergeMessage,
  EmergencyContact,
  EMehmonRecord,
  EMehmonSlipMetadata,
  ESimPlan,
  MerchantBooking,
  PacingType,
  SafetyState,
  SubscriptionTier,
  TicketHunterWaitlistEntry,
  TouristVoucher,
  TransportOption,
  TripPlan,
  UserProfile,
} from '../types/domain';
import { SAMARKAND_DEFAULT_COORDS } from '../utils/geo';

export interface ActiveDestinationTarget {
  name: string;
  subtitle?: string;
  lat: number;
  lng: number;
  distanceMeters?: number;
}

export interface AudioPlayerState {
  currentTrackId: string;
  isPlaying: boolean;
  progressSeconds: number;
  durationSeconds: number;
  language: 'English' | 'Russian' | 'German';
  showTranscript: boolean;
}

export interface ToastNotification {
  id: string;
  message: string;
  type: 'success' | 'info' | 'warning' | 'error';
}

export interface MerchantDashboardState {
  businessName: string;
  city: string;
  category: 'Restaurant' | 'Guide' | 'Driver' | 'Craftsman' | 'Experience';
  languages: string[];
  bookingsToday: number;
  vouchersRedeemed: number;
  aiItineraryViews: number;
  isBoosted: boolean;
  licenseFileName: string | null;
  upcomingBookings: MerchantBooking[];
  vouchers: TouristVoucher[];
  activeVoucherIndex: number;
}

export interface AppStoreState {
  userProfile: UserProfile;
  tripPlan: TripPlan;
  safetyState: SafetyState;
  eMehmonRecords: EMehmonRecord[];
  b2bListings: B2BListing[];
  merchantState: MerchantDashboardState;
  conciergeMessages: ConciergeMessage[];
  audioPlayer: AudioPlayerState;
  activeDestination: ActiveDestinationTarget;
  toasts: ToastNotification[];

  // Toast Actions
  showToast: (message: string, type?: ToastNotification['type']) => void;
  dismissToast: (id: string) => void;

  // Profile & Subscription Actions
  updateUserProfile: (partial: Partial<UserProfile>) => void;
  updatePreferences: (partial: Partial<UserProfile['preferences']>) => void;
  setNationality: (nationality: string) => void;
  toggleInterest: (interest: string) => void;
  toggleDietaryPreference: (dietary: string) => void;
  setSubscriptionTier: (tier: SubscriptionTier) => void;
  purchaseESim: (plan: ESimPlan) => void;
  addEmergencyContact: (contact: Omit<EmergencyContact, 'id'>) => void;
  updateEmergencyContact: (id: string, contact: Partial<EmergencyContact>) => void;
  removeEmergencyContact: (id: string) => void;
  updateMedicalInfo: (info: Partial<UserProfile['medicalInfo']>) => void;

  // Trip Planning & Itinerary Actions
  toggleCitySelection: (cityId: string) => void;
  applyAiCitySuggestion: () => void;
  setTotalTripDays: (days: number) => void;
  setCityDaysAllocated: (cityId: string, days: number) => void;
  setTravelDates: (startDate: string, endDate: string) => void;
  setPacing: (pacing: PacingType) => void;
  regenerateItinerary: () => void;
  reorderItineraryItem: (dayNumber: number, itemId: string, direction: 'up' | 'down') => void;
  removeItineraryItem: (dayNumber: number, itemId: string) => void;
  addCustomItineraryItem: (dayNumber: number, title: string, time: string, subtitle: string) => void;

  // Transport, Checkout & Wallet Actions
  setPendingCheckoutOption: (option: TransportOption | null) => void;
  completeTransportBooking: (option: TransportOption, paymentMethod: string) => BookedTicket;
  buyMonumentTicket: (monument: {
    id: string;
    title: string;
    city: string;
    priceUzs: number;
    priceUsd: number;
  }) => BookedTicket;
  joinTicketHunterWaitlist: (
    fromCity: string,
    toCity: string,
    date: string,
    trainName?: string
  ) => TicketHunterWaitlistEntry;
  cancelBooking: (ticketId: string) => void;

  // Hotel Actions
  selectAndBookHotel: (hotelId: string) => BookedHotel | null;
  addCustomHotelBooking: (hotel: BookedHotel) => void;

  // Navigation / Routing Target Actions
  setActiveDestination: (dest: ActiveDestinationTarget) => void;

  // Safety Heartbeat & SOS Actions
  setHeartbeatActive: (active: boolean) => void;
  setHeartbeatInterval: (minutes: 5 | 15 | 30) => void;
  updateDeadMansSwitchConfig: (config: {
    trekkingMode: boolean;
    intervalMinutes: 5 | 15 | 30;
    noMovementHours: number;
    highRiskZones: string[];
  }) => void;
  recordLocationPing: (ping: {
    lat: number;
    lng: number;
    accuracy: number;
    battery: number | null;
    source: 'GPS' | 'FALLBACK_SAMARKAND';
  }) => void;
  setConnectivityStatus: (status: 'ONLINE' | 'OFFLINE') => void;
  startSosWarningCountdown: (isTestMode?: boolean, seconds?: number) => void;
  tickSosCountdown: () => void;
  cancelSosAlarm: () => void;
  triggerSosDispatch: () => void;

  // E-Mehmon Actions
  uploadEMehmonSlip: (recordId: string, metadata: EMehmonSlipMetadata) => void;
  removeEMehmonSlip: (recordId: string) => void;
  markHotelAskedForEMehmon: (recordId: string) => void;

  // Audio Guide Actions
  selectAudioTrack: (trackId: string) => void;
  toggleAudioPlay: () => void;
  stopAudioPlay: () => void;
  seekAudio: (deltaOrAbsoluteSeconds: number, isRelative?: boolean) => void;
  setAudioLanguage: (lang: 'English' | 'Russian' | 'German') => void;
  toggleAudioTranscript: () => void;

  // Concierge Actions
  sendConciergeMessage: (text: string) => void;

  // B2B Merchant Actions
  createB2BListing: (input: {
    name: string;
    city: string;
    category: B2BListing['category'];
    description?: string;
    priceLabel?: string;
    languages: string[];
    dietaryTags?: string[];
    licenseFileName?: string;
  }) => B2BListing;
  updateB2BListing: (id: string, partial: Partial<B2BListing>) => void;
  toggleB2BListingActive: (id: string) => void;
  toggleB2BPromoteInAi: (id: string) => void;
  deleteB2BListing: (id: string) => void;
  boostMerchantVisibility: () => void;
  redeemTouristVoucher: (voucherId?: string) => void;
  nextTouristVoucher: () => void;

  // Reset Demo Data
  resetDemoData: () => void;
}

function createInitialState() {
  const initialCities = INITIAL_CITIES.map((c) => ({ ...c }));
  const initialB2B = INITIAL_B2B_LISTINGS.map((b) => ({ ...b }));
  const initialItinerary = ItineraryService.generateItinerary(
    initialCities,
    '2026-10-22',
    'Balanced',
    initialB2B
  );

  const userProfile: UserProfile = {
    name: 'Anna Becker',
    email: 'anna.becker@example.com',
    phone: '+49 000 000 00 00',
    nationality: 'Germany',
    passportInfo: {
      maskedNumber: 'Saved · ending ••21',
      expiryDate: '2031-05-14',
    },
    visaStatus: 'VISA_FREE_30_DAYS',
    emergencyContacts: [
      {
        id: 'ec-mark',
        name: 'Mark Becker',
        phone: '+49 000 000 001',
        email: 'mark.becker@example.com',
        relation: 'Spouse',
      },
      {
        id: 'ec-lena',
        name: 'Lena Becker',
        phone: '+49 000 000 002',
        email: 'lena.becker@example.com',
        relation: 'Sister',
      },
    ],
    medicalInfo: {
      allergies: 'Penicillin',
      bloodType: 'A+',
    },
    tier: 'FREE',
    preferences: {
      interests: ['History', 'Gastronomy', 'Photography'],
      dietary: ['Vegetarian'],
      pacing: 'Balanced',
      language: 'English',
      notificationsEnabled: true,
    },
    esimPlan: null,
    onboardingCompleted: false,
  };

  const tripPlan: TripPlan = {
    selectedCities: initialCities,
    totalDays: 8,
    travelDates: {
      startDate: '2026-10-22',
      endDate: '2026-10-29',
    },
    dailyItinerary: initialItinerary,
    bookedTickets: INITIAL_BOOKED_TICKETS.map((t) => ({ ...t })),
    ticketHunterWaitlist: [],
    bookedHotels: [CURATED_HOTELS[0]],
    pendingCheckoutOption: {
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
    },
  };

  const safetyState: SafetyState = {
    isHeartbeatActive: true,
    intervalMinutes: 15,
    trekkingMode: true,
    noMovementHours: 3,
    highRiskZones: ['Chimgan', 'Aydarkul', 'Aral Sea'],
    lastKnownLocation: {
      lat: SAMARKAND_DEFAULT_COORDS.lat,
      lng: SAMARKAND_DEFAULT_COORDS.lng,
      accuracy: 12,
      timestamp: '2 min ago',
      battery: 78,
      source: 'FALLBACK_SAMARKAND',
    },
    locationHistory: INITIAL_LOCATION_HISTORY.map((p) => ({ ...p })),
    sosCountdownActive: false,
    sosCountdownSeconds: 10,
    sosStatus: 'SAFE',
    isTestMode: false,
    heartbeatLastUpdated: '2 min ago',
    connectivityStatus: 'ONLINE',
    permissionStatus: 'PROMPT',
    lastSosOutcome: null,
  };

  const merchantState: MerchantDashboardState = {
    businessName: 'Plov House',
    city: 'Samarkand',
    category: 'Restaurant',
    languages: ['English', 'Russian', 'Uzbek'],
    bookingsToday: 12,
    vouchersRedeemed: 5,
    aiItineraryViews: 340,
    isBoosted: false,
    licenseFileName: null,
    upcomingBookings: INITIAL_MERCHANT_BOOKINGS.map((b) => ({ ...b })),
    vouchers: INITIAL_TOURIST_VOUCHERS.map((v) => ({ ...v })),
    activeVoucherIndex: 0,
  };

  const audioPlayer: AudioPlayerState = {
    currentTrackId: 'track-1',
    isPlaying: false,
    progressSeconds: 72, // 1:12 as shown in E1 - Audio guide.png
    durationSeconds: 270, // 4:30 as shown in E1 - Audio guide.png
    language: 'English',
    showTranscript: false,
  };

  const activeDestination: ActiveDestinationTarget = {
    name: 'Registan Square',
    subtitle: 'Three madrasas facing a grand square',
    lat: POI_REGISTAN_FALLBACK_COORDS.lat,
    lng: POI_REGISTAN_FALLBACK_COORDS.lng,
    distanceMeters: 350,
  };

  return {
    userProfile,
    tripPlan,
    safetyState,
    eMehmonRecords: INITIAL_EMEHMON_RECORDS.map((r) => ({ ...r })),
    b2bListings: initialB2B,
    merchantState,
    conciergeMessages: INITIAL_CONCIERGE_MESSAGES.map((m) => ({ ...m })),
    audioPlayer,
    activeDestination,
    toasts: [] as ToastNotification[],
  };
}

export const useAppStore = create<AppStoreState>()(
  persist(
    (set, get) => ({
      ...createInitialState(),

      showToast: (message, type = 'info') => {
        const id = `toast-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`;
        set((state) => ({
          toasts: [...state.toasts.slice(-2), { id, message, type }],
        }));
      },

      dismissToast: (id) => {
        set((state) => ({
          toasts: state.toasts.filter((t) => t.id !== id),
        }));
      },

      updateUserProfile: (partial) => {
        set((state) => ({
          userProfile: {
            ...state.userProfile,
            ...partial,
          },
        }));
      },

      updatePreferences: (partial) => {
        set((state) => ({
          userProfile: {
            ...state.userProfile,
            preferences: {
              ...state.userProfile.preferences,
              ...partial,
            },
          },
        }));
      },

      setNationality: (nationality) => {
        const visaStatus = resolveVisaStatusByNationality(nationality);
        set((state) => ({
          userProfile: {
            ...state.userProfile,
            nationality,
            visaStatus,
          },
        }));
      },

      toggleInterest: (interest) => {
        set((state) => {
          const current = state.userProfile.preferences.interests;
          const exists = current.includes(interest);
          const next = exists
            ? current.length > 1
              ? current.filter((i) => i !== interest)
              : current
            : [...current, interest];
          return {
            userProfile: {
              ...state.userProfile,
              preferences: {
                ...state.userProfile.preferences,
                interests: next,
              },
            },
          };
        });
      },

      toggleDietaryPreference: (dietary) => {
        set((state) => {
          const current = state.userProfile.preferences.dietary;
          const exists = current.includes(dietary);
          const next = exists ? current.filter((d) => d !== dietary) : [...current, dietary];
          return {
            userProfile: {
              ...state.userProfile,
              preferences: {
                ...state.userProfile.preferences,
                dietary: next,
              },
            },
          };
        });
      },

      setSubscriptionTier: (tier) => {
        set((state) => ({
          userProfile: {
            ...state.userProfile,
            tier,
          },
        }));
      },

      purchaseESim: (plan) => {
        const purchasedPlan: ESimPlan = {
          ...plan,
          purchasedAt: new Date().toISOString(),
          qrPayload: `UZ-ESIM-${plan.dataGb}GB-${plan.days}DAYS-ACTIVE`,
        };
        const esimTicket: BookedTicket = {
          id: `ticket-esim-${Date.now().toString(36)}`,
          bookingRef: `ESIM-${plan.dataGb}GB`,
          type: 'monument',
          title: `Uzbekistan eSIM · ${plan.title}`,
          subtitle: 'Instant QR Activation · Local 4G/5G',
          fromCity: 'Uzbekistan',
          toCity: 'All Cities',
          fromCode: 'eSIM',
          toCode: `${plan.dataGb}GB`,
          date: 'Valid from landing',
          departureTime: 'Instant',
          provider: 'Ucell / Beeline Tourist eSIM',
          priceUsd: plan.priceUsd,
          seatOrWagon: `${plan.dataGb} GB · ${plan.days} days`,
          passengerName: get().userProfile.name,
          status: 'CONFIRMED',
          qrPayload: purchasedPlan.qrPayload!,
          isDemoBooking: true,
          createdAt: new Date().toISOString(),
        };
        set((state) => ({
          userProfile: {
            ...state.userProfile,
            esimPlan: purchasedPlan,
          },
          tripPlan: {
            ...state.tripPlan,
            bookedTickets: [
              esimTicket,
              ...state.tripPlan.bookedTickets.filter((t) => !t.id.startsWith('ticket-esim-')),
            ],
          },
        }));
      },

      addEmergencyContact: (contact) => {
        const newContact: EmergencyContact = {
          ...contact,
          id: `ec-${Date.now().toString(36)}`,
        };
        set((state) => ({
          userProfile: {
            ...state.userProfile,
            emergencyContacts: [...state.userProfile.emergencyContacts, newContact],
          },
        }));
      },

      updateEmergencyContact: (id, partial) => {
        set((state) => ({
          userProfile: {
            ...state.userProfile,
            emergencyContacts: state.userProfile.emergencyContacts.map((c) =>
              c.id === id ? { ...c, ...partial } : c
            ),
          },
        }));
      },

      removeEmergencyContact: (id) => {
        set((state) => ({
          userProfile: {
            ...state.userProfile,
            emergencyContacts: state.userProfile.emergencyContacts.filter((c) => c.id !== id),
          },
        }));
      },

      updateMedicalInfo: (info) => {
        set((state) => ({
          userProfile: {
            ...state.userProfile,
            medicalInfo: {
              ...state.userProfile.medicalInfo,
              ...info,
            },
          },
        }));
      },

      toggleCitySelection: (cityId) => {
        set((state) => {
          const target = state.tripPlan.selectedCities.find((c) => c.id === cityId);
          if (!target) return state;

          const currentlySelectedCount = state.tripPlan.selectedCities.filter((c) => c.selected).length;
          // Prevent deselecting the last remaining city
          if (target.selected && currentlySelectedCount <= 1) {
            return state;
          }

          const updatedCities = state.tripPlan.selectedCities.map((c) => {
            if (c.id !== cityId) return c;
            const nextSelected = !c.selected;
            return {
              ...c,
              selected: nextSelected,
              daysAllocated: nextSelected ? Math.max(1, c.daysAllocated || 2) : 0,
            };
          });

          const totalDays = Math.max(
            1,
            updatedCities
              .filter((c) => c.selected)
              .reduce((sum, c) => sum + c.daysAllocated, 0)
          );

          const dailyItinerary = ItineraryService.generateItinerary(
            updatedCities,
            state.tripPlan.travelDates.startDate,
            state.userProfile.preferences.pacing,
            state.b2bListings
          );

          return {
            tripPlan: {
              ...state.tripPlan,
              selectedCities: updatedCities,
              totalDays,
              dailyItinerary,
            },
          };
        });
      },

      applyAiCitySuggestion: () => {
        set((state) => {
          const updatedCities = state.tripPlan.selectedCities.map((c) => ({
            ...c,
            selected: true,
            daysAllocated:
              c.id === 'tashkent'
                ? 1
                : c.id === 'samarkand'
                  ? 3
                  : c.id === 'bukhara'
                    ? 3
                    : 1,
          }));
          const dailyItinerary = ItineraryService.generateItinerary(
            updatedCities,
            state.tripPlan.travelDates.startDate,
            state.userProfile.preferences.pacing,
            state.b2bListings
          );
          return {
            tripPlan: {
              ...state.tripPlan,
              selectedCities: updatedCities,
              totalDays: 8,
              dailyItinerary,
            },
          };
        });
      },

      setTotalTripDays: (days) => {
        const clampedDays = Math.min(30, Math.max(1, Math.round(days)));
        set((state) => {
          const selected = state.tripPlan.selectedCities.filter((c) => c.selected);
          const count = selected.length || 1;
          let remaining = clampedDays;

          // Distribute proportionally across selected cities
          const currentSum = selected.reduce((s, c) => s + Math.max(1, c.daysAllocated), 0) || count;
          const updatedCities = state.tripPlan.selectedCities.map((c, idx) => {
            if (!c.selected) return { ...c, daysAllocated: 0 };
            const isLastSelected =
              selected[selected.length - 1]?.id === c.id || idx === state.tripPlan.selectedCities.length - 1;
            if (isLastSelected) {
              return { ...c, daysAllocated: Math.max(1, remaining) };
            }
            const share = Math.max(
              1,
              Math.min(
                remaining - (selected.length - 1 - selected.findIndex((s) => s.id === c.id)),
                Math.round((Math.max(1, c.daysAllocated) / currentSum) * clampedDays)
              )
            );
            remaining = Math.max(1, remaining - share);
            return { ...c, daysAllocated: share };
          });

          const newTotal = updatedCities
            .filter((c) => c.selected)
            .reduce((s, c) => s + c.daysAllocated, 0);

          const dailyItinerary = ItineraryService.generateItinerary(
            updatedCities,
            state.tripPlan.travelDates.startDate,
            state.userProfile.preferences.pacing,
            state.b2bListings
          );

          return {
            tripPlan: {
              ...state.tripPlan,
              selectedCities: updatedCities,
              totalDays: newTotal,
              dailyItinerary,
            },
          };
        });
      },

      setCityDaysAllocated: (cityId, days) => {
        const clamped = Math.min(20, Math.max(1, Math.round(days)));
        set((state) => {
          const updatedCities = state.tripPlan.selectedCities.map((c) =>
            c.id === cityId ? { ...c, selected: true, daysAllocated: clamped } : c
          );
          const totalDays = updatedCities
            .filter((c) => c.selected)
            .reduce((s, c) => s + c.daysAllocated, 0);
          const dailyItinerary = ItineraryService.generateItinerary(
            updatedCities,
            state.tripPlan.travelDates.startDate,
            state.userProfile.preferences.pacing,
            state.b2bListings
          );
          return {
            tripPlan: {
              ...state.tripPlan,
              selectedCities: updatedCities,
              totalDays,
              dailyItinerary,
            },
          };
        });
      },

      setTravelDates: (startDate, endDate) => {
        set((state) => {
          const s = new Date(startDate).getTime();
          const e = new Date(endDate).getTime();
          const validEnd = !isNaN(s) && !isNaN(e) && e < s ? startDate : endDate;
          const dailyItinerary = ItineraryService.generateItinerary(
            state.tripPlan.selectedCities,
            startDate,
            state.userProfile.preferences.pacing,
            state.b2bListings
          );
          return {
            tripPlan: {
              ...state.tripPlan,
              travelDates: {
                startDate,
                endDate: validEnd,
              },
              dailyItinerary,
            },
          };
        });
      },

      setPacing: (pacing) => {
        set((state) => {
          const dailyItinerary = ItineraryService.generateItinerary(
            state.tripPlan.selectedCities,
            state.tripPlan.travelDates.startDate,
            pacing,
            state.b2bListings
          );
          return {
            userProfile: {
              ...state.userProfile,
              preferences: {
                ...state.userProfile.preferences,
                pacing,
              },
            },
            tripPlan: {
              ...state.tripPlan,
              dailyItinerary,
            },
          };
        });
      },

      regenerateItinerary: () => {
        set((state) => ({
          tripPlan: {
            ...state.tripPlan,
            dailyItinerary: ItineraryService.generateItinerary(
              state.tripPlan.selectedCities,
              state.tripPlan.travelDates.startDate,
              state.userProfile.preferences.pacing,
              state.b2bListings
            ),
          },
        }));
      },

      reorderItineraryItem: (dayNumber, itemId, direction) => {
        set((state) => {
          const updatedDays = state.tripPlan.dailyItinerary.map((day) => {
            if (day.dayNumber !== dayNumber) return day;
            const idx = day.items.findIndex((i) => i.id === itemId);
            if (idx === -1) return day;
            const targetIdx = direction === 'up' ? idx - 1 : idx + 1;
            if (targetIdx < 0 || targetIdx >= day.items.length) return day;
            const nextItems = [...day.items];
            const [moved] = nextItems.splice(idx, 1);
            nextItems.splice(targetIdx, 0, moved);
            return { ...day, items: nextItems };
          });
          return {
            tripPlan: {
              ...state.tripPlan,
              dailyItinerary: updatedDays,
            },
          };
        });
      },

      removeItineraryItem: (dayNumber, itemId) => {
        set((state) => ({
          tripPlan: {
            ...state.tripPlan,
            dailyItinerary: state.tripPlan.dailyItinerary.map((day) =>
              day.dayNumber === dayNumber
                ? { ...day, items: day.items.filter((i) => i.id !== itemId) }
                : day
            ),
          },
        }));
      },

      addCustomItineraryItem: (dayNumber, title, time, subtitle) => {
        set((state) => ({
          tripPlan: {
            ...state.tripPlan,
            dailyItinerary: state.tripPlan.dailyItinerary.map((day) =>
              day.dayNumber === dayNumber
                ? {
                    ...day,
                    items: [
                      ...day.items,
                      {
                        id: `itin-custom-${Date.now().toString(36)}`,
                        time: time || '18:00',
                        title,
                        subtitle: subtitle || 'Custom traveler stop',
                        category: 'experience',
                        actionType: 'ride',
                        lat: SAMARKAND_DEFAULT_COORDS.lat,
                        lng: SAMARKAND_DEFAULT_COORDS.lng,
                      },
                    ],
                  }
                : day
            ),
          },
        }));
      },

      setPendingCheckoutOption: (option) => {
        set((state) => ({
          tripPlan: {
            ...state.tripPlan,
            pendingCheckoutOption: option,
          },
        }));
      },

      completeTransportBooking: (option, paymentMethod) => {
        const passengerName = get().userProfile.name || 'Anna Becker';
        const newTicket: BookedTicket = {
          id: `ticket-${Date.now().toString(36)}`,
          bookingRef: `UZ-${Math.floor(1000 + Math.random() * 9000)}`,
          type: option.type === 'waitlist' ? 'train' : option.type,
          title: `${option.fromCode} → ${option.toCode}`,
          subtitle: `${option.date} · ${option.departureTime} · ${option.seatOrWagon || 'Seat 14A'}`,
          fromCity: option.fromCity,
          toCity: option.toCity,
          fromCode: option.fromCode,
          toCode: option.toCode,
          date: option.date,
          departureTime: option.departureTime,
          arrivalTime: option.arrivalTime,
          provider: `${option.provider} (${paymentMethod} Demo)`,
          priceUsd: option.priceUsd,
          priceUzs: option.priceUzs,
          seatOrWagon: option.seatOrWagon || 'Seat 14A',
          passengerName,
          driverDetails: option.driverDetails,
          status: 'CONFIRMED',
          qrPayload: `UZ-TICKET-${option.fromCode}-${option.toCode}-${option.date}-${passengerName}-${Date.now()}`,
          isDemoBooking: true,
          createdAt: new Date().toISOString(),
        };

        set((state) => ({
          tripPlan: {
            ...state.tripPlan,
            bookedTickets: [newTicket, ...state.tripPlan.bookedTickets],
          },
        }));

        return newTicket;
      },

      buyMonumentTicket: (monument) => {
        const passengerName = get().userProfile.name || 'Anna Becker';
        const ticket: BookedTicket = {
          id: `ticket-mon-${monument.id}-${Date.now().toString(36)}`,
          bookingRef: `QR-${Math.floor(1000 + Math.random() * 9000)}`,
          type: 'monument',
          title: `${monument.title} · Skip-the-line`,
          subtitle: `Oct 25 · 10:30 · ${monument.priceUzs.toLocaleString('en-US')} UZS`,
          fromCity: monument.city,
          toCity: monument.title,
          fromCode: monument.city.slice(0, 3).toUpperCase(),
          toCode: 'QR',
          date: 'Oct 25',
          departureTime: '10:30',
          provider: 'Uzbekistan Cultural Heritage Pass',
          priceUsd: monument.priceUsd,
          priceUzs: monument.priceUzs,
          seatOrWagon: 'Skip-the-line QR Entry',
          passengerName,
          status: 'CONFIRMED',
          qrPayload: `UZ-MONUMENT-${monument.id.toUpperCase()}-${passengerName}-${Date.now()}`,
          isDemoBooking: true,
          createdAt: new Date().toISOString(),
        };

        set((state) => ({
          tripPlan: {
            ...state.tripPlan,
            bookedTickets: [ticket, ...state.tripPlan.bookedTickets],
          },
        }));

        return ticket;
      },

      joinTicketHunterWaitlist: (fromCity, toCity, date, trainName = 'Afrosiyob 08:00') => {
        const entry: TicketHunterWaitlistEntry = {
          id: `waitlist-${Date.now().toString(36)}`,
          fromCity,
          toCity,
          date,
          trainName,
          status: 'MONITORING_DEMO',
          createdAt: new Date().toISOString(),
        };

        set((state) => ({
          tripPlan: {
            ...state.tripPlan,
            ticketHunterWaitlist: [entry, ...state.tripPlan.ticketHunterWaitlist],
          },
        }));

        return entry;
      },

      cancelBooking: (ticketId) => {
        set((state) => ({
          tripPlan: {
            ...state.tripPlan,
            bookedTickets: state.tripPlan.bookedTickets.filter((t) => t.id !== ticketId),
          },
        }));
      },

      selectAndBookHotel: (hotelId) => {
        const found = CURATED_HOTELS.find((h) => h.id === hotelId);
        if (!found) return null;

        const booked: BookedHotel = {
          ...found,
          status: 'BOOKED',
        };

        set((state) => ({
          tripPlan: {
            ...state.tripPlan,
            bookedHotels: [
              booked,
              ...state.tripPlan.bookedHotels.filter((h) => h.id !== hotelId),
            ],
          },
          activeDestination: {
            name: booked.name,
            subtitle: booked.address,
            lat: booked.lat,
            lng: booked.lng,
            distanceMeters: 620,
          },
        }));

        return booked;
      },

      addCustomHotelBooking: (hotel) => {
        set((state) => ({
          tripPlan: {
            ...state.tripPlan,
            bookedHotels: [hotel, ...state.tripPlan.bookedHotels.filter((h) => h.id !== hotel.id)],
          },
        }));
      },

      setActiveDestination: (dest) => {
        set({ activeDestination: dest });
      },

      setHeartbeatActive: (active) => {
        set((state) => ({
          safetyState: {
            ...state.safetyState,
            isHeartbeatActive: active,
            heartbeatLastUpdated: active ? 'Just now' : state.safetyState.heartbeatLastUpdated,
          },
        }));
      },

      setHeartbeatInterval: (minutes) => {
        set((state) => ({
          safetyState: {
            ...state.safetyState,
            intervalMinutes: minutes,
          },
        }));
      },

      updateDeadMansSwitchConfig: (config) => {
        set((state) => ({
          safetyState: {
            ...state.safetyState,
            trekkingMode: config.trekkingMode,
            intervalMinutes: config.intervalMinutes,
            noMovementHours: Math.min(24, Math.max(1, config.noMovementHours)),
            highRiskZones: config.highRiskZones,
          },
        }));
      },

      recordLocationPing: (ping) => {
        const now = new Date();
        const timeLabel = `${String(now.getHours()).padStart(2, '0')}:${String(
          now.getMinutes()
        ).padStart(2, '0')}`;

        set((state) => {
          const newEntry = {
            id: `ping-${Date.now().toString(36)}`,
            timeLabel,
            lat: Number(ping.lat.toFixed(4)),
            lng: Number(ping.lng.toFixed(4)),
            accuracy: ping.accuracy,
            battery: ping.battery,
            status:
              state.safetyState.connectivityStatus === 'ONLINE'
                ? ('Synced' as const)
                : ('Queued offline' as const),
            source: ping.source,
          };

          return {
            safetyState: {
              ...state.safetyState,
              lastKnownLocation: {
                lat: newEntry.lat,
                lng: newEntry.lng,
                accuracy: newEntry.accuracy,
                timestamp: 'Just now',
                battery: ping.battery,
                source: ping.source,
              },
              locationHistory: [newEntry, ...state.safetyState.locationHistory.slice(0, 9)],
              heartbeatLastUpdated: 'Just now',
              permissionStatus: ping.source === 'GPS' ? 'GRANTED' : state.safetyState.permissionStatus,
            },
          };
        });
      },

      setConnectivityStatus: (status) => {
        set((state) => ({
          safetyState: {
            ...state.safetyState,
            connectivityStatus: status,
          },
        }));
      },

      startSosWarningCountdown: (isTestMode = true, seconds = 10) => {
        set((state) => ({
          safetyState: {
            ...state.safetyState,
            sosCountdownActive: true,
            sosCountdownSeconds: seconds,
            sosStatus: 'WARNING_PROMPT',
            isTestMode,
            lastSosOutcome: isTestMode
              ? 'Test alarm started (10s countdown)'
              : 'Safety check countdown started',
          },
        }));
      },

      tickSosCountdown: () => {
        const { safetyState } = get();
        if (!safetyState.sosCountdownActive) return;

        if (safetyState.sosCountdownSeconds <= 1) {
          set((state) => ({
            safetyState: {
              ...state.safetyState,
              sosCountdownActive: false,
              sosCountdownSeconds: 0,
              sosStatus: 'SOS_DISPATCHED',
              lastSosOutcome: state.safetyState.isTestMode
                ? 'Simulated test SOS dispatched (no real 112 call placed)'
                : 'Emergency alert recorded',
            },
          }));
        } else {
          set((state) => ({
            safetyState: {
              ...state.safetyState,
              sosCountdownSeconds: state.safetyState.sosCountdownSeconds - 1,
            },
          }));
        }
      },

      cancelSosAlarm: () => {
        set((state) => ({
          safetyState: {
            ...state.safetyState,
            sosCountdownActive: false,
            sosCountdownSeconds: 10,
            sosStatus: 'SAFE',
            lastSosOutcome: 'Alarm canceled by traveler ("I’m safe")',
          },
        }));
      },

      triggerSosDispatch: () => {
        set((state) => ({
          safetyState: {
            ...state.safetyState,
            sosCountdownActive: false,
            sosCountdownSeconds: 0,
            sosStatus: 'SOS_DISPATCHED',
            lastSosOutcome: state.safetyState.isTestMode
              ? 'Simulated test SOS dispatched (no real 112 call placed)'
              : 'Simulated SOS dispatch recorded',
          },
        }));
      },

      uploadEMehmonSlip: (recordId, metadata) => {
        set((state) => ({
          eMehmonRecords: state.eMehmonRecords.map((rec) =>
            rec.id === recordId
              ? {
                  ...rec,
                  verificationStatus: 'USER_UPLOADED',
                  uploadedSlipMetadata: metadata,
                  uploadedAt: metadata.uploadedAt,
                }
              : rec
          ),
        }));
      },

      removeEMehmonSlip: (recordId) => {
        set((state) => ({
          eMehmonRecords: state.eMehmonRecords.map((rec) =>
            rec.id === recordId
              ? {
                  ...rec,
                  verificationStatus: 'MISSING',
                  uploadedSlipMetadata: null,
                  uploadedAt: null,
                }
              : rec
          ),
        }));
      },

      markHotelAskedForEMehmon: (recordId) => {
        set((state) => ({
          eMehmonRecords: state.eMehmonRecords.map((rec) =>
            rec.id === recordId
              ? {
                  ...rec,
                  hotelAskedAt: new Date().toISOString(),
                }
              : rec
          ),
        }));
      },

      selectAudioTrack: (trackId) => {
        const track = AUDIO_GUIDE_TRACKS.find((t) => t.id === trackId) || AUDIO_GUIDE_TRACKS[0];
        set((state) => ({
          audioPlayer: {
            ...state.audioPlayer,
            currentTrackId: track.id,
            progressSeconds: 0,
            durationSeconds: track.durationSeconds,
            isPlaying: true,
          },
        }));
      },

      toggleAudioPlay: () => {
        set((state) => ({
          audioPlayer: {
            ...state.audioPlayer,
            isPlaying: !state.audioPlayer.isPlaying,
          },
        }));
      },

      stopAudioPlay: () => {
        set((state) => ({
          audioPlayer: {
            ...state.audioPlayer,
            isPlaying: false,
            progressSeconds: 0,
          },
        }));
      },

      seekAudio: (deltaOrAbsoluteSeconds, isRelative = true) => {
        set((state) => {
          const next = isRelative
            ? state.audioPlayer.progressSeconds + deltaOrAbsoluteSeconds
            : deltaOrAbsoluteSeconds;
          const clamped = Math.max(0, Math.min(state.audioPlayer.durationSeconds, Math.round(next)));
          return {
            audioPlayer: {
              ...state.audioPlayer,
              progressSeconds: clamped,
            },
          };
        });
      },

      setAudioLanguage: (lang) => {
        set((state) => ({
          audioPlayer: {
            ...state.audioPlayer,
            language: lang,
          },
        }));
      },

      toggleAudioTranscript: () => {
        set((state) => ({
          audioPlayer: {
            ...state.audioPlayer,
            showTranscript: !state.audioPlayer.showTranscript,
          },
        }));
      },

      sendConciergeMessage: (text) => {
        const trimmed = text.trim();
        if (!trimmed) return;

        const now = new Date();
        const timeStr = `${String(now.getHours()).padStart(2, '0')}:${String(
          now.getMinutes()
        ).padStart(2, '0')}`;
        const passengerName = get().userProfile.name || 'Anna Becker';

        const userMsg: ConciergeMessage = {
          id: `cmsg-u-${Date.now().toString(36)}`,
          sender: 'user',
          senderName: passengerName,
          text: trimmed,
          timestamp: timeStr,
        };

        const reply = ConciergeService.generateReply(trimmed, passengerName);
        const replyMsg: ConciergeMessage = {
          id: `cmsg-a-${Date.now().toString(36)}-r`,
          sender: 'concierge',
          senderName: 'Dilnoza',
          text: reply.replyText,
          timestamp: timeStr,
          voucherCard: reply.voucherCard,
        };

        set((state) => ({
          conciergeMessages: [...state.conciergeMessages, userMsg, replyMsg],
          tripPlan: reply.newTicket
            ? {
                ...state.tripPlan,
                bookedTickets: [reply.newTicket, ...state.tripPlan.bookedTickets],
              }
            : state.tripPlan,
        }));
      },

      createB2BListing: (input) => {
        const newListing: B2BListing = {
          id: `b2b-${Date.now().toString(36)}`,
          merchantId: 'merch-plov-house',
          name: input.name.trim(),
          city: input.city || 'Samarkand',
          category: input.category,
          description:
            input.description ||
            `${input.category} in ${input.city} · Languages: ${input.languages.join(', ')}`,
          address: `${input.city} Old Town Center`,
          lat: SAMARKAND_DEFAULT_COORDS.lat + (Math.random() - 0.5) * 0.008,
          lng: SAMARKAND_DEFAULT_COORDS.lng + (Math.random() - 0.5) * 0.008,
          services: [input.name.trim()],
          priceLabel: input.priceLabel || '50,000 UZS',
          priceUzs: 50000,
          priceUsd: 4,
          openingHours: '09:00–21:00',
          dietaryTags:
            input.dietaryTags && input.dietaryTags.length > 0
              ? input.dietaryTags
              : input.category === 'Restaurant'
                ? ['Halal', 'Hygiene-verified', 'Vegetarian']
                : [],
          languages: input.languages,
          images: [],
          artworkVariant:
            input.category === 'Restaurant'
              ? 'terracotta'
              : input.category === 'Guide'
                ? 'blue-arch'
                : 'rose-arch',
          contactInfo: '+998 90 123 45 67',
          verificationStatus: 'PENDING_VERIFICATION',
          promoteInAiItinerary: true,
          licenseFileName: input.licenseFileName,
          createdAt: new Date().toISOString(),
          isActive: true,
        };

        set((state) => {
          const updatedB2B = [newListing, ...state.b2bListings];
          const updatedItinerary = ItineraryService.generateItinerary(
            state.tripPlan.selectedCities,
            state.tripPlan.travelDates.startDate,
            state.userProfile.preferences.pacing,
            updatedB2B
          );

          return {
            b2bListings: updatedB2B,
            merchantState: {
              ...state.merchantState,
              businessName: input.name.trim(),
              city: input.city,
              category: input.category,
              languages: input.languages,
              licenseFileName: input.licenseFileName || state.merchantState.licenseFileName,
              aiItineraryViews: state.merchantState.aiItineraryViews + 15,
            },
            tripPlan: {
              ...state.tripPlan,
              dailyItinerary: updatedItinerary,
            },
          };
        });

        return newListing;
      },

      updateB2BListing: (id, partial) => {
        set((state) => {
          const updatedB2B = state.b2bListings.map((b) => (b.id === id ? { ...b, ...partial } : b));
          return {
            b2bListings: updatedB2B,
            tripPlan: {
              ...state.tripPlan,
              dailyItinerary: ItineraryService.generateItinerary(
                state.tripPlan.selectedCities,
                state.tripPlan.travelDates.startDate,
                state.userProfile.preferences.pacing,
                updatedB2B
              ),
            },
          };
        });
      },

      toggleB2BListingActive: (id) => {
        set((state) => {
          const updatedB2B = state.b2bListings.map((b) =>
            b.id === id ? { ...b, isActive: !b.isActive } : b
          );
          return {
            b2bListings: updatedB2B,
            tripPlan: {
              ...state.tripPlan,
              dailyItinerary: ItineraryService.generateItinerary(
                state.tripPlan.selectedCities,
                state.tripPlan.travelDates.startDate,
                state.userProfile.preferences.pacing,
                updatedB2B
              ),
            },
          };
        });
      },

      toggleB2BPromoteInAi: (id) => {
        set((state) => {
          const updatedB2B = state.b2bListings.map((b) =>
            b.id === id
              ? {
                  ...b,
                  promoteInAiItinerary: !b.promoteInAiItinerary,
                  isActive: !b.promoteInAiItinerary ? true : b.isActive,
                }
              : b
          );
          return {
            b2bListings: updatedB2B,
            tripPlan: {
              ...state.tripPlan,
              dailyItinerary: ItineraryService.generateItinerary(
                state.tripPlan.selectedCities,
                state.tripPlan.travelDates.startDate,
                state.userProfile.preferences.pacing,
                updatedB2B
              ),
            },
          };
        });
      },

      deleteB2BListing: (id) => {
        set((state) => {
          const updatedB2B = state.b2bListings.filter((b) => b.id !== id);
          return {
            b2bListings: updatedB2B,
            tripPlan: {
              ...state.tripPlan,
              dailyItinerary: ItineraryService.generateItinerary(
                state.tripPlan.selectedCities,
                state.tripPlan.travelDates.startDate,
                state.userProfile.preferences.pacing,
                updatedB2B
              ),
            },
          };
        });
      },

      boostMerchantVisibility: () => {
        set((state) => ({
          merchantState: {
            ...state.merchantState,
            isBoosted: !state.merchantState.isBoosted,
            aiItineraryViews: state.merchantState.isBoosted
              ? state.merchantState.aiItineraryViews
              : state.merchantState.aiItineraryViews + 45,
          },
        }));
      },

      redeemTouristVoucher: (voucherId) => {
        set((state) => {
          const activeVoucher =
            state.merchantState.vouchers[state.merchantState.activeVoucherIndex] ||
            state.merchantState.vouchers[0];
          const targetId = voucherId || activeVoucher?.id;
          if (!targetId) return state;

          const target = state.merchantState.vouchers.find((v) => v.id === targetId);
          if (!target || target.isRedeemed) return state;

          return {
            merchantState: {
              ...state.merchantState,
              vouchersRedeemed: state.merchantState.vouchersRedeemed + 1,
              vouchers: state.merchantState.vouchers.map((v) =>
                v.id === targetId ? { ...v, isRedeemed: true } : v
              ),
            },
          };
        });
      },

      nextTouristVoucher: () => {
        set((state) => ({
          merchantState: {
            ...state.merchantState,
            activeVoucherIndex:
              (state.merchantState.activeVoucherIndex + 1) % state.merchantState.vouchers.length,
          },
        }));
      },

      resetDemoData: () => {
        set(createInitialState());
      },
    }),
    {
      name: 'uzbekistan-travel-companion-v1',
      version: 1,
      storage: createJSONStorage(() => localStorage),
      // Persist durable data; exclude transient countdown timers and toasts
      partialize: (state) => ({
        userProfile: state.userProfile,
        tripPlan: state.tripPlan,
        safetyState: {
          ...state.safetyState,
          sosCountdownActive: false,
          sosCountdownSeconds: 10,
        },
        eMehmonRecords: state.eMehmonRecords,
        b2bListings: state.b2bListings,
        merchantState: state.merchantState,
        conciergeMessages: state.conciergeMessages,
        activeDestination: state.activeDestination,
      }),
      migrate: (persistedState: unknown, version: number) => {
        if (version === 0 || !persistedState || typeof persistedState !== 'object') {
          return createInitialState();
        }
        return persistedState as AppStoreState;
      },
    }
  )
);
