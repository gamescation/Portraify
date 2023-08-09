import { useEffect, useRef } from 'react';
import { Animated } from 'react-native';

export const ANIMATION_DURATION = 1000;

export function FadeView(props: any): JSX.Element {
    const loaded = props?.loaded !== undefined ? props.loaded : true;
    const fadeAnim = useRef(new Animated.Value(0)).current; // Initial value for opacity: 1
    useEffect(() => {
        if (loaded) {
            Animated.timing(fadeAnim, {
                toValue: 1, // target value of opacity: 0
                duration: props.duration || ANIMATION_DURATION, // duration of animation: 2s
                useNativeDriver: false, // leverage the native driver
            }).start();
        }
    }, [fadeAnim, loaded]);
    return (
        <Animated.View {...props} style={[{
            opacity: fadeAnim,
        }, props.style]}>{props.children}</Animated.View>
    )
}