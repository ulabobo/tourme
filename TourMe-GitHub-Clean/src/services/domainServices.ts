import {
  ATMPoint,
  AudioTrack,
  B2BListing,
  BazaarItem,
  BookedHotel,
  BookedTicket,
  ConciergeMessage,
  ESimPlan,
  ItineraryDay,
  ItineraryItem,
  MedicineEquivalent,
  OfficialUpdateItem,
  PacingType,
  PharmacyLocation,
  POIItem,
  SelectedCity,
  SubscriptionTier,
  TransportOption,
} from '../types/domain';
import {
  buildYandexGoLinks,
  calculateHaversineMeters,
  estimateUzbekistanTaxiFare,
  SAMARKAND_DEFAULT_COORDS,
} from '../utils/geo';

// ============================================================================
// 1. CURATED DATA SEEDING (MATCHING ALL 40 PNG SCREENSHOTS)
// ============================================================================

export const INITIAL_CITIES: SelectedCity[] = [
  {
    id: 'tashkent',
    name: 'Tashkent',
    daysAllocated: 1,
    selected: true,
    color: '#9BB1F2',
    cardVariant: 'tashkent',
    tagline: 'Modern capital, Soviet metro & Chorsu bazaar',
    dailyCostUsd: 55,
    categories: ['History', 'Gastronomy', 'Photography'],
    lat: 41.2995,
    lng: 69.2401,
  },
  {
    id: 'samarkand',
    name: 'Samarkand',
    daysAllocated: 3,
    selected: true,
    color: '#F3A678',
    cardVariant: 'samarkand',
    tagline: '5 days of domes, blue tiles & plov',
    dailyCostUsd: 65,
    categories: ['History', 'Gastronomy', 'Photography', 'Crafts'],
    lat: 39.6542,
    lng: 66.9597,
  },
  {
    id: 'bukhara',
    name: 'Bukhara',
    daysAllocated: 3,
    selected: true,
    color: '#C3A2F4',
    cardVariant: 'bukhara',
    tagline: '4 days of bazaars, pools & madrasas',
    dailyCostUsd: 55,
    categories: ['History', 'Crafts', 'Wellness', 'Gastronomy'],
    lat: 39.7747,
    lng: 64.4286,
  },
  {
    id: 'khiva',
    name: 'Khiva',
    daysAllocated: 1,
    selected: true,
    color: '#F79FA9',
    cardVariant: 'khiva',
    tagline: '2 days inside a walled desert city',
    dailyCostUsd: 50,
    categories: ['History', 'Photography', 'Nature'],
    lat: 41.3775,
    lng: 60.3619,
  },
];

export const OFFICIAL_UPDATES: OfficialUpdateItem[] = [
  {
    id: 'upd-1',
    source: 'Tourism Committee',
    dateLabel: 'Oct 17',
    title: 'New audio-guide route opens in Bukhara',
    summary: 'Official update for visitors to the old city.',
    details:
      'The Uzbekistan Tourism Committee has launched 14 new QR-enabled audio guide stops around Lyab-i Hauz and Po-i-Kalyan in Bukhara, available offline in English, German, Russian, and Uzbek.',
  },
  {
    id: 'upd-2',
    source: 'Visa (MFA)',
    dateLabel: 'Oct 15',
    title: 'e-Visa portal: processing times updated',
    summary: 'Check the latest rules before you apply.',
    details:
      'Standard e-Visa applications on e-visa.gov.uz are processed within 2–3 working days. Citizens of 90+ countries (including EU, UK, Japan) enjoy 30-day visa-free entry without an e-Visa.',
  },
  {
    id: 'upd-3',
    source: 'Tourism Committee',
    dateLabel: 'Oct 12',
    title: 'Winter opening hours for main monuments',
    summary: 'Several sites close earlier from November.',
    details:
      'Starting November 1, major architectural complexes in Samarkand, Bukhara, and Khiva adjust evening closing times from 20:00 to 18:30. Registan Square light shows run at 19:30.',
  },
];

export const ESIM_PLANS: ESimPlan[] = [
  {
    id: 'esim-3gb',
    title: '3 GB · 7 days',
    subtitle: 'Short city break',
    dataGb: 3,
    days: 7,
    priceUsd: 4.5,
  },
  {
    id: 'esim-10gb',
    title: '10 GB · 15 days',
    subtitle: 'Most popular',
    dataGb: 10,
    days: 15,
    priceUsd: 9,
    isPopular: true,
  },
  {
    id: 'esim-20gb',
    title: '20 GB · 30 days',
    subtitle: 'Long trip',
    dataGb: 20,
    days: 30,
    priceUsd: 15,
  },
];

export const CURATED_HOTELS: BookedHotel[] = [
  {
    id: 'hotel-registan-medrese',
    name: 'Registan Medrese Boutique',
    city: 'Samarkand',
    category: 'Medrese hotel',
    rating: 4.9,
    subtitle: 'Samarkand · Old town · Breakfast',
    address: 'Registan St 14, Old Town, Samarkand',
    lat: 39.6551,
    lng: 66.9769,
    pricePerNightUsd: 48,
    checkInDate: '2026-10-23',
    checkOutDate: '2026-10-26',
    checkInTime: '14:00',
    status: 'BOOKED',
    artworkVariant: 'blue-arch',
  },
  {
    id: 'hotel-silk-road-guest',
    name: 'Silk Road Guest House',
    city: 'Samarkand',
    category: 'Guest house',
    rating: 4.7,
    subtitle: 'Samarkand · Family-run',
    address: 'Tashkent St 42, Samarkand',
    lat: 39.6584,
    lng: 66.9781,
    pricePerNightUsd: 29,
    checkInDate: '2026-10-23',
    checkOutDate: '2026-10-26',
    checkInTime: '14:00',
    status: 'SAVED',
    artworkVariant: 'rose-arch',
  },
  {
    id: 'hotel-aydarkul-yurt',
    name: 'Aydarkul Desert Yurt Camp',
    city: 'Samarkand',
    category: 'Yurt camp',
    rating: 4.8,
    subtitle: 'Aydarkul Lake · Camel trek & dinner',
    address: 'Aydarkul Shore, Nurata District',
    lat: 40.7821,
    lng: 66.8112,
    pricePerNightUsd: 42,
    checkInDate: '2026-10-25',
    checkOutDate: '2026-10-26',
    checkInTime: '15:00',
    status: 'SAVED',
    artworkVariant: 'gold-arch',
  },
  {
    id: 'hotel-bukhara-courtyard',
    name: 'Lyabi-Hauz Medrese Courtyard',
    city: 'Bukhara',
    category: 'Medrese hotel',
    rating: 4.9,
    subtitle: 'Bukhara · Historic Pool · Breakfast',
    address: 'Nakshbandi St 18, Bukhara',
    lat: 39.7732,
    lng: 64.4209,
    pricePerNightUsd: 54,
    checkInDate: '2026-10-26',
    checkOutDate: '2026-10-29',
    checkInTime: '14:00',
    status: 'SAVED',
    artworkVariant: 'blue-arch',
  },
];

export const CURATED_ATMS: ATMPoint[] = [
  {
    id: 'atm-registan-nbu',
    name: 'Nearest ATM · NBU Registan',
    bankName: 'National Bank of Uzbekistan',
    address: 'Registan Square North Gate, Samarkand',
    city: 'Samarkand',
    lat: 39.6556,
    lng: 66.9749,
    isOnline: true,
    cardsSupported: ['Visa', 'Mastercard', 'UnionPay'],
    currencies: ['UZS cash', 'USD cash'],
    mapX: 34,
    mapY: 46,
  },
  {
    id: 'atm-amir-temur-kapital',
    name: 'ATM · Amir Temur St',
    bankName: 'Kapitalbank 24/7',
    address: 'Amir Temur St 19, Samarkand',
    city: 'Samarkand',
    lat: 39.6512,
    lng: 66.9635,
    isOnline: true,
    cardsSupported: ['Visa', 'Mastercard'],
    currencies: ['UZS cash', 'USD cash'],
    mapX: 79,
    mapY: 46,
  },
  {
    id: 'atm-tashkent-st-ipak',
    name: 'ATM · Tashkent St Bazaar',
    bankName: 'Ipak Yuli Bank',
    address: 'Tashkent St 88, Siab Bazaar Gate',
    city: 'Samarkand',
    lat: 39.6609,
    lng: 66.9794,
    isOnline: true,
    cardsSupported: ['Visa', 'UnionPay'],
    currencies: ['UZS cash'],
    mapX: 76,
    mapY: 21,
  },
  {
    id: 'atm-university-blvd',
    name: 'ATM · University Blvd',
    bankName: 'SQB Bank',
    address: 'University Blvd 12, Samarkand',
    city: 'Samarkand',
    lat: 39.6478,
    lng: 66.9602,
    isOnline: false,
    cardsSupported: ['Mastercard', 'UnionPay'],
    currencies: ['UZS cash'],
    mapX: 21,
    mapY: 19,
  },
];

export const CURATED_POIS: POIItem[] = [
  {
    id: 'poi-registan',
    name: 'Registan Square',
    city: 'Samarkand',
    category: 'Monument',
    lat: 39.6547,
    lng: 66.9758,
    rating: 4.9,
    distanceMeters: 350,
    openStatusLabel: 'Open now',
    openingHours: 'Open 08:00–19:00',
    description: 'Three madrasas facing a grand square — the heart of old Samarkand.',
    ticketPriceUzs: 130000,
    priceRangeLabel: '130,000 UZS · Skip-the-line',
    dietaryTags: [],
    serviceTags: ['Historical', 'Monument', 'Audio guide'],
    hasAudioGuide: true,
    audioGuideId: 'audio-registan',
    artworkVariant: 'blue-arch',
    source: 'CURATED_VERIFIED',
    mapX: 36,
    mapY: 44,
  },
  {
    id: 'poi-green-garden-cafe',
    name: 'Green Garden Cafe',
    city: 'Samarkand',
    category: 'Food',
    lat: 39.6562,
    lng: 66.9731,
    rating: 4.8,
    distanceMeters: 420,
    openStatusLabel: 'Open now',
    openingHours: 'Open 09:00–22:00',
    description: 'No meat broth · Vegetarian, Pure Vegan & Gluten-free courtyard dining near Registan.',
    priceRangeLabel: '45,000 – 85,000 UZS',
    dietaryTags: ['Vegetarian', 'Vegan', 'Pure Vegan', 'Gluten-free', 'Hygiene-verified'],
    serviceTags: ['Food', 'Pure Vegan', 'Vegetarian'],
    hasAudioGuide: false,
    artworkVariant: 'lavender',
    source: 'CURATED_VERIFIED',
    mapX: 21,
    mapY: 21,
  },
  {
    id: 'poi-halal-plov-house',
    name: 'Halal Plov House',
    city: 'Samarkand',
    category: 'Food',
    lat: 39.6589,
    lng: 66.9772,
    rating: 4.9,
    distanceMeters: 540,
    openStatusLabel: 'Open now',
    openingHours: 'Open 11:00–16:00',
    description: 'Halal · Hygiene-verified traditional Samarkand zigir plov cooked over wood fire.',
    priceRangeLabel: '40,000 – 60,000 UZS',
    dietaryTags: ['Halal', 'Hygiene-verified', 'Gluten-free'],
    serviceTags: ['Food', 'Halal'],
    hasAudioGuide: false,
    artworkVariant: 'rose-arch',
    source: 'CURATED_VERIFIED',
    mapX: 77,
    mapY: 23,
  },
  {
    id: 'poi-siab-bazaar',
    name: 'Siab Bazaar',
    city: 'Samarkand',
    category: 'Bazaar',
    lat: 39.6615,
    lng: 66.9799,
    rating: 4.7,
    distanceMeters: 680,
    openStatusLabel: 'Open now',
    openingHours: 'Open 07:00–19:00',
    description: 'Samarkand’s oldest covered farmer’s market for dried apricots, saffron, almonds, and non bread.',
    priceRangeLabel: 'Fair-price guide available',
    dietaryTags: ['Vegetarian', 'Vegan', 'Pure Vegan', 'Halal'],
    serviceTags: ['Bazaar', 'Historical'],
    hasAudioGuide: true,
    artworkVariant: 'terracotta',
    source: 'CURATED_VERIFIED',
    mapX: 79,
    mapY: 46,
  },
  {
    id: 'poi-gur-e-amir',
    name: 'Gur-e-Amir Mausoleum',
    city: 'Samarkand',
    category: 'Monument',
    lat: 39.6484,
    lng: 66.9689,
    rating: 4.9,
    distanceMeters: 790,
    openStatusLabel: 'Open now',
    openingHours: 'Open 08:00–19:00',
    description: 'Azure-fluted dome mausoleum of Amir Temur (Tamerlane) and his astronomy-loving grandson Ulugh Beg.',
    ticketPriceUzs: 60000,
    priceRangeLabel: '60,000 UZS · Skip-the-line',
    dietaryTags: [],
    serviceTags: ['Historical', 'Monument', 'Audio guide'],
    hasAudioGuide: true,
    artworkVariant: 'lavender',
    source: 'CURATED_VERIFIED',
    mapX: 52,
    mapY: 31,
  },
  {
    id: 'poi-central-pharmacy',
    name: 'Dori-Darmon 24h Pharmacy',
    city: 'Samarkand',
    category: 'Pharmacy',
    lat: 39.6531,
    lng: 66.9628,
    rating: 4.8,
    distanceMeters: 300,
    openStatusLabel: 'Open 24h',
    openingHours: 'Open 24 hours',
    description: 'Licensed 24-hour pharmacy carrying international generics (Ibuprofen, Loperamide, Paracetamol, Loratadine).',
    priceRangeLabel: '10,000 – 45,000 UZS',
    dietaryTags: [],
    serviceTags: ['Pharmacy'],
    hasAudioGuide: false,
    artworkVariant: 'blue-arch',
    source: 'CURATED_VERIFIED',
    mapX: 64,
    mapY: 37,
  },
];

export const MONUMENT_TICKETS_CATALOG = [
  {
    id: 'mon-registan',
    title: 'Registan Square',
    city: 'Samarkand',
    priceUzs: 130000,
    priceUsd: 10.5,
    artworkVariant: 'blue-arch' as const,
  },
  {
    id: 'mon-gur-e-amir',
    title: 'Gur-e-Amir Mausoleum',
    city: 'Samarkand',
    priceUzs: 60000,
    priceUsd: 5.0,
    artworkVariant: 'lavender' as const,
  },
  {
    id: 'mon-ark-fortress',
    title: 'Ark Fortress',
    city: 'Bukhara',
    priceUzs: 70000,
    priceUsd: 5.5,
    artworkVariant: 'rose-arch' as const,
  },
  {
    id: 'mon-itchan-kala',
    title: 'Itchan Kala',
    city: 'Khiva',
    priceUzs: 150000,
    priceUsd: 12.0,
    artworkVariant: 'terracotta' as const,
  },
];

export const BAZAAR_ITEMS_CATALOG: BazaarItem[] = [
  {
    id: 'baz-apricots',
    name: 'Dried apricots (1 kg)',
    category: 'Dried fruit',
    fairMinUzs: 60000,
    fairMaxUzs: 90000,
    touristPriceUzs: 150000,
    uzbekPhrase: '“Bu qancha turadi?”',
    uzbekMeaning: 'How much does this cost? · Biroz arzonroq bering (Give a slight discount)',
    russianPhrase: '«Сколько это стоит? Давайте за 70 тысяч.»',
    confidence: '94% match · Siab & Chorsu Bazaar verified',
    greenBarStartPct: 20,
    greenBarWidthPct: 34,
  },
  {
    id: 'baz-ceramic-plate',
    name: 'Ceramic plate (medium)',
    category: 'Ceramics',
    fairMinUzs: 80000,
    fairMaxUzs: 140000,
    touristPriceUzs: 300000,
    uzbekPhrase: '“Bu qancha turadi?”',
    uzbekMeaning: 'Rishtan / Gijduvan hand-painted plate (25cm)',
    russianPhrase: '«Это ручная работа из Риштана? Какая крайняя цена?»',
    confidence: '91% match · Rishtan & Samarkand workshops',
    greenBarStartPct: 25,
    greenBarWidthPct: 30,
  },
  {
    id: 'baz-suzani',
    name: 'Suzani wall piece (small)',
    category: 'Suzani',
    fairMinUzs: 400000,
    fairMaxUzs: 700000,
    touristPriceUzs: 1200000,
    uzbekPhrase: '“Bu qancha turadi?”',
    uzbekMeaning: 'Silk-on-cotton hand embroidery (check back stitches for handwork)',
    russianPhrase: '«Это ручная вышивка шелком? Уступите немного.»',
    confidence: '89% match · Bukhara & Urgut suzani guild',
    greenBarStartPct: 28,
    greenBarWidthPct: 30,
  },
  {
    id: 'baz-saffron',
    name: 'Samarkand saffron & spice set',
    category: 'Spices',
    fairMinUzs: 35000,
    fairMaxUzs: 65000,
    touristPriceUzs: 140000,
    uzbekPhrase: '“Bu qancha turadi?”',
    uzbekMeaning: 'Zira (wild cumin), barberry & saffron spice bundle',
    russianPhrase: '«Почем набор специй для плова?»',
    confidence: '95% match · Siab Spice Dome',
    greenBarStartPct: 22,
    greenBarWidthPct: 32,
  },
];

export const AUDIO_GUIDE_TRACKS: AudioTrack[] = [
  {
    id: 'track-1',
    number: 1,
    title: 'Introduction',
    durationSeconds: 270,
    durationLabel: '4:30',
    isFreePreview: true,
    transcript:
      'Welcome to Registan Square — the "Square of Sand" and the monumental heart of Timurid Samarkand. Stand in the center and look around you: to your left rises the Ulugh Beg Madrasa from 1420; directly ahead shines the Tilya-Kori gold-covered mosque; and to your right stands the Sher-Dor Madrasa with its iconic roaring tigers.',
    transcriptRu:
      'Добро пожаловать на площадь Регистан — «Песчаную площадь» и сердце Самарканда эпохи Тимуридов. Перед вами три великих медресе: Улугбека, Шердор и Тилля-Кори.',
    transcriptDe:
      'Willkommen auf dem Registan-Platz — dem „Sandplatz“ und dem monumentalen Herzen des timuridischen Samarkand.',
  },
  {
    id: 'track-2',
    number: 2,
    title: 'The Madrasas',
    durationSeconds: 345,
    durationLabel: '5:45',
    isFreePreview: false,
    transcript:
      'Ulugh Beg, grandson of Tamerlane, was one of the 15th century’s greatest astronomers. Notice the star-patterned girikh mosaics above the portal: over 100 scholars studied mathematics, astronomy, and philosophy within these two-story student cells.',
    transcriptRu:
      'Улугбек, внук Тамерлана, был выдающимся астрономом XV века. В этом медресе более ста ученых изучали математику и небесную механику.',
    transcriptDe:
      'Ulugh Beg, der Enkel Tamerlans, war einer der größten Astronomen des 15. Jahrhunderts. Über 100 Gelehrte studierten hier Mathematik und Astronomie.',
  },
  {
    id: 'track-3',
    number: 3,
    title: 'Secrets of the Tilework',
    durationSeconds: 310,
    durationLabel: '5:10',
    isFreePreview: false,
    transcript:
      'Look closely at the Sher-Dor portal: breaking centuries of strict aniconic convention, the 17th-century architect depicted sun-faces and striped tigers chasing white deer, crafted from hand-cut glazed majolica and cobalt lapis lazuli glazes.',
    transcriptRu:
      'Обратите внимание на портал медресе Шердор: вопреки канонам, зодчий XVII века изобразил тигров с солнечными ликами на спинах.',
    transcriptDe:
      'Betrachten Sie das Portal der Sher-Dor-Medrese genau: Die glasierten Majolika-Fliesen zeigen Tiger und strahlende Sonnengesichter.',
  },
];

export const MEDICINES_DATABASE: MedicineEquivalent[] = [
  {
    id: 'med-advil',
    foreignBrand: 'Advil / Ibuprofen',
    activeIngredient: 'Ibuprofen',
    localEquivalentTitle: 'Ibuprofen 200 mg',
    strengthAndForm: '200 mg / 400 mg film-coated tablets',
    packageSize: '20 tablets (blister pack)',
    indicativePriceUzs: '12,000 – 22,000 UZS',
    pharmacistPhrase: 'Ask the pharmacist for ibuprofen tablets',
    uzbekPhrase: 'Menga Ibuprofen ikki yuz milligram tabletkasi kerak',
    russianPhrase: 'Дайте, пожалуйста, Ибупрофен 200 мг в таблетках',
    clinicalNote:
      'Verify exact strength (200 mg vs 400 mg) on the local box. Avoid if allergic to NSAIDs or taking blood thinners. Consult a licensed pharmacist or physician.',
    sourceUpdatedDate: 'Curated Pharmacy Index · Oct 2026',
  },
  {
    id: 'med-imodium',
    foreignBrand: 'Imodium',
    activeIngredient: 'Loperamide hydrochloride',
    localEquivalentTitle: 'Loperamide 2 mg',
    strengthAndForm: '2 mg capsules or tablets (Loperamid / Imodium)',
    packageSize: '10 or 20 capsules',
    indicativePriceUzs: '8,000 – 28,000 UZS',
    pharmacistPhrase: 'Ask the pharmacist for loperamide',
    uzbekPhrase: 'Menga Loperamid ikki milligram kapsulasi kerak',
    russianPhrase: 'Дайте, пожалуйста, Лоперамид 2 мг (от диареи)',
    clinicalNote:
      'Do not use if accompanied by high fever or bacterial dysentery; pair with oral rehydration salts (Regidron). Consult a clinician before dosing.',
    sourceUpdatedDate: 'Curated Pharmacy Index · Oct 2026',
  },
  {
    id: 'med-tylenol',
    foreignBrand: 'Tylenol',
    activeIngredient: 'Paracetamol (Acetaminophen)',
    localEquivalentTitle: 'Paracetamol 500 mg',
    strengthAndForm: '500 mg tablets (Paratsetamol / Panadol)',
    packageSize: '10 or 20 tablets',
    indicativePriceUzs: '6,000 – 18,000 UZS',
    pharmacistPhrase: 'Ask the pharmacist for paracetamol 500 mg',
    uzbekPhrase: 'Menga Paratsetamol besh yuz milligram kerak',
    russianPhrase: 'Дайте, пожалуйста, Парацетамол 500 мг',
    clinicalNote:
      'In Uzbekistan and Europe, Acetaminophen is known exclusively as Paracetamol. Check combined cold remedies to avoid duplicate dosing.',
    sourceUpdatedDate: 'Curated Pharmacy Index · Oct 2026',
  },
  {
    id: 'med-pepto',
    foreignBrand: 'Pepto-Bismol',
    activeIngredient: 'Bismuth subsalicylate / Bismuth trikali dicitrate',
    localEquivalentTitle: 'De-Nol / Ulkavis (Bismuth 120 mg) + Smecta',
    strengthAndForm: '120 mg tablets or Dioctahedral smectite sachets',
    packageSize: '10 sachets / 32 tablets',
    indicativePriceUzs: '25,000 – 65,000 UZS',
    pharmacistPhrase: 'Ask the pharmacist for Smecta or Bismuth tablets',
    uzbekPhrase: 'Oshqozon uchun Smekta yoki Vismut bering',
    russianPhrase: 'Посоветуйте Смекту или препарат висмута для желудка',
    clinicalNote:
      'US Pepto-Bismol (bismuth subsalicylate) is rarely sold under that exact salt locally; pharmacists commonly recommend Smecta (diosmectite) or bismuth dicitrate. Confirm suitability with the pharmacist.',
    sourceUpdatedDate: 'Curated Pharmacy Index · Oct 2026',
  },
  {
    id: 'med-claritin',
    foreignBrand: 'Claritin',
    activeIngredient: 'Loratadine',
    localEquivalentTitle: 'Loratadin 10 mg',
    strengthAndForm: '10 mg non-drowsy antihistamine tablets',
    packageSize: '10 tablets',
    indicativePriceUzs: '9,000 – 24,000 UZS',
    pharmacistPhrase: 'Ask the pharmacist for Loratadine 10 mg',
    uzbekPhrase: 'Allergiyaga qarshi Loratadin o’n milligram bering',
    russianPhrase: 'Дайте, пожалуйста, Лоратадин 10 мг от аллергии',
    clinicalNote:
      'Verify non-drowsy formulation (Loratadine 10 mg) with the pharmacist, especially if you have Penicillin or other drug allergies recorded in your Emergency Profile.',
    sourceUpdatedDate: 'Curated Pharmacy Index · Oct 2026',
  },
];

export const NEARBY_PHARMACIES: PharmacyLocation[] = [
  {
    id: 'pharm-24h',
    name: 'Pharmacy · Open 24h',
    hoursLabel: 'Open 24h',
    isOpen24h: true,
    address: 'Registan St 8 (Dori-Darmon #14), Samarkand',
    lat: 39.6531,
    lng: 66.9628,
    defaultDistanceMeters: 300,
  },
  {
    id: 'pharm-22h',
    name: 'Pharmacy · Until 22:00',
    hoursLabel: 'Until 22:00',
    isOpen24h: false,
    address: 'Tashkent St 25 (OxyMed Pharmacy), Samarkand',
    lat: 39.6581,
    lng: 66.9669,
    defaultDistanceMeters: 650,
  },
];

export const INITIAL_B2B_LISTINGS: B2BListing[] = [
  {
    id: 'b2b-plov-lunch',
    merchantId: 'merch-plov-house',
    name: 'Plov set lunch',
    city: 'Samarkand',
    category: 'Restaurant',
    description: 'Traditional Samarkand zigir plov served with achichuk salad, non bread & green tea.',
    address: 'Tashkent St 19, Old Town, Samarkand',
    lat: 39.6574,
    lng: 66.9762,
    services: ['Plov set lunch', 'Tea ceremony'],
    priceLabel: '45,000 UZS',
    priceUzs: 45000,
    priceUsd: 3.5,
    openingHours: '11:30–15:30',
    dietaryTags: ['Halal', 'Hygiene-verified'],
    languages: ['English', 'Russian', 'Uzbek'],
    images: [],
    artworkVariant: 'terracotta',
    contactInfo: '+998 90 123 45 67',
    verificationStatus: 'DEMO_VERIFIED',
    promoteInAiItinerary: true,
    createdAt: '2026-10-18T09:00:00Z',
    isActive: true,
  },
  {
    id: 'b2b-old-town-tour',
    merchantId: 'merch-plov-house',
    name: 'Private old-town tour',
    city: 'Samarkand',
    category: 'Guide',
    description: '3-hour walking tour through Registan, Bibikhanym courtyards & hidden Jewish/Tajik mahallas.',
    address: 'Registan Square Main Gate, Samarkand',
    lat: 39.6549,
    lng: 66.9754,
    services: ['Private walking tour', 'Hidden rooftops access'],
    priceLabel: '$30 / person',
    priceUzs: 384000,
    priceUsd: 30,
    openingHours: '09:00–18:00',
    dietaryTags: [],
    languages: ['English', 'Russian', 'Uzbek'],
    images: [],
    artworkVariant: 'blue-arch',
    contactInfo: '+998 90 123 45 67',
    verificationStatus: 'DEMO_VERIFIED',
    promoteInAiItinerary: true,
    createdAt: '2026-10-18T10:00:00Z',
    isActive: true,
  },
  {
    id: 'b2b-ceramic-workshop',
    merchantId: 'merch-plov-house',
    name: 'Ceramic workshop',
    city: 'Samarkand',
    category: 'Craftsman',
    description: 'Paint your own traditional Samarkand blue-glazed ceramic bowl with a 5th-generation master.',
    address: 'Konigil Crafts Village, Samarkand',
    lat: 39.6712,
    lng: 67.0124,
    services: ['Pottery wheel', 'Glaze painting'],
    priceLabel: '$25',
    priceUzs: 320000,
    priceUsd: 25,
    openingHours: '10:00–17:00',
    dietaryTags: [],
    languages: ['English', 'Russian', 'Uzbek'],
    images: [],
    artworkVariant: 'rose-arch',
    contactInfo: '+998 90 123 45 67',
    verificationStatus: 'DEMO_VERIFIED',
    promoteInAiItinerary: false,
    createdAt: '2026-10-19T11:00:00Z',
    isActive: false,
  },
];

// ============================================================================
// 2. TYPED SERVICE IMPLEMENTATIONS
// ============================================================================

export const TransportService = {
  checkAvailability(
    fromCity: string,
    toCity: string,
    dateLabel: string,
    sortBy: 'Recommended' | 'Fastest' | 'Cheapest' = 'Recommended'
  ): TransportOption[] {
    const codeMap: Record<string, string> = {
      Tashkent: 'TAS',
      Samarkand: 'SKD',
      Bukhara: 'BHK',
      Khiva: 'UGC',
    };
    const fromCode = codeMap[fromCity] || 'TAS';
    const toCode = codeMap[toCity] || 'SKD';

    const baseOptions: TransportOption[] = [
      {
        id: `tr-afrosiyob-${fromCode}-${toCode}`,
        type: 'train',
        title: 'Afrosiyob 08:00',
        subtitle: `${fromCity} → ${toCity} · 2h 10m`,
        provider: 'Uzbekistan Railways (Afrosiyob)',
        fromCity,
        toCity,
        fromCode,
        toCode,
        date: dateLabel,
        departureTime: '08:00',
        arrivalTime: '10:10',
        durationLabel: '2h 10m',
        durationMinutes: 130,
        priceUsd: 28,
        priceUzs: 358000,
        availability: 'SOLD_OUT',
        seatOrWagon: 'Wagon 3 · Economy',
        sourceLabel: 'Demo Peak Schedule (Sold Out)',
      },
      {
        id: `tr-hunter-${fromCode}-${toCode}`,
        type: 'waitlist',
        title: 'Ticket Hunter Bot',
        subtitle: 'Auto-buys the first free seat · Free',
        provider: 'Companion Ticket Hunter (Demo Scheduler)',
        fromCity,
        toCity,
        fromCode,
        toCode,
        date: dateLabel,
        departureTime: '08:00',
        arrivalTime: '10:10',
        durationLabel: '2h 10m',
        durationMinutes: 130,
        priceUsd: 28,
        priceUzs: 358000,
        availability: 'WAITLIST_BOT',
        badge: 'Best match',
        seatOrWagon: 'Auto-assigned on release',
        sourceLabel: 'Local Demo Waitlist Monitor',
      },
      {
        id: `tr-flight-${fromCode}-${toCode}`,
        type: 'flight',
        title: 'Domestic flight',
        subtitle: 'Uzbekistan Airways · 1h 05m',
        provider: 'Uzbekistan Airways',
        fromCity,
        toCity,
        fromCode,
        toCode,
        date: dateLabel,
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
      {
        id: `tr-sedan-${fromCode}-${toCode}`,
        type: 'transfer',
        title: 'Private transfer',
        subtitle: 'Verified driver · 3h 30m',
        provider: 'Verified Silk Road Transfer (Chevrolet Lacetti / Cobalt Sedan)',
        fromCity,
        toCity,
        fromCode,
        toCode,
        date: dateLabel,
        departureTime: '09:00',
        arrivalTime: '12:30',
        durationLabel: '3h 30m',
        durationMinutes: 210,
        priceUsd: 45,
        priceUzs: 576000,
        availability: 'AVAILABLE',
        vehicleType: 'Sedan',
        seatOrWagon: 'Private Sedan · Door-to-door',
        driverDetails: {
          name: 'Rustam Alimov',
          vehicle: 'Chevrolet Lacetti White (A/C)',
          plate: '30 A 774 KA',
          phone: '+998 90 555 12 34',
        },
        sourceLabel: 'Verified Local Transfer Demo Pool',
      },
      {
        id: `tr-minivan-${fromCode}-${toCode}`,
        type: 'transfer',
        title: 'Private Minivan transfer',
        subtitle: 'Hyundai Starex (up to 6 pax) · 3h 30m',
        provider: 'Verified Silk Road Group Transfer',
        fromCity,
        toCity,
        fromCode,
        toCode,
        date: dateLabel,
        departureTime: '09:30',
        arrivalTime: '13:00',
        durationLabel: '3h 30m',
        durationMinutes: 210,
        priceUsd: 78,
        priceUzs: 998400,
        availability: 'AVAILABLE',
        vehicleType: 'Minivan',
        seatOrWagon: 'Private Minivan · 6 seats',
        driverDetails: {
          name: 'Farrukh Karimov',
          vehicle: 'Hyundai H-1 Starex Silver',
          plate: '01 M 892 BB',
          phone: '+998 93 441 88 99',
        },
        sourceLabel: 'Verified Local Transfer Demo Pool',
      },
    ];

    const soldOutItem = baseOptions[0];
    const bookable = baseOptions.slice(1);

    if (sortBy === 'Fastest') {
      bookable.sort((a, b) => a.durationMinutes - b.durationMinutes);
    } else if (sortBy === 'Cheapest') {
      bookable.sort((a, b) => a.priceUsd - b.priceUsd);
    }

    return [soldOutItem, ...bookable];
  },
};

export const HotelService = {
  searchHotels(city: string, category: string | null, query: string): BookedHotel[] {
    return CURATED_HOTELS.filter((h) => {
      const matchesCity = !city || city === 'All' || h.city.toLowerCase() === city.toLowerCase();
      const matchesCategory =
        !category || category === 'All' || h.category.toLowerCase() === category.toLowerCase();
      const matchesQuery =
        !query.trim() ||
        h.name.toLowerCase().includes(query.toLowerCase()) ||
        h.subtitle.toLowerCase().includes(query.toLowerCase());
      return matchesCity && matchesCategory && matchesQuery;
    });
  },
};

export const RoutingService = {
  getYandexRoute(
    userLat: number,
    userLng: number,
    destLat: number,
    destLng: number,
    destName: string
  ) {
    const links = buildYandexGoLinks(userLat, userLng, destLat, destLng);
    const fare = estimateUzbekistanTaxiFare(userLat, userLng, destLat, destLng);
    return {
      destinationName: destName,
      fromLat: userLat,
      fromLng: userLng,
      toLat: destLat,
      toLng: destLng,
      ...links,
      fare,
    };
  },

  getOfflineWalkingSteps(destName: string, distanceMeters = 950) {
    const minutes = Math.max(3, Math.round(distanceMeters / 80));
    return {
      destinationName: destName,
      distanceMeters,
      walkMinutes: minutes,
      summaryLabel: `Walk ${minutes} min · ${distanceMeters} m`,
      steps: [
        'Head north on Tashkent St',
        'Turn left at the bazaar gate',
        `${destName} is on your right`,
      ],
    };
  },
};

export const PharmacyService = {
  searchMedicines(query: string): MedicineEquivalent[] {
    const q = query.trim().toLowerCase();
    if (!q) return MEDICINES_DATABASE;
    return MEDICINES_DATABASE.filter(
      (m) =>
        m.foreignBrand.toLowerCase().includes(q) ||
        m.activeIngredient.toLowerCase().includes(q) ||
        m.localEquivalentTitle.toLowerCase().includes(q)
    );
  },

  getNearbyPharmacies(userLat?: number, userLng?: number): PharmacyLocation[] {
    if (typeof userLat === 'number' && typeof userLng === 'number') {
      return NEARBY_PHARMACIES.map((p) => ({
        ...p,
        defaultDistanceMeters: calculateHaversineMeters(userLat, userLng, p.lat, p.lng),
      })).sort((a, b) => a.defaultDistanceMeters - b.defaultDistanceMeters);
    }
    return NEARBY_PHARMACIES;
  },
};

export const PriceEstimationService = {
  searchBazaarItems(category: string | null, query: string): BazaarItem[] {
    return BAZAAR_ITEMS_CATALOG.filter((item) => {
      const matchesCat =
        !category || category === 'All' || item.category.toLowerCase() === category.toLowerCase();
      const matchesQuery =
        !query.trim() ||
        item.name.toLowerCase().includes(query.toLowerCase()) ||
        item.category.toLowerCase().includes(query.toLowerCase());
      return matchesCat && matchesQuery;
    });
  },

  analyzeScannedBazaarImage(fileName = 'bazaar-capture.jpg') {
    const lower = fileName.toLowerCase();
    if (lower.includes('plate') || lower.includes('ceramic')) {
      return BAZAAR_ITEMS_CATALOG[1];
    }
    if (lower.includes('suzani') || lower.includes('carpet') || lower.includes('embroidery')) {
      return BAZAAR_ITEMS_CATALOG[2];
    }
    if (lower.includes('spice') || lower.includes('saffron')) {
      return BAZAAR_ITEMS_CATALOG[3];
    }
    return BAZAAR_ITEMS_CATALOG[0];
  },
};

export const CameraAnalysisService = {
  getMenuTranslations(tier: SubscriptionTier) {
    const allDishes = [
      {
        id: 'dish-shashlik',
        cyrillicLine: 'Шашлык — 45 000',
        name: 'Shashlik',
        description: 'Grilled meat skewers (marinated lamb or beef over charcoal)',
        priceUzs: 45000,
        priceUsd: '$3.50',
        tags: ['Meat'],
        isSafeForVeg: false,
      },
      {
        id: 'dish-samsa',
        cyrillicLine: 'Самса — 12 000',
        name: 'Samsa',
        description: 'Baked tandoor pastry with savoury filling (ask for pumpkin/greens if vegetarian)',
        priceUzs: 12000,
        priceUsd: '$0.95',
        tags: ['Gluten'],
        isSafeForVeg: true,
      },
      {
        id: 'dish-norin',
        cyrillicLine: 'Норин — 38 000',
        name: 'Norin',
        description: 'Cold hand-rolled noodles tossed with cured horse/beef meat & cumin',
        priceUzs: 38000,
        priceUsd: '$2.95',
        tags: ['Meat · Gluten'],
        isSafeForVeg: false,
      },
      {
        id: 'dish-halim',
        cyrillicLine: 'Халим — 30 000',
        name: 'Halim',
        description: 'Slow-cooked wheat berry and meat porridge (high gluten & meat content)',
        priceUzs: 30000,
        priceUsd: '$2.35',
        tags: ['Meat · Gluten'],
        isSafeForVeg: false,
      },
    ];

    return {
      dishes: tier === 'FREE' ? allDishes.slice(0, 3) : allDishes,
      totalDishesCount: allDishes.length,
      isLimitedPreview: tier === 'FREE',
      exchangeRateNote: '1 USD ≈ 12,800 UZS (CBU reference rate · Oct 2026 · Demo OCR model)',
    };
  },
};

export const ItineraryService = {
  generateItinerary(
    cities: SelectedCity[],
    startDate: string,
    pacing: PacingType,
    b2bListings: B2BListing[]
  ): ItineraryDay[] {
    const activeCities = cities.filter((c) => c.selected && c.daysAllocated > 0);
    const listToUse = activeCities.length > 0 ? activeCities : INITIAL_CITIES;
    const promotedB2B = b2bListings.filter((b) => b.isActive && b.promoteInAiItinerary);

    const days: ItineraryDay[] = [];
    let dayCounter = 1;
    const baseDate = new Date(startDate || '2026-10-22');

    // Day 1 always includes the signature Samarkand itinerary from E5 - My trip.png
    listToUse.forEach((city) => {
      for (let d = 0; d < city.daysAllocated; d++) {
        const currentDate = new Date(baseDate);
        currentDate.setDate(baseDate.getDate() + (dayCounter - 1));
        const isoDate = isNaN(currentDate.getTime())
          ? `2026-10-${21 + dayCounter}`
          : currentDate.toISOString().slice(0, 10);

        let items: ItineraryItem[] = [];

        if (dayCounter === 1) {
          items = [
            {
              id: `itin-d1-1`,
              time: '08:40',
              title: 'Flight to Samarkand',
              subtitle: 'TAS → SKD · QR in wallet',
              category: 'transport',
              actionType: 'wallet',
              lat: 39.6542,
              lng: 66.9597,
              isCompleted: true,
            },
            {
              id: `itin-d1-2`,
              time: '10:30',
              title: 'Registan Square',
              subtitle: 'Audio guide ready',
              category: 'monument',
              actionType: 'ride',
              poiId: 'poi-registan',
              lat: 39.6547,
              lng: 66.9758,
            },
            {
              id: `itin-d1-3`,
              time: '13:00',
              title: 'Plov at Besh Qozon',
              subtitle: 'Hygiene-verified',
              category: 'food',
              actionType: 'ride',
              lat: 39.6589,
              lng: 66.9772,
            },
            {
              id: `itin-d1-4`,
              time: '16:00',
              title: 'Siab Bazaar',
              subtitle: 'Fair-price guide',
              category: 'bazaar',
              actionType: 'ride',
              poiId: 'poi-siab-bazaar',
              lat: 39.6615,
              lng: 66.9799,
            },
          ];
        } else if (dayCounter === 2) {
          items = [
            {
              id: `itin-d2-1`,
              time: '09:30',
              title: 'Gur-e-Amir Mausoleum',
              subtitle: 'Skip-the-line QR ready',
              category: 'monument',
              actionType: 'ride',
              poiId: 'poi-gur-e-amir',
              lat: 39.6484,
              lng: 66.9689,
            },
            {
              id: `itin-d2-2`,
              time: '12:30',
              title: 'Green Garden Cafe',
              subtitle: 'No meat broth · Vegetarian',
              category: 'food',
              actionType: 'ride',
              poiId: 'poi-green-garden-cafe',
              lat: 39.6562,
              lng: 66.9731,
            },
            {
              id: `itin-d2-3`,
              time: '15:30',
              title: 'Shah-i-Zinda Necropolis',
              subtitle: 'Golden hour photography walk',
              category: 'monument',
              actionType: 'ride',
              lat: 39.6631,
              lng: 66.9877,
            },
          ];
        } else {
          items = [
            {
              id: `itin-d${dayCounter}-1`,
              time: '10:00',
              title: `${city.name} Old City Citadel`,
              subtitle: `Curated ${pacing.toLowerCase()} pace walk`,
              category: 'monument',
              actionType: 'ride',
              lat: city.lat,
              lng: city.lng,
            },
            {
              id: `itin-d${dayCounter}-2`,
              time: '13:30',
              title: `${city.name} Courtyard Tea House`,
              subtitle: 'Hygiene-verified local lunch',
              category: 'food',
              actionType: 'ride',
              lat: city.lat + 0.002,
              lng: city.lng + 0.002,
            },
            {
              id: `itin-d${dayCounter}-3`,
              time: '16:30',
              title: `${city.name} Artisan Workshop & Bazaar`,
              subtitle: 'Fair-price guide & crafts',
              category: 'bazaar',
              actionType: 'ride',
              lat: city.lat - 0.002,
              lng: city.lng + 0.003,
            },
          ];
        }

        // Inject promoted B2B listings into matching city days
        promotedB2B.forEach((b2b, idx) => {
          if (
            (b2b.city.toLowerCase() === city.name.toLowerCase() || dayCounter <= 2) &&
            !items.some((it) => it.title.toLowerCase() === b2b.name.toLowerCase())
          ) {
            if (pacing !== 'Relaxed' || items.length < 4) {
              items.push({
                id: `itin-b2b-${dayCounter}-${b2b.id}-${idx}`,
                time: idx === 0 ? '18:30' : '19:30',
                title: b2b.name,
                subtitle: `Featured Partner · ${b2b.priceLabel}`,
                category: b2b.category === 'Restaurant' ? 'food' : 'experience',
                actionType: 'ride',
                lat: b2b.lat,
                lng: b2b.lng,
                isB2BPromoted: true,
              });
            }
          }
        });

        days.push({
          dayNumber: dayCounter,
          date: isoDate,
          cityId: city.id,
          cityName: city.name,
          items,
        });
        dayCounter++;
      }
    });

    return days;
  },
};

export const PaymentService = {
  async processDemoPayment(params: {
    amountUsd: number;
    method: 'Apple Pay' | 'Google Pay' | 'Credit / debit card';
    description: string;
  }): Promise<{
    success: boolean;
    transactionId: string;
    isDemoTransaction: true;
    processedAt: string;
    notice: string;
  }> {
    return {
      success: true,
      transactionId: `DEMO-TX-${Date.now().toString(36).toUpperCase()}`,
      isDemoTransaction: true,
      processedAt: new Date().toISOString(),
      notice: `Simulated ${params.method} checkout ($${params.amountUsd.toFixed(2)}) — Demo mode, no real charge occurred.`,
    };
  },
};

export const AudioGuideService = {
  speakText(text: string, lang: 'en-US' | 'ru-RU' | 'uz-UZ' | 'de-DE' = 'en-US'): boolean {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
      return false;
    }
    try {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = lang;
      utterance.rate = 0.96;
      window.speechSynthesis.speak(utterance);
      return true;
    } catch {
      return false;
    }
  },

  stopSpeech(): void {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      try {
        window.speechSynthesis.cancel();
      } catch {
        // ignore
      }
    }
  },
};

export const ConciergeService = {
  generateReply(userMessage: string, passengerName: string): {
    replyText: string;
    newTicket?: BookedTicket;
    voucherCard?: ConciergeMessage['voucherCard'];
  } {
    const lower = userMessage.toLowerCase();
    const ticketId = `vouch-${Date.now().toString(36)}`;

    if (lower.includes('table') || lower.includes('dinner') || lower.includes('restaurant')) {
      return {
        replyText:
          'Done — 20:00 on a rooftop terrace overlooking Registan. I’m sending your QR voucher now.',
        newTicket: {
          id: ticketId,
          bookingRef: `VIP-TBL-${Math.floor(1000 + Math.random() * 9000)}`,
          type: 'monument',
          title: 'Rooftop Terrace · Table for 4',
          subtitle: 'Samarkand · Near Registan Square · 20:00',
          fromCity: 'Samarkand',
          toCity: 'Registan Rooftop',
          fromCode: 'VIP',
          toCode: '20:00',
          date: 'Tonight · 20:00',
          departureTime: '20:00',
          provider: 'Dilnoza VIP Concierge',
          priceUsd: 0,
          seatOrWagon: 'Terrace Table 4',
          passengerName,
          status: 'CONFIRMED',
          qrPayload: `UZ-VIP-TABLE-4-2000-${passengerName}`,
          isDemoBooking: true,
          createdAt: new Date().toISOString(),
        },
        voucherCard: {
          title: 'Table for 4 · 20:00',
          subtitle: 'Voucher QR in Wallet',
          ticketId,
        },
      };
    }

    if (lower.includes('driver') || lower.includes('taxi') || lower.includes('transfer')) {
      return {
        replyText:
          'I have arranged a verified English-speaking driver (Rustam, White Chevrolet Lacetti, plate 30 A 774 KA) to meet you at your hotel entrance in 15 minutes. Your transfer pass is in your Offline Wallet.',
        newTicket: {
          id: ticketId,
          bookingRef: `VIP-DRV-${Math.floor(1000 + Math.random() * 9000)}`,
          type: 'transfer',
          title: 'VIP Chauffeur Dispatch',
          subtitle: 'Rustam Alimov · Plate 30 A 774 KA',
          fromCity: 'Hotel Entrance',
          toCity: 'Samarkand City Tour',
          fromCode: 'HTL',
          toCode: 'SKD',
          date: 'Today · Ready in 15m',
          departureTime: 'Now',
          provider: 'VIP Concierge Fleet',
          priceUsd: 18,
          seatOrWagon: 'Private Sedan (A/C)',
          passengerName,
          status: 'CONFIRMED',
          qrPayload: `UZ-VIP-DRIVER-${passengerName}`,
          isDemoBooking: true,
          createdAt: new Date().toISOString(),
        },
        voucherCard: {
          title: 'VIP Chauffeur · 30 A 774 KA',
          subtitle: 'Voucher QR in Wallet',
          ticketId,
        },
      };
    }

    if (lower.includes('train') || lower.includes('afrosiyob') || lower.includes('ticket')) {
      return {
        replyText:
          'I have prioritized your Afrosiyob seat request on the VIP Concierge desk and issued a backup Priority Boarding Pass in your Offline Wallet.',
        voucherCard: {
          title: 'Priority Afrosiyob Desk',
          subtitle: 'Voucher QR in Wallet',
          ticketId: 'ticket-tas-skd-initial',
        },
      };
    }

    if (lower.includes('dispute') || lower.includes('police') || lower.includes('help')) {
      return {
        replyText:
          'I am online and ready to translate in Uzbek or Russian immediately. Hand the phone to the vendor or officer, or call our 24/7 bilingual desk.',
      };
    }

    return {
      replyText: `Got it, ${passengerName.split(' ')[0]}! As your Samarkand & Silk Road concierge (Demo Assistant), I've logged your request: "${userMessage}". Would you like me to send a booking QR to your Offline Wallet?`,
    };
  },
};

export const GeolocationService = {
  activeWatchId: null as number | null,

  async getBatteryPercentage(): Promise<number | null> {
    if (typeof navigator !== 'undefined' && 'getBattery' in navigator) {
      try {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const bat = await (navigator as any).getBattery();
        if (bat && typeof bat.level === 'number') {
          return Math.round(bat.level * 100);
        }
      } catch {
        return null;
      }
    }
    return null;
  },

  startWatching(
    onPosition: (pos: {
      lat: number;
      lng: number;
      accuracy: number;
      battery: number | null;
      source: 'GPS' | 'FALLBACK_SAMARKAND';
    }) => void,
    onError: (reason: string) => void
  ): void {
    this.stopWatching();

    if (typeof navigator === 'undefined' || !('geolocation' in navigator)) {
      onError('Geolocation API unsupported in this browser — using labeled Samarkand coordinates.');
      return;
    }

    try {
      this.activeWatchId = navigator.geolocation.watchPosition(
        async (position) => {
          const battery = await this.getBatteryPercentage();
          onPosition({
            lat: Number(position.coords.latitude.toFixed(4)),
            lng: Number(position.coords.longitude.toFixed(4)),
            accuracy: Math.round(position.coords.accuracy || 15),
            battery,
            source: 'GPS',
          });
        },
        (err) => {
          onError(err.message || 'GPS permission denied — using labeled Samarkand reference coordinates.');
        },
        {
          enableHighAccuracy: true,
          timeout: 8000,
          maximumAge: 30000,
        }
      );
    } catch {
      onError('Unable to initialize GPS watchPosition.');
    }
  },

  stopWatching(): void {
    if (
      this.activeWatchId !== null &&
      typeof navigator !== 'undefined' &&
      'geolocation' in navigator
    ) {
      try {
        navigator.geolocation.clearWatch(this.activeWatchId);
      } catch {
        // ignore
      }
      this.activeWatchId = null;
    }
  },

  getFallbackSamarkandCoords() {
    return SAMARKAND_DEFAULT_COORDS;
  },
};
