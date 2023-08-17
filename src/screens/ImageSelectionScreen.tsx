import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { View, StyleSheet, Image, TouchableOpacity } from 'react-native';
import { Banner } from '../components/base/ads/Banner';
import getDimensionsAndOrientation from '../components/hooks/getDimensionsAndOrientation';
import { useNavigation, useRoute } from '@react-navigation/native';
import { Btn } from '../components/base/Btn';
import { TxtBanner } from '../components/base/TxtBanner';
import { makeRequest } from '../api/user/image';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { InLine } from '../components/base/ads/InLine/InLineAd';

const styles = StyleSheet.create({
    container: {
      position: 'absolute',
      top: 0,
      bottom: 0,
      left: 0,
      right: 0
    },
    image: {
        position: 'absolute',
        zIndex: 0
    },
    btn: {
      position: 'absolute',
      bottom: 30,
      zIndex: 100000,
    },
    center: {
    },
    keepTxt: {

    },
    box: {
      position: 'absolute',
      opacity: 0,
      zIndex: 10000,
      top: 0,
      left: 0
    }
})

const startTime = '15'

const ImageSelectionScreen = () => {
  const route = useRoute();
  const [error, setError] = useState(false);
  const { imageId, secure_url } = route.params;
  const { dimensions } = getDimensionsAndOrientation();    
  const [choices, setChoices] = useState({});
  const [time, setTime] = useState(startTime);
  const navigation = useNavigation();
  const [loading, setLoading] = useState(false);
  const [startTimer, setStartTimer] = useState(false);

  useEffect(() => {
    if (startTimer) {
      const interval = setInterval(() => {
        setTime(`${parseInt(time) - 1}`);
      }, 1000);

      return () => {
        clearInterval(interval);
      }
    }
  }, [time, startTimer]);

  const onSelect = useCallback((value) => {
    setChoices({
      ...choices,
      [value]: !choices[value]
    })
  }, [choices]);

  const onNext = useCallback(async() => {
    const actualChoices = Object.keys(choices).map((choice) => {
      return choices[choice];
    }).filter((value) => value);

    if (actualChoices.length === 0) {
      navigation.reset({
        index: 0,
        routes: [{ name: "Library" }]
      })
      return;
    }

    setLoading(true);
    try {
      setTime(startTime);
      setStartTimer(true);
      const result = await makeRequest({ body: {
        imageId,
        choices: Object.keys(choices).map((value) => parseInt(value))
      }})
      console.log('Result: ', result);
      await AsyncStorage.removeItem('imageUploaded');

      if (result.success) {
        navigation.reset({
          index: 0,
          routes: [{ name: "Library", params: { connect: true, upscale: true} }]
        });
      }
    } catch(e) {
      console.error(`Error saving image selection: ${e}`);
      setError(error);
    }
    setLoading(false);
    setStartTimer(false);
  }, [choices, imageId]);

  const offsetHeight = -50;
  const bannerStyle =  {top: (dimensions.screenHeight / 2) + offsetHeight - 100, zIndex: 100000};
  return (
    <View style={[styles.container, { width: dimensions.screenWidth, height: dimensions.screenHeight}]}>
        <>
          {error && <TxtBanner style={bannerStyle}>There's been an error. Please try again.</TxtBanner>}
          {loading ? (
            <>
              <TxtBanner style={bannerStyle}>Upscaling... {time}</TxtBanner>
              <InLine wrapperStyle={{ top: (dimensions.screenHeight / 2) - 50, width: dimensions.screenWidth, alignItems: 'center'}} />
            </>
          ): (<TxtBanner style={bannerStyle}>Tap the ones to keep</TxtBanner>)}
          <Image style={[styles.image, {top: offsetHeight}]} source={{ uri: secure_url }} height={dimensions.screenHeight} width={dimensions.screenWidth} />
          
          {[1, 2, 3, 4].map((value) => {
            const position = {
              top: value > 2 ? (dimensions.screenHeight / 2) + offsetHeight - 2: offsetHeight,
              left: value % 3 === 1 ? (dimensions.screenWidth / 2): 0,
              zIndex: 10000,
              backgroundColor: '#ffffff',
              opacity: !choices[value] ? 0.5: 0
            }

            return (
              <TouchableOpacity key={`img-select-${value}`} onPress={() => {
                onSelect(value) 
              }} style={[styles.box, { width: dimensions.screenWidth / 2, height: value > 2 ? dimensions.screenHeight / 2 + offsetHeight: dimensions.screenHeight / 2 }, {top: offsetHeight}, position]}>
              </TouchableOpacity>
            )
          })}
        </>
        
        {!loading && <View style={{ left: 0, width: dimensions.screenWidth, alignItems: 'center', bottom: 150, position: 'absolute', zIndex: 10000 }}><Btn overlay style={[styles.btn]} onPress={onNext}>Next</Btn></View>}
        <View style={{position: 'absolute', bottom: 65}}><Banner /></View>
    </View>
  );
};
export default ImageSelectionScreen;