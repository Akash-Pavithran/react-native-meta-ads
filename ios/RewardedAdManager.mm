#import "RewardedAdManager.h"
#import <FBAudienceNetwork/FBAudienceNetwork.h>
#import <React/RCTLog.h>

@interface RewardedAdManager () <FBRewardedVideoAdDelegate>
@property (nonatomic, strong) FBRewardedVideoAd *rewardedVideoAd;
@property (nonatomic, assign) BOOL isAdLoading;
@end

@implementation RewardedAdManager

RCT_EXPORT_MODULE()

- (NSArray<NSString *> *)supportedEvents {
    return @[@"onRewardedVideoCompleted"];
}

- (void)loadAd:(NSString *)placementId
       resolve:(RCTPromiseResolveBlock)resolve
        reject:(RCTPromiseRejectBlock)reject {
    @try {
        if (self.isAdLoading) {
            reject(@"AD_LOADING", @"Ad is already loading", nil);
            return;
        }
        
        if (self.rewardedVideoAd && self.rewardedVideoAd.isAdValid) {
            reject(@"AD_LOADED", @"Ad is already loaded", nil);
            return;
        }
        
        self.isAdLoading = YES;
        
        // Create the rewarded video ad
        self.rewardedVideoAd = [[FBRewardedVideoAd alloc] initWithPlacementID:placementId];
        self.rewardedVideoAd.delegate = self;
        
        // Load the ad
        [self.rewardedVideoAd loadAd];
        
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
        if (!self.rewardedVideoAd || !self.rewardedVideoAd.isAdValid) {
            RCTLogError(@"Ad not loaded");
            reject(@"AD_NOT_LOADED", @"Ad is not loaded", nil);
            return;
        }
        
        UIViewController *rootViewController = [UIApplication sharedApplication].keyWindow.rootViewController;
        if (!rootViewController) {
            reject(@"AD_SHOW_ERROR", @"No root view controller found", nil);
            return;
        }
        
        [self.rewardedVideoAd showAdFromRootViewController:rootViewController];
        resolve(nil);
        
    } @catch (NSException *exception) {
        RCTLogError(@"Error showing ad: %@", exception.reason);
        reject(@"AD_SHOW_ERROR", exception.reason ?: @"Unknown error showing ad", nil);
    }
}

- (void)emitOnRewardedVideoCompleted {
    [self sendEventWithName:@"onRewardedVideoCompleted" body:nil];
}

#pragma mark - FBRewardedVideoAdDelegate

- (void)rewardedVideoAdDidLoad:(FBRewardedVideoAd *)rewardedVideoAd {
    self.isAdLoading = NO;
    RCTLogInfo(@"Rewarded video ad is loaded and ready to be displayed");
}

- (void)rewardedVideoAd:(FBRewardedVideoAd *)rewardedVideoAd didFailWithError:(NSError *)error {
    self.isAdLoading = NO;
    RCTLogError(@"Rewarded video ad failed to load: %@", error.localizedDescription);
}

- (void)rewardedVideoAdDidClick:(FBRewardedVideoAd *)rewardedVideoAd {
    RCTLogInfo(@"Rewarded video ad clicked");
}

- (void)rewardedVideoAdDidClose:(FBRewardedVideoAd *)rewardedVideoAd {
    RCTLogInfo(@"Rewarded video ad closed");
}

- (void)rewardedVideoAdWillLogImpression:(FBRewardedVideoAd *)rewardedVideoAd {
    RCTLogInfo(@"Rewarded video ad impression logged");
}

- (void)rewardedVideoAdVideoComplete:(FBRewardedVideoAd *)rewardedVideoAd {
    RCTLogInfo(@"Rewarded video completed");
    [self emitOnRewardedVideoCompleted];
}

- (std::shared_ptr<facebook::react::TurboModule>)getTurboModule:
    (const facebook::react::ObjCTurboModule::InitParams &)params
{
    return std::make_shared<facebook::react::NativeRewardedAdManagerSpecJSI>(params);
}

@end 