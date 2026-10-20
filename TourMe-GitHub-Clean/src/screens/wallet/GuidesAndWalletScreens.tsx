import React, { useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  QrMatrixSvg,
  ScreenHeader,
  SilkRoadArchArtwork,
  TouristBottomNav,
} from '../../components/common/UIElements';
import {
  AUDIO_GUIDE_TRACKS,
  AudioGuideService,
  MONUMENT_TICKETS_CATALOG,
  PriceEstimationService,
} from '../../services/domainServices';
import { useAppStore } from '../../store/useAppStore';
import { BazaarItem } from '../../types/domain';

function formatSeconds(sec: number): string {
  const m = Math.floor(sec / 60);
  const s = Math.floor(sec % 60);
  return `${m}:${String(s).padStart(2, '0')}`;
}

/**
 * Screen E1 — Audio guide
 */
export const ScreenE1AudioGuide: React.FC = () => {
  const navigate = useNavigate();
  const tier = useAppStore((s) => s.userProfile.tier);
  const audioPlayer = useAppStore((s) => s.audioPlayer);
  const selectAudioTrack = useAppStore((s) => s.selectAudioTrack);
  const toggleAudioPlay = useAppStore((s) => s.toggleAudioPlay);
  const seekAudio = useAppStore((s) => s.seekAudio);
  const setAudioLanguage = useAppStore((s) => s.setAudioLanguage);
  const toggleAudioTranscript = useAppStore((s) => s.toggleAudioTranscript);
  const showToast = useAppStore((s) => s.showToast);

  const currentTrack =
    AUDIO_GUIDE_TRACKS.find((t) => t.id === audioPlayer.currentTrackId) ||
    AUDIO_GUIDE_TRACKS[0];

  const waveformHeights = [
    18, 36, 26, 38, 30, 34, 30, 34, 28, 36, 22, 38, 16, 34, 18, 30, 26, 36, 30,
    34, 30, 34, 26, 36, 16, 34, 22, 30, 26, 24,
  ];
  const progressRatio =
    audioPlayer.durationSeconds > 0
      ? audioPlayer.progressSeconds / audioPlayer.durationSeconds
      : 0.26;
  const activeBarsCount = Math.round(progressRatio * waveformHeights.length);

  const handlePlayPause = () => {
    const nextPlaying = !audioPlayer.isPlaying;
    toggleAudioPlay();
    if (nextPlaying) {
      const langCode =
        audioPlayer.language === 'Russian'
          ? 'ru-RU'
          : audioPlayer.language === 'German'
            ? 'de-DE'
            : 'en-US';
      const textToSpeak =
        audioPlayer.language === 'Russian'
          ? currentTrack.transcriptRu
          : audioPlayer.language === 'German'
            ? currentTrack.transcriptDe
            : currentTrack.transcript;
      AudioGuideService.speakText(textToSpeak, langCode);
      showToast(`Playing "${currentTrack.title}" (${audioPlayer.language})`, 'info');
    } else {
      AudioGuideService.stopSpeech();
    }
  };

  const handleSelectTrack = (track: (typeof AUDIO_GUIDE_TRACKS)[0]) => {
    if (!track.isFreePreview && tier === 'FREE') {
      showToast(
        `"${track.title}" requires Silk Road Pass (PRO) or VIP. Redirecting to Plans...`,
        'warning'
      );
      navigate('/plans');
      return;
    }
    selectAudioTrack(track.id);
    AudioGuideService.speakText(track.transcript, 'en-US');
    showToast(`Now playing Track ${track.number}: ${track.title}`, 'success');
  };

  const activeTranscript =
    audioPlayer.language === 'Russian'
      ? currentTrack.transcriptRu
      : audioPlayer.language === 'German'
        ? currentTrack.transcriptDe
        : currentTrack.transcript;

  return (
    <div className="flex-1 flex flex-col justify-between">
      <div>
        <ScreenHeader
          title="Audio guide"
          rightElement={
            <div className="flex items-center gap-1.5">
              <button
                type="button"
                onClick={() => {
                  const langs: ('English' | 'Russian' | 'German')[] = [
                    'English',
                    'Russian',
                    'German',
                  ];
                  const next =
                    langs[(langs.indexOf(audioPlayer.language) + 1) % langs.length];
                  setAudioLanguage(next);
                  showToast(`Audio language: ${next}`, 'info');
                }}
                className="px-2.5 py-1 rounded-full bg-white text-[#111111] text-[11px] font-semibold shadow-sm"
              >
                {audioPlayer.language.slice(0, 2).toUpperCase()}
              </button>
              <button
                type="button"
                onClick={toggleAudioTranscript}
                className="px-2.5 py-1 rounded-full bg-[#F6F2EA] text-[#111111] text-[11px] font-semibold"
              >
                {audioPlayer.showTranscript ? 'Hide Text' : 'Transcript'}
              </button>
            </div>
          }
        />

        <SilkRoadArchArtwork
          variant="blue-arch"
          size="hero"
          className="w-full h-48 rounded-[28px] mt-1"
        />

        <div className="mt-3.5">
          <span className="inline-block bg-[#DDEFE3] text-[#2E9E6B] text-[12px] font-semibold px-3.5 py-1.5 rounded-full">
            GPS-triggered · you are at Registan
          </span>
        </div>

        <h2 className="mt-3 text-[22px] font-bold text-[#111111]">
          Registan: the square of sand
        </h2>

        {audioPlayer.showTranscript && (
          <div className="mt-2 bg-[#F6F2EA] rounded-2xl p-3.5 text-[12px] text-[#111111] leading-relaxed">
            {activeTranscript}
          </div>
        )}

        {/* Waveform Visualizer */}
        <div
          onClick={(e) => {
            const rect = e.currentTarget.getBoundingClientRect();
            const ratio = Math.max(
              0,
              Math.min(1, (e.clientX - rect.left) / rect.width)
            );
            seekAudio(Math.round(ratio * audioPlayer.durationSeconds), false);
          }}
          className="mt-5 flex items-center justify-between h-11 cursor-pointer px-1"
          title="Click to seek audio position"
        >
          {waveformHeights.map((h, i) => (
            <span
              key={i}
              style={{ height: `${h}px` }}
              className={`w-[5px] rounded-full transition-colors ${
                i < activeBarsCount ? 'bg-[#111111]' : 'bg-[#CBC5BA]'
              }`}
            />
          ))}
        </div>

        {/* Progress Bar & Timestamps */}
        <div className="mt-2">
          <div className="w-full h-1.5 bg-[#D5CFC4] rounded-full overflow-hidden">
            <div
              style={{ width: `${Math.min(100, Math.round(progressRatio * 100))}%` }}
              className="h-full bg-[#111111] rounded-full"
            />
          </div>
          <div className="mt-1.5 flex items-center justify-between text-[12px] text-[#6E6A63]">
            <span>{formatSeconds(audioPlayer.progressSeconds)}</span>
            <span>{currentTrack.durationLabel}</span>
          </div>
        </div>

        {/* Playback Controls (-15, Play/Pause, +15) */}
        <div className="mt-3 flex items-center justify-center gap-6">
          <button
            type="button"
            aria-label="Rewind 15 seconds"
            onClick={() => seekAudio(-15, true)}
            className="w-14 h-14 rounded-full bg-white text-[#111111] text-[14px] font-bold shadow-sm active:scale-95 transition-transform"
          >
            −15
          </button>

          <button
            type="button"
            aria-label={audioPlayer.isPlaying ? 'Pause audio guide' : 'Play audio guide'}
            onClick={handlePlayPause}
            className="w-16 h-16 rounded-full bg-[#111111] text-white text-xl font-bold flex items-center justify-center shadow-md active:scale-95 transition-transform"
          >
            {audioPlayer.isPlaying ? '❚❚' : '▶'}
          </button>

          <button
            type="button"
            aria-label="Forward 15 seconds"
            onClick={() => seekAudio(15, true)}
            className="w-14 h-14 rounded-full bg-white text-[#111111] text-[14px] font-bold shadow-sm active:scale-95 transition-transform"
          >
            +15
          </button>
        </div>

        {/* Track List */}
        <div className="mt-5 space-y-2">
          {AUDIO_GUIDE_TRACKS.map((track) => {
            const isLocked = !track.isFreePreview && tier === 'FREE';
            const isCurrent = track.id === currentTrack.id;
            return (
              <button
                key={track.id}
                type="button"
                onClick={() => handleSelectTrack(track)}
                className={`w-full bg-[#F6F2EA] rounded-2xl px-4 py-3 flex items-center justify-between text-left transition-colors ${
                  isCurrent ? 'ring-2 ring-[#111111]/20' : ''
                }`}
              >
                <span
                  className={`text-[14px] font-semibold ${
                    isLocked ? 'text-[#6E6A63]' : 'text-[#111111]'
                  }`}
                >
                  {track.number} &nbsp;{track.title}
                </span>

                {track.isFreePreview ? (
                  <span className="bg-[#DDEFE3] text-[#2E9E6B] text-[11px] font-semibold px-3 py-1 rounded-full">
                    Free preview
                  </span>
                ) : (
                  <span className="bg-[#EBC878] text-[#111111] text-[11px] font-bold px-3 py-1 rounded-full">
                    {tier === 'FREE' ? 'PRO' : '✓ Unlocked'}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      <div className="mt-4">
        {tier === 'FREE' ? (
          <button
            type="button"
            onClick={() => navigate('/plans')}
            className="w-full py-4 rounded-full bg-[#111111] text-white text-[15px] font-semibold"
          >
            Unlock all audio-guides
          </button>
        ) : (
          <button
            type="button"
            onClick={() => navigate('/explore')}
            className="w-full py-4 rounded-full bg-[#111111] text-white text-[15px] font-semibold"
          >
            Back to Explore Map ({tier} Active)
          </button>
        )}
      </div>
    </div>
  );
};

/**
 * Screen E2 — Skip-the-line tickets
 */
export const ScreenE2Tickets: React.FC = () => {
  const navigate = useNavigate();
  const bookedTickets = useAppStore((s) => s.tripPlan.bookedTickets);
  const buyMonumentTicket = useAppStore((s) => s.buyMonumentTicket);
  const showToast = useAppStore((s) => s.showToast);

  const handleBuyMonument = (mon: (typeof MONUMENT_TICKETS_CATALOG)[0]) => {
    const ticket = buyMonumentTicket(mon);
    showToast(
      `Purchased ${mon.title} QR ticket (${ticket.bookingRef})! Saved to Offline Wallet.`,
      'success'
    );
  };

  return (
    <div className="flex-1 flex flex-col justify-between">
      <div>
        <ScreenHeader title="Skip-the-line tickets" backTo="/place/poi-registan" />

        <div className="mt-2 space-y-3">
          {MONUMENT_TICKETS_CATALOG.map((mon) => {
            const alreadyOwned = bookedTickets.some((t) =>
              t.title.toLowerCase().includes(mon.title.toLowerCase())
            );
            return (
              <div
                key={mon.id}
                className="bg-[#F6F2EA] rounded-[24px] p-3.5 flex items-center justify-between"
              >
                <div className="flex items-center gap-3.5">
                  <SilkRoadArchArtwork
                    variant={mon.artworkVariant}
                    className="w-20 h-20 rounded-2xl shrink-0"
                  />
                  <div>
                    <h3 className="text-[17px] font-bold text-[#111111]">
                      {mon.title}
                    </h3>
                    <div className="text-[12px] text-[#6E6A63] mt-0.5">
                      {mon.city} · QR ticket
                    </div>
                    <span className="mt-1 inline-block bg-[#DDEFE3] text-[#2E9E6B] text-[11px] font-semibold px-3 py-0.5 rounded-full">
                      Skip-the-line
                    </span>
                    <div className="mt-1 text-[13px] font-bold text-[#111111]">
                      {mon.priceUzs.toLocaleString('en-US')} UZS
                    </div>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => handleBuyMonument(mon)}
                  className="px-5 py-2.5 rounded-full bg-[#111111] text-white text-[13px] font-semibold shrink-0 active:scale-95 transition-transform"
                >
                  {alreadyOwned ? 'Buy +1' : 'Buy'}
                </button>
              </div>
            );
          })}
        </div>

        <button
          type="button"
          onClick={() => navigate('/wallet')}
          className="mt-4 w-full py-4 rounded-full bg-[#EBC878] text-[#111111] text-[15px] font-semibold shadow-sm"
        >
          Open my wallet
        </button>

        <p className="mt-2 text-[12px] text-[#6E6A63] text-center">
          Tickets are saved offline in your wallet.
        </p>
      </div>

      <TouristBottomNav activeTab="Explore" />
    </div>
  );
};

/**
 * Screen E3 — Fair-price bazaar (with Spoken Uzbek/Russian Phrases & AI Bazaar Camera Scanner)
 */
export const ScreenE3FairPriceBazaar: React.FC = () => {
  const navigate = useNavigate();
  const tier = useAppStore((s) => s.userProfile.tier);
  const showToast = useAppStore((s) => s.showToast);

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('Dried fruit');
  const [showScannerModal, setShowScannerModal] = useState(false);
  const [scannedResult, setScannedResult] = useState<BazaarItem | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const categories = ['Spices', 'Ceramics', 'Suzani', 'Dried fruit'];

  // Show the 3 signature bazaar items by default matching E3 - Fair-price bazaar.png, or filter by search
  const displayedItems = searchQuery.trim()
    ? PriceEstimationService.searchBazaarItems('All', searchQuery)
    : PriceEstimationService.searchBazaarItems('All', '').slice(0, 3);

  const handlePlayPhrase = (item: BazaarItem) => {
    const spoke = AudioGuideService.speakText(
      `Bu qancha turadi? ${item.russianPhrase}`,
      'ru-RU'
    );
    showToast(
      spoke
        ? `Speaking: "Bu qancha turadi?" (${item.uzbekMeaning})`
        : `"Bu qancha turadi?" — How much is this? Fair range: ${item.fairMinUzs.toLocaleString('en-US')}–${item.fairMaxUzs.toLocaleString('en-US')} UZS`,
      'info'
    );
  };

  const handleScanFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const item = PriceEstimationService.analyzeScannedBazaarImage(file.name);
    setScannedResult(item);
    setShowScannerModal(true);
    showToast(`Detected "${item.name}" — Fair price calculated!`, 'success');
  };

  return (
    <div className="flex-1 flex flex-col justify-between">
      <div>
        <ScreenHeader title="Fair-price bazaar" backTo="/explore" />

        {/* Search Input */}
        <div className="mt-1">
          <input
            type="search"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search item..."
            aria-label="Search bazaar item"
            className="w-full px-4 py-3.5 rounded-full bg-white text-[#111111] text-[14px] placeholder-[#8C877E] focus:outline-none"
          />
        </div>

        {/* Category Chips */}
        <div className="mt-3 flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar">
          {categories.map((cat) => {
            const isSelected = selectedCategory === cat;
            return (
              <button
                key={cat}
                type="button"
                onClick={() => setSelectedCategory(cat)}
                className={`px-4 py-2 rounded-full text-[13px] font-semibold whitespace-nowrap transition-colors ${
                  isSelected
                    ? 'bg-[#111111] text-white'
                    : 'bg-white text-[#111111]'
                }`}
              >
                {cat}
              </button>
            );
          })}
        </div>

        {/* Item Cards */}
        <div className="mt-3 space-y-3">
          {displayedItems.map((item) => (
            <div
              key={item.id}
              className="bg-[#F6F2EA] rounded-[24px] p-4 space-y-2"
            >
              <h3 className="text-[16px] font-bold text-[#111111]">
                {item.name}
              </h3>

              {/* Green/Red Price Meter */}
              <div className="relative w-full h-2.5 bg-[#DFDAD0] rounded-full overflow-hidden flex items-center">
                <div
                  style={{
                    marginLeft: `${item.greenBarStartPct}%`,
                    width: `${item.greenBarWidthPct}%`,
                  }}
                  className="h-full bg-[#2E9E6B] rounded-full"
                />
                <div className="ml-auto w-[18%] h-full bg-[#D9534F] rounded-full" />
              </div>

              <div className="flex items-center justify-between text-[12px] font-medium">
                <span className="text-[#2E9E6B]">
                  Fair: {item.fairMinUzs.toLocaleString('en-US')} –{' '}
                  {item.fairMaxUzs.toLocaleString('en-US')} UZS
                </span>
                <span className="text-[#D9534F]">
                  Tourist price {item.touristPriceUzs.toLocaleString('en-US')}+
                </span>
              </div>

              {/* Phrase Bar */}
              <div className="bg-white rounded-full pl-4 pr-1.5 py-1.5 flex items-center justify-between">
                <span className="text-[13px] font-medium text-[#111111]">
                  {item.uzbekPhrase}
                </span>
                <button
                  type="button"
                  onClick={() => handlePlayPhrase(item)}
                  className="px-3.5 py-1.5 rounded-full bg-[#111111] text-white text-[12px] font-semibold flex items-center gap-1"
                >
                  <span>▶</span>
                  <span>Play</span>
                </button>
              </div>
            </div>
          ))}
        </div>

        <button
          type="button"
          onClick={() => {
            setScannedResult(BAZAAR_ITEMS_CATALOG_DEFAULT());
            setShowScannerModal(true);
          }}
          className="mt-3.5 w-full py-4 rounded-full bg-[#EBC878] text-[#111111] text-[15px] font-semibold shadow-sm"
        >
          Scan an item with AI · PRO
        </button>

        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleScanFile}
          className="hidden"
          aria-label="Upload bazaar item photo"
        />
      </div>

      {/* AI Bazaar Scanner Modal */}
      {showScannerModal && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label="AI Fair-Price Bazaar Scanner"
          className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4"
        >
          <div className="bg-[#F6F2EA] text-[#111111] w-full max-w-[370px] rounded-[28px] p-5 shadow-2xl space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-[18px] font-bold">AI Bazaar Fair-Price Result</h3>
              <button
                type="button"
                onClick={() => setShowScannerModal(false)}
                className="w-8 h-8 rounded-full bg-white font-bold"
              >
                ✕
              </button>
            </div>

            {scannedResult && (
              <div className="bg-white rounded-2xl p-4 space-y-2 text-xs">
                <div className="text-[16px] font-bold">{scannedResult.name}</div>
                <div className="text-[#2E9E6B] font-semibold">
                  Fair Price: {scannedResult.fairMinUzs.toLocaleString('en-US')} –{' '}
                  {scannedResult.fairMaxUzs.toLocaleString('en-US')} UZS (~$
                  {(scannedResult.fairMinUzs / 12800).toFixed(1)}–$
                  {(scannedResult.fairMaxUzs / 12800).toFixed(1)} USD)
                </div>
                <div className="text-[#6E6A63]">{scannedResult.confidence}</div>
                <div className="pt-1 border-t border-black/10">
                  <div>
                    <strong>Uzbek:</strong> {scannedResult.uzbekPhrase} ({scannedResult.uzbekMeaning})
                  </div>
                  <div className="mt-1">
                    <strong>Russian:</strong> {scannedResult.russianPhrase}
                  </div>
                </div>
              </div>
            )}

            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="flex-1 py-3 rounded-full bg-[#111111] text-white text-[13px] font-semibold"
              >
                Upload Craft Photo
              </button>
              {tier === 'FREE' && (
                <button
                  type="button"
                  onClick={() => {
                    setShowScannerModal(false);
                    navigate('/plans');
                  }}
                  className="flex-1 py-3 rounded-full bg-[#EBC878] text-[#111111] text-[13px] font-semibold"
                >
                  Upgrade to PRO
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      <TouristBottomNav activeTab="Explore" />
    </div>
  );
};

function BAZAAR_ITEMS_CATALOG_DEFAULT(): BazaarItem {
  return PriceEstimationService.searchBazaarItems('All', '')[1];
}

/**
 * Screen E4 — Offline wallet (Tickets, Hotel, E-Mehmon)
 */
export const ScreenE4OfflineWallet: React.FC = () => {
  const navigate = useNavigate();
  const bookedTickets = useAppStore((s) => s.tripPlan.bookedTickets);
  const bookedHotels = useAppStore((s) => s.tripPlan.bookedHotels);
  const eMehmonRecords = useAppStore((s) => s.eMehmonRecords);
  const setActiveDestination = useAppStore((s) => s.setActiveDestination);

  const [activeTab, setActiveTab] = useState<'Tickets' | 'Hotel' | 'E-Mehmon'>('Tickets');
  const [selectedTicketIndex, setSelectedTicketIndex] = useState(0);

  const primaryTicket = bookedTickets[selectedTicketIndex] || bookedTickets[0];
  const secondaryTicket =
    bookedTickets.find((_, i) => i !== selectedTicketIndex) || bookedTickets[1];

  const handleTakeMeToHotel = (hotel: (typeof bookedHotels)[0]) => {
    setActiveDestination({
      name: hotel.name,
      subtitle: hotel.address,
      lat: hotel.lat,
      lng: hotel.lng,
      distanceMeters: 620,
    });
    navigate('/yandex-go');
  };

  return (
    <div className="flex-1 flex flex-col justify-between">
      <div>
        <ScreenHeader title="Offline wallet" />

        {/* Filter Tabs */}
        <div className="mt-1 flex items-center gap-2">
          {(['Tickets', 'Hotel', 'E-Mehmon'] as const).map((tab) => {
            const isActive = activeTab === tab;
            return (
              <button
                key={tab}
                type="button"
                onClick={() => setActiveTab(tab)}
                className={`px-4 py-2 rounded-full text-[13px] font-semibold transition-colors ${
                  isActive
                    ? 'bg-[#111111] text-white'
                    : 'bg-white text-[#111111]'
                }`}
              >
                {tab}
              </button>
            );
          })}
        </div>

        {activeTab === 'Tickets' && primaryTicket && (
          <div className="mt-3.5 space-y-3">
            {/* Primary White QR Card matching E4 - Offline wallet.png */}
            <div
              data-testid="wallet-primary-qr-card"
              className="bg-white rounded-[28px] p-5 shadow-sm"
            >
              <span className="inline-block bg-[#DDEFE3] text-[#2E9E6B] text-[12px] font-semibold px-3.5 py-1 rounded-full">
                Works offline
              </span>

              <div className="mt-2.5 text-[28px] font-bold tracking-tight text-[#111111]">
                {primaryTicket.title}
              </div>

              <div className="text-[13px] text-[#6E6A63] mt-0.5">
                {primaryTicket.subtitle}
              </div>

              <div className="my-5">
                <QrMatrixSvg payload={primaryTicket.qrPayload} size={196} />
              </div>

              <div className="text-[17px] font-bold text-[#111111]">
                {primaryTicket.passengerName}
              </div>
              <div className="text-[12px] text-[#6E6A63] mt-0.5">
                Show this QR at the gate. No internet needed.
              </div>
            </div>

            {/* Secondary Gold Ticket Card */}
            {secondaryTicket && (
              <button
                type="button"
                onClick={() =>
                  setSelectedTicketIndex((prev) =>
                    prev === 0 && bookedTickets.length > 1 ? 1 : 0
                  )
                }
                className="w-full bg-[#EBC878] rounded-[26px] p-5 text-left transition-transform active:scale-[0.99]"
              >
                <div className="text-[17px] font-bold text-[#111111]">
                  {secondaryTicket.title}
                </div>
                <div className="text-[13px] text-[#4A463F] mt-1">
                  {secondaryTicket.subtitle}
                </div>
              </button>
            )}
          </div>
        )}

        {activeTab === 'Hotel' && (
          <div className="mt-3.5 space-y-3">
            {bookedHotels.map((hotel) => (
              <div
                key={hotel.id}
                className="bg-white rounded-[26px] p-5 space-y-3 shadow-sm"
              >
                <span className="inline-block bg-[#DDEFE3] text-[#2E9E6B] text-[12px] font-semibold px-3 py-1 rounded-full">
                  Saved Offline · Verified Coordinates
                </span>
                <h3 className="text-[20px] font-bold text-[#111111]">
                  {hotel.name}
                </h3>
                <p className="text-[13px] text-[#6E6A63]">{hotel.address}</p>
                <p className="text-[12px] font-mono text-[#111111]">
                  GPS: {hotel.lat.toFixed(4)}, {hotel.lng.toFixed(4)}
                </p>
                <button
                  type="button"
                  onClick={() => handleTakeMeToHotel(hotel)}
                  className="w-full py-3.5 rounded-full bg-[#111111] text-white text-[14px] font-semibold"
                >
                  Take me to my Hotel (Yandex Go)
                </button>
              </div>
            ))}
          </div>
        )}

        {activeTab === 'E-Mehmon' && (
          <div className="mt-3.5 bg-white rounded-[26px] p-5 space-y-3 shadow-sm">
            <div className="text-[17px] font-bold text-[#111111]">
              Offline E-Mehmon Registration Slips
            </div>
            <p className="text-[13px] text-[#6E6A63]">
              {
                eMehmonRecords.filter((r) => r.verificationStatus !== 'MISSING')
                  .length
              }{' '}
              of {eMehmonRecords.length} nights recorded for passport control.
            </p>
            <button
              type="button"
              onClick={() => navigate('/e-mehmon')}
              className="w-full py-3.5 rounded-full bg-[#111111] text-white text-[14px] font-semibold"
            >
              Manage E-Mehmon Slips
            </button>
          </div>
        )}
      </div>

      <TouristBottomNav activeTab="Trip" />
    </div>
  );
};

/**
 * Screen E5 — My trip (Daily Itinerary Timeline & AI Re-Planner)
 */
export const ScreenE5MyTrip: React.FC = () => {
  const navigate = useNavigate();
  const dailyItinerary = useAppStore((s) => s.tripPlan.dailyItinerary);
  const tier = useAppStore((s) => s.userProfile.tier);
  const regenerateItinerary = useAppStore((s) => s.regenerateItinerary);
  const reorderItineraryItem = useAppStore((s) => s.reorderItineraryItem);
  const setActiveDestination = useAppStore((s) => s.setActiveDestination);
  const showToast = useAppStore((s) => s.showToast);

  const [selectedDayNum, setSelectedDayNum] = useState<number>(1);
  const currentDay =
    dailyItinerary.find((d) => d.dayNumber === selectedDayNum) ||
    dailyItinerary[0];

  const handleActionClick = (item: (typeof currentDay.items)[0]) => {
    if (item.actionType === 'wallet') {
      navigate('/wallet');
      return;
    }
    setActiveDestination({
      name: item.title,
      subtitle: item.subtitle,
      lat: item.lat,
      lng: item.lng,
      distanceMeters: 450,
    });
    navigate('/yandex-go');
  };

  const handleAiReplan = () => {
    regenerateItinerary();
    if (tier === 'FREE') {
      showToast(
        'Recalculated itinerary with local partner stops! Upgrade to PRO for unlimited AI re-planning.',
        'info'
      );
    } else {
      showToast('AI re-planned your day with optimal routing!', 'success');
    }
  };

  return (
    <div className="flex-1 flex flex-col justify-between">
      <div>
        <h1 className="pt-2 text-[34px] font-bold tracking-tight text-[#111111]">
          My trip
        </h1>

        {/* Day Selector Tabs */}
        <div className="mt-3 flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar">
          {dailyItinerary.slice(0, 6).map((day) => {
            const isActive = day.dayNumber === selectedDayNum;
            return (
              <button
                key={day.dayNumber}
                type="button"
                onClick={() => setSelectedDayNum(day.dayNumber)}
                className={`px-4 py-2 rounded-full text-[13px] font-semibold whitespace-nowrap transition-colors ${
                  isActive
                    ? 'bg-[#111111] text-white'
                    : 'bg-white text-[#111111]'
                }`}
              >
                Day {day.dayNumber}
              </button>
            );
          })}
        </div>

        {/* Vertical Timeline */}
        <div className="mt-4 relative pl-7 space-y-3">
          {/* Vertical Line */}
          <div className="absolute left-2.5 top-4 bottom-4 w-[2px] bg-[#CEC8BC]" />

          {currentDay?.items.map((item, idx) => (
            <div key={item.id} className="relative flex items-center">
              {/* Timeline Dot */}
              <span
                className={`-left-7 absolute w-4 h-4 rounded-full ${
                  idx === 0 ? 'bg-[#2E9E6B]' : 'bg-[#111111]'
                }`}
              />

              {/* Stop Card */}
              <div className="w-full bg-[#F6F2EA] rounded-[22px] p-3.5 flex items-center justify-between">
                <div
                  onClick={() =>
                    reorderItineraryItem(
                      currentDay.dayNumber,
                      item.id,
                      idx > 0 ? 'up' : 'down'
                    )
                  }
                  className="cursor-pointer pr-2"
                  title="Tap to reorder stop"
                >
                  <span className="inline-block bg-[#EBC878] text-[#111111] text-[11px] font-bold px-2.5 py-0.5 rounded-full">
                    {item.time}
                  </span>
                  <h3 className="mt-1 text-[16px] font-bold text-[#111111]">
                    {item.title}
                  </h3>
                  <div className="text-[12px] text-[#6E6A63]">
                    {item.subtitle}
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => handleActionClick(item)}
                  className="px-4 py-2 rounded-full bg-[#111111] text-white text-[12px] font-semibold shrink-0"
                >
                  {item.actionType === 'wallet' ? 'Wallet' : 'Ride'}
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Bottom CTAs */}
        <div className="mt-4 space-y-2.5">
          <button
            type="button"
            onClick={handleAiReplan}
            className="w-full py-4 rounded-full bg-[#EBC878] text-[#111111] text-[15px] font-semibold shadow-sm"
          >
            AI re-plan my day · PRO
          </button>

          <button
            type="button"
            onClick={() => navigate('/wallet')}
            className="w-full py-4 rounded-full bg-white text-[#111111] text-[15px] font-semibold shadow-sm"
          >
            Open wallet
          </button>
        </div>
      </div>

      <TouristBottomNav activeTab="Trip" />
    </div>
  );
};
