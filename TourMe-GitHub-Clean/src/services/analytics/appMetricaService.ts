/**
 * Yandex AppMetrica Analytics & Deep-Link Attribution Service
 * Supports Web Counter (ym / AppMetrica tag), Yandex Go affiliate tracking,
 * and persistent local telemetry log for offline/online inspection.
 */

export interface AppMetricaEventRecord {
  id: string;
  name: string;
  params: Record<string, unknown>;
  timestamp: string;
  synced: boolean;
}

const APPMETRICA_STORAGE_KEY = 'uz_companion_appmetrica_events_v1';

declare global {
  interface Window {
    ym?: (counterId: number, action: string, ...args: unknown[]) => void;
    appMetricaInitialized?: boolean;
  }
}

export const APPMETRICA_COUNTER_ID = Number(
  (import.meta as unknown as { env?: Record<string, string> }).env
    ?.VITE_APPMETRICA_COUNTER_ID || 98451203
);

export const APPMETRICA_TRACKING_ID =
  (import.meta as unknown as { env?: Record<string, string> }).env
    ?.VITE_YANDEX_APPMETRICA_TRACKING_ID || '25395763362139037';

class AppMetricaServiceImpl {
  private initialized = false;

  init(): void {
    if (this.initialized || typeof window === 'undefined') return;
    this.initialized = true;
    window.appMetricaInitialized = true;

    this.trackEvent('app_launch', {
      platform: navigator.userAgent,
      counterId: APPMETRICA_COUNTER_ID,
      trackingId: APPMETRICA_TRACKING_ID,
    });
  }

  trackEvent(name: string, params: Record<string, unknown> = {}): AppMetricaEventRecord {
    const record: AppMetricaEventRecord = {
      id: `am-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
      name,
      params,
      timestamp: new Date().toISOString(),
      synced: typeof navigator !== 'undefined' ? navigator.onLine : true,
    };

    try {
      if (typeof window !== 'undefined' && typeof window.ym === 'function') {
        window.ym(APPMETRICA_COUNTER_ID, 'reachGoal', name, params);
      }
      const existing = this.getRecentEvents();
      const updated = [record, ...existing].slice(0, 50);
      localStorage.setItem(APPMETRICA_STORAGE_KEY, JSON.stringify(updated));
    } catch {
      // Ignore storage quota errors in restricted environments
    }

    return record;
  }

  getRecentEvents(): AppMetricaEventRecord[] {
    try {
      const raw = localStorage.getItem(APPMETRICA_STORAGE_KEY);
      if (!raw) return [];
      const parsed = JSON.parse(raw);
      return Array.isArray(parsed) ? parsed : [];
    } catch {
      return [];
    }
  }
}

export const AppMetricaService = new AppMetricaServiceImpl();
