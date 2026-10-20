import React, { useState } from 'react';
import { POIItem } from '../../types/domain';

interface InteractiveExploreMapProps {
  pois: POIItem[];
  selectedPoi: POIItem;
  onSelectPoi: (poi: POIItem) => void;
  isOffline: boolean;
}

/**
 * Dual-mode map for Screen D2 (Explore Map):
 * - Vector Mode (default): Matches Figma Screen D2 pixel layout and works 100% offline.
 * - Live Street Tile Mode: Renders real OpenStreetMap Samarkand street tiles with interactive pins.
 */
export const InteractiveExploreMap: React.FC<InteractiveExploreMapProps> = ({
  pois,
  selectedPoi,
  onSelectPoi,
  isOffline,
}) => {
  const [mapMode, setMapMode] = useState<'vector' | 'osm'>('vector');
  const [zoom, setZoom] = useState(15);

  const pinPositions = [
    { top: '42%', left: '34%', color: '#D9534F', size: 'lg' },
    { top: '38%', left: '51%', color: '#2E9E6B', size: 'md' },
    { top: '44%', left: '64%', color: '#EBC878', size: 'md' },
    { top: '32%', left: '47%', color: '#EBC878', size: 'sm' },
    { top: '34%', left: '51%', color: '#D9534F', size: 'sm' },
    { top: '37%', left: '63%', color: '#D9534F', size: 'sm' },
    { top: '43%', left: '78%', color: '#D9534F', size: 'sm' },
    { top: '28%', left: '76%', color: '#D9534F', size: 'sm' },
  ];

  // Calculate Web Mercator tile coordinates for Samarkand Registan (39.6548, 66.9758)
  const lat = selectedPoi?.lat || 39.6548;
  const lng = selectedPoi?.lng || 66.9758;
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
    <div className="absolute inset-0 bg-[#DCEBE1] overflow-hidden select-none">
      {mapMode === 'osm' && !isOffline ? (
        <div
          data-testid="live-osm-tile-grid"
          className="absolute inset-0 grid grid-cols-2 grid-rows-2 opacity-90"
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
        <>
          {/* Park green circle matching Figma D2 */}
          <div className="absolute bottom-[30%] left-[4%] w-32 h-32 rounded-full bg-[#C3DEC5]" />

          {/* Road network lines matching Figma D2 */}
          <svg
            className="absolute inset-0 w-full h-full"
            viewBox="0 0 390 844"
            fill="none"
          >
            <line x1="-20" y1="260" x2="410" y2="365" stroke="white" strokeWidth="12" />
            <line x1="-20" y1="380" x2="410" y2="300" stroke="white" strokeWidth="12" />
            <line x1="145" y1="-20" x2="210" y2="860" stroke="white" strokeWidth="14" />
            <line x1="270" y1="-20" x2="165" y2="860" stroke="white" strokeWidth="12" />
          </svg>
        </>
      )}

      {/* Map Mode & Zoom Controls */}
      <div className="absolute right-3 top-[116px] z-20 flex flex-col gap-1.5">
        <button
          type="button"
          data-testid="toggle-map-mode-btn"
          onClick={() => setMapMode((m) => (m === 'vector' ? 'osm' : 'vector'))}
          className="px-2.5 py-1 rounded-full bg-white/95 text-[#111111] text-[10px] font-bold shadow border border-black/10"
        >
          {mapMode === 'osm' && !isOffline ? '🗺 Vector Map' : '🌍 Live OSM'}
        </button>
        {mapMode === 'osm' && !isOffline && (
          <div className="flex flex-col bg-white/95 rounded-xl shadow border border-black/10 overflow-hidden">
            <button
              type="button"
              aria-label="Zoom in map"
              onClick={() => setZoom((z) => Math.min(17, z + 1))}
              className="px-2 py-1 text-xs font-bold hover:bg-black/5"
            >
              +
            </button>
            <button
              type="button"
              aria-label="Zoom out map"
              onClick={() => setZoom((z) => Math.max(12, z - 1))}
              className="px-2 py-1 text-xs font-bold border-t border-black/10 hover:bg-black/5"
            >
              −
            </button>
          </div>
        )}
      </div>

      {/* Interactive POI Pins */}
      {pois.slice(0, 8).map((poi, idx) => {
        const pos = pinPositions[idx % pinPositions.length];
        const isSelected = selectedPoi?.id === poi.id;
        return (
          <button
            key={poi.id}
            type="button"
            aria-label={`Select ${poi.name} on map`}
            onClick={() => onSelectPoi(poi)}
            style={{ top: pos.top, left: pos.left }}
            className={`absolute -translate-x-1/2 -translate-y-1/2 rounded-full flex items-center justify-center shadow-md transition-transform ${
              isSelected ? 'w-8 h-8 scale-110 z-20' : 'w-6 h-6 hover:scale-105 z-10'
            }`}
          >
            <span
              style={{ backgroundColor: pos.color }}
              className="w-full h-full rounded-full flex items-center justify-center"
            >
              <span className="w-2.5 h-2.5 rounded-full bg-white" />
            </span>
          </button>
        );
      })}
    </div>
  );
};
