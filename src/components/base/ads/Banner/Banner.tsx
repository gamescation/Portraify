import { getPlacement } from "../getPlacement"
import { BannerAd, BannerAdSize, TestIds } from 'react-native-google-mobile-ads';
import { StyleSheet, View } from 'react-native';
import getDimensionsAndOrientation from '../../../hooks/getDimensionsAndOrientation';
import { FadeView } from "../../../base/FadeView";
import { useEffect, useState } from "react";
import { getTrackingStatus } from "react-native-tracking-transparency";


export function Banner(): JSX.Element {
    const adToServe = getPlacement('admob', 'banner');
    const adUnitId = __DEV__ ? TestIds.BANNER: adToServe;
    const height = 50;

    const { dimensions } = getDimensionsAndOrientation();
    const [showPersonalized, setShowPersonalized] = useState(false);

    const askForPersonalized = async() => {
        const trackingStatus = await getTrackingStatus();
        if (trackingStatus === 'authorized' || trackingStatus === 'unavailable') {
          // enable tracking features
          setShowPersonalized(true);
        }
    }

    useEffect(() => {
        askForPersonalized();
    }, []);

    const styles = StyleSheet.create({
        bannerAdWrapper: {position: 'absolute', zIndex: 1000000, bottom: 0},
        bannerAd: {
            height, 
            width: dimensions.screenWidth
        }
    })
    return (
        <FadeView style={styles.bannerAdWrapper} loaded={true}>
            <BannerAd
                unitId={adUnitId}
                size={BannerAdSize.ANCHORED_ADAPTIVE_BANNER}
                requestOptions={{
                    requestNonPersonalizedAdsOnly: showPersonalized,
                }}
                style={styles.bannerAd}
            />
        </FadeView>
    );
}