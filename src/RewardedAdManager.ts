import NativeRewardedAdManager from './specs/NativeRewardedAdManager';

export const RewardedAdManager = {
  loadAd: async (placementId: string): Promise<void> => {
    if (NativeRewardedAdManager) {
      await NativeRewardedAdManager.loadAd(placementId);
    } else {
      throw new Error('RewardedAdManager not available');
    }
  },

  showAd: async (placementId: string): Promise<void> => {
    if (NativeRewardedAdManager) {
      await NativeRewardedAdManager.showAd(placementId);
    } else {
      throw new Error('RewardedAdManager not available');
    }
  },

  onRewardedVideoCompleted: (() => {
    if (NativeRewardedAdManager) {
      return NativeRewardedAdManager.onRewardedVideoCompleted;
    } else {
      throw new Error('RewardedAdManager not available');
    }
  })(),
};
