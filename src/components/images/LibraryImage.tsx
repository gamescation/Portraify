import { Image, Platform, StyleSheet, View } from "react-native";
import getDimensionsAndOrientation from "../hooks/getDimensionsAndOrientation";
import { TouchableOpacity } from "react-native-gesture-handler";
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome'
import { faDownload } from '@fortawesome/free-solid-svg-icons/faDownload'
import { faShare } from '@fortawesome/free-solid-svg-icons/faShare'
import { faArrowUp } from '@fortawesome/free-solid-svg-icons/faArrowUp'
import { useCallback, useState } from "react";
import { CameraRoll } from "@react-native-camera-roll/camera-roll";
import Share from 'react-native-share';
import { TxtBanner } from "../base/TxtBanner";
import { useNavigation } from "@react-navigation/native";


const HEIGHT = 150;
const styles = StyleSheet.create({
    container: {
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
    iconWrapper: {
        position: 'absolute',
        right: 5,
        top: 50,
        flexDirection: 'column',
        width: 50,
        zIndex: 100,
    },
    iconContainer: {
        padding: 5
    },
    icon: { color: 'white', height: 30, width: 30, marginTop: 20}
  });
export const LibraryImage = ({ image }) => {
    const { dimensions } = getDimensionsAndOrientation();
    const [status, setStatus] = useState('');
    const navigation = useNavigation();

    const onSave = useCallback(async() => {
        await CameraRoll.save(image.secure_url);
        setStatus('Saved')

        setTimeout(() => {
            setStatus('');
        }, 3000);
    }, []);

    const onShare= useCallback(async() => {
        try {
            const options = {
              message: `Check out this image I made with Portraify (${Platform.OS})`,
              url: image.secure_url,
              title: 'Portraify awesomeness',
            };
            await Share.open(options);
          } catch (error) {
            // console.error('Error sharing content:', error);
          }
    }, []);
    const onUpscale = useCallback(async() => {
        navigation.navigate('ImageSelection', {
            imageId: image.id,
            secure_url: image.secure_url
        })
    }, [navigation]);


    return (
        <View style={styles.container}>
            {status && <TxtBanner>{status}</TxtBanner>}
            <View style={styles.imageWrapper}>
                <View style={[styles.iconWrapper, { top: dimensions.screenHeight / 5 }]}>
                    <TouchableOpacity style={styles.iconContainer} onPress={onSave}>
                        <FontAwesomeIcon icon={faDownload} style={styles.icon} size={30} />
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.iconContainer} onPress={onShare}>
                        <FontAwesomeIcon icon={faShare} style={styles.icon} size={30} />
                    </TouchableOpacity>
                    {image.generated && image.choices && (
                        <TouchableOpacity style={styles.iconContainer} onPress={onUpscale}>
                            <FontAwesomeIcon icon={faArrowUp} style={styles.icon} size={30} />
                        </TouchableOpacity>
                    )}
                </View>
                <Image style={styles.image} source={{uri: image.secure_url}} height={dimensions.screenHeight} width={dimensions.screenWidth} />
            </View>
        </View>
    )
}

export default LibraryImage;