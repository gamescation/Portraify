import React, { useCallback, useEffect, useState } from 'react';
import { View, StyleSheet, Image } from 'react-native';
import { Txt } from '../Txt';
import getDimensionsAndOrientation from '../../../components/hooks/getDimensionsAndOrientation';

const styles = StyleSheet.create({
  text: {
    color: "white",
    textTransform: 'uppercase',
    fontWeight: '800',
    paddingVertical: 2,
    textAlign: 'center'
  },
  textWrapper: {
    backgroundColor: '#313131',
    opacity: 0.65,
    width: '100%',
    paddingVertical: 10,
    zIndex: 1000
  },
})

export const TxtBanner = (props) => {
    const { dimensions } = getDimensionsAndOrientation();
    return (
        <View style={[styles.textWrapper, {top: props.top || dimensions.screenHeight / 5, width: dimensions.screenWidth }, props.style]}>
            <Txt style={styles.text}>{props.children}</Txt>
        </View>
    );
};
export default TxtBanner;