import React from 'react';
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import { PhoneShell } from '../components/common/PhoneShell';
import {
  ScreenC1ESim,
  ScreenC2ArrivalTransfer,
  ScreenC3AtmRadar,
} from '../screens/arrival/ArrivalScreens';
import {
  ScreenD1Home,
  ScreenD2ExploreMap,
  ScreenD3PlaceDetail,
  ScreenD4YandexGoLink,
  ScreenD5FoodPlovTimer,
  ScreenD6AIMenuScanner,
  ScreenD7OfflineWalking,
} from '../screens/home/HomeAndExploreScreens';
import {
  ScreenH1MerchantHome,
  ScreenH2MerchantListings,
  ScreenH3MerchantScanVoucher,
  ScreenH4MerchantRegister,
} from '../screens/merchant/MerchantScreens';
import {
  ScreenA1Welcome,
  ScreenA2SignIn,
  ScreenA3AboutYou,
  ScreenA4VisaCustoms,
  ScreenA5OfficialUpdates,
} from '../screens/onboarding/OnboardingScreens';
import {
  ScreenF1SafetyHub,
  ScreenF2DeadMansSwitch,
  ScreenF3AreYouSafe,
  ScreenF4SosSent,
  ScreenF5EMehmonTracker,
  ScreenF6MedicineMapper,
  ScreenF7EmergencyProfile,
} from '../screens/safety/SafetyAndMedicalScreens';
import {
  ScreenG1Plans,
  ScreenG2VipConcierge,
  ScreenG3Profile,
} from '../screens/subscriptions/PlansAndProfileScreens';
import {
  ScreenB1ChooseCities,
  ScreenB2DaysPacing,
  ScreenB3TransportFallback,
  ScreenB4Checkout,
  ScreenB5Hotels,
  ScreenB6TripSummary,
} from '../screens/trip-planner/TripPlannerScreens';
import {
  ScreenE1AudioGuide,
  ScreenE2Tickets,
  ScreenE3FairPriceBazaar,
  ScreenE4OfflineWallet,
  ScreenE5MyTrip,
} from '../screens/wallet/GuidesAndWalletScreens';

export const AppRoutesContent: React.FC = () => {
  return (
    <PhoneShell>
      <Routes>
        <Route path="/" element={<Navigate to="/onboarding/welcome" replace />} />

        {/* Module A: Onboarding & Visa (A1-A5) */}
        <Route path="/onboarding/welcome" element={<ScreenA1Welcome />} />
        <Route path="/onboarding/sign-in" element={<ScreenA2SignIn />} />
        <Route path="/onboarding/about-you" element={<ScreenA3AboutYou />} />
        <Route path="/onboarding/visa" element={<ScreenA4VisaCustoms />} />
        <Route path="/official-updates" element={<ScreenA5OfficialUpdates />} />

        {/* Module B: Trip Planner, Transport, Checkout, Hotels & Summary (B1-B6) */}
        <Route path="/planner/cities" element={<ScreenB1ChooseCities />} />
        <Route path="/planner/days" element={<ScreenB2DaysPacing />} />
        <Route path="/planner/transport" element={<ScreenB3TransportFallback />} />
        <Route path="/planner/checkout" element={<ScreenB4Checkout />} />
        <Route path="/planner/hotels" element={<ScreenB5Hotels />} />
        <Route path="/planner/summary" element={<ScreenB6TripSummary />} />

        {/* Module C: Arrival, eSIM & ATM Radar (C1-C3) */}
        <Route path="/esim" element={<ScreenC1ESim />} />
        <Route path="/arrival" element={<ScreenC2ArrivalTransfer />} />
        <Route path="/atm-radar" element={<ScreenC3AtmRadar />} />

        {/* Module D: Home, Explore, Place Detail, Yandex Go, Food, Menu Scanner, Walking (D1-D7) */}
        <Route path="/home" element={<ScreenD1Home />} />
        <Route path="/explore" element={<ScreenD2ExploreMap />} />
        <Route path="/place/:id" element={<ScreenD3PlaceDetail />} />
        <Route path="/yandex-go" element={<ScreenD4YandexGoLink />} />
        <Route path="/food" element={<ScreenD5FoodPlovTimer />} />
        <Route path="/menu-scanner" element={<ScreenD6AIMenuScanner />} />
        <Route path="/walking" element={<ScreenD7OfflineWalking />} />

        {/* Module E: Audio Guide, Tickets, Bazaar, Wallet & My Trip (E1-E5) */}
        <Route path="/audio-guide" element={<ScreenE1AudioGuide />} />
        <Route path="/tickets" element={<ScreenE2Tickets />} />
        <Route path="/bazaar" element={<ScreenE3FairPriceBazaar />} />
        <Route path="/wallet" element={<ScreenE4OfflineWallet />} />
        <Route path="/trip" element={<ScreenE5MyTrip />} />

        {/* Module F: Safety Hub, Dead Man's Switch, SOS, E-Mehmon, Pharmacy, Emergency Profile (F1-F7) */}
        <Route path="/safety" element={<ScreenF1SafetyHub />} />
        <Route path="/safety/dead-mans-switch" element={<ScreenF2DeadMansSwitch />} />
        <Route path="/safety/are-you-safe" element={<ScreenF3AreYouSafe />} />
        <Route path="/safety/sos-sent" element={<ScreenF4SosSent />} />
        <Route path="/e-mehmon" element={<ScreenF5EMehmonTracker />} />
        <Route path="/pharmacy" element={<ScreenF6MedicineMapper />} />
        <Route path="/emergency-profile" element={<ScreenF7EmergencyProfile />} />

        {/* Module G: Plans, VIP Concierge & Profile (G1-G3) */}
        <Route path="/plans" element={<ScreenG1Plans />} />
        <Route path="/concierge" element={<ScreenG2VipConcierge />} />
        <Route path="/profile" element={<ScreenG3Profile />} />

        {/* Module H: B2B Merchant Portal (H1-H4) */}
        <Route path="/merchant" element={<ScreenH1MerchantHome />} />
        <Route path="/merchant/listings" element={<ScreenH2MerchantListings />} />
        <Route path="/merchant/scan" element={<ScreenH3MerchantScanVoucher />} />
        <Route path="/merchant/register" element={<ScreenH4MerchantRegister />} />

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/home" replace />} />
      </Routes>
    </PhoneShell>
  );
};

export const AppRouter: React.FC = () => {
  return (
    <BrowserRouter
      future={{
        v7_startTransition: true,
        v7_relativeSplatPath: true,
      }}
    >
      <AppRoutesContent />
    </BrowserRouter>
  );
};
