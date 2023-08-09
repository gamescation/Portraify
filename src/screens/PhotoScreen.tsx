import React, { useCallback, useEffect, useRef, useState } from 'react';
import { View, StyleSheet, Text, Platform, Image, ImageBackground, TouchableOpacity } from 'react-native';
import { Size, Txt } from '../components/base/Txt';
import {launchCamera, launchImageLibrary} from 'react-native-image-picker';
import backgroundImage from '../../assets/backgrounds/photographer-2.png'
import takePhotoImage from '../../assets/images/camera-icon-transparent.png'
import photoLibraryImage from '../../assets/images/photo-icons-transparent.png'

import { BackgroundImage } from '../components/base/BackgroundImage';
import { useNavigation, useRoute } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const styles = StyleSheet.create({
  txt: {
    marginTop: 10
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  headline: {
    marginTop: 100,
    fontSize: 30,
    marginBottom: 15
  },
  btnTop: {
    marginTop: 10
  },
  btnBottom: {
    marginTop: 5
  },

  camera: {
    flex: 1,
    width: '100%',
  },

  queuedText: {
    position: 'absolute',
    bottom: 50,
    color: "white",
    textTransform: 'uppercase',
    fontWeight: '800'
  },
  backgroundImage: {
    zIndex: 0,
    position: "absolute"
  },
  btnWrapper: {
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'column',
  },
  photoBtn: {
    height: 100,
    width: 100,
    marginTop: 15,
    marginBottom: 15
  },
  image: {
    position: 'absolute',
  }
})

const PhotoScreen = () => {
  const navigation = useNavigation();

  const takePhoto = useCallback(async() => {
    let options = {
      storageOptions: {
        skipBackup: true,
        path: 'images',
      },
      includeBase64: true,
      mediaType: 'photo'
    };

    try {
      launchCamera(options, async(res) => {
        console.log('Response = ', res);
        if (res.didCancel) {
          console.log('User cancelled image picker');
        } else if (res.error) {
          console.log('ImagePicker Error: ', res.error);
        } else if (res.customButton) {
          console.log('User tapped custom button: ', res.customButton);
          // alert(res.customButton);
        } else {
          if (res && res.assets.length > 0) {
            const file = res.assets[0];
            const image = `data:image/jpg;base64,${file.base64}`
            // await uploadToCloudinary(image);
            // upload uri
            navigation.navigate('Upload', { image });
          }
        }
      });
    } catch(e) {
      console.log("Camera error");
    }
  }, [navigation]);

  const selectImage = useCallback(async() => {
    try {
      const result = await launchImageLibrary({
        mediaType: 'photo',
        includeBase64: true,
        quality: 1
      });
      if (result && result.assets.length > 0) {
        const file = result.assets[0];
        const image = `data:image/jpg;base64,${file.base64}`
        navigation.navigate('Upload', { image });
      }
    } catch (e) {
      console.error(`Error: ${e.message}`);
    }
  }, []);


  return (
    <View style={styles.container}>
        <BackgroundImage style={styles.backgroundImage} sources={[backgroundImage]} />
        <>
          <View style={styles.btnWrapper}>
              <Txt style={styles.headline}>Portrait Time!</Txt>
              <Txt size={Size.L} style={styles.txt}>First, take a portrait photo of yourself</Txt>
              <TouchableOpacity onPress={takePhoto}><Image style={styles.photoBtn} source={takePhotoImage} /></TouchableOpacity>
              <Txt size={Size.L} style={styles.txt}>or upload one</Txt>
              <TouchableOpacity onPress={selectImage}><Image style={styles.photoBtn} source={photoLibraryImage} /></TouchableOpacity>
          </View>
        </>
    </View>
  );
};
export default PhotoScreen;