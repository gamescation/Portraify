import { useEffect, useMemo, useState } from "react";
import { Image, ImageBackground, ImageBackgroundProps, ImageRequireSource, ImageSourcePropType, StyleSheet, View } from "react-native";
import getDimensionsAndOrientation from "../../hooks/getDimensionsAndOrientation";

interface BackgroundImageProps  extends ImageBackgroundProps {
    sources: ImageRequireSource[]
    source: ImageSourcePropType | null
}

const randomNumber = function (min: number, max: number) {
    return Math.floor(Math.random() * max + min);
}

const styles = StyleSheet.create({
    imageBackground: {
        position: 'absolute',
        top: 0,
        bottom: 0,
        left: 0,
        right: 0,
        opacity: 0.85,
        zIndex: -1,
    },
    overlay: {
        position: 'absolute',
        top: 0,
        bottom: 0,
        left: 0,
        right: 0,
        opacity: 0.5,
        width: '100%',
        zIndex: 100,
        backgroundColor: '#111111',
    },

    view: {
        flexDirection: 'column'
    }
})

export function BackgroundImage({ sources }: BackgroundImageProps): JSX.Element {
    const { dimensions } = getDimensionsAndOrientation();
    const [rand, setRand] = useState(randomNumber(0, sources.length));
    const image = useMemo(() => {
        return sources[rand];
    }, [rand]);
    useEffect(() => {
        return () => {
            setRand(randomNumber(0, sources.length));
        }
    }, [sources])
    return (
        <View style={{position: 'absolute', top: 0}}>
            <Image source={image} style={[styles.imageBackground, 
                dimensions.fullView]} height={dimensions.screenHeight} width={dimensions.screenWidth}  />

            <View style={[styles.overlay, dimensions.fullView]} />
        </View>
    )
}