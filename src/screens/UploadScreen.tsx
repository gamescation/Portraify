import React, { useCallback, useEffect, useState } from 'react';
import { View, StyleSheet, Image } from 'react-native';
import { Txt } from '../components/base/Txt';
import axios from 'axios';
import { cloudinaryUrl, imageQueueUrl } from '../constants/urls';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { REACT_APP_CLOUDINARY_API_KEY, REACT_APP_CLOUD_NAME } from "@env"
import getDimensionsAndOrientation from '../components/hooks/getDimensionsAndOrientation';
import { useNavigation, useRoute } from '@react-navigation/native';
import { Btn } from '../components/base/Btn';
import { Banner } from '../components/base/ads/Banner';

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
    top: 0,
    bottom: 0
  },
  queuedText: {
    color: "white",
    textTransform: 'uppercase',
    fontWeight: '800',
    paddingVertical: 2,
    textAlign: 'center'
  },
  textWrapper: {
    backgroundColor: '#313131',
    opacity: 0.85,
    width: '100%',
    paddingVertical: 10,
  },
  queuedTextWrapper: {
    position: 'absolute',
    zIndex: 100,
    alignItems: 'center',
    backgroundColor: 'red',
    opacity: 0.85,
    width: '100%',
    paddingVertical: 10
  },
  image: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 0
  },
  errorContainer: {
    top: 550
  }
})

const UploadScreen = () => {
  const route = useRoute();
  const image = route.params?.image;
  const { dimensions } = getDimensionsAndOrientation();
  const [error, setError] = useState(false);
  const navigation = useNavigation();

  const uploadToCloudinary = useCallback(async(image) => {
    try {
      console.log("Uploading");
      const t = await AsyncStorage.getItem('t');
      const response = await axios.post(`${cloudinaryUrl}`, {
        t
      });
      const { signature, timestamp, public_id, channel_id } = response.data;
      const url = `https://api.cloudinary.com/v1_1/${REACT_APP_CLOUD_NAME}/upload`;
      const fd = new FormData();
      fd.append("upload_preset", 'default');
      fd.append("file", image);
      fd.append('api_key', REACT_APP_CLOUDINARY_API_KEY);
      fd.append('signature', signature);
      fd.append('public_id', public_id);
      fd.append('timestamp', timestamp);
      fd.append('folder', 'user');

      const result = await fetch(url, {
        method: "POST",
        body: fd,
        headers: {
          'content-type': 'application/json'
        }
      });
      const json = await result.json();
      const {secure_url} = json;
      console.log("secure_url: ", secure_url);

      if (secure_url) {
        console.log("image uploaded: ", secure_url);
        console.log("channel_id:", channel_id);
        
        navigation.replace('Queued', { image: secure_url, channel_id });
      }
    } catch (error) {
      console.log('Error uploading to Cloudinary:', error.message, error.stack);
      setError(true);
    }
  }, [image, navigation]);

  useEffect(() => {
    uploadToCloudinary(image);
  }, [image]);

  return (
    <View style={styles.container}>
        <>
        {image && <Image style={styles.image} source={{ uri: image }} height={dimensions.screenHeight} width={dimensions.screenWidth} />}
        <View style={[styles.textWrapper, {top: 0, width: dimensions.screenWidth }]}>
            <Txt style={styles.queuedText}>Uploading...</Txt>
        </View>
          {error && 
            (<View style={[styles.errorContainer, { top: dimensions.screenHeight / 2}]}>
              <Txt>Sorry, there was an error.</Txt>
              <Btn overlay onPress={navigation.goBack}>Cancel</Btn>
              <Btn overlay onPress={uploadToCloudinary}>Retry</Btn>
            </View>)}
        </>
        <Banner />
    </View>
  );
};
export default UploadScreen;