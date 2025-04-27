import type { TurboModule } from 'react-native';
import { TurboModuleRegistry } from 'react-native';

export interface Spec extends TurboModule {
  initialize(): Promise<{ success: boolean; message: string }>;
  isInitialized(): boolean;
  addTestDevice(deviceHash: string): void;
  // iOS-specific methods
  setLogLevel?(level: string): void;
  setAdvertiserIDCollectionEnabled?(enabled: boolean): void;
  setAdvertiserTrackingEnabled?(enabled: boolean): void;
}

export default TurboModuleRegistry.get<Spec>('AdSettings');
