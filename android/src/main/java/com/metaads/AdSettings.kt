package com.metaads

import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.bridge.Promise
import com.facebook.react.bridge.WritableMap
import com.facebook.react.bridge.Arguments
import com.facebook.ads.AdSettings
import com.facebook.ads.AudienceNetworkAds
import android.util.Log
import android.content.pm.ApplicationInfo


class AdSettings(reactContext: ReactApplicationContext) : NativeAdSettingsSpec(reactContext) {
    init {
        // Set debug mode based on build type
        val isDebug = reactApplicationContext.applicationInfo.flags and ApplicationInfo.FLAG_DEBUGGABLE != 0
        val mode = if (isDebug) {
            AdSettings.IntegrationErrorMode.INTEGRATION_ERROR_CRASH_DEBUG_MODE
        } else {
            AdSettings.IntegrationErrorMode.INTEGRATION_ERROR_CALLBACK_MODE
        }
        AdSettings.setIntegrationErrorMode(mode)
        Log.d("AdSettings", "AdSettings Integration Error Mode set successfully")
    }

    companion object {
        const val NAME = "AdSettings"
    }

    override fun getName() = NAME

    override fun initialize(promise: Promise) {
        try {
            if (AudienceNetworkAds.isInitialized(reactApplicationContext)) {
                Log.w("AdSettings", "Audience Network SDK is already initialized")
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
            val response = Arguments.createMap().apply {
                putBoolean("success", false)
                putString("message", e.message ?: "Initialization failed")
            }
            promise.resolve(response)
        }
    }

    override fun isInitialized(): Boolean {
        return AudienceNetworkAds.isInitialized(reactApplicationContext)
    }

    override fun addTestDevice(deviceHash: String) {
        try {
            AdSettings.addTestDevice(deviceHash)
            Log.d("AdSettings", "Test device added: $deviceHash")
        } catch (e: Exception) {
            Log.e("AdSettings", "Error adding test device: "+e.message)
        }
    }

    override fun clearTestDevices() {
        try {
            AdSettings.clearTestDevices()
            Log.d("AdSettings", "All test devices cleared")
        } catch (e: Exception) {
            Log.e("AdSettings", "Error clearing test devices: "+e.message)
        }
    }

    override fun getCurrentDeviceHash(): String? {
        val sp = reactApplicationContext.getSharedPreferences("FBAdPrefs", 0)
        return sp.getString("deviceIdHash", null)
    }
}