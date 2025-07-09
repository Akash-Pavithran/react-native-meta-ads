import type { TurboModule } from 'react-native';
import { TurboModuleRegistry } from 'react-native';

export interface Spec extends TurboModule {
  initialize(): Promise<{
    success: boolean;
    message: string;
    attResult?: {
      authorized: boolean;
      status: string;
      message: string;
    };
  }>;
  isInitialized(): boolean;
  addTestDevice(deviceHash: string): void;
  getCurrentDeviceHash(): string;
  clearTestDevices(): void;
}

export default TurboModuleRegistry.get<Spec>('AdSettings');
