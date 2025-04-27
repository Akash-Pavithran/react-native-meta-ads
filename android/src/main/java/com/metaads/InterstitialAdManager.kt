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
    private var preloadedAd: InterstitialAd? = null
    private val TAG = "InterstitialAdManager"

    companion object {
        const val NAME = "InterstitialAdManager"
    }

    override fun getName() = NAME

    override fun loadAd(placementId: String, promise: Promise) {
        try {
            // Create the interstitial ad
            interstitialAd = InterstitialAd(reactApplicationContext, placementId)

            // Create listeners for the Interstitial Ad
            val interstitialAdListener = object : InterstitialAdListener {
                override fun onInterstitialDisplayed(ad: com.facebook.ads.Ad) {
                    Log.d(TAG, "Interstitial ad displayed")
                }

                override fun onInterstitialDismissed(ad: com.facebook.ads.Ad) {
                    Log.d(TAG, "Interstitial ad dismissed")
                }

                override fun onError(ad: com.facebook.ads.Ad, adError: AdError) {
                    Log.e(TAG, "Interstitial ad failed to load: ${adError.errorMessage}")
                    promise.reject("AD_LOAD_ERROR", adError.errorMessage)
                }

                override fun onAdLoaded(ad: com.facebook.ads.Ad) {
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

    override fun preloadAd(placementId: String, promise: Promise) {
        try {
            // Create the preloaded interstitial ad
            preloadedAd = InterstitialAd(reactApplicationContext, placementId)

            // Create listeners for the Preloaded Interstitial Ad
            val preloadedAdListener = object : InterstitialAdListener {
                override fun onInterstitialDisplayed(ad: com.facebook.ads.Ad) {
                    Log.d(TAG, "Preloaded interstitial ad displayed")
                }

                override fun onInterstitialDismissed(ad: com.facebook.ads.Ad) {
                    Log.d(TAG, "Preloaded interstitial ad dismissed")
                }

                override fun onError(ad: com.facebook.ads.Ad, adError: AdError) {
                    Log.e(TAG, "Preloaded interstitial ad failed to load: ${adError.errorMessage}")
                    promise.reject("AD_LOAD_ERROR", adError.errorMessage)
                }

                override fun onAdLoaded(ad: com.facebook.ads.Ad) {
                    Log.d(TAG, "Preloaded interstitial ad is loaded and ready to be displayed")
                    promise.resolve(null)
                }

                override fun onAdClicked(ad: com.facebook.ads.Ad) {
                    Log.d(TAG, "Preloaded interstitial ad clicked")
                }

                override fun onLoggingImpression(ad: com.facebook.ads.Ad) {
                    Log.d(TAG, "Preloaded interstitial ad impression logged")
                }
            }

            // Load the preloaded ad
            val loadConfig = preloadedAd?.buildLoadAdConfig()
                ?.withAdListener(preloadedAdListener)
                ?.build()
            preloadedAd?.loadAd(loadConfig!!)
        } catch (e: Exception) {
            Log.e(TAG, "Error preloading ad: ${e.message}")
            promise.reject("AD_PRELOAD_ERROR", e.message ?: "Unknown error preloading ad")
        }
    }

    override fun showPreloadedAd(placementId: String, promise: Promise) {
        try {
            if (preloadedAd == null || !preloadedAd!!.isAdLoaded) {
                Log.e(TAG, "Preloaded ad not loaded")
                promise.reject("AD_NOT_LOADED", "Preloaded ad is not loaded")
                return
            }

            if (preloadedAd!!.isAdInvalidated) {
                Log.e(TAG, "Preloaded ad is invalidated")
                promise.reject("AD_INVALIDATED", "Preloaded ad is invalidated")
                return
            }

            preloadedAd!!.show()
            promise.resolve(null)
        } catch (e: Exception) {
            Log.e(TAG, "Error showing preloaded ad: ${e.message}")
            promise.reject("AD_SHOW_ERROR", e.message ?: "Unknown error showing preloaded ad")
        }
    }
}
