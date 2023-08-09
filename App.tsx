/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */
import { TransitionPresets, createStackNavigator } from '@react-navigation/stack';
import { NavigationContainer } from '@react-navigation/native';
import React from 'react';
import {
  StyleSheet,
} from 'react-native';
import HomeScreen from './src/screens/HomeScreen';
import PhotoScreen from './src/screens/PhotoScreen';
import UploadScreen from './src/screens/UploadScreen';
import LibraryScreen from './src/screens/LibraryScreen';
import { registerDevice } from './src/hooks/devices/registerDevice';
import QueuedScreen from './src/screens/QueuedScreen';
import ImageSelectionScreen from './src/screens/ImageSelectionScreen';


const Stack = createStackNavigator();

function App(): JSX.Element {
  // this will likely be required for android
  // await PermissionsAndroid.request();

  registerDevice();

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

const styles = StyleSheet.create({
  sectionContainer: {
    marginTop: 32,
    paddingHorizontal: 24,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: '600',
  },
  sectionDescription: {
    marginTop: 8,
    fontSize: 18,
    fontWeight: '400',
  },
  highlight: {
    fontWeight: '700',
  },
});

export default App;
