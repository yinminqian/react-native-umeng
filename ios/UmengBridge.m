//
//  UmengBridge.m
//  ReactNativeUmeng
//

#import "UmengBridge.h"
#import <UMCommon/UMConfigure.h>
#import <UMCommon/UMCommon.h>
#import <UMAnalytics/MobClick.h>

@implementation UmengBridge

+ (void)setLogEnabled:(BOOL)enabled {
    [UMConfigure setLogEnabled:enabled];
}

+ (void)setupWithAppKey:(NSString *)appKey channel:(NSString *)channel {
    [UMConfigure initWithAppkey:appKey channel:channel];
}

+ (void)event:(NSString *)eventId {
    [MobClick event:eventId];
}

+ (void)event:(NSString *)eventId attributes:(NSDictionary<NSString *, NSString *> *)attributes {
    [MobClick event:eventId attributes:attributes];
}

+ (void)profileSignInWithPUID:(NSString *)puid {
    [MobClick profileSignInWithPUID:puid];
}

+ (void)profileSignInWithPUID:(NSString *)puid provider:(NSString *)provider {
    [MobClick profileSignInWithPUID:puid provider:provider];
}

+ (void)profileSignOff {
    [MobClick profileSignOff];
}

+ (void)beginLogPageView:(NSString *)pageName {
    [MobClick beginLogPageView:pageName];
}

+ (void)endLogPageView:(NSString *)pageName {
    [MobClick endLogPageView:pageName];
}

@end
