-- ============================================================================
-- Uzbekistan Travel Companion (TourMe) — Production PostgreSQL / Supabase Schema
-- Compliant with Uzbekistan Personal Data Law (O'RQ-547) & GDPR
-- ============================================================================

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. Users & Travelers Profile Table
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email TEXT UNIQUE,
  full_name TEXT NOT NULL DEFAULT 'Anna Becker',
  nationality TEXT NOT NULL DEFAULT 'Germany',
  visa_status TEXT NOT NULL DEFAULT 'VISA_FREE_30_DAYS',
  tier TEXT NOT NULL DEFAULT 'FREE' CHECK (tier IN ('FREE', 'PRO', 'VIP')),
  preferred_language TEXT NOT NULL DEFAULT 'English',
  blood_type TEXT DEFAULT 'O+',
  allergies TEXT DEFAULT 'Penicillin',
  emergency_contact_name TEXT,
  emergency_contact_phone TEXT,
  emergency_contact_relation TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 2. Legal & Personal Data Consents Log (Terms of Use, Privacy Policy, GPS, Camera)
CREATE TABLE IF NOT EXISTS public.user_consents (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  terms_of_use_accepted BOOLEAN NOT NULL DEFAULT TRUE,
  privacy_policy_accepted BOOLEAN NOT NULL DEFAULT TRUE,
  personal_data_processing_accepted BOOLEAN NOT NULL DEFAULT TRUE,
  gps_tracking_consent BOOLEAN NOT NULL DEFAULT TRUE,
  camera_ocr_consent BOOLEAN NOT NULL DEFAULT TRUE,
  policy_version TEXT NOT NULL DEFAULT '2026.10-v2',
  accepted_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  user_agent TEXT
);

-- 3. Booked Transport Tickets (Afrosiyob, Sharq, Flights, Private Transfers)
CREATE TABLE IF NOT EXISTS public.booked_tickets (
  id TEXT PRIMARY KEY,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  booking_ref TEXT NOT NULL,
  type TEXT NOT NULL,
  provider TEXT NOT NULL,
  origin TEXT NOT NULL,
  destination TEXT NOT NULL,
  travel_date TEXT NOT NULL,
  departure_time TEXT NOT NULL,
  arrival_time TEXT NOT NULL,
  passenger_name TEXT NOT NULL,
  seat_or_wagon TEXT,
  price_usd NUMERIC(10, 2) NOT NULL DEFAULT 0,
  status TEXT NOT NULL DEFAULT 'CONFIRMED',
  qr_payload TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 4. Booked Hotels & Coordinates
CREATE TABLE IF NOT EXISTS public.booked_hotels (
  id TEXT PRIMARY KEY,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  city TEXT NOT NULL,
  address TEXT NOT NULL,
  lat DOUBLE PRECISION NOT NULL,
  lng DOUBLE PRECISION NOT NULL,
  check_in TEXT NOT NULL,
  check_out TEXT NOT NULL,
  price_per_night_usd NUMERIC(10, 2) NOT NULL,
  e_mehmon_ready BOOLEAN NOT NULL DEFAULT TRUE,
  status TEXT NOT NULL DEFAULT 'CONFIRMED',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 5. E-Mehmon Registration Compliance Records
CREATE TABLE IF NOT EXISTS public.emehmon_records (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  stay_date TEXT NOT NULL,
  date_label TEXT NOT NULL,
  hotel_name TEXT NOT NULL,
  verification_status TEXT NOT NULL CHECK (
    verification_status IN ('OFFICIALLY_VERIFIED', 'USER_UPLOADED_RECEIPT', 'MISSING')
  ),
  slip_file_name TEXT,
  uploaded_at TIMESTAMPTZ
);

-- 6. B2B Merchant Portal Listings
CREATE TABLE IF NOT EXISTS public.b2b_listings (
  id TEXT PRIMARY KEY,
  merchant_id TEXT NOT NULL,
  name TEXT NOT NULL,
  city TEXT NOT NULL,
  category TEXT NOT NULL,
  description TEXT NOT NULL,
  address TEXT NOT NULL,
  lat DOUBLE PRECISION NOT NULL,
  lng DOUBLE PRECISION NOT NULL,
  price_label TEXT NOT NULL,
  opening_hours TEXT NOT NULL,
  dietary_tags TEXT[] DEFAULT '{}',
  languages TEXT[] DEFAULT '{}',
  verification_status TEXT NOT NULL DEFAULT 'PENDING_REVIEW',
  is_active BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 7. Safety Heartbeat & SOS Audit Log
CREATE TABLE IF NOT EXISTS public.safety_telemetry (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  event_type TEXT NOT NULL,
  lat DOUBLE PRECISION NOT NULL,
  lng DOUBLE PRECISION NOT NULL,
  accuracy DOUBLE PRECISION,
  battery_percent INTEGER,
  is_test_mode BOOLEAN NOT NULL DEFAULT FALSE,
  recorded_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
