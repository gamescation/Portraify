import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { FlatList, View, StyleSheet, Image, TouchableOpacity } from 'react-native';
import { Txt } from '../components/base/Txt';
import getDimensionsAndOrientation from '../components/hooks/getDimensionsAndOrientation';
import { TxtBanner } from '../components/base/TxtBanner';
import { makeRequest } from '../api/user/images';
import { Btn } from '../components/base/Btn';
import { Banner } from '../components/base/ads/Banner';
import { useNavigation, useRoute } from '@react-navigation/native';
import LibraryImage from '../components/images/LibraryImage';
import { FadeView } from '../components/base/FadeView';


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

const LibraryScreen = ({ onLoad = () => {} }: { onLoad: () => void }) => {
  const [images, setImages] = useState([]);
  const [image, setImage] = useState();
  const { dimensions } = getDimensionsAndOrientation();
  const [loading, setLoading] = useState(false);
  const [loadedFirstTime, setLoadedFirstTime] = useState(false);
  const [page, setPage] = useState(1);
  const [error, setError] = useState(false);
  const navigation = useNavigation();

  const fetchPage = useCallback(function(page: number) {
    setLoading(true);
    makeRequest({ page, pageSize: 10 })
      .then((results) => {
        setLoadedFirstTime(true);
        const len = results?.images?.length;

        if (len === 0 && !Object.keys(images).length) {
          return navigation.reset({ 
            index: 0,
            routes: [{ name: 'Photo' }]
          });
        }
        
        if (len > 0) {
          const mappedResults = map(results.images);
          const mappedImages = map(images);
          const newImages = {
            ...mappedResults,
            ...mappedImages,
          }

          const sortedImages = Object.values(newImages).sort((a:any, b: any) => { 
            return a.createdAt > b.createdAt ? 1: -1;
          });

          setImages(sortedImages);

          setPage(page + 1);

          if (!image && sortedImages.length) {
            const first = sortedImages[0];
            setImage(first);
            onLoad();
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
  }, [image, navigation, images]);

  const selectImage = useCallback((image) => {
    setImage(image);
  }, [images])

  useEffect(() => {
    fetchPage(page);
  }, []);

  const flatlistStyle = StyleSheet.create({
    flatlist: {
      width: dimensions.screenWidth - 100,
      height: 200
    }
  });

  return (
      <FadeView loaded={loadedFirstTime} style={[styles.container, { height: dimensions.screenHeight, width: dimensions.screenWidth }]}>
        <>
          {error && <TxtBanner>Error loading images</TxtBanner>}
          {error && <Btn overlay onPress={() => fetchPage(page)}>Retry</Btn>}
          {image && 
            <LibraryImage image={image} />}
        </>

        {images.length > 0 && (
          <View style={[styles.flatlistWrapper, { width: dimensions.screenWidth }]}>
            <View style={styles.addWrapper}>
              <TouchableOpacity style={styles.add} onPress={() => {
                navigation.navigate('Photo', {
                  inPage: true
                })
              }}><Txt style={styles.addBtn}>+</Txt></TouchableOpacity>
            </View>
            <FlatList horizontal data={images} style={[styles.flatlist, flatlistStyle.flatlist]} 
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
      </FadeView>

  );
};

export default LibraryScreen;