# React Native Meta Ads

A React Native package for Meta Audience Network integration. 
Supports:
- Interstitial ads
- Rewarded ads

## Development Status

⚠️ **Note**: This open-source package currently supports Android and meets my personal requirements. iOS support is planned for the future, but I don't have a timeline for it. I'm sharing it as a package so others can either build upon it or contribute to its development. If this package has significantly saved your time or helped your project or led to successful monetization, and you insist on showing appreciation, donations via [PayPal](https://paypal.me/akashp96) are welcome.

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

// Initialize the SDK
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

### InterstitialAdManager

- `loadAd(placementId: string): Promise<void>`
- `showAd(placementId: string): Promise<void>`

### RewardedAdManager

- `loadAd(placementId: string): Promise<void>`
- `showAd(placementId: string): Promise<void>`
- `onRewardedVideoCompleted: EventEmitter<void>`

### AdSettings

- `initialize(): Promise<void>`

## Contributing

See the [contributing guide](CONTRIBUTING.md) to learn how to contribute to the repository and the development workflow.

## License

MIT

---

Made with [create-react-native-library](https://github.com/callstack/react-native-builder-bob)
