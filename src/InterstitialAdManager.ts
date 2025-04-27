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
};
