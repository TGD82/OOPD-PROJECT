import { StyleSheet, Text, View ,Pressable,Image,ScrollView, ImageBackground ,Button} from 'react-native'
import React = require('react');
import {useState} from'react';

const Playground = () => {

    const images = Array.from({ length: 10 }, (_, i) => i);

  return (

   
    <ImageBackground
   source={{
    uri: "https://media.istockphoto.com/id/1279551163/photo/abstract-full-frame-fire-cloud-background.webp?a=1&b=1&s=612x612&w=0&k=20&c=0-o5RSC1c9kUW4Pikwv6KWolymfeqrHn-5dsFZj7dHA="
  }}
 style={styles.background}
  resizeMode="cover"
> 
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {images.map((item, index) => (
          <Pressable>
            <Image source={require("../assets/images/snake.jpg")} style={styles.img} />
          </Pressable>
        ))}
      </ScrollView>
    </ImageBackground>
  )
}

export default Playground

const styles = StyleSheet.create({
  background: {
    flex: 1,
    width: "100%",
    height: "100%",
  },
  scrollContent: {
  flexDirection: "row",
  flexWrap: "wrap",
  justifyContent: "center",
  padding: 10,
}
,
img: {
    width:400,
    height: 400,
   padding:20,
   marginTop:25,
   marginLeft:25,
   marginRight:25,
    marginBottom: 25,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: "white",
  }
});