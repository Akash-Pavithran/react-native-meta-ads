package com.metaads

import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.bridge.Promise
import com.facebook.react.bridge.WritableMap
import com.facebook.react.bridge.Arguments
import com.facebook.ads.RewardedVideoAd
import com.facebook.ads.AdError
import com.facebook.ads.RewardedVideoAdListener
import android.util.Log

class RewardedAdManager(reactContext: ReactApplicationContext) : NativeRewardedAdManagerSpec(reactContext) {
    private var rewardedVideoAd: RewardedVideoAd? = null
    private var isAdLoading = false
    private val TAG = "RewardedAdManager"

    companion object {
        const val NAME = "RewardedAdManager"
    }

    override fun getName() = NAME

    override fun loadAd(placementId: String, promise: Promise) {
        try {
            if (isAdLoading) {
                promise.reject("AD_LOADING", "Ad is already loading")
                return
            }

            if (rewardedVideoAd?.isAdLoaded == true) {
                promise.reject("AD_LOADED", "Ad is already loaded")
                return
            }

            isAdLoading = true
            // Create the rewarded video ad
            rewardedVideoAd = RewardedVideoAd(reactApplicationContext, placementId)

            // Create listeners for the Rewarded Video Ad
            val rewardedVideoAdListener = object : RewardedVideoAdListener {
                override fun onError(ad: com.facebook.ads.Ad, adError: AdError) {
                    isAdLoading = false
                    Log.e(TAG, "Rewarded video ad failed to load: ${adError.errorMessage}")
                    promise.reject("AD_LOAD_ERROR", adError.errorMessage)
                }

                override fun onAdLoaded(ad: com.facebook.ads.Ad) {
                    isAdLoading = false
                    Log.d(TAG, "Rewarded video ad is loaded and ready to be displayed")
                    promise.resolve(null)
                }

                override fun onAdClicked(ad: com.facebook.ads.Ad) {
                    Log.d(TAG, "Rewarded video ad clicked")
                }

                override fun onLoggingImpression(ad: com.facebook.ads.Ad) {
                    Log.d(TAG, "Rewarded video ad impression logged")
                }

                override fun onRewardedVideoCompleted() {
                    Log.d(TAG, "Rewarded video completed")
                    emitOnRewardedVideoCompleted()
                }

                override fun onRewardedVideoClosed() {
                    Log.d(TAG, "Rewarded video ad closed")
                }
            }

            // Load the ad
            val loadConfig = rewardedVideoAd?.buildLoadAdConfig()
                ?.withAdListener(rewardedVideoAdListener)
                ?.build()
            rewardedVideoAd?.loadAd(loadConfig!!)
        } catch (e: Exception) {
            isAdLoading = false
            Log.e(TAG, "Error loading ad: ${e.message}")
            promise.reject("AD_LOAD_ERROR", e.message ?: "Unknown error loading ad")
        }
    }

    override fun showAd(placementId: String, promise: Promise) {
        try {
            if (rewardedVideoAd == null || !rewardedVideoAd!!.isAdLoaded) {
                Log.e(TAG, "Ad not loaded")
                promise.reject("AD_NOT_LOADED", "Ad is not loaded")
                return
            }

            if (rewardedVideoAd!!.isAdInvalidated) {
                Log.e(TAG, "Ad is invalidated")
                promise.reject("AD_INVALIDATED", "Ad is invalidated")
                return
            }

            rewardedVideoAd!!.show()
            promise.resolve(null)
        } catch (e: Exception) {
            Log.e(TAG, "Error showing ad: ${e.message}")
            promise.reject("AD_SHOW_ERROR", e.message ?: "Unknown error showing ad")
        }
    }
} 