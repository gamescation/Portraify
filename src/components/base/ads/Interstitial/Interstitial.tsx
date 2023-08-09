import { getPlacement } from "../getPlacement"
import { AdEventType, InterstitialAd, TestIds } from 'react-native-google-mobile-ads';
import { StyleSheet, View } from 'react-native';
import getDimensionsAndOrientation from '../../../hooks/getDimensionsAndOrientation';
import { FadeView } from "../../../base/FadeView";
import { getTrackingStatus } from 'react-native-tracking-transparency';
import { useEffect, useState } from "react";


export function Interstitial() {
    const [loaded, setLoaded] = useState(false);
    const adToServe = getPlacement('admob', 'interstitial');
    const adUnitId = __DEV__ ? TestIds.INTERSTITIAL: adToServe;
    const [showPersonalized, setShowPersonalized] = useState(false);

    const askForPersonalized = async() => {
        try {
            const trackingStatus = await getTrackingStatus();
            if (trackingStatus === 'authorized' || trackingStatus === 'unavailable') {
                // enable tracking features
                setShowPersonalized(true);
            }
        } catch(e) {
            console.log("No tracking");
        }
        setLoaded(true)
    }

    useEffect(() => {
        askForPersonalized();
    }, []);

    const interstitial = InterstitialAd.createForAdRequest(adUnitId, {
        requestNonPersonalizedAdsOnly: showPersonalized,
    });

    useEffect(() => {
        const unsubscribe = interstitial.addAdEventListener(AdEventType.LOADED, () => {
          setLoaded(true);
        });
    
        // Start loading the interstitial straight away
        interstitial.load();
    
        // Unsubscribe from events on unmount
        return unsubscribe;
      }, []);

    return interstitial;
}