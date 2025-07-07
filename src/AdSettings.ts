import { Platform } from 'react-native';
import AdSettings from './specs/NativeAdSettings';

export const AdSettingsManager = {
  async initialize(): Promise<{
    success: boolean;
    message: string;
  }> {
    if (AdSettings) {
      return await AdSettings.initialize();
    }
    return { success: false, message: 'AdSettings module not available' };
  },

  isInitialized(): boolean {
    if (AdSettings) {
      return AdSettings.isInitialized();
    }
    return false;
  },

  addTestDevice(deviceHash: string): void {
    if (AdSettings) {
      AdSettings.addTestDevice(deviceHash);
    }
  },

  getCurrentDeviceHash(): string | undefined {
    if (AdSettings) {
      return AdSettings.getCurrentDeviceHash();
    }
    return undefined;
  },

  clearTestDevices(): void {
    if (AdSettings && AdSettings.clearTestDevices) {
      AdSettings.clearTestDevices();
    }
  },

  // iOS-specific methods
  setLogLevel(
    level: 'none' | 'debug' | 'verbose' | 'warning' | 'error' | 'notification'
  ): void {
    if (Platform.OS === 'ios' && AdSettings?.setLogLevel) {
      AdSettings.setLogLevel(level);
    }
  },

  setAdvertiserIDCollectionEnabled(enabled: boolean): void {
    if (Platform.OS === 'ios' && AdSettings?.setAdvertiserIDCollectionEnabled) {
      AdSettings.setAdvertiserIDCollectionEnabled(enabled);
    }
  },

  setAdvertiserTrackingEnabled(enabled: boolean): void {
    if (Platform.OS === 'ios' && AdSettings?.setAdvertiserTrackingEnabled) {
      AdSettings.setAdvertiserTrackingEnabled(enabled);
    }
  },
};
