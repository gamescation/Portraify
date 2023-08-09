import { secondaryFont } from "../../../constants/fonts";
import { StyleSheet, Text, TextProps } from "react-native";
import { useMemo } from "react";

export enum Size {
    XXS,
    XS,
    S,
    M,
    L,
    XL,
    XXL,
    XXXL
}

export const sizes = {
    [Size.XXS]: 9,
    [Size.XS]: 10,
    [Size.S]: 12,
    [Size.M]: 14,
    [Size.L]: 16,
    [Size.XL]: 18,
    [Size.XXL]: 20,
    [Size.XXXL]: 30
}

const styles = StyleSheet.create({
    txt: {
        color: 'white',
        fontFamily: secondaryFont
    }
})

interface TxtProps extends TextProps {
    size?: Size
}

export function Txt(props?: TxtProps): JSX.Element {
    const fontSize = useMemo(() => {
        if (props?.style && props?.style?.fontSize) {
            return props?.style?.fontSize;
        }

        if (props?.size && sizes[props?.size]) {
            return sizes[props?.size];
        }

        return sizes[Size.L];
    }, [props?.style, props?.size]);

    return (
        <Text {...props} style={[styles.txt, props?.style, { fontSize }]} />
    )
}