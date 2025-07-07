# React Native Meta Ads

A React Native package for Meta Audience Network integration. 
Supports:
- Interstitial ads
- Rewarded ads

## Development Status

⚠️ **Note**: This package is currently in development. Only Android implementation is available at the moment. iOS support is planned but not yet implemented. Contributors are welcome to help implement the iOS side.

## Platform Support

- ✅ Android
- ❌ iOS (Coming soon)

## Installation

```bash
npm install react-native-meta-ads
# or
yarn add react-native-meta-ads
```

## Usage

```javascript
import { InterstitialAdManager, RewardedAdManager, AdSettings } from 'react-native-meta-ads';
import { useEffect, useRef } from 'react';
import { EventSubscription } from 'react-native';

// Initialize the SDK - in App.js (call conditionally based on user preferences, e.g., skip for premium users)
await AdSettings.initialize();

// Basic ad loading and showing
await InterstitialAdManager.loadAd(PLACEMENT_ID);
await InterstitialAdManager.showAd(PLACEMENT_ID);

// Rewarded ads with reward handling
function YourComponent() {
  const [reward, setReward] = useState(0);
  const listenerSubscription = useRef<null | EventSubscription>(null);

  useEffect(() => {
    // Subscribe to reward events
    listenerSubscription.current = RewardedAdManager.onRewardedVideoCompleted(() => {
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

## Requirements

### Android

For optimal performance of video ads (including rewarded ads), it's recommended to enable hardware acceleration in your app's `AndroidManifest.xml`. While hardware acceleration is enabled by default for API level >= 14, explicitly enabling it ensures the best experience:

```xml
<application android:hardwareAccelerated="true" ...>
```

## API

### AdSettings

- `initialize(): Promise<void>`
- `addTestDevice(deviceHash: string): void`
- `clearTestDevices(): void`
- `getCurrentDeviceHash(): string | undefined`

### InterstitialAdManager

- `loadAd(placementId: string): Promise<void>`
- `showAd(placementId: string): Promise<void>`

### RewardedAdManager

- `loadAd(placementId: string): Promise<void>`
- `showAd(placementId: string): Promise<void>`
- `onRewardedVideoCompleted: EventEmitter<void>`

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

**Note:** You can also manually manage test devices using `AdSettings.addTestDevice()`, `AdSettings.clearTestDevices()`, and `AdSettings.getCurrentDeviceHash()` methods. This is useful for advanced features like premium ad-free experiences where you might want to disable ads for specific users.

## Contributing

See the [contributing guide](CONTRIBUTING.md) to learn how to contribute to the repository and the development workflow.

## License

MIT

---

Made with [create-react-native-library](https://github.com/callstack/react-native-builder-bob)
