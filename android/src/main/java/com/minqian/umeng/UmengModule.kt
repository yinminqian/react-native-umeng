package com.minqian.umeng

import android.util.Log
import com.umeng.analytics.MobclickAgent
import com.umeng.commonsdk.UMConfigure
import expo.modules.kotlin.modules.Module
import expo.modules.kotlin.modules.ModuleDefinition

/**
 * Umeng (友盟+) Analytics module for Expo.
 *
 * Implementation notes:
 *   - `preInit` is safe to call *before* the user accepts the privacy policy.
 *   - `init` actually starts collecting + uploading. Call it once consent is in.
 *   - Session events (`onResume` / `onPause`) are wired automatically through
 *     Expo's `OnActivityEntersForeground/Background` hooks, so the host app
 *     does not need to override MainActivity.
 */
class UmengModule : Module() {

  companion object {
    private const val TAG = "UmengModule"

    @Volatile
    private var initialized: Boolean = false
  }

  override fun definition() = ModuleDefinition {
    Name("Umeng")

    // ---- Lifecycle: drive Umeng session start/end ----
    OnActivityEntersForeground {
      val ctx = appContext.reactContext ?: return@OnActivityEntersForeground
      if (initialized) {
        MobclickAgent.onResume(ctx)
      }
    }

    OnActivityEntersBackground {
      val ctx = appContext.reactContext ?: return@OnActivityEntersBackground
      if (initialized) {
        MobclickAgent.onPause(ctx)
      }
    }

    // ---- Configuration / init ----
    Function("setLogEnabled") { enabled: Boolean ->
      UMConfigure.setLogEnabled(enabled)
    }

    Function("preInit") { appKey: String, channel: String ->
      val ctx = appContext.reactContext
        ?: throw IllegalStateException("Umeng.preInit: no React context")
      try {
        UMConfigure.preInit(ctx, appKey, channel)
        Log.d(TAG, "preInit done (appKey=$appKey, channel=$channel)")
      } catch (e: Throwable) {
        Log.e(TAG, "preInit failed", e)
        throw e
      }
    }

    Function("init") { appKey: String, channel: String, deviceType: Int, pushSecret: String ->
      val ctx = appContext.reactContext
        ?: throw IllegalStateException("Umeng.init: no React context")
      try {
        UMConfigure.init(ctx, appKey, channel, deviceType, pushSecret)
        initialized = true
        // Once initialized, also start the current session immediately so the
        // first foreground tick (already past) doesn't get lost.
        MobclickAgent.onResume(ctx)
        Log.d(TAG, "init done (appKey=$appKey, channel=$channel, deviceType=$deviceType)")
      } catch (e: Throwable) {
        Log.e(TAG, "init failed", e)
        throw e
      }
    }

    Function("isInitialized") { initialized }

    // ---- Events ----
    Function("onEvent") { eventId: String, properties: Map<String, String> ->
      val ctx = appContext.reactContext ?: return@Function
      if (!initialized) {
        Log.w(TAG, "onEvent before init — dropped (eventId=$eventId)")
        return@Function
      }
      val payload: MutableMap<String, Any> = HashMap(properties.size + 1)
      payload.putAll(properties)
      MobclickAgent.onEventObject(ctx, eventId, payload)
    }

    // ---- Profile ----
    Function("onProfileSignIn") { userId: String, provider: String? ->
      if (!initialized) return@Function
      if (provider.isNullOrEmpty()) {
        MobclickAgent.onProfileSignIn(userId)
      } else {
        MobclickAgent.onProfileSignIn(provider, userId)
      }
    }

    Function("onProfileSignOff") {
      if (initialized) MobclickAgent.onProfileSignOff()
    }

    // ---- Manual page tracking ----
    Function("onPageStart") { pageName: String ->
      if (initialized) MobclickAgent.onPageStart(pageName)
    }

    Function("onPageEnd") { pageName: String ->
      if (initialized) MobclickAgent.onPageEnd(pageName)
    }

    // ---- Error reporting ----
    Function("reportError") { message: String ->
      val ctx = appContext.reactContext ?: return@Function
      if (!initialized) return@Function
      MobclickAgent.reportError(ctx, message)
    }
  }
}
