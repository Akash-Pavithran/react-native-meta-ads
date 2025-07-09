#import "AdSettings.h"
#import <FBAudienceNetwork/FBAudienceNetwork.h>
#import <React/RCTLog.h>
#import <AppTrackingTransparency/AppTrackingTransparency.h>

@implementation AdSettings

static BOOL s_isAudienceNetworkInitialized = NO;

RCT_EXPORT_MODULE()

- (NSArray<NSString *> *)supportedEvents {
    return @[];
}

- (void)requestTrackingAuthorization:(RCTPromiseResolveBlock)resolve
                              reject:(RCTPromiseRejectBlock)reject {
    NSLog(@"🔍 requestTrackingAuthorization called");
    
    // Debug iOS version
    NSOperatingSystemVersion version = [[NSProcessInfo processInfo] operatingSystemVersion];
    NSLog(@"📱 Current iOS version: %ld.%ld.%ld", (long)version.majorVersion, (long)version.minorVersion, (long)version.patchVersion);
    
    // Manual iOS version check as fallback
    BOOL isIOS17Plus = version.majorVersion >= 17;
    NSLog(@"🔍 Manual iOS 17+ check: %@", isIOS17Plus ? @"YES" : @"NO");
    
    if (@available(iOS 14.5, *)) {
        NSLog(@"✅ iOS 14.5+ check passed");
        
        if (@available(iOS 17.0, *)) {
            // iOS 17+: ATT not needed since IDFA is always zeros
            NSLog(@"📱 iOS 17+ detected - ATT not required");
            [self setAdvertiserTrackingEnabled:NO];
            NSDictionary *result = @{
                @"authorized": @NO,
                @"status": @"not_required",
                @"message": @"ATT not required on iOS 17+ (IDFA always zeros)"
            };
            NSLog(@"✅ Returning ATT result: %@", result);
            resolve(result);
            return;
        } else {
            NSLog(@"❌ iOS 17+ check failed - falling back to iOS 14.5-16.x logic");
        }
        
        // Fallback: If @available didn't work but manual check shows iOS 17+
        if (isIOS17Plus) {
            NSLog(@"📱 Manual fallback: iOS 17+ detected - ATT not required");
            [self setAdvertiserTrackingEnabled:NO];
            NSDictionary *result = @{
                @"authorized": @NO,
                @"status": @"not_required",
                @"message": @"ATT not required on iOS 17+ (IDFA always zeros)"
            };
            NSLog(@"✅ Returning ATT result: %@", result);
            resolve(result);
            return;
        }
        
        NSLog(@"📱 iOS 14.5-16.x detected - ATT permission required");
        // iOS 14.5-16.x: ATT permission required
        ATTrackingManagerAuthorizationStatus status = [ATTrackingManager trackingAuthorizationStatus];
        NSLog(@"🔐 Current ATT status: %ld", (long)status);
        
        if (status == ATTrackingManagerAuthorizationStatusNotDetermined) {
            // Request permission
            NSLog(@"🔐 Requesting ATT permission...");
            [ATTrackingManager requestTrackingAuthorizationWithCompletionHandler:^(ATTrackingManagerAuthorizationStatus authStatus) {
                dispatch_async(dispatch_get_main_queue(), ^{
                    [self handleTrackingAuthorizationResult:authStatus resolve:resolve reject:reject];
                });
            }];
        } else {
            // Permission already determined
            NSLog(@"🔐 ATT permission already determined: %ld", (long)status);
            [self handleTrackingAuthorizationResult:status resolve:resolve reject:reject];
        }
    } else {
        // iOS < 14.5, no ATT required
        NSLog(@"📱 iOS < 14.5 detected - ATT not required");
        [self setAdvertiserTrackingEnabled:YES];
        NSDictionary *result = @{
            @"authorized": @YES,
            @"status": @"not_required",
            @"message": @"ATT not required on this iOS version"
        };
        NSLog(@"✅ Returning ATT result: %@", result);
        resolve(result);
    }
}

- (void)handleTrackingAuthorizationResult:(ATTrackingManagerAuthorizationStatus)status
                                   resolve:(RCTPromiseResolveBlock)resolve
                                    reject:(RCTPromiseRejectBlock)reject {
    NSLog(@"🔍 handleTrackingAuthorizationResult called with status: %ld", (long)status);
    
    BOOL isAuthorized = (status == ATTrackingManagerAuthorizationStatusAuthorized);
    
    // Set the tracking enabled flag based on authorization status
    [self setAdvertiserTrackingEnabled:isAuthorized];
    
    NSString *statusString;
    switch (status) {
        case ATTrackingManagerAuthorizationStatusAuthorized:
            statusString = @"authorized";
            break;
        case ATTrackingManagerAuthorizationStatusDenied:
            statusString = @"denied";
            break;
        case ATTrackingManagerAuthorizationStatusRestricted:
            statusString = @"restricted";
            break;
        case ATTrackingManagerAuthorizationStatusNotDetermined:
            statusString = @"notDetermined";
            break;
    }
    
    NSDictionary *result = @{
        @"authorized": @(isAuthorized),
        @"status": statusString,
        @"message": [NSString stringWithFormat:@"Tracking authorization: %@", statusString]
    };
    
    NSLog(@"✅ Returning ATT result: %@", result);
    resolve(result);
}

- (void)initialize:(RCTPromiseResolveBlock)resolve
            reject:(RCTPromiseRejectBlock)reject {
    NSLog(@"🚀 initialize called");
    
    @try {
        if (s_isAudienceNetworkInitialized) {
            RCTLogWarn(@"Audience Network SDK is already initialized");
            NSDictionary *result = @{
                @"success": @YES,
                @"message": @"Audience Network SDK is already initialized"
            };
            resolve(result);
            return;
        }
        
        // First request ATT permission, then initialize SDK
        NSLog(@"🔐 Requesting ATT permission before SDK initialization...");
        [self requestTrackingAuthorization:^(NSDictionary *attResult) {
            NSLog(@"✅ ATT permission result received: %@", attResult);
            
            // Now initialize the SDK
            [FBAudienceNetworkAds initializeWithSettings:nil completionHandler:^(FBAdInitResults *results) {
                s_isAudienceNetworkInitialized = YES;
                NSDictionary *result = @{
                    @"success": @YES,
                    @"message": results.message ?: @"Initialization completed",
                    @"attResult": attResult
                };
                NSLog(@"🎯 Final initialization result: %@", result);
                resolve(result);
            }];
        } reject:^(NSString *code, NSString *message, NSError *error) {
            NSLog(@"❌ ATT request failed: %@", message);
            
            // Even if ATT fails, still try to initialize SDK
            [FBAudienceNetworkAds initializeWithSettings:nil completionHandler:^(FBAdInitResults *results) {
                s_isAudienceNetworkInitialized = YES;
                NSDictionary *result = @{
                    @"success": @YES,
                    @"message": results.message ?: @"Initialization completed",
                    @"attResult": @{
                        @"authorized": @NO,
                        @"status": @"error",
                        @"message": message ?: @"ATT request failed"
                    }
                };
                NSLog(@"🎯 Final initialization result (ATT failed): %@", result);
                resolve(result);
            }];
        }];
        
    } @catch (NSException *exception) {
        NSLog(@"❌ Exception in initialize: %@", exception.reason);
        NSDictionary *result = @{
            @"success": @NO,
            @"message": exception.reason ?: @"Initialization failed"
        };
        resolve(result);
    }
}

- (NSNumber *)isInitialized {
    return @(s_isAudienceNetworkInitialized);
}

- (void)addTestDevice:(NSString *)deviceHash {
    @try {
        [FBAdSettings addTestDevice:deviceHash];
        RCTLogInfo(@"Test device added: %@", deviceHash);
    } @catch (NSException *exception) {
        RCTLogError(@"Error adding test device: %@", exception.reason);
    }
}

- (NSString *)getCurrentDeviceHash {
    return [FBAdSettings testDeviceHash];
}

- (void)clearTestDevices {
    @try {
        [FBAdSettings clearTestDevices];
        RCTLogInfo(@"All test devices cleared");
    } @catch (NSException *exception) {
        RCTLogError(@"Error clearing test devices: %@", exception.reason);
    }
}

- (void)setAdvertiserTrackingEnabled:(BOOL)enabled {
    if ([FBAdSettings respondsToSelector:@selector(setAdvertiserTrackingEnabled:)]) {
        [FBAdSettings setAdvertiserTrackingEnabled:enabled];
    }
}

- (std::shared_ptr<facebook::react::TurboModule>)getTurboModule:
    (const facebook::react::ObjCTurboModule::InitParams &)params
{
    return std::make_shared<facebook::react::NativeAdSettingsSpecJSI>(params);
}

@end 