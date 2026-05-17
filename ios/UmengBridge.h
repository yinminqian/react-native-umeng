//
//  UmengBridge.h
//  ReactNativeUmeng
//
//  Objective-C bridge that imports UMCommon and UMAnalytics frameworks
//  and re-exposes their API to Swift through a plain ObjC interface.
//  (Old 2019 Umeng frameworks don't have Swift module maps.)
//

#import <Foundation/Foundation.h>

NS_ASSUME_NONNULL_BEGIN

@interface UmengBridge : NSObject

+ (void)setLogEnabled:(BOOL)enabled;
+ (void)setupWithAppKey:(NSString *)appKey channel:(NSString *)channel;
+ (void)event:(NSString *)eventId;
+ (void)event:(NSString *)eventId attributes:(NSDictionary<NSString *, NSString *> *)attributes;
+ (void)profileSignInWithPUID:(NSString *)puid;
+ (void)profileSignInWithPUID:(NSString *)puid provider:(NSString *)provider;
+ (void)profileSignOff;
+ (void)beginLogPageView:(NSString *)pageName;
+ (void)endLogPageView:(NSString *)pageName;

@end

NS_ASSUME_NONNULL_END
