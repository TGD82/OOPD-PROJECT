import React from 'react';
import { View, StyleSheet } from 'react-native';
import DinoGameManager from '../components/DinoGameManager';

export default function DinoJumpScreen() {
  return (
    <View style={styles.container}>
      <DinoGameManager />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f7f7f7',
  },
});