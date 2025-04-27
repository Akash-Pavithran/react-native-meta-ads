import NativeInterstitialAdManager from './specs/NativeInterstitialAdManager';

export const InterstitialAdManager = {
  loadAd: async (placementId: string): Promise<void> => {
    if (NativeInterstitialAdManager) {
      await NativeInterstitialAdManager.loadAd(placementId);
    } else {
      throw new Error('InterstitialAdManager not available');
    }
  },

  showAd: async (placementId: string): Promise<void> => {
    if (NativeInterstitialAdManager) {
      await NativeInterstitialAdManager.showAd(placementId);
    } else {
      throw new Error('InterstitialAdManager not available');
    }
  },

  preloadAd: async (placementId: string): Promise<void> => {
    if (NativeInterstitialAdManager) {
      await NativeInterstitialAdManager.preloadAd(placementId);
    } else {
      throw new Error('InterstitialAdManager not available');
    }
  },

  showPreloadedAd: async (placementId: string): Promise<void> => {
    if (NativeInterstitialAdManager) {
      await NativeInterstitialAdManager.showPreloadedAd(placementId);
    } else {
      throw new Error('InterstitialAdManager not available');
    }
  },
};
