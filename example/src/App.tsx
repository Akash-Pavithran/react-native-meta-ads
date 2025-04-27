import React, { useEffect, useState, useRef } from 'react';
import {
  SafeAreaView,
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  Platform,
  type EventSubscription,
} from 'react-native';
import {
  initialize,
  InterstitialAdManager,
  RewardedAdManager,
} from 'react-native-meta-ads';
import { placementId } from '../config/placementIds';

const TEST_AD_TYPE = 'VID_HD_9_16_39S_LINK';

const getPlacementId = (androidId: string, iosId: string) => {
  const isAndroid = Platform.OS === 'android';
  const id = isAndroid ? androidId : iosId;
  return __DEV__ ? `${TEST_AD_TYPE}#${id}` : id;
};

const INTERSTITIAL_PLACEMENT_ID = getPlacementId(
  placementId.interstitial.android,
  placementId.interstitial.ios
);
const REWARDED_PLACEMENT_ID = getPlacementId(
  placementId.rewarded.android,
  placementId.rewarded.ios
);

console.log('INTERSTITIAL_PLACEMENT_ID', INTERSTITIAL_PLACEMENT_ID);
console.log('REWARDED_PLACEMENT_ID', REWARDED_PLACEMENT_ID);

function App(): React.JSX.Element {
  const [isInitialized, setIsInitialized] = useState(false);
  const [isInterstitialLoaded, setIsInterstitialLoaded] = useState(false);
  const [isRewardedLoaded, setIsRewardedLoaded] = useState(false);
  const [reward, setReward] = useState(0);
  const listenerSubscription = useRef<null | EventSubscription>(null);

  useEffect(() => {
    initializeAds();
  }, []);

  useEffect(() => {
    listenerSubscription.current = RewardedAdManager.onRewardedVideoCompleted(
      () => {
        setReward((prev) => prev + 100);
        console.log('Reward given: +100 points');
      }
    );

    return () => {
      listenerSubscription.current?.remove();
      listenerSubscription.current = null;
    };
  }, []);

  const initializeAds = async () => {
    try {
      const result = await initialize();
      if (result.success) {
        setIsInitialized(true);
        console.log('AdSettings initialized:', result.message);
      } else {
        console.error('AdSettings initialization failed:', result.message);
      }
    } catch (error) {
      console.error('Error initializing AdSettings:', error);
    }
  };

  const loadInterstitialAd = async () => {
    try {
      await InterstitialAdManager.loadAd(INTERSTITIAL_PLACEMENT_ID);
      setIsInterstitialLoaded(true);
      console.log('Interstitial ad loaded successfully');
    } catch (error) {
      console.error('Failed to load interstitial ad:', error);
    }
  };

  const showInterstitialAd = async () => {
    try {
      await InterstitialAdManager.showAd(INTERSTITIAL_PLACEMENT_ID);
      setIsInterstitialLoaded(false);
      console.log('Interstitial ad shown successfully');
    } catch (error) {
      console.error('Error showing interstitial ad:', error);
    }
  };

  const loadRewardedAd = async () => {
    try {
      await RewardedAdManager.loadAd(REWARDED_PLACEMENT_ID);
      setIsRewardedLoaded(true);
      console.log('Rewarded ad loaded successfully');
    } catch (error) {
      console.error('Failed to load rewarded ad:', error);
    }
  };

  const showRewardedAd = async () => {
    try {
      await RewardedAdManager.showAd(REWARDED_PLACEMENT_ID);
      setIsRewardedLoaded(false);
      console.log('Rewarded ad shown successfully');
    } catch (error) {
      console.error('Error showing rewarded ad:', error);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>Meta Ads Example</Text>
        <Text style={styles.status}>
          SDK Status: {isInitialized ? 'Initialized' : 'Not Initialized'}
        </Text>
        <Text style={styles.reward}>Reward Points: {reward}</Text>

        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={[styles.button, !isInitialized && styles.buttonDisabled]}
            onPress={loadInterstitialAd}
            disabled={!isInitialized}
          >
            <Text style={styles.buttonText}>Load Interstitial</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.button,
              !isInterstitialLoaded && styles.buttonDisabled,
            ]}
            onPress={showInterstitialAd}
            disabled={!isInterstitialLoaded}
          >
            <Text style={styles.buttonText}>Show Interstitial</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.button, !isInitialized && styles.buttonDisabled]}
            onPress={loadRewardedAd}
            disabled={!isInitialized}
          >
            <Text style={styles.buttonText}>Load Rewarded</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.button, !isRewardedLoaded && styles.buttonDisabled]}
            onPress={showRewardedAd}
            disabled={!isRewardedLoaded}
          >
            <Text style={styles.buttonText}>Show Rewarded</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5FCFF',
  },
  content: {
    flex: 1,
    padding: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  status: {
    fontSize: 16,
    marginBottom: 10,
    color: '#666',
  },
  reward: {
    fontSize: 18,
    marginBottom: 30,
    color: '#2196F3',
    fontWeight: '600',
  },
  buttonContainer: {
    width: '100%',
    gap: 10,
  },
  button: {
    backgroundColor: '#2196F3',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
  },
  buttonDisabled: {
    backgroundColor: '#BDBDBD',
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default App;
