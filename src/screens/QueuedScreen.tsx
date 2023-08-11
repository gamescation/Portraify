import React, { useCallback, useEffect, useState } from 'react';
import { View, StyleSheet, Image } from 'react-native';
import { Txt } from '../components/base/Txt';
import { subscribe, unsubscribe } from '../hooks/pusher';
import { useNavigation, useRoute } from '@react-navigation/native';
import getDimensionsAndOrientation from '../components/hooks/getDimensionsAndOrientation';
import { Btn } from '../components/base/Btn';
import { imageQueueUrl } from '../constants/urls';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import MaleFemaleSelector from '../components/base/selector/MaleFemaleSelector';
import { Banner } from '../components/base/ads/Banner';
import TypeSelector from '../components/base/selector/TypeSelector';
import { useInterstitialAd, TestIds } from 'react-native-google-mobile-ads';
import { getPlacement } from '../components/base/ads/getPlacement';
import { InLine } from '../components/base/ads/InLine/InLineAd';
import { Radius } from '../constants/radius';


const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
    paddingHorizontal: 50
  },
  queuedText: {
    color: "white",
    textTransform: 'uppercase',
    fontWeight: '800',
    paddingVertical: 2
  },
  queuedTextWrapper: {
    position: 'absolute',
    zIndex: 100,
    alignItems: 'center',
    backgroundColor: '#333',
    opacity: 0.85,
    width: '100%',
    paddingVertical: 10
  },
  image: {
    position: 'absolute',
  },
  sliderRow: {
    alignSelf: 'stretch',
    marginTop: 12
  },
  btnWrapper: {
    flexDirection: 'row',
    marginTop: 10
  },
  interstitial: {
    position: 'absolute',
    zIndex: 10,
  },
  typeOverlay: {
    position: 'absolute', 
    left:0, 
    right: 0, 
    top: 0, 
    bottom: 0, 
    backgroundColor: '#1b1b1b', 
    borderRadius: Radius.M
  },
  label: {
    paddingLeft: 30,
    textTransform: 'uppercase',
    fontWeight: '800'
  },
  selectorContainer: {
    paddingTop: 15,
    width: '100%',
    marginTop: 15,
    opacity: 0.9,
  },
  inputContainer: {
    position: 'absolute', 
    top: 0,
    alignItems: 'center',
    flexDirection: 'column'
  },
  btn: {
  },
  startBtnOverlay: {
    backgroundColor: 'orange'
  }
})

const backgrounds = [{
  name: "Office"
}, {
  name: "Forest"
}, {
  name: "Desert"
}, {
  name: "Waterfall"
}, {
  name: "New York City"
}, {
  name: "San Francisco"
}, {
  name: "Hawaii"
}, {
  name: "Miami"
}, {
  name: "Paris"
}, {
  name: "Night Market"
}, {
  name: "Sunset"
}, {
  name: "Piano"
}];


const types = [{
  name: "Portrait"
}, {
  name: "Headshot"
}, {
  name: "Anime"
}, {
  name: "Graffiti"
}, {
  name: "Street"
}, {
  name: "Wild Life"
}, {
  name: "Food"
}, {
  name: "Travel"
}, {
  name: "Night Life"
}, {
  name: "Abstract"
}, {
  name: "Barbie"
}];

const QueuedScreen = () => {
  const [queued, setQueued] = useState(false);
  const route = useRoute();
  const params = route.params || {};
  const { image, channel_id } = params;
  const [subscribed, setSubscribed] = useState(false);
  const [progress, setProgress] = useState('0%');
  const { dimensions } = getDimensionsAndOrientation();
  const [gender, setGender] = useState('');
  const [background, setBackground] = useState('Office');
  const [type, setType] = useState('Headshot');
  const [ newImageUri, setImageUri ] = useState('');
  const navigation = useNavigation();
  const [hasSeenAd, setHasSeenAd] = useState(false);
  const [imageId, setImageId] = useState();
  const [disconnected, setDisconnected] = useState(false);

  const adToServe = getPlacement('admob', 'interstitial');
  const adUnitId = __DEV__ ? TestIds.INTERSTITIAL: adToServe;
  const { isLoaded, isClosed, load, show } = useInterstitialAd(adUnitId, {
    requestNonPersonalizedAdsOnly: true,
  });

  useEffect(() => {
    // Start loading the interstitial straight away
    load();
  }, [load]);

  useEffect(() => {
    if (isClosed) {
      // Action after the ad is closed
      setHasSeenAd(true);
      if (parseInt(progress) >= 100 && newImageUri) {
        console.log("using new image uri: ", newImageUri);
        navigation.replace('ImageSelection', { secure_url: newImageUri, imageId, channel_id });
      }
    }
  }, [isClosed, navigation, progress, newImageUri, imageId, channel_id]);

  const subscribeToChannel = useCallback(() => {
    if (!subscribed) {
      setSubscribed(true);
      console.log("Subscribed to channel_id", channel_id);
      subscribe(channel_id, (data) => {
        const message = data.message;
        console.log("Progress: ", message?.progress);
        const prog = parseInt(message?.progress) || 0;
        if (prog < 100) {
          setProgress(message?.progress || 0);
        } else if (prog >= 100) {
          console.log("Complete");
          const secure_url = message?.secure_url;
          console.log("imageUri: ", secure_url);
          setImageUri(secure_url);
          setProgress(message?.progress); 
          setImageId(message?.id)
          if (hasSeenAd || !isLoaded) {
            console.log('secure_url: ', secure_url);
            navigation.replace('ImageSelection', { secure_url, imageId: message?.id });
          }
        }
      });
    }
  }, [subscribed, channel_id, navigation, isLoaded, hasSeenAd]);


  // useEffect(() => {
  //   if (queued) {
  //     const interval = setInterval(async() => {
  //       const userImageResult = await axios.post(`${checkImageUrl}`, {
  //         t,
  //         secure_url: image,
  //         data: {
  //           gender,
  //           background,
  //           type
  //         }
  //       });
  //       console.log("userImageResult: ", userImageResult.data);
  //       const userImageJson = userImageResult.data;
  //       console.log("userImageJson.status: ", userImageJson.status);
  //     }, 60000);
  //      return () => { 
            // clearInterval(interval);
          // }
  //   }
  // }, [queued]);

  useEffect(() => {
    if (disconnected) {
      setDisconnected(false);
      subscribeToChannel();
    }
    return () => {
      if (subscribed) {
        unsubscribe(channel_id);
        setSubscribed(false);
        setDisconnected(true)
      }
    }
  }, [channel_id, subscribed, disconnected]);

  useEffect(() => {
    AsyncStorage.getItem('gender', (error, result) => {
        if (result) {
            setGender(result);
        }
    })
}, []);


  const enqueue = useCallback(async() => {
    console.log("sending secure_url: ", image);
    setQueued(true);
    try { 
      subscribeToChannel();
      const t = await AsyncStorage.getItem('t');

      console.log(`Sending ${gender} ${background} ${type}`)
      const userImageResult = await axios.post(`${imageQueueUrl}`, {
        t,
        secure_url: image,
        data: {
          gender,
          background,
          type
        }
      });
      console.log("userImageResult: ", userImageResult.data);
      const userImageJson = userImageResult.data;
      console.log("userImageJson.status: ", userImageJson.status);
      setQueued(userImageJson.status);

      if (userImageJson.status) {
        show();
      }
    } catch(e) {
      setQueued(false);
    }
  }, [image, gender, background, type]);

  const cancel = useCallback(() => {
    navigation.popToTop();
  }, [navigation]);
  return (
    <View style={styles.container}>
        <>
          {image && <Image style={styles.image} source={{ uri: image }} height={dimensions.screenHeight} width={dimensions.screenWidth} />}
          {queued && (<View style={[styles.queuedTextWrapper, { top: dimensions.screenHeight / 7 }]}>
            {parseInt(progress) > 0 ?
            <>
              <Txt style={styles.queuedText}>Creating Your Images</Txt>
              <Txt style={styles.queuedText}>{progress}</Txt>
            </>:
            <>
              <Txt style={styles.queuedText}>In Line</Txt>
              <Txt style={styles.queuedText}>Creating other headshots</Txt>
              <Txt style={styles.queuedText}>Please wait</Txt>
            </>}
            <InLine />
          </View>)}

          {!queued && 
          (
            <View style={styles.inputContainer}>
              <View style={[styles.selectorContainer, {top: 0}]}>
                <MaleFemaleSelector onSelect={setGender} />
              </View>
              <View style={styles.selectorContainer}>
                <View style={styles.typeOverlay}></View>
                <Txt style={styles.label}>Background</Txt>
                <View>
                  <TypeSelector type="background"  onSelect={setBackground} types={backgrounds} defaultValue='Office' />
                </View>
              </View>
              <View style={[styles.selectorContainer]}>
                <View style={styles.typeOverlay}></View>
                <Txt style={styles.label}>Portrait Type</Txt>
                <View>
                  <TypeSelector type="types" onSelect={setType} types={types} defaultValue='Portrait' />
                </View>
              </View>

              <View style={[styles.btnWrapper]}>
                <Btn overlay onPress={cancel} style={{width: dimensions.screenWidth / 2.5, left: -5}}>Cancel</Btn>
                <Btn overlay onPress={enqueue} style={{width: dimensions.screenWidth / 2.5, right: -5}} overlayStyle={styles.startBtnOverlay}>Next</Btn>
              </View>
            </View>
          )}
          

          {!queued && <Banner />}
        </>
    </View>
  );
};
export default QueuedScreen;