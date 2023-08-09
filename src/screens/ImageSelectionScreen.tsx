import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { View, StyleSheet, Image, TouchableOpacity } from 'react-native';
import { Banner } from '../components/base/ads/Banner';
import getDimensionsAndOrientation from '../components/hooks/getDimensionsAndOrientation';
import { useNavigation, useRoute } from '@react-navigation/native';
import { Btn } from '../components/base/Btn';
import { TxtBanner } from '../components/base/TxtBanner';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { makeRequest } from '../api/user/image';

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

const ImageSelectionScreen = () => {
  const route = useRoute();
  const [error, setError] = useState(false);
  const { imageId, secure_url } = route.params;
  const { dimensions } = getDimensionsAndOrientation();    
  const [choices, setChoices] = useState({});
  const navigation = useNavigation();
  const [loading, setLoading] = useState(false);

  const onSelect = useCallback((value) => {
    setChoices({
      ...choices,
      [value]: !choices[value]
    })
  }, [choices]);

  const onNext = useCallback(async() => {
    setLoading(true);
    try {
      const result = await makeRequest({ body: {
        imageId,
        choices: Object.keys(choices).map((value) => parseInt(value))
      }})
      console.log('Result: ', result);
      AsyncStorage.setItem('created', 'true');
      navigation.reset({
        index: 0,
        routes: [{ name: "Library", params: { connect: true, upscale: true} }]
      });
    } catch(e) {
      console.error(`Error saving image selection: ${e}`);
      setError(error);
    }
    setLoading(false);
  }, [choices, imageId]);

  const offsetHeight = -50;
  const bannerStyle =  {top: (dimensions.screenHeight / 2) + offsetHeight - 25, zIndex: 100000};
  return (
    <View style={styles.container}>
        <>
          {error && <TxtBanner style={bannerStyle}>There's been an error. Please try again.</TxtBanner>}
          {loading ? (
              <TxtBanner style={bannerStyle}>Starting Upscaling Task</TxtBanner>
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
        
        {!loading && <Btn style={[styles.btn, { left: dimensions.screenWidth / 8}]} onPress={onNext}>Next</Btn>}
        <Banner />
    </View>
  );
};
export default ImageSelectionScreen;