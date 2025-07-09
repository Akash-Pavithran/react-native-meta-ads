#import "InterstitialAdManager.h"
#import <FBAudienceNetwork/FBAudienceNetwork.h>
#import <React/RCTLog.h>

@interface InterstitialAdManager () <FBInterstitialAdDelegate>
@property (nonatomic, strong) FBInterstitialAd *interstitialAd;
@property (nonatomic, assign) BOOL isAdLoading;
@end

@implementation InterstitialAdManager

RCT_EXPORT_MODULE()

- (NSArray<NSString *> *)supportedEvents {
    return @[@"onInterstitialDismissed"];
}

- (void)loadAd:(NSString *)placementId
       resolve:(RCTPromiseResolveBlock)resolve
        reject:(RCTPromiseRejectBlock)reject {
    @try {
        if (self.isAdLoading) {
            reject(@"AD_LOADING", @"Ad is already loading", nil);
            return;
        }
        
        if (self.interstitialAd && self.interstitialAd.isAdValid) {
            reject(@"AD_LOADED", @"Ad is already loaded", nil);
            return;
        }
        
        self.isAdLoading = YES;
        
        // Create the interstitial ad
        self.interstitialAd = [[FBInterstitialAd alloc] initWithPlacementID:placementId];
        self.interstitialAd.delegate = self;
        
        // Load the ad
        [self.interstitialAd loadAd];
        
    } @catch (NSException *exception) {
        self.isAdLoading = NO;
        RCTLogError(@"Error loading ad: %@", exception.reason);
        reject(@"AD_LOAD_ERROR", exception.reason ?: @"Unknown error loading ad", nil);
    }
}

- (void)showAd:(NSString *)placementId
       resolve:(RCTPromiseResolveBlock)resolve
        reject:(RCTPromiseRejectBlock)reject {
    @try {
        if (!self.interstitialAd || !self.interstitialAd.isAdValid) {
            RCTLogError(@"Ad not loaded");
            reject(@"AD_NOT_LOADED", @"Ad is not loaded", nil);
            return;
        }
        
        UIViewController *rootViewController = [UIApplication sharedApplication].keyWindow.rootViewController;
        if (!rootViewController) {
            reject(@"AD_SHOW_ERROR", @"No root view controller found", nil);
            return;
        }
        
        [self.interstitialAd showAdFromRootViewController:rootViewController];
        resolve(nil);
        
    } @catch (NSException *exception) {
        RCTLogError(@"Error showing ad: %@", exception.reason);
        reject(@"AD_SHOW_ERROR", exception.reason ?: @"Unknown error showing ad", nil);
    }
}

- (void)emitOnInterstitialDismissed {
    [self sendEventWithName:@"onInterstitialDismissed" body:nil];
}

#pragma mark - FBInterstitialAdDelegate

- (void)interstitialAdDidLoad:(FBInterstitialAd *)interstitialAd {
    self.isAdLoading = NO;
    RCTLogInfo(@"Interstitial ad is loaded and ready to be displayed");
}

- (void)interstitialAd:(FBInterstitialAd *)interstitialAd didFailWithError:(NSError *)error {
    self.isAdLoading = NO;
    RCTLogError(@"Interstitial ad failed to load: %@", error.localizedDescription);
}

- (void)interstitialAdDidClick:(FBInterstitialAd *)interstitialAd {
    RCTLogInfo(@"Interstitial ad clicked");
}

- (void)interstitialAdDidClose:(FBInterstitialAd *)interstitialAd {
    RCTLogInfo(@"Interstitial ad dismissed");
    [self emitOnInterstitialDismissed];
}

- (void)interstitialAdWillLogImpression:(FBInterstitialAd *)interstitialAd {
    RCTLogInfo(@"Interstitial ad impression logged");
}

- (std::shared_ptr<facebook::react::TurboModule>)getTurboModule:
    (const facebook::react::ObjCTurboModule::InitParams &)params
{
    return std::make_shared<facebook::react::NativeInterstitialAdManagerSpecJSI>(params);
}

@end 