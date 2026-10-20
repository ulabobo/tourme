/**
 * Haversine distance calculation and Yandex Go Deep-Link & Tariff utilities
 */

export const SAMARKAND_DEFAULT_COORDS = {
  lat: 39.6542,
  lng: 66.9597,
};

export const REGISTAN_SQUARE_COORDS = {
  lat: 39.6547,
  lng: 66.9758,
};

export const TASHKENT_AIRPORT_COORDS = {
  lat: 41.2579,
  lng: 69.2812,
};

/**
 * Calculates great-circle distance between two coordinates in meters using the Haversine formula.
 */
export function calculateHaversineMeters(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number {
  const R = 6371000; // Earth radius in meters
  const toRad = (deg: number) => (deg * Math.PI) / 180;
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);

  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(lat1)) *
      Math.cos(toRad(lat2)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return Math.round(R * c);
}

export function formatDistanceLabel(meters: number): string {
  if (meters < 1000) {
    return `${Math.max(50, Math.round(meters / 10) * 10)} m`;
  }
  return `${(meters / 1000).toFixed(1)} km`;
}

export interface TaxiFareEstimate {
  distanceMeters: number;
  distanceKm: number;
  estimatedMinutes: number;
  minUzs: number;
  maxUzs: number;
  formattedRangeUzs: string;
  approxUsd: string;
  tariffNote: string;
}

/**
 * Estimates a local Uzbekistan Yandex Go Comfort/Start tariff in UZS based on Haversine distance.
 * Base flag-drop: 7,500 UZS + ~2,500 UZS per road km (approx 1.35x straight-line distance).
 */
export function estimateUzbekistanTaxiFare(
  startLat: number,
  startLng: number,
  endLat: number,
  endLng: number
): TaxiFareEstimate {
  const distanceMeters = calculateHaversineMeters(startLat, startLng, endLat, endLng);
  const roadDistanceKm = Math.max(1.2, (distanceMeters / 1000) * 1.35);
  const baseFare = 8000;
  const perKmRate = 2800;
  const rawEstimate = baseFare + roadDistanceKm * perKmRate;

  const minUzs = Math.max(10000, Math.round(rawEstimate / 1000) * 1000);
  const maxUzs = Math.max(15000, Math.round((rawEstimate * 1.35) / 1000) * 1000);
  const estimatedMinutes = Math.max(4, Math.round(roadDistanceKm * 2.5));
  const exchangeRateUzsPerUsd = 12800;
  const minUsd = (minUzs / exchangeRateUzsPerUsd).toFixed(2);
  const maxUsd = (maxUzs / exchangeRateUzsPerUsd).toFixed(2);

  return {
    distanceMeters,
    distanceKm: Number(roadDistanceKm.toFixed(1)),
    estimatedMinutes,
    minUzs,
    maxUzs,
    formattedRangeUzs: `${minUzs.toLocaleString('en-US')} – ${maxUzs.toLocaleString('en-US')} UZS`,
    approxUsd: `$${minUsd}–$${maxUsd}`,
    tariffNote: 'Estimated local Yandex Go tariff (actual fare depends on live traffic & demand).',
  };
}

export interface YandexGoLinks {
  deepLink: string;
  displayDeepLink: string;
  webFallbackUrl: string;
  yandexMapsWebUrl: string;
}

export function buildYandexGoLinks(
  startLat: number,
  startLng: number,
  endLat: number,
  endLng: number,
  appMetricaId = '25395763362139037'
): YandexGoLinks {
  const sLat = startLat.toFixed(4);
  const sLon = startLng.toFixed(4);
  const eLat = endLat.toFixed(4);
  const eLon = endLng.toFixed(4);

  const deepLink = `yandextaxi://route?start-lat=${encodeURIComponent(sLat)}&start-lon=${encodeURIComponent(sLon)}&end-lat=${encodeURIComponent(eLat)}&end-lon=${encodeURIComponent(eLon)}&appmetrica_tracking_id=${encodeURIComponent(appMetricaId)}`;

  const displayDeepLink = `yandextaxi://route?\nstart-lat=${sLat}\n&start-lon=${sLon}\n&end-lat=${eLat}\n&end-lon=${eLon}\n&appmetrica_tracking_id=...`;

  const webFallbackUrl = `https://3.redirect.appmetrica.yandex.com/route?start-lat=${encodeURIComponent(sLat)}&start-lon=${encodeURIComponent(sLon)}&end-lat=${encodeURIComponent(eLat)}&end-lon=${encodeURIComponent(eLon)}&level=50&ref=uzbekistantravelcompanion&appmetrica_tracking_id=${encodeURIComponent(appMetricaId)}`;

  const yandexMapsWebUrl = `https://yandex.com/maps/?rtext=${encodeURIComponent(`${sLat},${sLon}~${eLat},${eLon}`)}&rtt=auto`;

  return {
    deepLink,
    displayDeepLink,
    webFallbackUrl,
    yandexMapsWebUrl,
  };
}
