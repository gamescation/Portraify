import { secondaryFont } from "../../../constants/fonts";
import { Animated, ButtonProps, ImageBackground, StyleProp, StyleSheet, TextProps, TouchableOpacity, TouchableOpacityProps, View, ViewProps } from "react-native";
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
    btnStyle: ViewProps
    textStyle: TextProps
    wrapperStyle: ViewProps
    overlayStyle: ViewProps
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
        <Animated.View style={[{ opacity: fadeAnim }, props?.wrapperStyle ? props.wrapperStyle: null]}>
            <TouchableOpacity {...props} style={[styles.btn, props?.btnStyle]}>
                <Txt style={[styles.txt, props?.textStyle]} size={props?.size}>{props?.children || DEFAULT_TITLE}</Txt>
                {props?.overlay && <View style={[styles.overlay, props?.overlayStyle, props?.btnStyle?.width ? { width: (props?.btnStyle?.width || 200) - 25 } : {}]}></View>}
            </TouchableOpacity>
        </Animated.View>
    )
}

export default Btn;