import { Platform } from 'react-native';
import AdSettings from './specs/NativeAdSettings';

export async function initialize(): Promise<{
  success: boolean;
  message: string;
}> {
  if (AdSettings) {
    return await AdSettings.initialize();
  }
  return { success: false, message: 'AdSettings module not available' };
}

export function isInitialized(): boolean {
  if (AdSettings) {
    return AdSettings.isInitialized();
  }
  return false;
}

export function addTestDevice(deviceHash: string): void {
  if (AdSettings) {
    AdSettings.addTestDevice(deviceHash);
  }
}

// iOS-specific methods
export function setLogLevel(
  level: 'none' | 'debug' | 'verbose' | 'warning' | 'error' | 'notification'
): void {
  if (Platform.OS === 'ios' && AdSettings?.setLogLevel) {
    AdSettings.setLogLevel(level);
  }
}

export function setAdvertiserIDCollectionEnabled(enabled: boolean): void {
  if (Platform.OS === 'ios' && AdSettings?.setAdvertiserIDCollectionEnabled) {
    AdSettings.setAdvertiserIDCollectionEnabled(enabled);
  }
}

export function setAdvertiserTrackingEnabled(enabled: boolean): void {
  if (Platform.OS === 'ios' && AdSettings?.setAdvertiserTrackingEnabled) {
    AdSettings.setAdvertiserTrackingEnabled(enabled);
  }
}
