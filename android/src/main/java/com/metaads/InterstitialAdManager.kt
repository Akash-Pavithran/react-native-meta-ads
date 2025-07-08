package com.metaads

import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.bridge.Promise
import com.facebook.react.bridge.WritableMap
import com.facebook.react.bridge.Arguments
import com.facebook.ads.InterstitialAd
import com.facebook.ads.AdError
import com.facebook.ads.InterstitialAdListener
import android.util.Log

class InterstitialAdManager(reactContext: ReactApplicationContext) : NativeInterstitialAdManagerSpec(reactContext) {
    private var interstitialAd: InterstitialAd? = null
    private var isAdLoading = false
    private val TAG = "InterstitialAdManager"

    companion object {
        const val NAME = "InterstitialAdManager"
    }

    override fun getName() = NAME

    override fun loadAd(placementId: String, promise: Promise) {
        try {
            if (isAdLoading) {
                promise.reject("AD_LOADING", "Ad is already loading")
                return
            }

            if (interstitialAd?.isAdLoaded == true) {
                promise.reject("AD_LOADED", "Ad is already loaded")
                return
            }

            isAdLoading = true
            // Create the interstitial ad
            interstitialAd = InterstitialAd(reactApplicationContext, placementId)

            // Create listeners for the Interstitial Ad
            val interstitialAdListener = object : InterstitialAdListener {
                override fun onInterstitialDisplayed(ad: com.facebook.ads.Ad) {
                    Log.d(TAG, "Interstitial ad displayed")
                }

                override fun onInterstitialDismissed(ad: com.facebook.ads.Ad) {
                    Log.d(TAG, "Interstitial ad dismissed")
                    emitOnInterstitialDismissed()
                }

                override fun onError(ad: com.facebook.ads.Ad, adError: AdError) {
                    isAdLoading = false
                    Log.e(TAG, "Interstitial ad failed to load: ${adError.errorMessage}")
                    promise.reject("AD_LOAD_ERROR", adError.errorMessage)
                }

                override fun onAdLoaded(ad: com.facebook.ads.Ad) {
                    isAdLoading = false
                    Log.d(TAG, "Interstitial ad is loaded and ready to be displayed")
                    promise.resolve(null)
                }

                override fun onAdClicked(ad: com.facebook.ads.Ad) {
                    Log.d(TAG, "Interstitial ad clicked")
                }

                override fun onLoggingImpression(ad: com.facebook.ads.Ad) {
                    Log.d(TAG, "Interstitial ad impression logged")
                }
            }

            // Load the ad
            val loadConfig = interstitialAd?.buildLoadAdConfig()
                ?.withAdListener(interstitialAdListener)
                ?.build()
            interstitialAd?.loadAd(loadConfig!!)
        } catch (e: Exception) {
            isAdLoading = false
            Log.e(TAG, "Error loading ad: ${e.message}")
            promise.reject("AD_LOAD_ERROR", e.message ?: "Unknown error loading ad")
        }
    }

    override fun showAd(placementId: String, promise: Promise) {
        try {
            if (interstitialAd == null || !interstitialAd!!.isAdLoaded) {
                Log.e(TAG, "Ad not loaded")
                promise.reject("AD_NOT_LOADED", "Ad is not loaded")
                return
            }

            if (interstitialAd!!.isAdInvalidated) {
                Log.e(TAG, "Ad is invalidated")
                promise.reject("AD_INVALIDATED", "Ad is invalidated")
                return
            }

            interstitialAd!!.show()
            promise.resolve(null)
        } catch (e: Exception) {
            Log.e(TAG, "Error showing ad: ${e.message}")
            promise.reject("AD_SHOW_ERROR", e.message ?: "Unknown error showing ad")
        }
    }
}
