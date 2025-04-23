package com.metaads

import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.module.annotations.ReactModule
import com.facebook.ads.AdSettings
import com.facebook.ads.AudienceNetworkAds
import com.facebook.react.bridge.ReactMethod
import android.util.Log
import com.facebook.react.bridge.Promise
import com.facebook.react.bridge.Arguments
import android.content.pm.ApplicationInfo

@ReactModule(name = MetaAdsModule.NAME)
class MetaAdsModule(reactContext: ReactApplicationContext) :
  NativeMetaAdsSpec(reactContext) {

  init {
    // Set debug mode based on build type
    val isDebug = reactApplicationContext.applicationInfo.flags and ApplicationInfo.FLAG_DEBUGGABLE != 0
    val mode = if (isDebug) {
      AdSettings.IntegrationErrorMode.INTEGRATION_ERROR_CRASH_DEBUG_MODE
    } else {
      AdSettings.IntegrationErrorMode.INTEGRATION_ERROR_CALLBACK_MODE
    }
    AdSettings.setIntegrationErrorMode(mode)
    Log.d("MetaAdsModule", "AdSettings Integration Error Mode set successfully")
  }

  // This needs to be a Promise because initialization is async
  override fun initialize(promise: Promise) {
    try {
      if (AudienceNetworkAds.isInitialized(reactApplicationContext)) {
        Log.w("MetaAds", "Audience Network SDK is already initialized")
        val result = Arguments.createMap().apply {
          putBoolean("success", true)
          putString("message", "Audience Network SDK is already initialized")
        }
        promise.resolve(result)
        return
      }

      AudienceNetworkAds
        .buildInitSettings(reactApplicationContext)
        .withInitListener(object : AudienceNetworkAds.InitListener {
          override fun onInitialized(result: AudienceNetworkAds.InitResult) {
            val map = Arguments.createMap().apply {
              putBoolean("success", true)
              putString("message", result.message)
            }
            promise.resolve(map)
          }
        })
        .initialize()
    } catch (e: Exception) {
      promise.reject("INITIALIZATION_ERROR", e.message ?: "Failed to initialize SDK")
    }
  }

  // Simple boolean check - no Promise needed
  override fun isInitialized(): Boolean {
    return AudienceNetworkAds.isInitialized(reactApplicationContext)
  }

  override fun add(a: Double, b: Double, promise: Promise) {
    promise.resolve(a + b)
  }

  override fun getName(): String {
    return NAME
  }

  // Example method
  // See https://reactnative.dev/docs/native-modules-android
  override fun multiply(a: Double, b: Double): Double {
    return a * b
  }

  companion object {
    const val NAME = "MetaAds"
  }
}
