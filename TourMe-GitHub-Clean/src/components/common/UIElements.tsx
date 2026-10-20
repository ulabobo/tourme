import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAppStore } from '../../store/useAppStore';
import { AUDIO_GUIDE_TRACKS } from '../../services/domainServices';
import { generateDeterministicQrMatrix } from '../../utils/qrSvg';
import { useI18n } from '../../utils/i18n';

/**
 * Exact Silk Road Arch & Sun Artwork matching A1, B1, B3, B5, D1, D2, D3, D5, E1, E2, H2
 */
export const SilkRoadArchArtwork: React.FC<{
  variant?: 'blue-arch' | 'terracotta' | 'lavender' | 'rose-arch' | 'gold-arch';
  className?: string;
  badgeText?: string;
  rating?: number;
  size?: 'hero' | 'card' | 'thumb';
}> = ({ variant = 'blue-arch', className = '', badgeText, rating, size = 'thumb' }) => {
  const gradientMap: Record<string, string> = {
    'blue-arch': 'linear-gradient(135deg, #98B4EE 0%, #C2C5E6 48%, #ECC69B 100%)',
    terracotta: 'linear-gradient(135deg, #F5C396 0%, #F3AD85 55%, #EE9B72 100%)',
    lavender: 'linear-gradient(135deg, #A3B7F5 0%, #B8B0F3 50%, #CEA6EF 100%)',
    'rose-arch': 'linear-gradient(135deg, #F69AA8 0%, #F7AE9E 52%, #F6C396 100%)',
    'gold-arch': 'linear-gradient(135deg, #ECCB7C 0%, #F3B885 100%)',
  };

  const sunSize =
    size === 'hero'
      ? 'w-20 h-20 top-7 right-8'
      : size === 'card'
        ? 'w-20 h-20 top-3 right-6'
        : 'w-5 h-5 top-2.5 right-2.5';

  const archSize =
    size === 'hero'
      ? 'w-44 h-40 left-7 -bottom-4'
      : size === 'card'
        ? 'w-44 h-24 left-7 -bottom-6'
        : 'w-11 h-9 left-2 -bottom-1';

  return (
    <div
      className={`relative overflow-hidden select-none ${className}`}
      style={{ background: gradientMap[variant] || gradientMap['blue-arch'] }}
    >
      {badgeText && (
        <div className="absolute top-3.5 left-3.5 z-10 bg-[#EBC878] text-[#111111] text-[12px] font-semibold px-3.5 py-1.5 rounded-full shadow-sm">
          {badgeText}
        </div>
      )}
      {typeof rating === 'number' && (
        <div className="absolute top-3 left-3 z-10 bg-white text-[#111111] text-[12px] font-semibold px-2.5 py-1 rounded-full flex items-center gap-1 shadow-sm">
          <span>★</span>
          <span>{rating.toFixed(1)}</span>
        </div>
      )}
      {/* Sun disc */}
      <div
        className={`absolute rounded-full bg-white/60 pointer-events-none ${sunSize}`}
      />
      {/* Madrasa Arch silhouette */}
      <div
        className={`absolute rounded-t-full bg-white/40 pointer-events-none ${archSize}`}
      />
    </div>
  );
};

/**
 * Circular Back Button + Screen Header matching A2-H4
 */
export const ScreenHeader: React.FC<{
  title: string;
  onBack?: () => void;
  backTo?: string;
  dark?: boolean;
  rightElement?: React.ReactNode;
}> = ({ title, onBack, backTo, dark = false, rightElement }) => {
  const navigate = useNavigate();

  const handleBack = () => {
    if (onBack) {
      onBack();
      return;
    }
    if (backTo) {
      navigate(backTo);
      return;
    }
    navigate(-1);
  };

  return (
    <div className="flex items-center justify-between pt-2 pb-3">
      <div className="flex items-center gap-3.5">
        <button
          type="button"
          onClick={handleBack}
          aria-label={`Back from ${title}`}
          className="w-11 h-11 rounded-full bg-white text-[#111111] flex items-center justify-center shadow-sm active:scale-95 transition-transform font-semibold text-lg"
        >
          ←
        </button>
        <h1
          className={`text-[20px] font-semibold tracking-tight ${
            dark ? 'text-white' : 'text-[#111111]'
          }`}
        >
          {title}
        </h1>
      </div>
      {rightElement && <div>{rightElement}</div>}
    </div>
  );
};

/**
 * Interactive Vector Map Canvas matching C2, C3, D2, D7
 */
export interface MapPinItem {
  id: string;
  x: number;
  y: number;
  label: string;
  color?: 'red' | 'green' | 'gold';
  selected?: boolean;
}

export const SilkRoadMapCanvas: React.FC<{
  className?: string;
  pins?: MapPinItem[];
  onSelectPin?: (id: string) => void;
  routeLine?: { x1: number; y1: number; x2: number; y2: number };
  children?: React.ReactNode;
}> = ({ className = 'h-72', pins = [], onSelectPin, routeLine, children }) => {
  const connectivityStatus = useAppStore((s) => s.safetyState.connectivityStatus);
  const [mapMode, setMapMode] = React.useState<'vector' | 'osm'>('vector');
  const [zoom, setZoom] = React.useState(15);

  const isOffline = connectivityStatus === 'OFFLINE';
  const lat = 39.6548;
  const lng = 66.9758;
  const n = Math.pow(2, zoom);
  const xtile = Math.floor(((lng + 180) / 360) * n);
  const ytile = Math.floor(
    ((1 -
      Math.log(
        Math.tan((lat * Math.PI) / 180) + 1 / Math.cos((lat * Math.PI) / 180)
      ) /
        Math.PI) /
      2) *
      n
  );

  return (
    <div
      className={`relative overflow-hidden select-none ${className}`}
      style={{
        background: 'linear-gradient(135deg, #E2EDE3 0%, #D9EAE4 55%, #D2E6EC 100%)',
      }}
    >
      {mapMode === 'osm' && !isOffline ? (
        <div
          data-testid="live-osm-tile-grid"
          className="absolute inset-0 grid grid-cols-2 grid-rows-2 opacity-90 pointer-events-none"
        >
          {[
            [xtile, ytile],
            [xtile + 1, ytile],
            [xtile, ytile + 1],
            [xtile + 1, ytile + 1],
          ].map(([tx, ty], i) => (
            <img
              key={`${zoom}-${tx}-${ty}-${i}`}
              src={`https://tile.openstreetmap.org/${zoom}/${tx}/${ty}.png`}
              alt="Samarkand OpenStreetMap tile"
              className="w-full h-full object-cover"
              crossOrigin="anonymous"
            />
          ))}
        </div>
      ) : (
        /* Vector street lines & park circle */
        <svg
          viewBox="0 0 390 420"
          className="absolute inset-0 w-full h-full object-cover pointer-events-none"
          preserveAspectRatio="none"
        >
          {/* Park / Oasis green oval */}
          <ellipse cx="78" cy="295" rx="60" ry="48" fill="#C4DEC0" opacity="0.85" />
          {/* White avenues */}
          <line x1="-20" y1="120" x2="410" y2="215" stroke="#FFFFFF" strokeWidth="9" opacity="0.85" />
          <line x1="-20" y1="225" x2="410" y2="145" stroke="#FFFFFF" strokeWidth="9" opacity="0.85" />
          <line x1="145" y1="-20" x2="205" y2="440" stroke="#FFFFFF" strokeWidth="9" opacity="0.85" />
          <line x1="270" y1="-20" x2="165" y2="440" stroke="#FFFFFF" strokeWidth="9" opacity="0.85" />

          {/* Optional route line (C2 Arrival / D7 Offline Walking) */}
          {routeLine && (
            <line
              x1={routeLine.x1}
              y1={routeLine.y1}
              x2={routeLine.x2}
              y2={routeLine.y2}
              stroke="#111111"
              strokeWidth="4.5"
              strokeLinecap="round"
            />
          )}
        </svg>
      )}

      {/* Live OSM / Vector Mode Switcher Pill */}
      <div className="absolute right-3 bottom-8 z-20 flex items-center gap-1">
        {mapMode === 'osm' && !isOffline && (
          <div className="flex items-center bg-white/95 rounded-full shadow border border-black/10 overflow-hidden text-[#111111]">
            <button
              type="button"
              aria-label="Zoom in map"
              onClick={() => setZoom((z) => Math.min(17, z + 1))}
              className="px-2 py-0.5 text-xs font-bold hover:bg-black/5"
            >
              +
            </button>
            <button
              type="button"
              aria-label="Zoom out map"
              onClick={() => setZoom((z) => Math.max(12, z - 1))}
              className="px-2 py-0.5 text-xs font-bold border-l border-black/10 hover:bg-black/5"
            >
              −
            </button>
          </div>
        )}
        <button
          type="button"
          data-testid="toggle-map-mode-btn"
          onClick={() => setMapMode((m) => (m === 'vector' ? 'osm' : 'vector'))}
          className="px-2.5 py-1 rounded-full bg-white/95 text-[#111111] text-[10px] font-bold shadow border border-black/10"
        >
          {mapMode === 'osm' && !isOffline ? '🗺 Vector' : '🌍 Live OSM'}
        </button>
      </div>

      {/* User green origin pin */}
      <button
        type="button"
        onClick={() => onSelectPin && onSelectPin('user-location')}
        aria-label="Your current GPS location"
        style={{
          left: routeLine ? `${(routeLine.x1 / 390) * 100}%` : '52%',
          top: routeLine ? `${(routeLine.y1 / 420) * 100}%` : '39%',
        }}
        className="absolute -translate-x-1/2 -translate-y-1/2 w-6 h-6 rounded-full bg-[#2E9E6B] flex items-center justify-center shadow-md z-10"
      >
        <span className="w-2.5 h-2.5 rounded-full bg-white" />
      </button>

      {/* Dynamic POI / ATM pins */}
      {pins.map((pin) => {
        const bgClass =
          pin.color === 'green'
            ? 'bg-[#2E9E6B]'
            : pin.color === 'gold'
              ? 'bg-[#EBC878]'
              : 'bg-[#D9534F]';
        return (
          <button
            key={pin.id}
            type="button"
            onClick={() => onSelectPin && onSelectPin(pin.id)}
            title={pin.label}
            aria-label={`Map pin: ${pin.label}`}
            style={{ left: `${pin.x}%`, top: `${pin.y}%` }}
            className={`absolute -translate-x-1/2 -translate-y-1/2 w-6 h-6 rounded-full ${bgClass} flex items-center justify-center shadow-md z-10 transition-transform ${
              pin.selected ? 'scale-125 ring-4 ring-white/80' : 'hover:scale-110'
            }`}
          >
            <span className="w-2.5 h-2.5 rounded-full bg-white" />
          </button>
        );
      })}

      {children}
    </div>
  );
};

/**
 * Tourist Bottom Navigation Pill Bar matching C3, D1, D2, D3, D4, D5, D7, E2, E3, E4, E5, F1, F5, F6, G3
 */
export const TouristBottomNav: React.FC<{
  activeTab: 'Home' | 'Explore' | 'Trip' | 'Safety' | 'Me';
}> = ({ activeTab }) => {
  const navigate = useNavigate();
  const { t } = useI18n();

  const tabs: {
    id: 'Home' | 'Explore' | 'Trip' | 'Safety' | 'Me';
    label: string;
    path: string;
  }[] = [
    { id: 'Home', label: t.navHome, path: '/home' },
    { id: 'Explore', label: t.navExplore, path: '/explore' },
    { id: 'Trip', label: t.navTrip, path: '/trip' },
    { id: 'Safety', label: t.navSafety, path: '/safety' },
    { id: 'Me', label: t.navMe, path: '/profile' },
  ];

  return (
    <nav
      aria-label="Primary tourist navigation"
      className="mt-auto pt-3 pb-1"
    >
      <div className="bg-[#F6F2EA] rounded-full p-1.5 flex items-center justify-between shadow-sm">
        {tabs.map((tab) => {
          const isActive = tab.id === activeTab;
          return (
            <button
              key={tab.id}
              type="button"
              aria-label={tab.id}
              onClick={() => navigate(tab.path)}
              className={`flex-1 py-2.5 rounded-full text-[13px] font-semibold transition-colors ${
                isActive
                  ? 'bg-[#111111] text-white'
                  : 'text-[#111111] hover:bg-black/5'
              }`}
            >
              {tab.label}
            </button>
          );
        })}
      </div>
    </nav>
  );
};

/**
 * Merchant Bottom Navigation Pill Bar matching H1 & H2
 */
export const MerchantBottomNav: React.FC<{
  activeTab: 'Home' | 'Listings' | 'Scan' | 'Profile';
}> = ({ activeTab }) => {
  const navigate = useNavigate();

  const tabs: { id: 'Home' | 'Listings' | 'Scan' | 'Profile'; path: string }[] = [
    { id: 'Home', path: '/merchant' },
    { id: 'Listings', path: '/merchant/listings' },
    { id: 'Scan', path: '/merchant/scan' },
    { id: 'Profile', path: '/merchant/register' },
  ];

  return (
    <nav
      aria-label="Merchant portal navigation"
      className="mt-auto pt-3 pb-1"
    >
      <div className="bg-[#F6F2EA] rounded-full p-1.5 flex items-center justify-between shadow-sm">
        {tabs.map((tab) => {
          const isActive = tab.id === activeTab;
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => navigate(tab.path)}
              className={`flex-1 py-2.5 rounded-full text-[13px] font-semibold transition-colors ${
                isActive
                  ? 'bg-[#111111] text-white'
                  : 'text-[#111111] hover:bg-black/5'
              }`}
            >
              {tab.id}
            </button>
          );
        })}
      </div>
    </nav>
  );
};

/**
 * Deterministic SVG QR Code matching E4 & H3
 */
export const QrMatrixSvg: React.FC<{
  payload: string;
  size?: number;
}> = ({ payload, size = 190 }) => {
  const matrix = generateDeterministicQrMatrix(payload);
  const n = matrix.length;

  return (
    <svg
      width={size}
      height={size}
      viewBox={`0 0 ${n} ${n}`}
      className="mx-auto block bg-white p-1.5 rounded-lg"
      role="img"
      aria-label={`QR Code for ${payload}`}
    >
      {matrix.map((row, r) =>
        row.map((cell, c) =>
          cell ? (
            <rect key={`${r}-${c}`} x={c} y={r} width={1} height={1} fill="#111111" />
          ) : null
        )
      )}
    </svg>
  );
};

/**
 * Floating Persistent Audio Guide Mini-Player when playing across screens
 */
export const FloatingAudioBar: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const audioPlayer = useAppStore((s) => s.audioPlayer);
  const toggleAudioPlay = useAppStore((s) => s.toggleAudioPlay);
  const stopAudioPlay = useAppStore((s) => s.stopAudioPlay);

  if (!audioPlayer.isPlaying || location.pathname === '/audio-guide') {
    return null;
  }

  const currentTrack =
    AUDIO_GUIDE_TRACKS.find((t) => t.id === audioPlayer.currentTrackId) || AUDIO_GUIDE_TRACKS[0];

  return (
    <div className="mb-2 bg-[#111111] text-white rounded-2xl px-3.5 py-2.5 flex items-center justify-between shadow-lg text-xs">
      <button
        type="button"
        onClick={() => navigate('/audio-guide')}
        className="flex flex-col text-left truncate pr-2"
      >
        <span className="text-[#35D084] font-semibold text-[11px]">
          ● Audio Guide Playing
        </span>
        <span className="font-semibold text-[13px] truncate">
          {currentTrack.number}. {currentTrack.title}
        </span>
      </button>
      <div className="flex items-center gap-2 shrink-0">
        <button
          type="button"
          onClick={toggleAudioPlay}
          className="px-2.5 py-1 rounded-full bg-white text-[#111111] font-semibold"
        >
          Pause
        </button>
        <button
          type="button"
          onClick={stopAudioPlay}
          aria-label="Stop audio guide"
          className="px-2 py-1 rounded-full bg-white/15 text-white font-semibold"
        >
          ✕
        </button>
      </div>
    </div>
  );
};
