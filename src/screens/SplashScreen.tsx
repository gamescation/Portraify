import React from 'react'
import { Image, StyleSheet, Text, View } from 'react-native';
import splash from '../../assets/images/splash.png';
import getDimensionsAndOrientation from '../components/hooks/getDimensionsAndOrientation';

const styles = StyleSheet.create({
    flex: {
        backgroundColor: 'black',
        flex: 1,
        alignContent: 'center',
        justifyContent: 'center'
    },
    logo: {
        position: 'absolute',
        zIndex: 2
    },
    error: {
        color: 'white',
        textAlign: 'center',
        fontSize: 18,
        lineHeight: 30
    },
    splash: {
        ...StyleSheet.absoluteFillObject,
    }
})

export function SplashScreen({ error = '' }: { error?: string }): JSX.Element {
    const {dimensions} = getDimensionsAndOrientation();
    const modifier = { top: dimensions.screenHeight / 2 - 50, left: 0, width: dimensions.screenWidth, height: 100};
    return (
        <View style={styles.flex}>
            <Image source={splash} style={[styles.splash, { width: dimensions.screenWidth, height: dimensions.screenHeight}]} />

            {error && (
                <View>
                    <Text style={styles.error}>{error}</Text>
                    <Text style={styles.error}>Retrying...</Text>
                </View>)}
        </View>
    )
}

export default SplashScreen;