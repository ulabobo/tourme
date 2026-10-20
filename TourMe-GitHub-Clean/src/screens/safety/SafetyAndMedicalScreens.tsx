import React, { useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ScreenHeader,
  TouristBottomNav,
} from '../../components/common/UIElements';
import { PharmacyService } from '../../services/domainServices';
import { PersistenceService } from '../../services/persistence/idbService';
import { useAppStore } from '../../store/useAppStore';

/**
 * Screen F1 — Safety hub
 */
export const ScreenF1SafetyHub: React.FC = () => {
  const navigate = useNavigate();
  const safetyState = useAppStore((s) => s.safetyState);
  const setHeartbeatActive = useAppStore((s) => s.setHeartbeatActive);
  const startSosWarningCountdown = useAppStore((s) => s.startSosWarningCountdown);
  const triggerSosDispatch = useAppStore((s) => s.triggerSosDispatch);
  const showToast = useAppStore((s) => s.showToast);

  const handleStartTestAlarm = () => {
    startSosWarningCountdown(true, 10);
    showToast(
      'Entered Test Mode: 10-second "Are you safe?" countdown started. Real 112 will NOT be contacted.',
      'warning'
    );
    navigate('/safety/are-you-safe');
  };

  return (
    <div className="flex-1 flex flex-col justify-between">
      <div>
        <h1 className="pt-2 text-[34px] font-bold tracking-tight text-[#111111]">
          Safety
        </h1>

        {/* Dark Heartbeat Active Card */}
        <div className="mt-3 bg-[#111111] text-white rounded-[26px] p-4 flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2.5">
              <span
                className={`w-3 h-3 rounded-full ${
                  safetyState.isHeartbeatActive ? 'bg-[#35D084]' : 'bg-[#6E6A63]'
                }`}
              />
              <span className="text-[17px] font-bold">
                {safetyState.isHeartbeatActive
                  ? 'Heartbeat active'
                  : 'Heartbeat paused'}
              </span>
            </div>
            <div className="mt-1 text-[13px] text-white/70">
              Next ping in 11 min · every {safetyState.intervalMinutes} min
            </div>
          </div>

          <button
            type="button"
            role="switch"
            aria-checked={safetyState.isHeartbeatActive}
            aria-label="Toggle Heartbeat active"
            onClick={() => setHeartbeatActive(!safetyState.isHeartbeatActive)}
            className={`w-14 h-8 rounded-full p-1 transition-colors flex items-center ${
              safetyState.isHeartbeatActive
                ? 'bg-[#35D084] justify-end'
                : 'bg-white/25 justify-start'
            }`}
          >
            <span className="w-6 h-6 rounded-full bg-white shadow-sm" />
          </button>
        </div>

        {/* Heartbeat Log Card */}
        <div className="mt-3 bg-[#F6F2EA] rounded-[24px] p-4">
          <h2 className="text-[16px] font-bold text-[#111111] mb-2.5">
            Heartbeat log
          </h2>
          <div className="space-y-2.5">
            {safetyState.locationHistory.slice(0, 3).map((ping) => (
              <div
                key={ping.id}
                className="flex items-center justify-between text-[13px]"
              >
                <div className="flex items-center gap-2.5">
                  <span className="font-bold text-[#111111] w-11">
                    {ping.timeLabel}
                  </span>
                  <span className="text-[#6E6A63]">
                    {ping.lat.toFixed(3)}, {ping.lng.toFixed(3)} ·{' '}
                    {ping.battery !== null ? `${ping.battery}%` : 'N/A'}
                  </span>
                </div>
                <span
                  className={`text-[11px] font-semibold px-3 py-1 rounded-full ${
                    ping.status === 'Synced'
                      ? 'bg-[#DDEFE3] text-[#2E9E6B]'
                      : 'bg-[#F5E6BE] text-[#785C12]'
                  }`}
                >
                  {ping.status}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Gold Dead Man's Switch Card */}
        <div className="mt-3 bg-[#EBC878] rounded-[24px] p-4 flex items-center justify-between">
          <div className="pr-3">
            <h2 className="text-[17px] font-bold text-[#111111]">
              Dead Man’s Switch
            </h2>
            <p className="text-[12px] text-[#4A463F] mt-0.5 leading-snug">
              Trekking mode {safetyState.trekkingMode ? 'on' : 'off'} · alarm
              after {safetyState.noMovementHours} h without movement
            </p>
          </div>
          <button
            type="button"
            onClick={() => navigate('/safety/dead-mans-switch')}
            className="px-4 py-2.5 rounded-full bg-[#111111] text-white text-[13px] font-semibold shrink-0"
          >
            Configure
          </button>
        </div>

        {/* Coral Red Hold for 112 Button */}
        <button
          type="button"
          onClick={() => {
            triggerSosDispatch();
            navigate('/safety/sos-sent');
          }}
          className="mt-3 w-full py-5 rounded-[26px] bg-[#D9534F] text-white text-[17px] font-bold shadow-sm active:scale-[0.99] transition-transform"
        >
          Hold for 112 / Tourist Police
        </button>

        {/* 3 Quick Tiles */}
        <div className="mt-3 grid grid-cols-3 gap-2.5">
          <button
            type="button"
            onClick={() => navigate('/e-mehmon')}
            className="bg-[#F6F2EA] hover:bg-white rounded-[20px] py-4 text-[13px] font-bold text-[#111111] transition-colors"
          >
            E-Mehmon
          </button>
          <button
            type="button"
            onClick={() => navigate('/pharmacy')}
            className="bg-[#F6F2EA] hover:bg-white rounded-[20px] py-4 text-[13px] font-bold text-[#111111] transition-colors"
          >
            Pharmacy
          </button>
          <button
            type="button"
            onClick={() => navigate('/emergency-profile')}
            className="bg-[#F6F2EA] hover:bg-white rounded-[20px] py-4 text-[13px] font-bold text-[#111111] transition-colors"
          >
            My profile
          </button>
        </div>

        {/* Test the "Are you safe?" alarm Button */}
        <button
          type="button"
          data-testid="test-sos-alarm-btn"
          onClick={handleStartTestAlarm}
          className="mt-3 w-full py-3.5 rounded-full bg-white text-[#111111] text-[14px] font-semibold shadow-sm"
        >
          Test the “Are you safe?” alarm
        </button>
      </div>

      <TouristBottomNav activeTab="Safety" />
    </div>
  );
};

/**
 * Screen F2 — Dead Man's Switch Configuration
 */
export const ScreenF2DeadMansSwitch: React.FC = () => {
  const navigate = useNavigate();
  const safetyState = useAppStore((s) => s.safetyState);
  const updateDeadMansSwitchConfig = useAppStore((s) => s.updateDeadMansSwitchConfig);
  const showToast = useAppStore((s) => s.showToast);

  const [trekkingMode, setTrekkingMode] = useState(safetyState.trekkingMode);
  const [intervalMinutes, setIntervalMinutes] = useState<5 | 15 | 30>(
    safetyState.intervalMinutes
  );
  const [noMovementHours, setNoMovementHours] = useState(safetyState.noMovementHours);
  const [highRiskZones, setHighRiskZones] = useState<string[]>(
    safetyState.highRiskZones
  );

  const toggleZone = (zone: string) => {
    setHighRiskZones((prev) =>
      prev.includes(zone) ? prev.filter((z) => z !== zone) : [...prev, zone]
    );
  };

  const handleSave = () => {
    updateDeadMansSwitchConfig({
      trekkingMode,
      intervalMinutes,
      noMovementHours,
      highRiskZones,
    });
    showToast("Saved Dead Man's Switch settings.", 'success');
    navigate('/safety');
  };

  return (
    <div className="flex-1 flex flex-col justify-between">
      <div>
        <ScreenHeader title="Dead Man’s Switch" backTo="/safety" />

        {/* Trekking mode toggle card */}
        <div className="mt-2 bg-[#F6F2EA] rounded-[24px] p-4 flex items-center justify-between">
          <span className="text-[16px] font-bold text-[#111111]">
            Trekking mode
          </span>
          <button
            type="button"
            role="switch"
            aria-checked={trekkingMode}
            onClick={() => setTrekkingMode(!trekkingMode)}
            className={`w-14 h-8 rounded-full p-1 transition-colors flex items-center ${
              trekkingMode
                ? 'bg-[#2E9E6B] justify-end'
                : 'bg-[#CBC5BA] justify-start'
            }`}
          >
            <span className="w-6 h-6 rounded-full bg-white shadow-sm" />
          </button>
        </div>

        {/* Heartbeat interval */}
        <div className="mt-4">
          <span className="block text-[13px] font-medium text-[#6E6A63] mb-1.5 ml-1">
            Heartbeat interval
          </span>
          <div className="bg-white rounded-full p-1 flex items-center justify-between">
            {([5, 15, 30] as const).map((mins) => {
              const isSelected = intervalMinutes === mins;
              return (
                <button
                  key={mins}
                  type="button"
                  onClick={() => setIntervalMinutes(mins)}
                  className={`flex-1 py-2.5 rounded-full text-[14px] font-semibold transition-colors ${
                    isSelected
                      ? 'bg-[#111111] text-white'
                      : 'text-[#111111]'
                  }`}
                >
                  {mins} min
                </button>
              );
            })}
          </div>
        </div>

        {/* No movement for stepper */}
        <div className="mt-3.5 bg-[#F6F2EA] rounded-[24px] p-4 flex items-center justify-between">
          <div>
            <div className="text-[12px] text-[#6E6A63]">No movement for</div>
            <div className="text-[22px] font-bold text-[#111111] mt-0.5">
              {noMovementHours} {noMovementHours === 1 ? 'hour' : 'hours'}
            </div>
          </div>

          <div className="flex items-center gap-2.5">
            <button
              type="button"
              aria-label="Decrease hours"
              onClick={() => setNoMovementHours((h) => Math.max(1, h - 1))}
              className="w-11 h-11 rounded-full bg-white text-[#111111] text-xl font-bold flex items-center justify-center shadow-sm"
            >
              −
            </button>
            <button
              type="button"
              aria-label="Increase hours"
              onClick={() => setNoMovementHours((h) => Math.min(24, h + 1))}
              className="w-11 h-11 rounded-full bg-[#111111] text-white text-xl font-bold flex items-center justify-center shadow-sm"
            >
              +
            </button>
          </div>
        </div>

        {/* First Warning Note */}
        <div className="mt-3.5 bg-[#F5E6BE] rounded-2xl p-3.5 text-[13px] font-medium text-[#111111]">
          First: “Are you safe?” — confirm within 10 minutes
        </div>

        {/* Auto-send Checklist */}
        <div className="mt-3.5 bg-[#F6F2EA] rounded-[24px] p-4 space-y-2.5">
          <div className="text-[14px] font-bold text-[#111111] leading-snug">
            If no reply, we auto-send to 112 + your contacts:
          </div>
          {[
            'Last GPS and route history',
            'Passport and medical info',
            'Hotel details',
          ].map((item) => (
            <div key={item} className="flex items-center gap-2.5 text-[14px]">
              <span className="w-5 h-5 rounded-full bg-[#2E9E6B] text-white text-xs font-bold flex items-center justify-center">
                ✓
              </span>
              <span className="text-[#111111]">{item}</span>
            </div>
          ))}
        </div>

        {/* High-risk zones */}
        <div className="mt-4">
          <span className="block text-[13px] font-medium text-[#6E6A63] mb-2 ml-1">
            High-risk zones
          </span>
          <div className="flex items-center gap-2 flex-wrap">
            {(['Chimgan', 'Aydarkul', 'Aral Sea'] as const).map((zone) => {
              const isSelected = highRiskZones.includes(zone);
              return (
                <button
                  key={zone}
                  type="button"
                  onClick={() => toggleZone(zone)}
                  className={`px-4 py-2 rounded-full text-[13px] font-semibold transition-colors ${
                    isSelected
                      ? 'bg-[#111111] text-white'
                      : 'bg-white text-[#111111]'
                  }`}
                >
                  {zone}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      <div className="mt-5">
        <button
          type="button"
          onClick={handleSave}
          className="w-full py-4 rounded-full bg-[#111111] text-white text-[15px] font-semibold"
        >
          Save settings
        </button>
      </div>
    </div>
  );
};

/**
 * Screen F3 — Are you safe? (Full-screen red countdown with Cancel & Escalation)
 */
export const ScreenF3AreYouSafe: React.FC = () => {
  const navigate = useNavigate();
  const safetyState = useAppStore((s) => s.safetyState);
  const cancelSosAlarm = useAppStore((s) => s.cancelSosAlarm);
  const triggerSosDispatch = useAppStore((s) => s.triggerSosDispatch);
  const showToast = useAppStore((s) => s.showToast);

  const formattedCountdown = safetyState.sosCountdownActive
    ? `00:${String(safetyState.sosCountdownSeconds).padStart(2, '0')}`
    : '09:42';

  const handleImSafe = () => {
    cancelSosAlarm();
    showToast('Alarm canceled — marked as SAFE. No emergency alert sent.', 'success');
    navigate('/safety');
  };

  const handleNeedHelp = () => {
    triggerSosDispatch();
    navigate('/safety/sos-sent');
  };

  return (
    <div className="flex-1 flex flex-col justify-between pt-4 pb-2 text-white">
      <div>
        <span className="inline-block bg-white text-[#C2412D] text-[12px] font-bold uppercase tracking-wider px-4 py-1.5 rounded-full">
          SAFETY CHECK
        </span>

        <h1 className="mt-5 text-[46px] leading-[1.04] font-bold tracking-tight">
          Are you
          <br />
          safe?
        </h1>

        <p className="mt-3 text-[15px] text-white/90 leading-snug">
          No movement detected for {safetyState.noMovementHours} hours in Aydarkul.
          {safetyState.isTestMode && (
            <span className="block text-xs text-white/75 mt-1">
              [Test Mode Active: 10s simulation countdown]
            </span>
          )}
        </p>

        {/* Circular Countdown Ring */}
        <div className="my-10 flex items-center justify-center">
          <div className="w-60 h-60 rounded-full border-[8px] border-white/85 flex flex-col items-center justify-center shadow-lg">
            <div
              data-testid="sos-countdown-display"
              className="text-[52px] leading-none font-bold tracking-tight"
            >
              {formattedCountdown}
            </div>
            <div className="mt-2 text-[14px] text-white/85">to confirm</div>
          </div>
        </div>
      </div>

      <div className="space-y-3">
        <button
          type="button"
          data-testid="sos-cancel-im-safe-btn"
          onClick={handleImSafe}
          className="w-full py-4 rounded-full bg-white text-[#C2412D] text-[17px] font-bold shadow-md"
        >
          I’m safe
        </button>

        <button
          type="button"
          data-testid="sos-need-help-btn"
          onClick={handleNeedHelp}
          className="w-full py-4 rounded-full bg-[#7A2316] text-white text-[16px] font-semibold"
        >
          I need help
        </button>

        <p className="pt-1 text-[12px] text-white/80 text-center">
          If you do not answer, we alert 112 and your contacts.
        </p>
      </div>
    </div>
  );
};

/**
 * Screen F4 — SOS sent
 */
export const ScreenF4SosSent: React.FC = () => {
  const navigate = useNavigate();
  const safetyState = useAppStore((s) => s.safetyState);
  const emergencyContacts = useAppStore((s) => s.userProfile.emergencyContacts);
  const cancelSosAlarm = useAppStore((s) => s.cancelSosAlarm);
  const showToast = useAppStore((s) => s.showToast);

  const handleCancelSafe = () => {
    cancelSosAlarm();
    showToast('SOS simulation reset — status returned to SAFE.', 'success');
    navigate('/safety');
  };

  return (
    <div className="flex-1 flex flex-col justify-between pt-6">
      <div className="text-center">
        {/* Green Checkmark Circle */}
        <div className="w-24 h-24 rounded-full bg-[#2E9E6B] text-white text-4xl font-bold flex items-center justify-center mx-auto shadow-md">
          ✓
        </div>

        <h1 className="mt-5 text-[28px] font-bold text-[#111111]">
          Help is on the way
        </h1>
        <p className="mt-1.5 text-[14px] text-[#6E6A63]">
          Your location and details were sent.
        </p>

        {safetyState.isTestMode && (
          <div
            data-testid="sos-test-mode-banner"
            className="mt-2 bg-[#F5E6BE] text-[#785C12] text-[11px] font-semibold px-3 py-1.5 rounded-full inline-block"
          >
            Simulated Test Dispatch — Real 112 was NOT contacted
          </div>
        )}

        {/* Checklist Card */}
        <div className="mt-5 bg-[#F6F2EA] rounded-[26px] p-5 space-y-3.5 text-left">
          {[
            { label: '112 Emergency', badge: 'Sent' },
            { label: 'Tourist Police', badge: 'Sent' },
            {
              label: `Your contacts (${emergencyContacts.length})`,
              badge: 'SMS sent',
            },
            { label: 'Live location', badge: 'Sharing' },
          ].map((row) => (
            <div
              key={row.label}
              className="flex items-center justify-between"
            >
              <div className="flex items-center gap-3">
                <span className="w-6 h-6 rounded-full bg-[#2E9E6B] text-white text-xs font-bold flex items-center justify-center">
                  ✓
                </span>
                <span className="text-[15px] font-semibold text-[#111111]">
                  {row.label}
                </span>
              </div>
              <span className="bg-[#DDEFE3] text-[#2E9E6B] text-[12px] font-semibold px-3 py-1 rounded-full">
                {row.badge}
              </span>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-6 space-y-2.5">
        <button
          type="button"
          onClick={() =>
            showToast(
              'In production, this dials 112 (Uzbekistan Emergency Services). Prevented automatic dial in test mode.',
              'info'
            )
          }
          className="w-full py-4 rounded-full bg-[#D9534F] text-white text-[16px] font-bold"
        >
          Call 112
        </button>

        <button
          type="button"
          onClick={handleCancelSafe}
          className="w-full py-4 rounded-full bg-white text-[#111111] text-[16px] font-semibold shadow-sm"
        >
          Cancel — I’m safe
        </button>

        <p className="pt-1 text-[12px] text-[#6E6A63] text-center">
          We keep sharing your location every minute.
        </p>
      </div>
    </div>
  );
};

/**
 * Screen F5 — E-Mehmon tracker
 */
export const ScreenF5EMehmonTracker: React.FC = () => {
  const eMehmonRecords = useAppStore((s) => s.eMehmonRecords);
  const uploadEMehmonSlip = useAppStore((s) => s.uploadEMehmonSlip);
  const markHotelAskedForEMehmon = useAppStore((s) => s.markHotelAskedForEMehmon);
  const showToast = useAppStore((s) => s.showToast);

  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [targetRecordId, setTargetRecordId] = useState<string>('emehmon-oct-22');
  const [showAskHotelModal, setShowAskHotelModal] = useState(false);

  const registeredCount = eMehmonRecords.filter(
    (r) => r.verificationStatus !== 'MISSING'
  ).length;
  const totalCount = eMehmonRecords.length;
  const missingNight = eMehmonRecords.find((r) => r.verificationStatus === 'MISSING');

  const handleOpenUpload = (recId?: string) => {
    const idToUse = recId || missingNight?.id || eMehmonRecords[0].id;
    setTargetRecordId(idToUse);
    fileInputRef.current?.click();
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = async () => {
      const dataUrl = typeof reader.result === 'string' ? reader.result : '';
      const idbKey = `slip-${targetRecordId}-${Date.now()}`;
      await PersistenceService.saveFile({
        key: idbKey,
        fileName: file.name,
        mimeType: file.type || 'image/png',
        fileSize: file.size,
        dataUrl,
        savedAt: new Date().toISOString(),
      });

      uploadEMehmonSlip(targetRecordId, {
        fileName: file.name,
        fileSize: file.size,
        mimeType: file.type || 'image/png',
        uploadedAt: new Date().toISOString(),
        idbKey,
      });

      showToast(
        `Uploaded receipt "${file.name}" for ${targetRecordId.replace('emehmon-', '')}. Saved offline in IndexedDB!`,
        'success'
      );
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className="flex-1 flex flex-col justify-between">
      <div>
        <ScreenHeader title="E-Mehmon" backTo="/safety" />

        <h2
          data-testid="emehmon-summary-heading"
          className="mt-1 text-[22px] font-bold text-[#111111]"
        >
          Registered {registeredCount} of {totalCount} nights
        </h2>

        {/* 7-Segment Progress Bar */}
        <div className="mt-2.5 grid grid-cols-7 gap-1.5">
          {eMehmonRecords.map((rec) => (
            <div
              key={rec.id}
              className={`h-2.5 rounded-full ${
                rec.verificationStatus === 'MISSING'
                  ? 'bg-[#D9534F]'
                  : 'bg-[#2E9E6B]'
              }`}
            />
          ))}
        </div>

        {/* Night Rows */}
        <div className="mt-3.5 space-y-2">
          {eMehmonRecords.map((rec) => {
            const isMissing = rec.verificationStatus === 'MISSING';
            return (
              <div
                key={rec.id}
                onClick={() => handleOpenUpload(rec.id)}
                className={`rounded-2xl px-4 py-2.5 flex items-center justify-between cursor-pointer transition-colors ${
                  isMissing ? 'bg-[#F2D5CF]' : 'bg-[#F6F2EA]'
                }`}
              >
                <div className="flex items-center gap-3">
                  <span className="text-[14px] font-bold text-[#111111] w-14">
                    {rec.dateLabel}
                  </span>
                  <span className="text-[13px] text-[#6E6A63] truncate">
                    {rec.associatedHotel}
                  </span>
                </div>

                <span
                  className={`text-[11px] font-semibold px-3 py-1 rounded-full ${
                    isMissing
                      ? 'bg-[#D9534F] text-white'
                      : 'bg-[#DDEFE3] text-[#2E9E6B]'
                  }`}
                >
                  {isMissing
                    ? 'Missing'
                    : rec.verificationStatus === 'USER_UPLOADED'
                      ? 'Slip uploaded'
                      : 'Registered'}
                </span>
              </div>
            );
          })}
        </div>

        {/* Warning Box */}
        <div className="mt-3.5 bg-[#F5E6BE] rounded-[22px] p-4">
          <div className="text-[15px] font-bold text-[#111111]">
            {missingNight
              ? `Night of ${missingNight.dateLabel} is missing`
              : 'All nights have registration records'}
          </div>
          <p className="mt-1 text-[12px] text-[#5C4E2C] leading-snug">
            Fines may apply at departure passport control. Upload the slip from
            your hotel. (User-uploaded slips are stored locally as evidence;
            official verification requires hotel submission to emehmon.uz).
          </p>
        </div>

        {/* CTAs */}
        <div className="mt-3.5 grid grid-cols-2 gap-3">
          <button
            type="button"
            onClick={() => handleOpenUpload()}
            className="py-3.5 rounded-full bg-[#111111] text-white text-[15px] font-semibold"
          >
            Scan slip
          </button>

          <button
            type="button"
            onClick={() => {
              if (missingNight) {
                markHotelAskedForEMehmon(missingNight.id);
              }
              setShowAskHotelModal(true);
            }}
            className="py-3.5 rounded-full bg-white text-[#111111] text-[15px] font-semibold shadow-sm"
          >
            Ask the hotel
          </button>
        </div>

        <input
          ref={fileInputRef}
          type="file"
          accept="image/*,application/pdf"
          data-testid="emehmon-file-input"
          onChange={handleFileChange}
          className="hidden"
          aria-label="Upload E-Mehmon registration slip"
        />
      </div>

      {showAskHotelModal && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label="Ask Hotel for E-Mehmon Slip"
          className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4"
        >
          <div className="bg-[#F6F2EA] text-[#111111] w-full max-w-[360px] rounded-[26px] p-5 space-y-3">
            <h3 className="text-[17px] font-bold">Show or Send to Reception</h3>
            <div className="bg-white rounded-2xl p-3.5 text-xs space-y-2">
              <p>
                <strong>Uzbek:</strong> “Iltimos, menga E-Mehmon ro‘yxatdan o‘tganlik haqida kvitansiya (QR slip) bering.”
              </p>
              <p>
                <strong>Russian:</strong> «Пожалуйста, выдайте мне квитанцию регистрации E-Mehmon с QR-кодом.»
              </p>
            </div>
            <button
              type="button"
              onClick={() => {
                setShowAskHotelModal(false);
                showToast('Copied E-Mehmon request message!', 'success');
              }}
              className="w-full py-3 rounded-full bg-[#111111] text-white text-xs font-semibold"
            >
              Copy & Close
            </button>
          </div>
        </div>
      )}

      <TouristBottomNav activeTab="Safety" />
    </div>
  );
};

/**
 * Screen F6 — Medicine mapper
 */
export const ScreenF6MedicineMapper: React.FC = () => {
  const navigate = useNavigate();
  const lastKnownLocation = useAppStore((s) => s.safetyState.lastKnownLocation);
  const setActiveDestination = useAppStore((s) => s.setActiveDestination);
  const showToast = useAppStore((s) => s.showToast);

  const [query, setQuery] = useState('Advil');
  const results = PharmacyService.searchMedicines(query);
  const allMeds = PharmacyService.searchMedicines('');
  const displayedMeds = results.length > 0 ? results : allMeds.slice(0, 2);

  const primaryMed = displayedMeds[0] || allMeds[0];
  const secondaryMed =
    displayedMeds[1] || allMeds.find((m) => m.id !== primaryMed.id) || allMeds[1];

  const pharmacies = PharmacyService.getNearbyPharmacies(
    lastKnownLocation?.lat,
    lastKnownLocation?.lng
  );

  const handleNavigatePharmacy = (pharm = pharmacies[0]) => {
    setActiveDestination({
      name: pharm.name,
      subtitle: pharm.address,
      lat: pharm.lat,
      lng: pharm.lng,
      distanceMeters: pharm.defaultDistanceMeters,
    });
    navigate('/yandex-go');
  };

  return (
    <div className="flex-1 flex flex-col justify-between">
      <div>
        <ScreenHeader title="Medicine mapper" backTo="/safety" />

        {/* Search Input */}
        <div className="mt-1">
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search Tylenol, Advil, Imodium, Pepto-Bismol, Claritin..."
            aria-label="Search medicine brand or ingredient"
            className="w-full px-4 py-3.5 rounded-full bg-white text-[#111111] text-[15px] font-medium focus:outline-none"
          />
        </div>

        {/* Quick Brand Pills */}
        <div className="mt-2 flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar">
          {(['Advil', 'Imodium', 'Tylenol', 'Pepto-Bismol', 'Claritin'] as const).map(
            (brand) => (
              <button
                key={brand}
                type="button"
                onClick={() => setQuery(brand)}
                className={`px-3 py-1 rounded-full text-[11px] font-semibold whitespace-nowrap ${
                  query.toLowerCase() === brand.toLowerCase()
                    ? 'bg-[#111111] text-white'
                    : 'bg-[#F6F2EA] text-[#111111]'
                }`}
              >
                {brand}
              </button>
            )
          )}
        </div>

        {/* Primary Gold Equivalent Card */}
        <div className="mt-2.5 bg-[#EBC878] rounded-[26px] p-5">
          <div className="text-[11px] font-semibold uppercase tracking-wider text-[#4A463F]">
            {primaryMed.foreignBrand.split('/')[0].trim().toUpperCase()} → LOCAL
            EQUIVALENT
          </div>
          <div className="mt-1 text-[24px] font-bold text-[#111111]">
            {primaryMed.localEquivalentTitle}
          </div>
          <div className="mt-0.5 text-[13px] text-[#4A463F]">
            {primaryMed.pharmacistPhrase} · {primaryMed.indicativePriceUzs}
          </div>
          <div className="mt-1.5 text-[11px] text-[#4A463F] leading-snug">
            {primaryMed.clinicalNote}
          </div>
        </div>

        {/* Secondary Light Equivalent Card */}
        {secondaryMed && (
          <div className="mt-3 bg-[#F6F2EA] rounded-[26px] p-5">
            <div className="text-[11px] font-semibold uppercase tracking-wider text-[#6E6A63]">
              {secondaryMed.foreignBrand.toUpperCase()} → LOCAL EQUIVALENT
            </div>
            <div className="mt-1 text-[22px] font-bold text-[#111111]">
              {secondaryMed.localEquivalentTitle}
            </div>
            <div className="mt-0.5 text-[13px] text-[#6E6A63]">
              {secondaryMed.pharmacistPhrase}
            </div>
          </div>
        )}

        {/* Nearby Pharmacies */}
        <h3 className="mt-4 mb-2 text-[17px] font-bold text-[#111111]">
          Nearby pharmacies
        </h3>

        <div className="space-y-2">
          {pharmacies.map((pharm) => (
            <button
              key={pharm.id}
              type="button"
              onClick={() => handleNavigatePharmacy(pharm)}
              className="w-full bg-[#F6F2EA] rounded-2xl px-4 py-3.5 flex items-center justify-between text-left hover:bg-white transition-colors"
            >
              <span className="text-[14px] font-semibold text-[#111111]">
                {pharm.name}
              </span>
              <span className="text-[13px] text-[#6E6A63]">
                {pharm.defaultDistanceMeters} m
              </span>
            </button>
          ))}
        </div>

        {/* Action Buttons */}
        <div className="mt-3.5 space-y-2.5">
          <button
            type="button"
            onClick={() => handleNavigatePharmacy(pharmacies[0])}
            className="w-full py-4 rounded-full bg-[#111111] text-white text-[15px] font-semibold"
          >
            Navigate to nearest pharmacy
          </button>

          <button
            type="button"
            onClick={() =>
              showToast(
                `Requested hotel pharmacy courier for ${primaryMed.localEquivalentTitle} (Demo Service).`,
                'success'
              )
            }
            className="w-full py-3.5 rounded-full bg-white text-[#111111] text-[15px] font-semibold shadow-sm"
          >
            Deliver to my hotel
          </button>
        </div>
      </div>

      <TouristBottomNav activeTab="Safety" />
    </div>
  );
};

/**
 * Screen F7 — Emergency profile
 */
export const ScreenF7EmergencyProfile: React.FC = () => {
  const navigate = useNavigate();
  const userProfile = useAppStore((s) => s.userProfile);
  const bookedHotels = useAppStore((s) => s.tripPlan.bookedHotels);
  const addEmergencyContact = useAppStore((s) => s.addEmergencyContact);
  const updateEmergencyContact = useAppStore((s) => s.updateEmergencyContact);
  const updateMedicalInfo = useAppStore((s) => s.updateMedicalInfo);
  const showToast = useAppStore((s) => s.showToast);

  const [editingId, setEditingId] = useState<string | null>(null);
  const [editName, setEditName] = useState('');
  const [editPhone, setEditPhone] = useState('');
  const [allergies, setAllergies] = useState(userProfile.medicalInfo.allergies);
  const [bloodType, setBloodType] = useState(userProfile.medicalInfo.bloodType);

  const handleAddContact = () => {
    addEmergencyContact({
      name: 'Dr. Weber (Family Clinic)',
      phone: '+49 000 000 003',
    });
    showToast('Added emergency contact.', 'success');
  };

  const handleSaveAll = () => {
    updateMedicalInfo({ allergies, bloodType });
    showToast('Emergency profile & medical info saved securely.', 'success');
    navigate(-1);
  };

  return (
    <div className="flex-1 flex flex-col justify-between">
      <div>
        <ScreenHeader title="Emergency profile" />

        <div className="mt-2 text-[11px] font-semibold uppercase tracking-wider text-[#6E6A63] ml-1">
          EMERGENCY CONTACTS
        </div>

        <div className="mt-2 space-y-2.5">
          {userProfile.emergencyContacts.map((contact) => {
            const isEditing = editingId === contact.id;
            return (
              <div
                key={contact.id}
                className="bg-[#F6F2EA] rounded-[22px] p-4 flex items-center justify-between"
              >
                {isEditing ? (
                  <div className="space-y-1.5 flex-1 mr-2">
                    <input
                      type="text"
                      value={editName}
                      onChange={(e) => setEditName(e.target.value)}
                      className="w-full px-3 py-1 rounded-xl bg-white text-sm font-semibold"
                    />
                    <input
                      type="tel"
                      value={editPhone}
                      onChange={(e) => setEditPhone(e.target.value)}
                      className="w-full px-3 py-1 rounded-xl bg-white text-xs"
                    />
                  </div>
                ) : (
                  <div>
                    <div className="text-[15px] font-bold text-[#111111]">
                      {contact.name}
                    </div>
                    <div className="text-[13px] text-[#6E6A63] mt-0.5">
                      {contact.phone}
                    </div>
                  </div>
                )}

                <button
                  type="button"
                  onClick={() => {
                    if (isEditing) {
                      updateEmergencyContact(contact.id, {
                        name: editName,
                        phone: editPhone,
                      });
                      setEditingId(null);
                      showToast('Updated emergency contact.', 'success');
                    } else {
                      setEditingId(contact.id);
                      setEditName(contact.name);
                      setEditPhone(contact.phone);
                    }
                  }}
                  className="px-4 py-1.5 rounded-full bg-white text-[#111111] text-[13px] font-semibold shadow-sm"
                >
                  {isEditing ? 'Done' : 'Edit'}
                </button>
              </div>
            );
          })}

          <button
            type="button"
            onClick={handleAddContact}
            className="w-full py-3.5 rounded-full bg-white text-[#111111] text-[14px] font-semibold shadow-sm"
          >
            + Add contact
          </button>
        </div>

        {/* Medical & Travel Info */}
        <div className="mt-5 text-[11px] font-semibold uppercase tracking-wider text-[#6E6A63] ml-1">
          MEDICAL & TRAVEL INFO
        </div>

        <div className="mt-2 space-y-2.5">
          <div className="bg-[#F6F2EA] rounded-2xl px-4 py-3.5 flex items-center justify-between">
            <span className="text-[14px] text-[#6E6A63]">Allergies</span>
            <input
              type="text"
              aria-label="Allergies"
              value={allergies}
              onChange={(e) => setAllergies(e.target.value)}
              className="text-[14px] font-bold text-[#111111] bg-transparent text-right focus:outline-none"
            />
          </div>

          <div className="bg-[#F6F2EA] rounded-2xl px-4 py-3.5 flex items-center justify-between">
            <span className="text-[14px] text-[#6E6A63]">Blood type</span>
            <input
              type="text"
              aria-label="Blood type"
              value={bloodType}
              onChange={(e) => setBloodType(e.target.value)}
              className="text-[14px] font-bold text-[#111111] bg-transparent text-right focus:outline-none w-20"
            />
          </div>

          <div className="bg-[#F6F2EA] rounded-2xl px-4 py-3.5 flex items-center justify-between">
            <span className="text-[14px] text-[#6E6A63]">Passport</span>
            <span className="text-[14px] font-bold text-[#111111]">
              {userProfile.passportInfo.maskedNumber}
            </span>
          </div>

          <div className="bg-[#F6F2EA] rounded-2xl px-4 py-3.5 flex items-center justify-between">
            <span className="text-[14px] text-[#6E6A63]">Hotel</span>
            <span className="text-[14px] font-bold text-[#111111]">
              {bookedHotels[0]?.name || 'Registan Medrese Boutique'}
            </span>
          </div>
        </div>

        <div className="mt-3.5 bg-[#F5E6BE] rounded-2xl p-4 text-[13px] text-[#111111] leading-snug">
          This information is sent only if an SOS is triggered.
        </div>
      </div>

      <div className="mt-4">
        <button
          type="button"
          onClick={handleSaveAll}
          className="w-full py-4 rounded-full bg-[#111111] text-white text-[16px] font-semibold"
        >
          Save
        </button>
      </div>
    </div>
  );
};
