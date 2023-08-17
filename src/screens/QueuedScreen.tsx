import React, { useCallback, useEffect, useMemo, useState } from 'react';
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
import { makeRequest } from '../api/images/image-queue';


const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    left: 0,
    width: '100%',
    backgroundColor: '#000',
    alignItems: 'center'
  },
  queuedText: {
    color: "white",
    textTransform: 'uppercase',
    fontWeight: '800',
    paddingVertical: 2,
    textAlign: 'center'
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
    left: 0,
    right: 0
  },
  sliderRow: {
    alignSelf: 'stretch',
    marginTop: 12
  },
  btnWrapper: {
    flexDirection: 'row',
    marginTop: 10,
    width: '100%',
    paddingHorizontal: 30,
    justifyContent: 'space-between'
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
    width: '80%',
    marginTop: 15,
    opacity: 0.9,
  },
  inputContainer: {
    position: 'absolute', 
    top: 0,
    alignItems: 'center',
    flexDirection: 'column',
    width: '100%'
  },
  btn: {width: 150},
  startBtnOverlay: {
    backgroundColor: 'orange'
  },
  selectorContainerSmallScreen: {
    paddingTop: 5,
    marginTop: 5
  }
})

const backgroundList = [
  "Office", 
  "Forest", 
  "Desert", 
  "Waterfall",
  "New York City", 
  "San Francisco", 
  "Hawaii", 
  "Miami",
  "Paris", 
  "Night Market",
  "Nature Landscape",
  "Urban Cityscape",
  "Beach Sunset",
  "Space Galaxy",
  "Abstract Patterns",
  "Vintage Texture",
  "Watercolor Splash",
  "Rustic Wood",
  "Minimalistic",
  "Floral Garden",
  "Night Sky",
  "Underwater Scene",
  "Fantasy Realm",
  "Vintage Paper",
  "Gradients",
  "Industrial Setting",
  "Desert Dunes",
  "Art Deco",
  "Tropical Paradise",
  "Sci-Fi Futuristic"
]

const typeList = [
  "Portrait",
  "Headshot",
  "Anime",
  "Graffiti",
  "Street",
  "Wild Life",
  "Food",
  "Travel",
  "Night Life",
  "Abstract",
  "Barbie",
  "Realism",
  "Impressionism",
  "Cubism",
  "Surrealism",
  "Minimalism",
  "Pop Art",
  "Expressionism",
  "Caricature",
  "Noir",
  "Classic Portrait",
  "Collage",
  "Line Drawing",
  "Digital Painting",
  "Monochromatic",
  "Mixed Media",
  "Pointillism",
  "Photorealism",
  "Stylized",
  "Mosaic"
]

const startTime = `45`;

const QueuedScreen = () => {
  const [queued, setQueued] = useState(false);
  const route = useRoute();
  const params = route.params || {};
  const { image: paramsImage, channel_id, previouslyQueued, imageId: paramsImageId } = params;
  const [image] = useState(paramsImage || (previouslyQueued ? previouslyQueued.secure_url: ''));
  const [subscribed] = useState(false);
  const [progress, setProgress] = useState(startTime);
  const { dimensions } = getDimensionsAndOrientation();
  const [gender, setGender] = useState('');
  const [startTimer, setStartTimer] = useState(false);
  const [background, setBackground] = useState('Office');
  const [type, setType] = useState('Headshot');
  const navigation = useNavigation();
  const [imageId] = useState(paramsImageId || previouslyQueued.id);

  const adToServe = getPlacement('admob', 'interstitial');
  const adUnitId = __DEV__ ? TestIds.INTERSTITIAL: adToServe;
  const { load, show } = useInterstitialAd(adUnitId, {
    requestNonPersonalizedAdsOnly: true,
  });

  useEffect(() => {
    // Start loading the interstitial straight away
    load();
  }, [load]);

  useEffect(() => {
    AsyncStorage.getItem('gender', (error, result) => {
        if (result) {
            setGender(result);
        }
    })
  }, []);

  useEffect(() => {
    if (startTimer) {
      const interval = setInterval(() => {
        if (parseInt(progress) - 1 > 0) {
          setProgress(`${parseInt(progress) - 1}`)
        } else {
          setProgress(startTime);
        }
      }, 1000);

      return () => {
        clearInterval(interval);
      }
    }
  }, [progress, startTimer])

  const enqueue = useCallback(async() => {
    console.log("sending secure_url: ", image);

    if (!queued) {
      try { 
        show();
      } catch(e) {
        // do nothing
      }
  
      setQueued(true);
      try { 

        const t = await AsyncStorage.getItem('t');

        // console.log(`Sending ${gender} ${background} ${type}`)
        setProgress(startTime)
        setStartTimer(true);
        const userImageResult = await axios.post(`${imageQueueUrl}`, {
          t,
          secure_url: image,
          imageId,
          data: {
            gender,
            background,
            type
          }
        });
        // console.log("userImageResult: ", userImageResult.data);
        const userImageJson = userImageResult.data;
        console.log("userImageJson.image: ", userImageJson.image);

        if (userImageJson.success) {
          if (userImageJson.image) {
            const { secure_url } = userImageJson.image;
            if (secure_url) {
              console.log("imageId: ", userImageJson?.image.id);
              navigation.replace('ImageSelection', { secure_url, imageId: userImageJson?.image.id, channel_id });
            }
          } 
        } else {
          setQueued(false);
          setStartTimer(false);
        }
      } catch(e) {
        console.error(`Error queueing: ${e.message} ${e.stack}`);
        setQueued(false);
        setStartTimer(false);
      }
    }
  }, [queued, subscribed, image, gender, background, type, imageId]);

  const cancel = useCallback(async() => {
    await AsyncStorage.removeItem('imageUploaded');
    navigation.popToTop();
  }, [navigation]);

  const backgrounds = useMemo(() => {
    return backgroundList.map((background) => { return { name: background }});
  }, [])


  const types = useMemo(() => {
    return typeList.map((type) => { return { name: type } });
  }, [])

  const smallScreen = dimensions.screenHeight < 700;
  return (
    <View style={styles.container}>
      {image && <Image style={styles.image} source={{ uri: image }} height={dimensions.screenHeight} width={dimensions.screenWidth} />}
          {queued && (<View style={[styles.queuedTextWrapper, { top: smallScreen ? 5: dimensions.screenHeight / 7 }, { width: dimensions.screenWidth}]}>
            <View>
              <Txt style={styles.queuedText}>Creating Your Images</Txt>
              <Txt style={styles.queuedText}>{progress}</Txt>
            </View>
            <InLine wrapperStyle={{top: dimensions.screenHeight - 550}} />
          </View>)}
          <View style={{ position: 'absolute', width: dimensions.screenWidth, left: 0 }}>
            {!queued && (
              <View style={styles.inputContainer}>
                <View style={[styles.selectorContainer, {top: 0}, smallScreen && styles.selectorContainerSmallScreen]}>
                  <MaleFemaleSelector onSelect={setGender} />
                </View>
                <View style={[styles.selectorContainer, smallScreen && styles.selectorContainerSmallScreen]}>
                  <View style={styles.typeOverlay}></View>
                  <Txt style={[styles.label, smallScreen && { fontSize: 8, marginTop: 2}]}>Background</Txt>
                  <View style={[smallScreen && { maxHeight: 175}]}>
                    <TypeSelector type="background"  onSelect={setBackground} types={backgrounds} defaultValue='Office' />
                  </View>
                </View>
                <View style={[styles.selectorContainer]}>
                  <View style={styles.typeOverlay}></View>
                  <Txt style={[styles.label, smallScreen && { fontSize: 8, marginTop: 2}]}>Portrait Type</Txt>
                  <View style={[smallScreen && { maxHeight: 170 }]}>
                    <TypeSelector type="types" onSelect={setType} types={types} defaultValue='Portrait' />
                  </View>
                </View>

                <View style={[styles.btnWrapper]}>
                  <Btn btnStyle={{ width: dimensions.screenWidth / 2 - 30}} overlay onPress={cancel}>Cancel</Btn>
                  <Btn btnStyle={{ width: dimensions.screenWidth / 2 - 30}}  overlay onPress={enqueue} overlayStyle={styles.startBtnOverlay}>Next</Btn>
                </View>
              </View>
            )}
          </View>
          

          {!queued && !subscribed && <Banner />}
    </View>
  );
};
export default QueuedScreen;