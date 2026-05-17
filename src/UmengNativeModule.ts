import { requireOptionalNativeModule, NativeModule } from 'expo-modules-core';
import { Platform } from 'react-native';

export interface UmengNativeModuleType extends NativeModule {
  setLogEnabled(enabled: boolean): void;
  preInit(appKey: string, channel: string): void;
  init(appKey: string, channel: string, deviceType: number, pushSecret: string): void;
  isInitialized(): boolean;
  onEvent(eventId: string, properties: Record<string, string>): void;
  onProfileSignIn(userId: string, provider: string | null): void;
  onProfileSignOff(): void;
  onPageStart(pageName: string): void;
  onPageEnd(pageName: string): void;
  reportError(message: string): void;
}

const stub: UmengNativeModuleType = {
  // expo-modules-core's NativeModule augments with addListener/removeListeners;
  // we only declare the methods we actually expose.
  addListener: () => {},
  removeListeners: () => {},
  setLogEnabled: () => {},
  preInit: () => {},
  init: () => {},
  isInitialized: () => false,
  onEvent: () => {},
  onProfileSignIn: () => {},
  onProfileSignOff: () => {},
  onPageStart: () => {},
  onPageEnd: () => {},
  reportError: () => {},
} as unknown as UmengNativeModuleType;

const native = requireOptionalNativeModule<UmengNativeModuleType>('Umeng');

// Native module is now available on both iOS and Android.
// Fallback to stub only on web or if native autolinking failed.
export default (Platform.OS === 'web' || !native) ? stub : native;
