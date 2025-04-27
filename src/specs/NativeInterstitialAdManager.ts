import type { TurboModule } from 'react-native';
import { TurboModuleRegistry } from 'react-native';

export interface Spec extends TurboModule {
  loadAd(placementId: string): Promise<void>;
  showAd(placementId: string): Promise<void>;
  preloadAd(placementId: string): Promise<void>;
  showPreloadedAd(placementId: string): Promise<void>;
}

export default TurboModuleRegistry.get<Spec>('InterstitialAdManager');
