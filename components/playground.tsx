import React, { useEffect, useState } from 'react';
import { Image, ImageBackground, Pressable, ScrollView, StyleSheet, Text } from 'react-native';

const Playground = () => {
const[data,setData]=useState([]);
const getapi=async()=>{
  const result=await fetch("https://jsonplaceholder.typicode.com/todos");
  const dat=await result.json();
  setData(dat);
}
useEffect(()=>{
const fakeAPI = [
      {
        id: 1,
        title: "Snake Game",
        image: require("../assets/images/snake.png") ,
      },
      {
        id: 2,
        title: "2048",
        image: require("../assets/images/2048.png"),
      },
      {
        id: 3,
        title: "Pac-Man",
        image:  require("../assets/images/2048.png"),
      },
      {
        id: 4,
        title: "Flappy Bird",
        image: require("../assets/images/flappy bird.png"),
      },
        {
        id: 5,
        title: "Snake Game",
        image: "https://i.ibb.co/2nYFqP9/snake.jpg",
      },
      {
        id: 6,
        title: "Chess Master",
        image: "../asse",
      },
      {
        id: 7,
        title: "Pac-Man",
        image: "https://i.ibb.co/6X0t4qG/pacman.jpg",
      },
      {
        id: 8,
        title: "Space Invaders",
        image: "https://i.ibb.co/K9m1b6V/space-invaders.jpg",
      },
        {
        id: 9,
        title: "Pac-Man",
        image: "https://i.ibb.co/6X0t4qG/pacman.jpg",
      },
      {
        id: 10,
        title: "Space Invaders",
        image: "https://i.ibb.co/K9m1b6V/space-invaders.jpg",
      },
    ];

 setTimeout(() => {
      setData(fakeAPI);
    }, 1000);
  }, []);
   
  return (
     

    <ImageBackground
   source={{
    uri: "https://media.istockphoto.com/id/1279551163/photo/abstract-full-frame-fire-cloud-background.webp?a=1&b=1&s=612x612&w=0&k=20&c=0-o5RSC1c9kUW4Pikwv6KWolymfeqrHn-5dsFZj7dHA="
  }}
 style={styles.background}
  resizeMode="cover"
>   
<ScrollView>
  { data.map((item)=>(
    <Pressable key={item.id}style={styles.card}>
 <Image source={item.image} style={styles.img} />
       <Text style={styles.title}> {item.title}</Text>
  </Pressable>))}
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
  container: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
    padding: 10,
  },
  card: {
    width: 160,
    margin: 10,
    backgroundColor: "#fff",
    borderRadius: 12,
    overflow: "hidden",
    alignItems: "center",
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 5,
    elevation: 5,
  },
  img: {
    width: "100%",
    height: 120,
  },
  title: {
    padding: 8,
    fontSize: 14,
    fontWeight: "600",
    color: "#333",
    textAlign: "center",
  },
});