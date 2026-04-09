export interface ModuleConfig {
  updateInterval?: number;
  dev?: boolean;
  latitude?: number;
  longitude?: number;
  timezone?: string;
  weatherRefreshInterval?: number;
  temperatureUnit?: "celsius" | "fahrenheit";
  [key: string]: unknown;
}

function getConfig(): ModuleConfig | null {
  const el = document.getElementsByClassName("mmm-clock-ao-root")[0];
  if (!(el instanceof HTMLElement)) return null;
  const raw = el.dataset?.config;
  if (!raw) return null;
  try {
    return JSON.parse(raw) as ModuleConfig;
  } catch (e) {
    console.error("[MMM-Clock-ao] Failed to parse data-config JSON", e);
    return null;
  }
}

let _cachedConfig: ModuleConfig | null | undefined;
export function ensureConfig(): ModuleConfig | null {
  if (_cachedConfig !== undefined) return _cachedConfig;
  _cachedConfig = getConfig() ?? null;
  return _cachedConfig;
}
