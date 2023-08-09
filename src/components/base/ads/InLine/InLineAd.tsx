import { getPlacement } from "../getPlacement"
import { BannerAd, BannerAdSize, TestIds } from 'react-native-google-mobile-ads';
import { StyleSheet, View } from 'react-native';
import getDimensionsAndOrientation from '../../../hooks/getDimensionsAndOrientation';
import { FadeView } from "../../../base/FadeView";
import { useEffect, useState } from "react";
import { getTrackingStatus } from "react-native-tracking-transparency";


export function InLine(): JSX.Element {
    const adToServe = getPlacement('admob', 'queuedpage');
    const adUnitId = __DEV__ ? TestIds.BANNER: adToServe;
    const height = 400;

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
        inlineWrapper: {position: 'absolute', zIndex: 1000000, top: dimensions.screenHeight / 2.5, bottom: 0, height},
        inlineAd: {
            height, 
            width: dimensions.screenWidth
        }
    })
    return (
        <FadeView style={styles.inlineWrapper} loaded={true}>
            <BannerAd
                unitId={adUnitId}
                size={BannerAdSize.MEDIUM_RECTANGLE}
                requestOptions={{
                    requestNonPersonalizedAdsOnly: showPersonalized,
                }}
                style={styles.inlineAd}
            />
        </FadeView>
    );
}