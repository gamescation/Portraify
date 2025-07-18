/**
 * Portraify
 *
 * @format
 */
import codePush from "react-native-code-push";
import { TransitionPresets, createStackNavigator } from '@react-navigation/stack';
import { NavigationContainer } from '@react-navigation/native';
import React, { useEffect, useState } from 'react';
import HomeScreen from './src/screens/HomeScreen';
import PhotoScreen from './src/screens/PhotoScreen';
import UploadScreen from './src/screens/UploadScreen';
import LibraryScreen from './src/screens/LibraryScreen';
import { registerDevice } from './src/hooks/devices/registerDevice';
import QueuedScreen from './src/screens/QueuedScreen';
import ImageSelectionScreen from './src/screens/ImageSelectionScreen';
import SplashScreen from './src/screens/SplashScreen';


const Stack = createStackNavigator();

function App(): JSX.Element {
  const [showSplash, setShowSplash] = useState(true);
  const token = registerDevice();

  useEffect(() => {
    if (token?.t) {
      setShowSplash(false);
    }
  }, [token?.t]);

  if (showSplash) {
    return (<SplashScreen error={token?.error}></SplashScreen>);
  }

  return (
    <NavigationContainer>
      <Stack.Navigator 
        screenOptions={{
          headerShown: false,
          ...TransitionPresets.ModalPresentationIOS
        }}
      >
          <Stack.Screen name="Home" component={HomeScreen} />
          <Stack.Screen name="Photo" component={PhotoScreen} />
          <Stack.Screen name="Upload" component={UploadScreen} />
          <Stack.Screen name="Queued" component={QueuedScreen} />
          <Stack.Screen name="ImageSelection" component={ImageSelectionScreen} />
          <Stack.Screen name="Library" component={LibraryScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default __DEV__ ? App: codePush(App);
