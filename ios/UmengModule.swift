import ExpoModulesCore
import UMCommon
import UMAnalytics

public class UmengModule: Module {
  private var initialized = false

  public func definition() -> ModuleDefinition {
    Name("Umeng")

    Function("setLogEnabled") { (enabled: Bool) in
      UMConfigure.setLogEnabled(enabled)
    }

    Function("preInit") { (_: String, _: String) in
      // Umeng iOS has no separate preInit; this is a no-op.
      // The Android privacy-policy two-stage pattern doesn't apply on iOS.
    }

    Function("init") { (appKey: String, channel: String, _: Int, _: String) in
      UMConfigure.initWithAppkey(appKey, channel: channel)
      self.initialized = true
    }

    Function("isInitialized") { () -> Bool in
      return self.initialized
    }

    Function("onEvent") { (eventId: String, properties: [String: String]) in
      if properties.isEmpty {
        MobClick.event(eventId)
      } else {
        MobClick.event(eventId, attributes: properties)
      }
    }

    Function("onProfileSignIn") { (userId: String, provider: String?) in
      if let p = provider, !p.isEmpty {
        MobClick.profileSignIn(withPUID: userId, provider: p)
      } else {
        MobClick.profileSignIn(withPUID: userId)
      }
    }

    Function("onProfileSignOff") {
      MobClick.profileSignOff()
    }

    Function("onPageStart") { (pageName: String) in
      MobClick.beginLogPageView(pageName)
    }

    Function("onPageEnd") { (pageName: String) in
      MobClick.endLogPageView(pageName)
    }

    Function("reportError") { (message: String) in
      // UMCAnalytics 6.0 has no stock error API; fall back to a custom event
      MobClick.event("rn_reported_error", attributes: ["message": message])
    }
  }
}
