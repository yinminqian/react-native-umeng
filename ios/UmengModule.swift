import ExpoModulesCore

// UMCommon and UMAnalytics are old Objective-C frameworks (2019) without
// Swift module maps. We call them via UmengBridge (ObjC wrapper in this pod).

public class UmengModule: Module {
  private var initialized = false

  public func definition() -> ModuleDefinition {
    Name("Umeng")

    Function("setLogEnabled") { (enabled: Bool) in
      UmengBridge.setLogEnabled(enabled)
    }

    Function("preInit") { (_: String, _: String) in
      // Umeng iOS has no separate preInit; this is a no-op.
      // The Android privacy-policy two-stage pattern doesn't apply on iOS.
    }

    Function("init") { (appKey: String, channel: String, _: Int, _: String) in
      UmengBridge.setup(withAppKey: appKey, channel: channel)
      self.initialized = true
    }

    Function("isInitialized") { () -> Bool in
      return self.initialized
    }

    Function("onEvent") { (eventId: String, properties: [String: String]) in
      if properties.isEmpty {
        UmengBridge.event(eventId)
      } else {
        UmengBridge.event(eventId, attributes: properties)
      }
    }

    Function("onProfileSignIn") { (userId: String, provider: String?) in
      if let p = provider, !p.isEmpty {
        UmengBridge.profileSignIn(withPUID: userId, provider: p)
      } else {
        UmengBridge.profileSignIn(withPUID: userId)
      }
    }

    Function("onProfileSignOff") {
      UmengBridge.profileSignOff()
    }

    Function("onPageStart") { (pageName: String) in
      UmengBridge.beginLogPageView(pageName)
    }

    Function("onPageEnd") { (pageName: String) in
      UmengBridge.endLogPageView(pageName)
    }

    Function("reportError") { (message: String) in
      // UMCAnalytics 6.0 has no stock error API; fall back to a custom event
      UmengBridge.event("rn_reported_error", attributes: ["message": message])
    }
  }
}
