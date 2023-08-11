import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation, useRoute } from "@react-navigation/native";
import { useEffect, useState } from "react";
import PhotoScreen from "./PhotoScreen";
import { FadeView } from "../components/base/FadeView";
import LibraryScreen from "./LibraryScreen";

export function HomeScreen() {
    const navigation = useNavigation();
    const [loaded, setLoaded] = useState(false);
    const [showLibrary, setShowLibrary] = useState(false);

    useEffect(() => {
        AsyncStorage.getItem('created', (error, result) => {
            if (result) {
                setShowLibrary(true);
            }
            setLoaded(true);
        });
    }, [navigation]);
    return (
        <FadeView loaded={loaded}>
            {!showLibrary ? (
                <LibraryScreen />
            ): (
                <PhotoScreen />
            )}
        </FadeView>
    )
}

export default HomeScreen;