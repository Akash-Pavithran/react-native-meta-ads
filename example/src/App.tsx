import React, { useEffect, useState } from 'react';
import {
  SafeAreaView,
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  Platform,
} from 'react-native';
import { initialize, InterstitialAdManager } from 'react-native-meta-ads';
import { placementId } from '../config/placementIds';

const getPlacementId = () => {
  const TEST_AD_TYPE = 'CAROUSEL_IMG_SQUARE_LINK'; // Test ad type from https://developers.facebook.com/docs/audience-network/setting-up/test/test-device
  const androidId = placementId.android; // Android placement ID
  const iosId = placementId.ios; // iOS placement ID
  const isAndroid = Platform.OS === 'android';

  if (isAndroid) {
    return __DEV__ ? `${TEST_AD_TYPE}#${androidId}` : androidId;
  }

  return __DEV__ ? `${TEST_AD_TYPE}#${iosId}` : iosId;
};

const PLACEMENT_ID = getPlacementId();
console.log('PLACEMENT_ID', PLACEMENT_ID);

function App(): React.JSX.Element {
  const [isInitialized, setIsInitialized] = useState(false);
  const [isAdLoaded, setIsAdLoaded] = useState(false);
  const [isPreloadedAdReady, setIsPreloadedAdReady] = useState(false);

  useEffect(() => {
    initializeAds();
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

  const loadAd = async () => {
    try {
      await InterstitialAdManager.loadAd(PLACEMENT_ID);
      setIsAdLoaded(true);
      console.log('Ad loaded successfully');
    } catch (error) {
      console.error('Failed to load ad <example load ad>:', error);
    }
  };

  const showAd = async () => {
    try {
      await InterstitialAdManager.showAd(PLACEMENT_ID);
      setIsAdLoaded(false);
      console.log('Ad shown successfully');
    } catch (error) {
      console.error('Error showing ad:', error);
    }
  };

  const preloadAd = async () => {
    try {
      await InterstitialAdManager.preloadAd(PLACEMENT_ID);
      setIsPreloadedAdReady(true);
      console.log('Ad preloaded successfully');
    } catch (error) {
      console.error('Error preloading ad<example preload ad>:', error);
    }
  };

  const showPreloadedAd = async () => {
    try {
      await InterstitialAdManager.showPreloadedAd(PLACEMENT_ID);
      setIsPreloadedAdReady(false);
      console.log('Preloaded ad shown successfully');
    } catch (error) {
      console.error('Error showing preloaded ad:', error);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>Meta Ads Example</Text>
        <Text style={styles.status}>
          SDK Status: {isInitialized ? 'Initialized' : 'Not Initialized'}
        </Text>

        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={[styles.button, !isInitialized && styles.buttonDisabled]}
            onPress={loadAd}
            disabled={!isInitialized}
          >
            <Text style={styles.buttonText}>Load Ad</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.button, !isAdLoaded && styles.buttonDisabled]}
            onPress={showAd}
            disabled={!isAdLoaded}
          >
            <Text style={styles.buttonText}>Show Ad</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.button, !isInitialized && styles.buttonDisabled]}
            onPress={preloadAd}
            disabled={!isInitialized}
          >
            <Text style={styles.buttonText}>Preload Ad</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.button,
              !isPreloadedAdReady && styles.buttonDisabled,
            ]}
            onPress={showPreloadedAd}
            disabled={!isPreloadedAdReady}
          >
            <Text style={styles.buttonText}>Show Preloaded Ad</Text>
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
    marginBottom: 30,
    color: '#666',
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
