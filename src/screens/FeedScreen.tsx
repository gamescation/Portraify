import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Txt } from '../components/base/Txt';

const FeedScreen = () => {
  return (
    <View style={styles.container}>
        <Txt>Feed Screen</Txt>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
});

export default FeedScreen;