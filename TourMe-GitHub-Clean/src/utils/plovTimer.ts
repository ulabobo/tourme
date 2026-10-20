/**
 * Plov Timer engine using the Asia/Tashkent (UTC+5) timezone.
 *
 * Schedule for Besh Qozon / Samarkand Plov Centers:
 * - 08:00 - 11:30: "Cooking now" (giant kazans simmering, first batch ready at 11:30)
 * - 11:30 - 15:30: "Ready & Serving" / "Serving now" (active serving window until kazans empty at 15:30)
 * - 15:30 - 08:00: "Sold Out for Today" (next morning prep starts at 08:00)
 */

export type PlovStatus = 'Cooking now' | 'Ready & Serving' | 'Sold Out for Today';

export interface PlovTimerState {
  status: PlovStatus;
  badgeText: string; // e.g. "Serving now", "Cooking now", "Sold out"
  homeCountdownLabel: string; // e.g. "42 min"
  homeSubtext: string; // e.g. "Next batch · Besh Qozon"
  foodScreenCountdown: string; // e.g. "1h 48m"
  foodScreenSuffix: string; // e.g. "until the plov runs out"
  progressPercent: number; // 0 to 100
  tashkentTimeFormatted: string;
}

export function getTashkentHoursAndMinutes(referenceDate: Date = new Date()): {
  hours: number;
  minutes: number;
  seconds: number;
  formattedTime: string;
} {
  try {
    const formatter = new Intl.DateTimeFormat('en-GB', {
      timeZone: 'Asia/Tashkent',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: false,
    });
    const parts = formatter.formatToParts(referenceDate);
    const hours = Number(parts.find((p) => p.type === 'hour')?.value ?? 12);
    const minutes = Number(parts.find((p) => p.type === 'minute')?.value ?? 0);
    const seconds = Number(parts.find((p) => p.type === 'second')?.value ?? 0);
    return {
      hours,
      minutes,
      seconds,
      formattedTime: `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')} UZT`,
    };
  } catch {
    // Fallback UTC+5 calculation
    const utcMs = referenceDate.getTime() + referenceDate.getTimezoneOffset() * 60000;
    const tashkentDate = new Date(utcMs + 5 * 3600000);
    const hours = tashkentDate.getHours();
    const minutes = tashkentDate.getMinutes();
    const seconds = tashkentDate.getSeconds();
    return {
      hours,
      minutes,
      seconds,
      formattedTime: `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')} UZT`,
    };
  }
}

export function calculatePlovTimer(referenceDate: Date = new Date()): PlovTimerState {
  const { hours, minutes, formattedTime } = getTashkentHoursAndMinutes(referenceDate);
  const currentMinutesOfDay = hours * 60 + minutes;

  const cookingStart = 8 * 60; // 08:00 (480)
  const servingStart = 11 * 60 + 30; // 11:30 (690)
  const soldOutStart = 15 * 60 + 30; // 15:30 (930)

  if (currentMinutesOfDay >= cookingStart && currentMinutesOfDay < servingStart) {
    const minsUntilServing = servingStart - currentMinutesOfDay;
    const h = Math.floor(minsUntilServing / 60);
    const m = minsUntilServing % 60;
    const durationStr = h > 0 ? `${h}h ${m}m` : `${m} min`;
    const progress = Math.round(((currentMinutesOfDay - cookingStart) / (servingStart - cookingStart)) * 100);

    return {
      status: 'Cooking now',
      badgeText: 'Cooking now',
      homeCountdownLabel: `${minsUntilServing} min`,
      homeSubtext: 'Next batch · Besh Qozon',
      foodScreenCountdown: durationStr,
      foodScreenSuffix: 'until first kazan opens',
      progressPercent: Math.min(95, Math.max(15, progress)),
      tashkentTimeFormatted: formattedTime,
    };
  }

  if (currentMinutesOfDay >= servingStart && currentMinutesOfDay < soldOutStart) {
    const minsRemaining = soldOutStart - currentMinutesOfDay;
    const h = Math.floor(minsRemaining / 60);
    const m = minsRemaining % 60;
    const durationStr = h > 0 ? `${h}h ${String(m).padStart(2, '0')}m` : `${m}m`;
    // Next kazan batch opens every 45 minutes during serving window
    const nextBatchMins = (minsRemaining % 45) || 42;
    const progress = Math.round(((soldOutStart - currentMinutesOfDay) / (soldOutStart - servingStart)) * 100);

    return {
      status: 'Ready & Serving',
      badgeText: 'Serving now',
      homeCountdownLabel: `${nextBatchMins} min`,
      homeSubtext: 'Next batch · Besh Qozon',
      foodScreenCountdown: durationStr,
      foodScreenSuffix: 'until the plov runs out',
      progressPercent: Math.min(90, Math.max(20, progress)),
      tashkentTimeFormatted: formattedTime,
    };
  }

  // Sold Out for Today (15:30 -> 08:00 next day)
  const minsUntilMorning =
    currentMinutesOfDay >= soldOutStart
      ? 24 * 60 - currentMinutesOfDay + cookingStart
      : cookingStart - currentMinutesOfDay;
  const h = Math.floor(minsUntilMorning / 60);
  const m = minsUntilMorning % 60;

  return {
    status: 'Sold Out for Today',
    badgeText: 'Sold Out for Today',
    homeCountdownLabel: `${h}h ${m}m`,
    homeSubtext: 'Next batch · Besh Qozon',
    foodScreenCountdown: `${h}h ${String(m).padStart(2, '0')}m`,
    foodScreenSuffix: 'until morning kazan prep',
    progressPercent: 100,
    tashkentTimeFormatted: formattedTime,
  };
}
