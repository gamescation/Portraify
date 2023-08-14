import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation, useRoute } from "@react-navigation/native";
import { useEffect, useState } from "react";
import PhotoScreen from "./PhotoScreen";
import { FadeView } from "../components/base/FadeView";
import LibraryScreen from "./LibraryScreen";
import { View } from "react-native";

export function HomeScreen() {
    const navigation = useNavigation();
    const [loaded, setLoaded] = useState(false);
    const [showLibrary, setShowLibrary] = useState(false);

    const checkForStored = () => {
        AsyncStorage.getItem('hasImages', (error, result) => {
            if (result) {
                setShowLibrary(true);
            }

            setLoaded(true);
        });
    }

    useEffect(() => {
        AsyncStorage.getItem('imageUploaded', (error, result) => {
            try {
                if (result) {
                    const json = JSON.parse(result);

                    if (json.queued) {
                        navigation.navigate('Queued', { previouslyQueued: json });
                    } else {
                        checkForStored();
                    }
                } else {
                    checkForStored();
                }
            } catch(e) {
                console.error("JSON parse error");
                checkForStored();
            }
        });
    }, [navigation]);
    return (
        <FadeView loaded={loaded}>
            <View style={{position: 'absolute', top: 0}}>
                {showLibrary ? (
                    <LibraryScreen onLoad={() => setLoaded(true)} />
                ): (
                    <PhotoScreen />
                )}
            </View>
        </FadeView>
    )
}

export default HomeScreen;