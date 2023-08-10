import { secondaryFont } from "../../../constants/fonts";
import { Animated, ButtonProps, ImageBackground, StyleProp, StyleSheet, TextProps, TouchableOpacity, TouchableOpacityProps, View } from "react-native";
import { Size, Txt } from "../Txt";
import { accentColor, primaryColor, secondaryColor } from "../../../constants/colors";
import { Space } from "../Spacing/Space";
import { useEffect, useRef, useState } from "react";

export const DEFAULT_TITLE = "Let's Go";

const styles = StyleSheet.create({
    btn: {
        paddingHorizontal: Space.Medium.Padding,
        paddingVertical: Space.Small.Padding,
        width: 200,
        height: 55,
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: 'row'
    },
    txt: {
        color: "white",
        textAlign: 'center',
        zIndex: 1,
        fontWeight: '800',
        textTransform: 'uppercase'
    },
    overlay: {
        position: 'absolute',
        width: 175,
        height: 44,
        backgroundColor: primaryColor,
        opacity: 1,
        top: 5,
        left: 12,
        borderRadius: 4,
        zIndex: 0
    },
    image: {
        width: 200,
        height: 55,
        resizeMode: 'contain'
    }
})

interface BtnProps extends TouchableOpacityProps {
    size?: Size
    outline?: boolean
    overlay?: boolean
}

const ANIMATION_DURATION = 1000;

export function Btn(props?: BtnProps): JSX.Element {
    const fadeAnim = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        Animated.timing(fadeAnim, {
            toValue: 1, // target value of opacity: 0
            duration: ANIMATION_DURATION, // duration of animation: 2s
            useNativeDriver: false, // leverage the native driver
        }).start();
    }, [fadeAnim]);

    return (
        <Animated.View style={[{ opacity: fadeAnim }, props?.style ? props.style: null]}>
            <TouchableOpacity {...props} style={[styles.btn, props?.style]}>
                <Txt style={styles.txt} size={props?.size}>{props?.children || DEFAULT_TITLE}</Txt>
                {props?.overlay && <View style={[styles.overlay, props.overlayStyle, props?.style?.width ? { width: (props?.style?.width || 200) - 25 } : {}]}></View>}
            </TouchableOpacity>
        </Animated.View>
    )
}

export default Btn;