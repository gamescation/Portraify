import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { FlatList, View, StyleSheet, Image, TouchableOpacity } from 'react-native';
import { Txt } from '../components/base/Txt';
import getDimensionsAndOrientation from '../components/hooks/getDimensionsAndOrientation';
import { TxtBanner } from '../components/base/TxtBanner';
import { makeRequest } from '../api/user/images';
import { Btn } from '../components/base/Btn';
import { Banner } from '../components/base/ads/Banner';
import { useNavigation, useRoute } from '@react-navigation/native';
import { subscribe, unsubscribe } from '../hooks/pusher';


const HEIGHT = 150;

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject
  },
  imageWrapper: {
    position: 'absolute',
    top: 0
  },
  image: {
    top: -50
  },
  imageThumb: {
    height: HEIGHT,
    width: 100
  },
  overlay: {
    position: 'absolute',
    height: HEIGHT,
    width: 100,
    opacity: 0.25,
    backgroundColor: '#000000',
    zIndex: 1
  },
  add: {
    borderRadius: 5,
    borderWidth: 2,
    borderColor: 'white',
    width: 60,
    alignContent: 'center',
    marginLeft: 15,
  },
  addWrapper: {
    position: 'absolute',
    justifyContent: 'center',
    height: HEIGHT,
    width: 100
  },
  addBtn: {
    fontSize: 40,
    paddingVertical: 5,
    paddingHorizontal: 15,
  },
  flatlistWrapper: {
    position: 'absolute',
    zIndex: 10,
    bottom: 10
  },
  flatlist: {
    left: 100
  }
});

const map = (data: any[], options = { key: 'id' }) => {
  const newData = {};
  for(const datum of data) {
    if (datum[options.key]) {
      newData[datum[options.key]] = datum;
    }
  }
  return newData;
}

const LibraryScreen = () => {
  const [images, setImages] = useState({});
  const [image, setImage] = useState();
  const [subscribed, setSubscribed] = useState(false);
  const [channel_id, setChannel] = useState();
  const { dimensions } = getDimensionsAndOrientation();
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [error, setError] = useState(false);
  const navigation = useNavigation();
  const route = useRoute();
  const [upscaling, setUpscaling] = useState(route.params?.upscale);

  const fetchPage = useCallback(function(page: number) {
    setLoading(true);
    makeRequest({ page, pageSize: 10 })
      .then((results) => {
        const len = results?.images?.length;

        if (results?.channel_id) {
          setChannel(results?.channel_id);
        }

        if (len === 0 && !Object.keys(images).length) {
          return navigation.reset({ 
            index: 0,
            routes: [{ name: 'Photo' }]
          });
        }
        
        if (len > 0) {
          const mappedResults = map(results.images);
          const newImages = {
            ...images,
            ...mappedResults
          }

          setImages(newImages);
          setPage(page + 1);

          if (!image && Object.values(newImages).length) {
            const first = Object.values(newImages)[0];
            setImage(first);
          } else if (!images && Object.values(newImages).length === 0) {
            return navigation.reset({ 
              index: 0,
              routes: [{ name: 'Photo' }]
            });
          }
        }
      })
      .catch((error) => {
        console.error(`Error fetching data: ${error.message}`);
        setError(true);
      })
      .finally(() => {
        setLoading(false);
      })
  }, [image, navigation, upscaling, images]);

  const selectImage = useCallback((image) => {
    setImage(image);
  }, [images])

  const subscribeToChannel = useCallback(() => {
    if (!subscribed && channel_id) {
      setSubscribed(true);
      console.log("Subscribed to channel_id", channel_id);
      subscribe(channel_id, (data) => {
        const message = data.message;
        console.log("Upscaled: ", message);

        setUpscaling(false);
        setImages({
          [message?.id]: {
            secure_url: message.secure_url,
            id: message?.id,
            generated: true
          },
          ...images,
        })
      });
    }
  }, [navigation, subscribed, channel_id, images]);

  useEffect(() => {
    fetchPage(page);
  }, []);

  useEffect(() => {
    if (route.params?.connect && channel_id) {
      console.log("Attempting to connect");
      subscribeToChannel();
    }
  }, [channel_id, route]);

  useEffect(() => {
    return () => {
      if (subscribed && channel_id) {
        unsubscribe(channel_id);
        setSubscribed(false);
      }
    }
  }, [channel_id, subscribed]);

  const flatlistStyle = StyleSheet.create({
    flatlist: {
      width: dimensions.screenWidth - 100,
      height: 200
    }
  });

  const values = useMemo(() => Object.values(images), [images]);

  return (
      <View style={[styles.container, { height: dimensions.screenHeight, width: dimensions.screenWidth }]}>
        <>
          {loading && <TxtBanner>Loading...</TxtBanner>}
          {!loading && upscaling && <TxtBanner>Upscaling...</TxtBanner>}
          {error && <TxtBanner>Error loading images</TxtBanner>}
          {error && <Btn overlay onPress={() => fetchPage(page)}>Retry</Btn>}
          {image && 
            <View style={styles.imageWrapper}>
              <Image style={styles.image} source={{uri: image.secure_url}} height={dimensions.screenHeight} width={dimensions.screenWidth} />
            </View>}
        </>

        {values.length > 0 && (
          <View style={[styles.flatlistWrapper, { width: dimensions.screenWidth }]}>
            <View style={styles.addWrapper}>
              <TouchableOpacity style={styles.add} onPress={() => {
                navigation.navigate('Photo', {
                  redirect: true
                })
              }}><Txt style={styles.addBtn}>+</Txt></TouchableOpacity>
            </View>
            <FlatList horizontal data={values} style={[styles.flatlist, flatlistStyle.flatlist]} 
              onEndReached={() => fetchPage(page)} 
              renderItem={({ item, index }) => {
                return (
                  <TouchableOpacity style={styles.imageThumb} onPress={() => selectImage(item)}>
                    <View style={[image === item ? {}: styles.overlay]}></View>
                    <Image style={styles.imageThumb} source={{ uri: item.secure_url}} />
                  </TouchableOpacity>
                )
              }} />
          </View>
        )} 
        <Banner />
      </View>

  );
};

export default LibraryScreen;