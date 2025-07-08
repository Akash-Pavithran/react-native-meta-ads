import type { TurboModule } from 'react-native';
import { TurboModuleRegistry } from 'react-native';
import type { EventEmitter } from 'react-native/Libraries/Types/CodegenTypes';

export interface Spec extends TurboModule {
  loadAd(placementId: string): Promise<void>;
  showAd(placementId: string): Promise<void>;
  readonly onInterstitialDismissed: EventEmitter<void>;
}

export default TurboModuleRegistry.get<Spec>('InterstitialAdManager');
