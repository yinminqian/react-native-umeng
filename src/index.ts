import Native from './UmengNativeModule';

/**
 * Public API for the Umeng analytics wrapper.
 *
 * Two-stage initialization to satisfy China privacy-policy rules:
 *   1. `preInit(appKey, channel)`  — call early; collects nothing personal.
 *   2. `init(appKey, channel, opts)` — call after the user accepts your privacy policy.
 *
 * Session events (`onResume` / `onPause`) are wired automatically through the
 * native `ReactActivityLifecycleListener`, so you only need to send custom
 * events via `onEvent`.
 *
 * On iOS every method is a no-op (Umeng iOS is intentionally out of scope here).
 */

export type UmengDeviceType = 'phone' | 'box';

export interface UmengInitOptions {
  /** Push secret. Pass empty string when push is not used. */
  pushSecret?: string;
  /** `'phone'` (default) or `'box'`. */
  deviceType?: UmengDeviceType;
  /** Enable verbose Umeng SDK logs. Off by default. */
  logEnabled?: boolean;
}

export interface UmengEventProperties {
  [key: string]: string | number | boolean | null | undefined;
}

/** Turn the Umeng SDK's internal log on/off. Call before `init` to log init. */
export function setLogEnabled(enabled: boolean): void {
  Native.setLogEnabled(enabled);
}

/**
 * Pre-initialization. Safe to call before the user agrees to the privacy
 * policy: only registers the app key and channel, does not collect or upload.
 */
export function preInit(appKey: string, channel: string = 'Umeng'): void {
  if (!appKey) throw new Error('[Umeng] preInit: appKey is required');
  Native.preInit(appKey, channel);
}

/**
 * Full initialization. Call after the user has accepted your privacy policy.
 * Safe to call multiple times — the SDK guards against double-init.
 */
export function init(
  appKey: string,
  channel: string = 'Umeng',
  options: UmengInitOptions = {},
): void {
  if (!appKey) throw new Error('[Umeng] init: appKey is required');
  if (options.logEnabled != null) Native.setLogEnabled(!!options.logEnabled);
  Native.init(
    appKey,
    channel,
    options.deviceType === 'box' ? 2 : 1,
    options.pushSecret ?? '',
  );
}

/** Returns true once `init()` has run successfully. */
export function isInitialized(): boolean {
  return Native.isInitialized();
}

/**
 * Track a custom event.
 *
 * @param eventId  Umeng event id you configured in the Umeng dashboard.
 * @param properties Optional key/value attributes (values are coerced to string).
 */
export function onEvent(
  eventId: string,
  properties?: UmengEventProperties,
): void {
  if (!eventId) throw new Error('[Umeng] onEvent: eventId is required');
  const map: Record<string, string> = {};
  if (properties) {
    for (const k of Object.keys(properties)) {
      const v = properties[k];
      if (v == null) continue;
      map[k] = String(v);
    }
  }
  Native.onEvent(eventId, map);
}

/** Tag the current session with an authenticated user id. */
export function onProfileSignIn(userId: string, provider?: string): void {
  if (!userId) throw new Error('[Umeng] onProfileSignIn: userId is required');
  Native.onProfileSignIn(userId, provider ?? null);
}

/** Drop the previously tagged user id from the session. */
export function onProfileSignOff(): void {
  Native.onProfileSignOff();
}

/**
 * Manual page-tracking helpers. Only useful when you also call
 * `setPageCollectionMode('manual')`. Most apps using RN won't need them.
 */
export function onPageStart(pageName: string): void {
  if (!pageName) throw new Error('[Umeng] onPageStart: pageName is required');
  Native.onPageStart(pageName);
}

export function onPageEnd(pageName: string): void {
  if (!pageName) throw new Error('[Umeng] onPageEnd: pageName is required');
  Native.onPageEnd(pageName);
}

/** Report a caught error message (Umeng surfaces these as custom errors). */
export function reportError(message: string): void {
  if (!message) return;
  Native.reportError(message);
}

const Umeng = {
  setLogEnabled,
  preInit,
  init,
  isInitialized,
  onEvent,
  onProfileSignIn,
  onProfileSignOff,
  onPageStart,
  onPageEnd,
  reportError,
};

export default Umeng;
