import React from 'react';
import { ImageBackground, Pressable, Text, StyleSheet } from 'react-native';

const GameButton = ({ imageSource, screenName, title, navigation }) => {
  return (
    <ImageBackground 
      source={imageSource} 
      style={styles.imageBackground} 
      resizeMode="cover"
    >
      <Pressable 
        onPress={() => navigation.navigate(screenName)} 
        style={({ pressed }) => [
          styles.pressableArea, 
          { opacity: pressed ? 0.7 : 1.0 }
        ]}
      >
        <Text style={styles.buttonText}>{title}</Text>
      </Pressable>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  imageBackground: {
    width: 150, 
    height: 60,
    marginVertical: 10,
    borderRadius: 8,
    overflow: 'hidden',
  },
  pressableArea: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.2)', 
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
    textShadowColor: 'black',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 3,
  },
});

export default GameButton;