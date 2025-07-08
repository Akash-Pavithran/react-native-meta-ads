# React Native Meta Ads

Modern React Native package for Meta Audience Network integration built with TurboModules and the new architecture. 
Supports:
- Interstitial ads
- Rewarded ads

**Built with React Native's new architecture featuring TurboModules, Codegen, and modern performance optimizations.**

## Development Status

⚠️ **Note**: This package currently supports Android only, which meets my requirements. iOS support is planned but I'm currently caught up with other projects and will return to it later.


## Platform Support

- ✅ Android
- ❌ iOS (Coming soon)

## Installation

```bash
npm install react-native-meta-ads
# or
yarn add react-native-meta-ads
```

## Requirements

### Android

For optimal performance of video ads (including rewarded ads), it's recommended to enable hardware acceleration in your app's `AndroidManifest.xml`. While hardware acceleration is enabled by default for API level >= 14, explicitly enabling it ensures the best experience:

```xml
<application android:hardwareAccelerated="true" ...>
```

## API

### AdSettings

- `initialize(): Promise<void>`

### InterstitialAdManager

- `loadAd(placementId: string): Promise<void>`
- `showAd(placementId: string): Promise<void>`
- `onInterstitialDismissed: EventEmitter<void>`

### RewardedAdManager

- `loadAd(placementId: string): Promise<void>`
- `showAd(placementId: string): Promise<void>`
- `onRewardedVideoCompleted: EventEmitter<void>`

## Usage

Initialize the SDK at the top level of your app (e.g., in `App.js`):

```javascript
import { AdSettings } from 'react-native-meta-ads';

// Initialize the SDK - in App.js (call conditionally based on user preferences, e.g., skip for premium users)
await AdSettings.initialize();
```

**Note:** The SDK is initialized as a method rather than automatically to give you control over when ads are loaded. This allows you to skip initialization for premium users (no ad) or implement conditional ad loading based on your app's business logic.

> **From Meta Audience Network Documentation:** In case of not showing the ad immediately after the ad has been loaded, the developer is responsible for checking whether or not the ad has been invalidated. Once the ad is successfully loaded, the ad will be valid for 60 mins. You will not get paid if you are showing an invalidated ad.

## Interstitial Ads

```javascript
import { InterstitialAdManager } from 'react-native-meta-ads';
import { useEffect, useRef } from 'react';
import { EventSubscription } from 'react-native';

// Interstitial ads with timer (see example folder for complete implementation)
function YourParentComponent() {
  const interstitialSubscription = useRef<null | EventSubscription>(null);
  // Listener - helps to know when interstitial ad is dismissed
  useEffect(() => {
    interstitialSubscription.current = InterstitialAdManager.onInterstitialDismissed(() => {
      // Show next interstitial ad after 5 minutes
      setTimeout(() => {
        loadAndShowInterstitialAd()
      }, 5 * 60 * 1000);
    });

    return () => {
      interstitialSubscription.current?.remove();
      interstitialSubscription.current = null;
    };
  }, []);

  // Single function to load and show ad - you can instead load at app start and just show when needed as a preload strategy (But be aware of ad invalidation and expiry)
  const loadAndShowInterstitialAd = async () => {
    try {
      await InterstitialAdManager.loadAd(PLACEMENT_ID); // loads the ad
      await InterstitialAdManager.showAd(PLACEMENT_ID); // shows the ad
    } catch (error) {
        console.error('Error with interstitial ad:', error);
      }
  }
}
```

## Rewarded Ads

```javascript
import { InterstitialAdManager, RewardedAdManager } from 'react-native-meta-ads';
import { useEffect, useRef, useState } from 'react';
import { EventSubscription } from 'react-native';

// Rewarded ads with reward handling
function YourParentComponent() {
  const [reward, setReward] = useState(0);
  const listenerSubscription = useRef<null | EventSubscription>(null);

// Listener - helps to know when rewarded video ad is completely watched
  useEffect(() => {
    listenerSubscription.current = RewardedAdManager.onRewardedVideoCompleted(() => {
      // Give can now give the reward
      setReward(prev => prev + 100);
      console.log('Reward given: +100 points');
    });

    // Cleanup subscription
    return () => {
      listenerSubscription.current?.remove();
      listenerSubscription.current = null;
    };
  }, []);

  const loadAndShowRewardedAd = async () => {
    try {
      await RewardedAdManager.loadAd(PLACEMENT_ID);
      await RewardedAdManager.showAd(PLACEMENT_ID);
    } catch (error) {
      console.error('Error with rewarded ad:', error);
    }
  };

  return (
    <View>
      <Text>Reward Points: {reward}</Text>
      <Button onPress={loadAndShowRewardedAd} title="Watch Ad for Reward" />
    </View>
  );
}
```

## Test Device Handling

### ⚠️ Important: Policy Compliance
**Always use test ads during development to avoid policy violations and potential account bans.** Serving real ads during development may result in account suspension.

### Recommended Test Device Management
You should implement test device management in your app:

```javascript
// Implement this in your app initialization
if (__DEV__) {
  // Development: Add test device for showing test ads while developing
  const deviceHash = AdSettings.getCurrentDeviceHash();
  if (deviceHash) {
    AdSettings.addTestDevice(deviceHash);
  }
} else {
  // Production: Clear test devices to ensure real ads
  AdSettings.clearTestDevices();
}
```

### Testing Real Ads Safely

#### For Physical Devices:
Use **Meta Business Suite Monetization Manager** to test real ads safely:
1. Go to Meta Business Suite → Monetization Manager
2. Navigate to **Integration** → **Testing** and enable testing
3. Add your device's **Google Advertising ID** as a test device
4. Meta will whitelist your device for real ads (no revenue generated)

**To find your Google Advertising ID on Android:** Go to **Settings** → **Google** → **Ads** → **Advertising ID**

**Reference:** [Meta's Test Device Documentation](https://developers.facebook.com/docs/audience-network/setting-up/testing/platform#test-users)


## Contributing

See the [contributing guide](CONTRIBUTING.md) to learn how to contribute to the repository and the development workflow.

## License

MIT

## ☕ Show Appreciation

If this package has helped your project or led to successful monetization, and you'd like to show appreciation, donations via [PayPal](https://paypal.me/akashp96) are welcome.
